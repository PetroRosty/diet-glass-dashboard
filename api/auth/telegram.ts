import { createClient } from '@supabase/supabase-js';
import { URL } from 'url';

// Initialize Supabase client with service role key for server-side operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server operations
);

// Function to verify Telegram hash (using dynamic import for crypto)
async function checkTelegramHash(data: Record<string, string>, botToken: string): Promise<boolean> {
  const { hash, ...userData } = data;
  if (!hash) return false;

  // Dynamically import crypto
  const crypto = await import('node:crypto');

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

export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  let url: URL | undefined; // Declare url variable here, can be undefined

  try {
    url = new URL(req.url); // Assign value inside try block
    const params = Object.fromEntries(url.searchParams.entries());

    // Check if we have all required data
    const requiredFields = ['id', 'first_name', 'username', 'hash', 'auth_date'];
    const missingFields = requiredFields.filter(field => !params[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      // Use url.origin for redirect
      return Response.redirect(`${url.origin}?telegram_login=failed&error=missing_fields`);
    }

    // Verify hash using bot token
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN is not set');
      // Use url.origin for redirect
      return Response.redirect(`${url.origin}?telegram_login=failed&error=server_config`);
    }

    // Use await here for the async checkTelegramHash function
    if (!await checkTelegramHash(params, botToken)) {
      console.error('Invalid hash');
       // Use url.origin for redirect
      return Response.redirect(`${url.origin}?telegram_login=failed&error=invalid_hash`);
    }

    // Check if auth_date is not too old (e.g., within last hour)
    const authDate = parseInt(params.auth_date);
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 3600) {
      console.error('Auth data is too old');
       // Use url.origin for redirect
      return Response.redirect(`${url.origin}?telegram_login=failed&error=expired`);
    }

    // Update or create user profile in Supabase
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
      console.error('Error upserting profile:', upsertError);
       // Use url.origin for redirect
      return Response.redirect(`${url.origin}?telegram_login=failed&error=database`);
    }

    // Redirect back to client with success and user data
    const redirectUrl = new URL(url.origin);
    redirectUrl.searchParams.set('telegram_login', 'success');
    redirectUrl.searchParams.set('telegram_id', params.id);
    redirectUrl.searchParams.set('first_name', params.first_name);
    redirectUrl.searchParams.set('username', params.username);

    return Response.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('Error in telegram auth handler:', error);
    // If url was successfully created, use its origin, otherwise redirect to root
    if (url) {
       // Use url.origin for redirect
      return Response.redirect(`${url.origin}?telegram_login=failed&error=server_error`);
    } else {
      // If URL parsing failed, redirect to root with a generic error
      return Response.redirect('/?telegram_login=failed&error=url_parsing_failed');
    }
  }
} 