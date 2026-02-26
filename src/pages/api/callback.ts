export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;

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
