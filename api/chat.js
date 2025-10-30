export default async function handler(req, res) {
  try {
    // Parse incoming request
    const body = JSON.parse(req.body || "{}");
    const userInput = body.userInput || "你好";

    // Send request to Chatbase
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

    // Extract text from Chatbase response
    let reply = "我没听懂，请再说一次～";

    if (data.reply) {
      reply = data.reply;
    } else if (data.raw?.text) {
      reply = data.raw.text;
    } else if (data.messages?.[0]?.content) {
      reply = data.messages[0].content;
    }

    // Return both the final reply and the raw data for frontend flexibility
    res.status(200).json({ reply, raw: data });

  } catch (error) {
    console.error("❌ Chat API Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
}
