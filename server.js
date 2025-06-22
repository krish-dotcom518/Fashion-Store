const express = require('express');
const path = require('path');
const app = express();

// Serve all static files (HTML, CSS, JS, images)
app.use(express.static(__dirname));

// Always serve index.html for unmatched routes (optional for SPA)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Optional catch-all: can be removed if not needed
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
