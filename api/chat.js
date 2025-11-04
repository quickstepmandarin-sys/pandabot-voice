export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      reply: "你好！(Nǐ hǎo! That means “Hello!”) 🐼 How are you today?",
    });
  }

  try {
    const { userInput } = req.body;

    // Log incoming message for debugging
    console.log("📥 User message:", userInput);

    // Make the request to Chatbase (or other chatbot service)
    const chatbaseResponse = await fetch("https://www.chatbase.co/api/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 8538bc13-cf10-41b1-8e82-35333680173b", // Your Chatbase API Key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatbotId: "ecEShdeeohpTsAImfdGCW", // Your Chatbase chatbot ID
        messages: [{ role: "user", content: userInput }],
        model: "gpt-4o-mini", // Adjust this based on your AI model
        temperature: 0.7,
        stream: false
      }),
    });

    // Check for response success
    if (!chatbaseResponse.ok) {
      console.error("❌ Failed to get valid response from Chatbase:", chatbaseResponse.statusText);
      return res.status(500).json({
        reply: "糟糕，伺服器出現問題了 😢",
        raw: { error: "Failed to get valid response from Chatbase" }
      });
    }

    // Parse the actual response from Chatbase
    const data = await chatbaseResponse.json();
    console.log("📤 Chatbase API response:", data);

    // Return the actual bot reply (from raw.text or fallback)
    const replyText = data?.raw?.text || data?.messages?.[0]?.content || "我没听懂，请再说一次～";

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
