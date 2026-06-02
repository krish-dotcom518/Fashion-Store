
document.addEventListener('DOMContentLoaded', () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("❌ Your browser does not support Speech Recognition!");
    console.error("Speech Recognition API not supported.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.continuous = false;

  const button = document.getElementById("voice-nav-btn");
  const status = document.getElementById("voice-status");

  if (button && status) {
    button.addEventListener('click', () => {
      try {
        recognition.start();
        button.innerText = '🎧 Listening...';
        status.innerText = "🎤 Listening for navigation commands...";
        console.log("🎤 Voice recognition started.");
      } catch (error) {
        console.error("❌ Failed to start recognition:", error);
        status.innerText = "❌ Error starting voice recognition.";
        button.innerText = "🎤 Start Voice Command";
      }
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log("🗣️ Voice Command:", transcript);
      status.innerText = `✅ Heard: "${transcript}"`;

      if (transcript.includes("home")) {
        console.log("Redirecting to Home...");
        window.location.href = "index.html";
      } else if (transcript.includes("product")) {
        console.log("Redirecting to Product...");
        window.location.href = "product.html";
      } else if (transcript.includes("inspiration")) {
        console.log("Scrolling to Inspiration Section...");
        window.scrollTo({ top: 800, behavior: 'smooth' });
      } else if (transcript.includes("account")) {
        console.log("Redirecting to Account...");
        window.location.href = "account.html";
      } else if (transcript.includes("cart")) {
        console.log("Redirecting to Cart...");
        window.location.href = "cart.html";
      } else {
        console.warn(`❌ Unrecognized command: "${transcript}"`);
        status.innerText = `❌ Unrecognized command: "${transcript}"`;
      }
    };

    recognition.onend = () => {
      console.log("🎤 Voice recognition ended.");
      button.innerText = "🎤 Start Voice Command";
    };

    recognition.onerror = (event) => {
      console.error(`❌ Error occurred in recognition: ${event.error}`);
      status.innerText = `❌ Voice error: ${event.error}`;
      button.innerText = "🎤 Start Voice Command";
    };
  } else {
    console.error("❌ Button or status element not found.");
  }
});

