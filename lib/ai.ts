import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export async function generateText(prompt: string) {
const response = await openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{
role: "system",
content: "You are Echelon, an expert writing assistant for authors.",
},
{
role: "user",
content: prompt,
},
],
max_tokens: 1000,
});

return response.choices[0]?.message?.content || "";
}

export async function fixGrammar(text: string) {
const prompt = `
Fix grammar, improve clarity, and maintain original meaning:

${text}
`;

return generateText(prompt);
}
