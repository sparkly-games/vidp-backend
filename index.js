const express = require('express');
const app = express();
const port = 80; // You can change this to 3001 if port 80 is restricted

// Allow your Vercel frontend to talk to your iMac
const cors = require('cors');
app.use(cors());

app.get('/video_stream', async (req, res) => {
    const videoId = req.query.id;

    if (!videoId) {
        return res.status(400).json({ error: "Missing 'id' parameter" });
    }

    console.log(`🚀 Processing request for ID: ${videoId}`);

    try {
        // This talks to your Cobalt instance running on port 9000
        const cobaltResponse = await fetch("http://[::1]:9000/", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: "https://www.youtube.com/watch?v=" + videoId,
                videoQuality: "720"
            })
        });

        const data = await cobaltResponse.json();

        if (data.status === 'stream' || data.url) {
            // Success! Return the JSON object with the URI
            console.log(`✅ Link generated for ${videoId}`);
            res.json({ uri: data.url });
        } else {
            console.log(`❌ Cobalt Error: ${data.text}`);
            res.status(500).json({ error: data.text || "Cobalt failed to process video" });
        }

    } catch (err) {
        console.error(`⚠️ Connection Error:`, err.message);
        res.status(500).json({ error: "Could not connect to Cobalt instance" });
    }
});

app.listen(port, () => {
    console.log(`\n✨ iMac API is live at http://localhost:${port}/video_stream?id=dQw4w9WgXcQ`);
    console.log(`🔗 Make sure Cobalt is also running on port 9000!\n`);
});