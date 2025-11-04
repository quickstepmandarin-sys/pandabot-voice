export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      reply: "你好！(Nǐ hǎo! That means “Hello!”) 🐼 How are you today?",
    });
  }

  try {
    const { message } = req.body;

    // Log incoming message for debugging
    console.log("📥 User message:", message);

    // Call your AI backend (e.g., Chatbase or OpenAI)
    const response = await fetch("https://www.chatbase.co/api/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 8538bc13-cf10-41b1-8e82-35333680173b",  // Your Chatbase API Key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatbotId: "ecEShdeeohpTsAImfdGCW",  // Your Chatbase chatbot ID
        messages: [{ role: "user", content: message }],
        model: "gpt-4o-mini",
        temperature: 0.7,
        stream: false
      }),
    });

    // Check if response is valid
    if (!response.ok) {
      console.error("❌ Failed to get response from Chatbase:", response.statusText);
      return res.status(500).json({ reply: "糟糕，伺服器出現問題了 😢" });
    }

    // Parse the response from Chatbase
    const data = await response.json();

    // Check if raw.text exists, and use it; otherwise fallback to reply
    const replyText = data?.raw?.text || data?.messages?.[0]?.content || "我没听懂，请再说一次～";

    // Log the raw response data for debugging
    console.log("📤 Raw reply from Chatbase:", data);

    res.status(200).json({
      reply: replyText,
      raw: data,
    });

  } catch (error) {
    console.error("❌ Error in API handler:", error);
    res.status(500).json({
      reply: "糟糕，伺服器出現問題了 😢",
      raw: { error: error.message },
    });
  }
}
