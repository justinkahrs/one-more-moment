import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.MAKE_API_KEY;
  const webhookUrl = import.meta.env.MAKE_MOMENT_WEBHOOK_URL;
  
  if (!apiKey || !webhookUrl) {
    console.error("Missing MAKE_API_KEY or MAKE_MOMENT_WEBHOOK_URL in environment variables");
    return new Response(JSON.stringify({ 
      success: false, 
      message: "Server configuration error" 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const data = await request.json();

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-make-apikey": apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`Make.com webhook failed: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({ 
        success: false,
        message: "Failed to submit request" 
      }), { 
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: "Request submitted successfully" 
    }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error submitting moment request:", error);
    return new Response(JSON.stringify({ 
      success: false,
      message: "Internal server error: " + error 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
