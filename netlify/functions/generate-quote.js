const { Anthropic } = require('@anthropic-ai/sdk'); // Or 'openai' depending on your model

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { systemPillar, userPrompt } = JSON.parse(event.body);
    
    // Securely pull your API key from Netlify's environment variables
    const anthropic = new Anthropic({
      apiKey: process.env.AI_API_KEY, 
    });

    // Create the system instructions telling the AI to act like an SDL professional
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      temperature: 0.3, // Low temperature ensures accurate, consistent pricing
      system: `You are an expert estimator for Samdamlet Electrical Engineering. 
               Generate a clean, itemized, professional quotation for the category: ${systemPillar}. 
               Format the output cleanly with clear item tables, material costs, and labor fees.`,
      messages: [{ role: "user", content: userPrompt }],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ quote: msg.content[0].text }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
