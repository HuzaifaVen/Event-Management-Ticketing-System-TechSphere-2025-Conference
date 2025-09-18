export function RedirectGoogleUrl(state:string | undefined){
    return `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${process.env.GOOGLE_CLIENT_ID}` +
          `&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}` +
          `&response_type=code` +
          `&scope=email%20profile` +
          `&access_type=offline` +
          `&prompt=select_account` +
          `${state ? `&state=${state}` : ''}`;

}