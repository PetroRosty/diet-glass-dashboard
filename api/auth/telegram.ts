import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client with service role key for server-side operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Function to verify Telegram hash
function checkTelegramHash(data, botToken) {
  const { hash, ...userData } = data;
  if (!hash) return false;

  // Create data check string as per Telegram docs
  const dataCheckArr = Object.keys(userData)
    .sort()
    .map(k => `${k}=${userData[k]}`);
  const dataCheckString = dataCheckArr.join('\n');

  // Create HMAC-SHA256 hash
  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(dataCheckString);
  const calculatedHash = hmac.digest('hex');

  return calculatedHash === hash;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  let url;
  try {
    // Для совместимости с Node.js serverless (Vercel), обязательно второй аргумент к URL!
    url = new URL(req.url, `https://${req.headers.host}`);
    const params = Object.fromEntries(url.searchParams.entries());
    const requiredFields = ['id', 'first_name', 'username', 'hash', 'auth_date'];
    const missingFields = requiredFields.filter(field => !params[field]);
    if (missingFields.length > 0) {
      return res.redirect(`/?telegram_login=failed&error=missing_fields`);
    }
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return res.redirect(`/?telegram_login=failed&error=server_config`);
    }
    if (!checkTelegramHash(params, botToken)) {
      return res.redirect(`/?telegram_login=failed&error=invalid_hash`);
    }
    const authDate = parseInt(params.auth_date);
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 3600) {
      return res.redirect(`/?telegram_login=failed&error=expired`);
    }
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        telegram_id: params.id,
        first_name: params.first_name,
        username: params.username,
        locale: params.language_code || 'en',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'telegram_id'
      });
    if (upsertError) {
      return res.redirect(`/?telegram_login=failed&error=database`);
    }
    const redirectUrl = new URL(`https://${req.headers.host}`);
    redirectUrl.searchParams.set('telegram_login', 'success');
    redirectUrl.searchParams.set('telegram_id', params.id);
    redirectUrl.searchParams.set('first_name', params.first_name);
    redirectUrl.searchParams.set('username', params.username);
    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Error in telegram auth handler:', error);
    if (url) {
      return res.redirect(`${url.origin}?telegram_login=failed&error=server_error`);
    } else {
      return res.redirect('/?telegram_login=failed&error=url_parsing_failed');
    }
  }
}
