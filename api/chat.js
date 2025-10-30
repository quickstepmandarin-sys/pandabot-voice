export default async function handler(req, res) {
  try {
    // 解析前端发送的数据
    const body = JSON.parse(req.body || "{}");
    const userInput = body.userInput?.trim() || "你好";

    // 每次生成唯一的 conversationId 和 contactId
    const conversationId = `conv_${Date.now()}`;
    const contactId = `user_${Math.floor(Math.random() * 1000000)}`;

    // 发送请求到 Chatbase
    const chatbaseResponse = await fetch("https://www.chatbase.co/api/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 8538bc13-cf10-41b1-8e82-35333680173b",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatbotId: "ecEShdeeohpTsAImfdGCW", // PandaBot Chatbase ID
        messages: [{ role: "user", content: userInput }],
        conversationId,
        contactId,
        model: "gpt-4o-mini",
        temperature: 0.7,
        stream: false
      }),
    });

    const data = await chatbaseResponse.json();

    // ✅ 提取 Chatbase 回复，优先使用 messages[0].content
    let reply = "我没听懂，请再说一次～";
    if (data.messages?.[0]?.content) {
      reply = data.messages[0].content;
    } else if (data.reply) {
      reply = data.reply;
    } else if (data.raw?.text) {
      reply = data.raw.text;
    }

    // 返回给前端
    res.status(200).json({ reply, raw: data });

  } catch (error) {
    console.error("❌ Chat API Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
}
