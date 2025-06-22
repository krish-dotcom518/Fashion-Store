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

    // Chatbot Logic
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbox = document.getElementById('chatbox');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const closeChat = document.getElementById('close-chat');

    if (chatbotToggle && chatbox && userInput && chatMessages && closeChat) {
        chatbotToggle.addEventListener('click', () => {
            chatbox.classList.toggle('hidden');
        });

        closeChat.addEventListener('click', () => {
            chatbox.classList.add('hidden');
        });

        const botReply = (message) => {
            const responses = {
                'hello': 'Hi there! How can I help you today?',
                'price': 'You can find pricing details under each product.',
                'return': 'Our return policy lasts 7 days. Contact support for more info.',
                'account': 'You can log in or register from the Account page.',
                'cart': 'Click the cart icon on the top right to view your items.',
                'default': 'Sorry, I didn\'t understand that. Please try something else.'
            };
            const lower = message.toLowerCase();
            return responses[lower] || responses['default'];
        };

        userInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const msg = userInput.value;
                if (!msg.trim()) return;

                chatMessages.innerHTML += `<div><strong>You:</strong> ${msg}</div>`;
                setTimeout(() => {
                    chatMessages.innerHTML += `<div><strong>Bot:</strong> ${botReply(msg)}</div>`;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 600);

                userInput.value = '';
            }
        });
    }
});
