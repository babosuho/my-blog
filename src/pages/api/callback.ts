export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const runtime = (context.locals as any).runtime;
  const clientId = runtime?.env?.GITHUB_CLIENT_ID || import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = runtime?.env?.GITHUB_CLIENT_SECRET || import.meta.env.GITHUB_CLIENT_SECRET;

  const { searchParams } = new URL(context.request.url);
  const code = searchParams.get("code");

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }),
  });

  const data = await response.json();
  const token = data.access_token;
  const provider = "github";

  const html = `
    <html>
      <body>
        <script>
          const token = "${token}";
          const provider = "${provider}";
          if (window.opener) {
            window.opener.postMessage(
              'authorization:' + provider + ':success:' + JSON.stringify({token, provider}),
              window.location.origin
            );
            window.close();
          }
        </script>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
};
