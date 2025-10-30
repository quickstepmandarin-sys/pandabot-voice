export default async function handler(req, res) {
  try {
    const body = JSON.parse(req.body || "{}");
    const userInput = body.userInput || "你好";

    console.log("📥 User said:", userInput);

    const response = await fetch("https://www.chatbase.co/api/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 8538bc13-cf10-41b1-8e82-35333680173b",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatbotId: "ecEShdeeohpTsAImfdGCW",
        message: userInput,
        stream: false,
      }),
    });

    const text = await response.text();
    console.log("📤 Raw Chatbase response text:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("⚠️ JSON parse failed:", err.message);
      return res.status(500).json({ error: "Invalid JSON from Chatbase", raw: text });
    }

    const reply = data.text || data.reply || data.response || "我没听懂，请再说一次～";

    res.status(200).json({ reply, raw: data });

  } catch (error) {
    console.error("❌ Chat API Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
}
