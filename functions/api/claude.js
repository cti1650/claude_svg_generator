// Cloudflare Function for Claude API
export async function onRequest(context) {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight request
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Parse the request body
    const { apiKey, model, temperature, messages } = await context.request.json();

    // Validate required fields
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API Key is required' }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Valid messages array is required' }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Call Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-3-opus-20240229',
        max_tokens: 4000,
        temperature: temperature || 0.7,
        messages: messages
      })
    });

    // Get the response from Claude API
    const data = await claudeResponse.json();

    // If there's an error from Claude API
    if (!claudeResponse.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || 'Error from Claude API' }),
        {
          status: claudeResponse.status,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Return the successful response
    return new Response(
      JSON.stringify({ content: data.content[0].text }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);

    return new Response(
      JSON.stringify({ error: 'Internal server error: ' + (error.message || 'Unknown error') }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
}