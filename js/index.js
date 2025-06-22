document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll behavior
    const navbar = document.getElementById('navbar');
    let scrolled = false;

    window.onscroll = function () {
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

    // Smooth Scrolling (requires jQuery)
    $('#navbar a, .btn').on('click', function (e) {
        if (this.hash !== '') {
            e.preventDefault();
            const hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 100,
            }, 800);
        }
    });

    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navUl = document.getElementById('nav-ul');

    if (hamburger && navUl) {
        hamburger.addEventListener('click', () => {
            navUl.classList.toggle('show');
        });
    }

    // Login/Register form toggle (if on account page)
    const loginFrm = document.getElementById("loginFrm");
    const regFrm = document.getElementById("regFrm");
    const active = document.getElementById("active");

    window.reg = function () {
        if (regFrm && loginFrm && active) {
            regFrm.style.transform = "translateX(0px)";
            loginFrm.style.transform = "translateX(0px)";
            active.style.transform = "translateX(100px)";
        }
    }

    window.login = function () {
        if (regFrm && loginFrm && active) {
            regFrm.style.transform = "translateX(300px)";
            loginFrm.style.transform = "translateX(300px)";
            active.style.transform = "translateX(0px)";
        }
    }

    // ✅ Chatbot Logic
    const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbox = document.getElementById('chatbox');
  const userInput = document.getElementById('user-input');
  const chatMessages = document.getElementById('chat-messages');
  const closeChat = document.getElementById('close-chat');
  const micBtn = document.getElementById('mic-btn');

  if (chatbotToggle && chatbox && userInput && chatMessages && closeChat) {
    chatbotToggle.addEventListener('click', () => {
      chatbox.classList.toggle('hidden');
    });

    closeChat.addEventListener('click', () => {
      chatbox.classList.add('hidden');
    });

    const botReply = async (message) => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });

        if (response.status === 429) {
          return "⚠️ You're out of AI usage quota. Please check billing.";
        }

        const data = await response.json();
        return data.reply || "⚠️ No reply from the AI.";
      } catch (err) {
        console.error("Cohere error:", err);
        return "⚠️ Sorry, I couldn’t connect to the AI server.";
      }
    };

    userInput.addEventListener('keypress', async function (e) {
      if (e.key === 'Enter') {
        const msg = userInput.value.trim();
        if (!msg) return;

        chatMessages.innerHTML += `<div><strong>You:</strong> ${msg}</div>`;
        userInput.value = '';

        chatMessages.innerHTML += `<div><strong>Bot:</strong> <em>Typing...</em></div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const reply = await botReply(msg);
        const lastBotMsg = chatMessages.querySelector('div:last-child');
        lastBotMsg.innerHTML = `<strong>Bot:</strong> ${reply}`;
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (
          reply.includes("out of AI") ||
          reply.includes("No reply") ||
          reply.includes("connect to the AI server")
        ) {
          userInput.disabled = true;
          userInput.placeholder = "⚠️ AI temporarily unavailable";
          userInput.style.backgroundColor = "#f5f5f5";
          userInput.style.cursor = "not-allowed";
        }
      }
    });
}
});
