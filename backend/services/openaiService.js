import OpenAI from "openai"
import dotenv from "dotenv"

dotenv.config()

const client = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.OPENAI_API_KEY,
})

const systemPrompt = `
You are a civic issue evaluator. Given a complaint description, classify its urgency into one of the following categories:
- "high": requires immediate attention (e.g. sewage overflow, major road damage, water pipe burst, etc.)
- "medium": important but not critical (e.g. minor leaks, recurring garbage issues)
- "low": non-urgent (e.g. suggestion, cosmetic complaints)

Respond ONLY with a JSON:
{
  "priority": "high" | "medium" | "low"
}
`

export async function classifyComplaintPriority(description) {
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: description },
  ]

  try {
    const response = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-R1",
      max_tokens: 100,
      temperature: 0.3,
      top_p: 0.9,
      messages,
    })

    const raw = response.choices[0]?.message?.content?.trim()
    console.log("Raw model response:\n", raw)

    if (!raw) throw new Error("Empty AI response")

    const jsonStart = raw.indexOf("{")
    const jsonEnd = raw.lastIndexOf("}")
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("JSON not found in model response")
    }

    const jsonString = raw.slice(jsonStart, jsonEnd + 1)
    const parsed = JSON.parse(jsonString)

    if (!["high", "medium", "low"].includes(parsed.priority)) {
      throw new Error("Invalid priority returned from AI")
    }

    return parsed.priority
  } catch (err) {
    console.error("Error classifying complaint priority:", err)
    return "medium" // fallback
  }
}
