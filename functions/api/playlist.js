export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const source = url.searchParams.get("url");

  if (!source) {
    return new Response(JSON.stringify({ error: "Missing url parameter" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  try {
    const response = await fetch(source, {
      headers: {
        "User-Agent": "WatchDen Live TV"
      }
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Upstream request failed: ${response.status}` }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    const text = await response.text();

    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300"
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch playlist", details: String(error) }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}
