export default async function handler(req, res) {
  try {
    // Parse the user input from frontend
    const body = JSON.parse(req.body || "{}");
    const userInput = body.userInput?.trim() || "你好";

    // Generate unique conversationId and contactId (optional, but keeping for continuity)
    const conversationId = `conv_${Date.now()}`;
    const contactId = `user_${Math.floor(Math.random() * 1000000)}`;

    // Send request to Chatbase
    const chatbaseResponse = await fetch("https://www.chatbase.co/api/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 8538bc13-cf10-41b1-8e82-35333680173b",  // Your Chatbase API Key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatbotId: "ecEShdeeohpTsAImfdGCW",  // Your Chatbase chatbot ID
        messages: [
          { role: "user", content: userInput }
        ],
        conversationId,  // Optional
        contactId,       // Optional
        model: "gpt-4o-mini",
        temperature: 0.7,
        stream: false
      }),
    });

    const data = await chatbaseResponse.json();

    // Log the full response for debugging (remove in production)
    console.log("Chatbase raw response:", JSON.stringify(data, null, 2));

    // Extract the actual reply from the 'text' field (per Chatbase docs)
    const reply = data.text || "我没听懂，请再说一次～";

    // Send reply and raw data back to frontend
    res.status(200).json({ reply, raw: data });

  } catch (error) {
    console.error("❌ Chat API Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
}
