export default async function handler(req, res) {
  try {
    // Parse the user input from frontend
    const body = JSON.parse(req.body || "{}");
    const userInput = body.userInput?.trim() || "你好";

    // Generate unique conversationId and contactId
    const conversationId = `conv_${Date.now()}`;
    const contactId = `user_${Math.floor(Math.random() * 1000000)}`;

    // Prepare the payload to send to Chatbase
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
        conversationId,  // Added conversationId
        contactId,       // Added contactId
        model: "gpt-4o-mini",
        temperature: 0.7,
        stream: false
      }),
    });

    const data = await chatbaseResponse.json();

    // Safely extract the reply text from Chatbase response
    const reply = data.messages?.[0]?.content || data.reply || data.raw?.text || "我没听懂，请再说一次～";

    res.status(200).json({ reply, raw: data });  // Send the reply and raw data back to frontend

  } catch (error) {
    console.error("❌ Chat API Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
}
