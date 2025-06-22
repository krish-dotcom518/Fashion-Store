document.addEventListener('DOMContentLoaded', () => {
    // ===================== Navbar Scroll Effect =====================
    const navbar = document.getElementById('navbar');
    let scrolled = false;

    window.onscroll = () => {
        if (window.pageYOffset > 40) {
            navbar.classList.remove('top');
            if (!scrolled) {
                navbar.style.transform = 'translateY(-270px)';
            }
            setTimeout(() => {
                navbar.style.transform = 'translateY(0)';
                scrolled = true;
            }, 200);
        } else {
            navbar.classList.add('top');
            scrolled = false;
        }
    };

    // ===================== Smooth Scrolling (jQuery required) =====================
    if (window.jQuery) {
        $('#navbar a, .btn').on('click', function (e) {
            if (this.hash !== '') {
                e.preventDefault();
                const hash = this.hash;
                $('html, body').animate({
                    scrollTop: $(hash).offset().top - 100,
                }, 800);
            }
        });
    }

    // ===================== Hamburger Menu =====================
    const hamburger = document.getElementById('hamburger');
    const navUl = document.getElementById('nav-ul');

    if (hamburger && navUl) {
        hamburger.addEventListener('click', () => {
            navUl.classList.toggle('show');
        });
    }

    // ===================== Login/Register Form Toggle =====================
    const loginFrm = document.getElementById("loginFrm");
    const regFrm = document.getElementById("regFrm");
    const active = document.getElementById("active");

    window.reg = function () {
        if (regFrm && loginFrm && active) {
            regFrm.style.transform = "translateX(0px)";
            loginFrm.style.transform = "translateX(0px)";
            active.style.transform = "translateX(100px)";
        }
    };

    window.login = function () {
        if (regFrm && loginFrm && active) {
            regFrm.style.transform = "translateX(300px)";
            loginFrm.style.transform = "translateX(300px)";
            active.style.transform = "translateX(0px)";
        }
    };

    // ===================== Chatbot Logic =====================
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbox = document.getElementById('chatbox');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const closeChat = document.getElementById('close-chat');

    if (chatbotToggle && chatbox && userInput && chatMessages && closeChat) {
        // Toggle chat visibility
        chatbotToggle.addEventListener('click', () => {
            chatbox.classList.toggle('hidden');
        });

        closeChat.addEventListener('click', () => {
            chatbox.classList.add('hidden');
        });

        // Optional: welcome message
        chatMessages.innerHTML += `<div><strong>Bot:</strong> Hi! 👋 I'm your assistant. How can I help you today?</div>`;

        // Send message to backend/OpenAI
        const botReply = async (message) => {
            try {
                const response = await fetch('http://localhost:5000/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });

                if (!response.ok) {
                    throw new Error('Failed to get response from server');
                }

                const data = await response.json();
                return data.reply || "Sorry, I didn't understand that.";
            } catch (error) {
                console.error("Chatbot API Error:", error);
                return "Oops! Something went wrong. Please try again.";
            }
        };

        // Handle Enter key
        userInput.addEventListener('keypress', async function (e) {
            if (e.key === 'Enter') {
                const msg = userInput.value.trim();
                if (!msg) return;

                // Show user message
                chatMessages.innerHTML += `<div><strong>You:</strong> ${msg}</div>`;
                userInput.value = '';

                // Show typing placeholder
                chatMessages.innerHTML += `<div><strong>Bot:</strong> <em>Typing...</em></div>`;
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Get reply
                const reply = await botReply(msg);

                // Replace typing with reply
                const lastBotMsg = chatMessages.querySelector('div:last-child');
                lastBotMsg.innerHTML = `<strong>Bot:</strong> ${reply}`;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
    }
});
