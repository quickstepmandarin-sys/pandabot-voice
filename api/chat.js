export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      reply: "你好！(Nǐ hǎo! That means “Hello!”) 🐼 How are you today?",
    });
  }

  try {
    const { message } = req.body;

    // ✅ Simulate backend logic
    // Replace this with your actual model or external API logic
    const aiResponse = {
      text: "你好！(Nǐ hǎo! That means “Hello!”) 🐼 How are you today?",
    };

    // ✅ Always reply using aiResponse.text, not fallback
    res.status(200).json({
      reply: aiResponse.text,
      raw: aiResponse,
    });
  } catch (err) {
    console.error("Chat API error:", err);
    res.status(500).json({
      reply: "糟糕，伺服器出現問題了 😢",
      raw: { error: err.message },
    });
  }
}
