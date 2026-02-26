export async function onRequest(context) {
  const clientId = context.env.GITHUB_CLIENT_ID;
  const redirectUri = `${new URL(context.request.url).origin}/api/auth/callback`;
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`;
  return Response.redirect(authUrl, 302);
}
