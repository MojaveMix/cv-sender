const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Generation configuration
const generationConfig = {
  temperature: 0.9,
};

// Express controller
const fetchAiData = async (req, res) => {
  try {
    // Prepare the model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: generationConfig,
    });

    // Your prompt text
    const prompt_text = `
You are a helpful and experienced tech interview coach.
Your entire response MUST be a single block of HTML content suitable for placing inside a <div>.

1. Begin with a "<div>" with the class "overall-summary".
2. After the summary, provide a series of accordion items using this exact HTML structure:
    <div class="accordion-item">
      <button class="accordion-header">...</button>
      <div class="accordion-content">...</div>
    </div>

IMPORTANT: Do not include any tags like <html>, <style>, or <script>.

Here is the interview data: ...
`;

    // Generate the content
    const result = await model.generateContent(prompt_text);

    // Send the generated HTML text as JSON
    res.json({ text: result.response.text() });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).send({ error: "Internal server problem" });
  }
};

module.exports = { fetchAiData };
