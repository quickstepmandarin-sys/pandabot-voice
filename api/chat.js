export default async function handler(req, res) {
  try {
    const body = JSON.parse(req.body || "{}");
    const userInput = body.userInput || "你好";

    const response = await fetch("https://www.chatbase.co/api/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 8538bc13-cf10-41b1-8e82-35333680173b",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatbotId: "ecEShdeeohpTsAImfdGCW",
        messages: [{ role: "user", content: userInput }],
        model: "gpt-4o-mini",
        temperature: 0.7,
        stream: false
      }),
    });

    const data = await response.json();

    // Use Chatbase text or fallback
    const reply = data.text || data.reply || "我没听懂，请再说一次～";

    res.status(200).json({ reply });

  } catch (error) {
    console.error("❌ Chat API Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
}
