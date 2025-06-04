async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, true);
    chatInput.value = '';

    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'message bot';
    loadingMsg.textContent = 'Dian is typing...';
    chatMessages.appendChild(loadingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // 🔐 1. Get key securely
        const keyResponse = await fetch('/api/key');
        const { apiKey } = await keyResponse.json();

        // 🔄 2. Call OpenRouter using the fetched key
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "https://dian-widget.vercel.app",
                "X-Title": "Dian AI Widget",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.3-8b-instruct:free",
                messages: [
                    { role: "system", content: "You are Dian, an AI from Diantech..." },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();
        loadingMsg.remove();
        addMessage(data.choices?.[0]?.message?.content || "Sorry, Dian couldn't respond.");
    } catch (err) {
        loadingMsg.remove();
        addMessage("Oops! Dian had an error.");
        console.error("Error:", err);
    }
}
