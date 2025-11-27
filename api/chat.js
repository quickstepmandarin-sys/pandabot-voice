export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      reply: "你好！我是 PandaBot 🐼"
    });
  }

  try {
    const { userInput } = req.body;

    console.log("📥 User:", userInput);

    const response = await fetch("https://www.chatbase.co/api/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 8538bc13-cf10-41b1-8e82-35333680173b", // YOUR API KEY
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chatbotId: "ecEShdeeohpTsAImfdGCW", // YOUR REAL Chatbot ID
        messages: [
          { role: "user", content: userInput }
        ]
      })
    });

    const data = await response.json();
    console.log("📤 Chatbase response:", data);

    // If Chatbase returns any error
    if (!response.ok) {
      return res.status(500).json({
        reply: "Chatbase 發生錯誤 😢",
        raw: data
      });
    }

    // Chatbase ALWAYS returns text in: data.response.text
    const reply = data?.response?.text || "我聽不懂～你再說一次？";

    return res.status(200).json({
      reply,
      raw: data
    });

  } catch (err) {
    console.error("❌ Server exception:", err);
    return res.status(500).json({
      reply: "伺服器爆炸了 💥",
      raw: { error: err.message }
    });
  }
}
