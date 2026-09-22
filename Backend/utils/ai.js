import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const generateAIResponse = async (
    messages
) => {

    const conversation = messages
        .map((message) => {

            const role =
                message.role === "assistant"
                    ? "Assistant"
                    : "User";

            return `${role}: ${message.content}`;

        })
        .join("\n\n");


    const prompt = `
You are DevGPT, a helpful AI developer assistant.

You help users with:

- Programming
- Debugging
- Data structures and algorithms
- System design
- Web development
- Backend development
- Databases
- Computer science concepts

Be accurate, practical, and concise.

When providing code:
- Use Markdown code blocks.
- Specify the programming language.
- Explain important parts of the solution.
- Mention time and space complexity when relevant.

Conversation:

${conversation}

Respond to the user's latest message.
`;


    const interaction =
        await ai.interactions.create({
            model:
                "gemini-2.5-flash-lite",

            input: prompt,
        });


    return interaction.output_text;
};