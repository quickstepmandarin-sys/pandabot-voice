export default async function handler(req, res) {
  try {
    // Parse the incoming user input
    const body = JSON.parse(req.body || "{}");
    const userInput = body.userInput?.trim() || "你好";

    // Chatbase API request
    const chatbaseResponse = await fetch("https://www.chatbase.co/api/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 8538bc13-cf10-41b1-8e82-35333680173b",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatbotId: "ecEShdeeohpTsAImfdGCW",  // Your PandaBot Chatbase ID
        messages: [
          { role: "user", content: userInput }
        ],
        model: "gpt-4o-mini",
        temperature: 0.7,
        stream: false
      }),
    });

    const data = await chatbaseResponse.json();

    // ✅ Safely extract reply
    // Chatbase may return the answer in data.messages[0].content or data.reply
    let reply = "我没听懂，请再说一次～"; // fallback

    if (data.messages?.[0]?.content) {
      reply = data.messages[0].content;
    } else if (data.reply) {
      reply = data.reply;
    } else if (data.raw?.text) {
      reply = data.raw.text;
    }

    // Return reply + raw for debugging
    res.status(200).json({ reply, raw: data });

  } catch (error) {
    console.error("❌ Chat API Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
}
