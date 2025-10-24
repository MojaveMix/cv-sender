import { example1 } from "../components/contentexample";

export const PromptService = async (
  company_name = "Example Company",
  position = "Software Developer",
  setContent = {},
  setLoading = {}
) => {
  try {
    setLoading(true);
    // Create a human-like prompt for the AI
    const prompt = `
  You are a professional HR and career coach. 
  Write a **polite, professional, and human-like cover letter** for someone applying to the position of "${position}" at "${company_name}".
  The letter should be engaging, concise (around 200–300 words), and tailored to make the candidate stand out.
  Use natural language, show enthusiasm, and avoid generic templates.
  `;

    // Call Puter AI
    const data = await puter.ai.chat(prompt, { model: "gpt-5-nano" });
    console.log("result", data, data?.message?.content);
    setContent(
      data?.message?.content
        ? data?.message?.content
        : example1(position, company_name)
    );
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
