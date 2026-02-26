export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/callback`;
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`;
  return Response.redirect(authUrl, 302);
};
