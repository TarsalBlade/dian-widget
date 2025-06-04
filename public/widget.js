(function () {
    // Inject CSS
    const style = document.createElement("style");
    style.textContent = `
    <div class="chat-widget">
        <button class="chat-button" id="chatButton">💬</button>
        
        <div class="chat-box" id="chatBox">
            <div class="chat-header">
                <div class="chat-title">Dian AI Assistant</div>
                <button class="chat-close" id="chatClose">×</button>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <div class="message bot">Hi! I'm your AI assistant. How can I help you today?</div>
            </div>
            
            <div class="chat-input-container">
                <input type="text" class="chat-input" id="chatInput" placeholder="Type your message...">
                <button class="chat-send" id="chatSend">→</button>
            </div>
        </div>
    </div>



Widget Styles */
        .chat-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }

        .chat-button {
            width: 60px;
            height: 60px;
            background: #000;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }

        .chat-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(0,0,0,0.4);
        }

        .chat-box {
            position: absolute;
            bottom: 70px;
            right: 0;
            width: 350px;
            height: 450px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            display: none;
            flex-direction: column;
            overflow: hidden;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .chat-header {
            background: #000;
            color: white;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chat-title {
            font-weight: 600;
            font-size: 16px;
        }

        .chat-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .chat-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .message {
            padding: 12px 16px;
            border-radius: 18px;
            max-width: 80%;
            word-wrap: break-word;
        }

        .message.bot {
            background: #f1f3f4;
            align-self: flex-start;
            color: #333;
            text-align: start;
        }

        .message.user {
            background: #000;
            color: white;
            align-self: flex-end;
        }

        .chat-input-container {
            padding: 16px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 8px;
        }

        .chat-input {
            flex: 1;
            border: 1px solid #ddd;
            border-radius: 20px;
            padding: 12px 16px;
            outline: none;
            font-size: 14px;
        }

        .chat-send {
            background: #000;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.2s;
        }

        .chat-send:hover {
            background: #333;
        }

        @media (max-width: 768px) {           
            .chat-box {
                width: 300px;
                height: 400px;
            }
        } 

`;
    document.head.appendChild(style);

    // Inject HTML
    const html = `
    <div class="chat-widget">
        <button class="chat-button" id="chatButton">💬</button>
        <div class="chat-box" id="chatBox">
            <div class="chat-header">
                <div class="chat-title">Dian AI Assistant</div>
                <button class="chat-close" id="chatClose">×</button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="message bot">Hi! I'm your AI assistant. How can I help you today?</div>
            </div>
            <div class="chat-input-container">
                <input type="text" class="chat-input" id="chatInput" placeholder="Type your message...">
                <button class="chat-send" id="chatSend">→</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", html);

    // Load marked.js for Markdown support
    const markedScript = document.createElement("script");
    markedScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    document.head.appendChild(markedScript);

    markedScript.onload = function () {
        const chatButton = document.getElementById('chatButton');
        const chatBox = document.getElementById('chatBox');
        const chatClose = document.getElementById('chatClose');
        const chatInput = document.getElementById('chatInput');
        const chatSend = document.getElementById('chatSend');
        const chatMessages = document.getElementById('chatMessages');
        let isOpen = false;

        function toggleChat() {
            isOpen = !isOpen;
            chatBox.style.display = isOpen ? 'flex' : 'none';
            chatButton.innerHTML = isOpen ? '×' : '💬';
            if (isOpen) chatInput.focus();
        }

        function closeChat() {
            isOpen = false;
            chatBox.style.display = 'none';
            chatButton.innerHTML = '💬';
        }

        function addMessage(content, isUser = false) {
            const message = document.createElement("div");
            message.className = `message ${isUser ? "user" : "bot"}`;
            message.innerHTML = isUser ? content : marked.parse(content);
            chatMessages.appendChild(message);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        async function sendMessage() {
            const userMessage = chatInput.value.trim();
            if (!userMessage) return;
            addMessage(userMessage, true);
            chatInput.value = "";

            const loading = document.createElement("div");
            loading.className = "message bot";
            loading.textContent = "Dian is typing...";
            chatMessages.appendChild(loading);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            try {
                const keyRes = await fetch("/api/key");
                const { apiKey } = await keyRes.json();

                const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": window.location.href,
                        "X-Title": "Dian AI Widget"
                    },
                    body: JSON.stringify({
                        model: "meta-llama/llama-3.3-8b-instruct:free",
                        messages: [
                            { role: "system", content: "You are Dian, an AI assistant from Diantech. Be helpful, concise, and friendly." },
                            { role: "user", content: userMessage }
                        ]
                    })
                });
                const data = await res.json();
                loading.remove();
                addMessage(data.choices?.[0]?.message?.content || "No reply received.");
            } catch (e) {
                loading.remove();
                addMessage("Oops! Something went wrong.");
                console.error(e);
            }
        }

        chatButton.addEventListener("click", toggleChat);
        chatClose.addEventListener("click", closeChat);
        chatSend.addEventListener("click", sendMessage);
        chatInput.addEventListener("keypress", e => {
            if (e.key === "Enter") sendMessage();
        });
        document.addEventListener("click", e => {
            if (isOpen && !chatBox.contains(e.target) && !chatButton.contains(e.target)) {
                closeChat();
            }
        });
    };
})();
