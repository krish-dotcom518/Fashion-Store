document.addEventListener('DOMContentLoaded', () => {
  // ✅ Navbar Scroll Behavior
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

  // ✅ Safe Smooth Scroll with Existence Check
 $('#navbar a[href^="#"]').on('click', function (e) {
  const hash = this.hash;
  const target = $(hash);
  if (target.length) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: target.offset().top - 100,
    }, 800);
  } else {
    console.warn(`⚠️ No element found for ${hash}`);
  }
});


  // ✅ Hamburger Menu
  const hamburger = document.getElementById('hamburger');
  const navUl = document.getElementById('nav-ul');
  if (hamburger && navUl) {
    hamburger.addEventListener('click', () => {
      navUl.classList.toggle('show');
    });
  }

  // ✅ Login/Register Toggle
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
  const micBtn = document.getElementById('mic-button');
  const statusBox = document.getElementById('chat-status');

  if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
      chatbox.classList.toggle('hidden');
    });
  }

  if (closeChat) {
    closeChat.addEventListener('click', () => {
      chatbox.classList.add('hidden');
    });
  }

  async function botReply(message) {
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
      console.error("AI error:", err);
      return "⚠️ Sorry, I couldn’t connect to the AI server.";
    }
  }

  if (userInput) {
    userInput.addEventListener('keypress', async function (e) {
      if (e.key === 'Enter') {
        const msg = userInput.value.trim();
        if (!msg) return;
        chatMessages.innerHTML += `<div><strong>You:</strong> ${msg}</div>`;
        userInput.value = '';
        chatMessages.innerHTML += `<div><strong>Bot:</strong> <em>Typing...</em></div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
        const reply = await botReply(msg);
        chatMessages.lastChild.innerHTML = `<strong>Bot:</strong> ${reply}`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
        if (reply.includes("out of AI") || reply.includes("No reply") || reply.includes("connect")) {
          userInput.disabled = true;
          userInput.placeholder = "⚠️ AI temporarily unavailable";
          userInput.style.backgroundColor = "#f5f5f5";
          userInput.style.cursor = "not-allowed";
        }
      }
    });
  }

  // ✅ Mic Button with Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition && micBtn) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    micBtn.addEventListener('click', () => {
      chatbox.classList.remove('hidden');
      statusBox.innerText = "🎤 Listening...";
      statusBox.style.display = 'block';
      micBtn.innerText = '🗣️';
      recognition.start();
    });

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      userInput.value = spokenText;
      userInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
    };

    recognition.onend = () => {
      statusBox.style.display = 'none';
      micBtn.innerText = '🎤';
    };

    recognition.onerror = (event) => {
      statusBox.innerText = "❌ Voice error: " + event.error;
      setTimeout(() => statusBox.style.display = 'none', 2000);
      micBtn.innerText = '🎤';
    };
  }

  // ✅ AI Size Estimator Logic
  const estimatorBtn = document.getElementById('size-estimator-btn');
  const estimatorModal = document.getElementById('size-estimator-modal');
  const submitEstimate = document.getElementById('submit-estimate');
  const closeEstimator = document.getElementById('close-estimator');

  if (estimatorBtn && estimatorModal) {
    estimatorBtn.addEventListener('click', () => {
      estimatorModal.style.display = 'flex';
    });
  }

  if (closeEstimator && estimatorModal) {
    closeEstimator.addEventListener('click', () => {
      estimatorModal.style.display = 'none';
    });
  }

  let detector;

  async function loadDetector() {
    detector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
      runtime: 'mediapipe',
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose',
    });
  }

  loadDetector();

  if (submitEstimate) {
    submitEstimate.addEventListener('click', async () => {
      const height = parseInt(document.getElementById('height').value);
      const weight = parseInt(document.getElementById('weight').value);
      const gender = document.getElementById('gender').value;
      const resultBox = document.getElementById('size-result');
      const fileInput = document.getElementById('photo');
      const file = fileInput.files[0];

      resultBox.innerHTML = `<span style="color: #243a6f;">
        <span class="emoji-loader">⏳</span> Processing your image, please wait...
      </span>`;
      resultBox.scrollIntoView({ behavior: "smooth", block: "center" });

      if (!file) {
        resultBox.innerHTML = `<span style="color: red;">❌ Please upload a photo to continue.</span>`;
        return;
      }

      const image = new Image();
      image.src = URL.createObjectURL(file);
      await new Promise(resolve => image.onload = resolve);

      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const poses = await detector.estimatePoses(canvas);
      if (!poses.length) {
        resultBox.innerHTML = `<span style="color: red;">❌ Could not detect body in the image.</span>`;
        return;
      }

      const keypoints = poses[0].keypoints;
      const nose = keypoints.find(k => k.name === 'nose');
      const ankle = keypoints.find(k => k.name === 'left_ankle') || keypoints.find(k => k.name === 'right_ankle');
      const leftShoulder = keypoints.find(k => k.name === 'left_shoulder');
      const rightShoulder = keypoints.find(k => k.name === 'right_shoulder');

      if (!nose || !ankle || !leftShoulder || !rightShoulder) {
        resultBox.innerHTML = `<span style="color: red;">❌ Full-body not visible. Please upload a clear photo.</span>`;
        return;
      }

      const heightPixels = Math.abs(ankle.y - nose.y);
      const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);

      let size = 'S';
      if (heightPixels < 250 || shoulderWidth < 80) size = 'M';
      else if (heightPixels > 330 || shoulderWidth > 160) size = 'L';

      resultBox.innerHTML = `<span style="color: green;">📸 Estimated Size: <strong>${size}</strong></span>`;
    });
  }
});
