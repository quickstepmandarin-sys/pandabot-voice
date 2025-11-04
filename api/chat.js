export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      reply: "你好！(Nǐ hǎo! That means “Hello!”) 🐼 How are you today?",
    });
  }

  try {
    const { message } = req.body;

    // ✅ Call your actual AI backend (example)
    const response = await fetch("https://pandabot-voice.vercel.app/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    const replyText = data?.raw?.text || data?.reply || "我没听懂，请再说一次～";

    res.status(200).json({
      reply: replyText,
      raw: data.raw,
    });
  } catch (err) {
    console.error("Chat API error:", err);
    res.status(500).json({
      reply: "糟糕，伺服器出現問題了 😢",
      raw: { error: err.message },
    });
  }
}
