const openai = require("openai");

async function openaiCaller(prompt) {
  try {
    const openaiClient = new openai({ apiKey: process.env.OPENAI_KEY });
    const response = await openaiClient.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

function apiResponseParser(response) {
  const prediction = response?.choices[0]?.message?.content;
  const result = JSON.parse(prediction);
  const parseResponse = result;
  return parseResponse;
}

module.exports = { openaiCaller, apiResponseParser };
