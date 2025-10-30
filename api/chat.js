export default async function handler(req, res) {
  try {
    const body = JSON.parse(req.body || "{}");
    const userInput = body.userInput?.trim() || "你好";

    const conversationId = `conv_${Date.now()}`;
    const contactId = `user_${Math.floor(Math.random() * 1000000)}`;

    const chatbaseResponse = await fetch("https://www.chatbase.co/api/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 8538bc13-cf10-41b1-8e82-35333680173b",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatbotId: "ecEShdeeohpTsAImfdGCW",
        messages: [{ role: "user", content: userInput }],
        conversationId,
        contactId,
        model: "gpt-4o-mini",
        temperature: 0.7,
        stream: false
      }),
    });

    const data = await chatbaseResponse.json();

    // ✅ Prioritize raw.text for the frontend
    const reply = data.raw?.text || data.messages?.[0]?.content || data.reply || "fuck you～";

    res.status(200).json({ reply, raw: data });

  } catch (error) {
    console.error("❌ Chat API Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
}
