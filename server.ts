import { serve } from "https://deno.land/std@0.153.0/http/server.ts";

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const userAgent = req.headers.get("user-agent") || "";

  if (url.pathname === "/") {
    return new Response(
      `
      <html>
        <body>
          <form action="/generate" method="post">
            <input type="text" name="text" />
            <button type="submit">Submit</button>
          </form>
        </body>
      </html>
    `,
      { headers: { "content-type": "text/html" } }
    );
  } else if (url.pathname === "/generate" && req.method === "POST") {
    const formData = await req.formData();
    const text = formData.get("text")?.toString() || "";
    const encodedText = encodeURIComponent(text);
    return new Response(
      `
      <html>
        <body>
          <p>Generated URL: <a href="/display?text=${encodedText}">/display?text=${encodedText}</a></p>
        </body>
      </html>
    `,
      { headers: { "content-type": "text/html" } }
    );
  } else if (url.pathname === "/display") {
    const text = url.searchParams.get("text") || "";
    if (userAgent.includes("curl")) {
      return new Response(text, { headers: { "content-type": "text/plain" } });
    } else {
      return new Response(
        `
        <html>
          <body>
            <p>${text}</p>
          </body>
        </html>
      `,
        { headers: { "content-type": "text/html" } }
      );
    }
  } else {
    return new Response("Not Found", { status: 404 });
  }
};

console.log("Server is running...");
await serve(handler, { port: 8000 });
