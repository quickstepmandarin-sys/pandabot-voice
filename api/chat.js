export default async function handler(req, res) {
  try {
    // 解析前端傳來的 JSON body
    const body = JSON.parse(req.body || "{}");
    const userInput = body.userInput || "你好";

    // 向 Chatbase API 發送請求
    const response = await fetch("https://www.chatbase.co/api/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 8538bc13-cf10-41b1-8e82-35333680173b", // 你的 Chatbase 金鑰
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatbotId: "ecEShdeeohpTsAImfdGCW", // 你的 Chatbase Bot ID
        messages: [{ role: "user", content: userInput }],
        model: "gpt-4o-mini",
        temperature: 0.7,
        stream: false
      }),
    });

    // 解析 Chatbase 回覆
    const data = await response.json();
    const reply = data.messages?.[0]?.content || "我没听懂，请再说一次～";

    // 回傳結果給前端
    res.status(200).json({ reply });

  } catch (error) {
    console.error("❌ Chat API Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
}
