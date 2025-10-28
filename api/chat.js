export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const userInput = body.query || "Hello";
    const conversationId = `conv_${Date.now()}`;
    const contactId = `user_${Math.floor(Math.random() * 1000000)}`;

    const response = await fetch("https://www.chatbase.co/api/v1/chat", {
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

    const data = await response.json();
    const reply = data.messages?.[0]?.content || "No reply from Chatbase";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
}
