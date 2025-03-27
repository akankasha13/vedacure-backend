const { openaiCaller, apiResponseParser } = require("../utils");
const asyncHandler = require("express-async-handler");

const genController = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  const apiResponse = await openaiCaller(prompt);

  const response = apiResponseParser(apiResponse) ?? {};
  if (!response)
    return res.json({ status: 400, message: "Failed to Generate" });

  res.json({
    status: 200,
    data: response,
    message: "Response generated successfully",
  });
});

module.exports = { genController };
