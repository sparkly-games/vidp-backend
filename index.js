const express = require('express');
const cors = require('cors');
// Use global fetch (Node 18+) or install node-fetch
const app = express();

// Use the PORT provided by the host (Koyeb/Render) or default to 3000
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/video_stream', async (req, res) => {
    const videoId = req.query.id;

    if (!videoId) {
        return res.status(400).json({ error: "Missing 'id' parameter" });
    }

    console.log(`🚀 Processing: https://www.youtube.com/watch?v=${videoId}`);

    try {
        // Use 127.0.0.1:9000 to talk to the Cobalt process in the same container
        const cobaltResponse = await fetch("http://127.0.0.1:9000/", {
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

        if (!cobaltResponse.ok) {
            throw new Error(`Cobalt responded with status ${cobaltResponse.status}`);
        }

        const data = await cobaltResponse.json();

        // Cobalt returns 'url' for success or 'stream' for direct media
        if (data.url || data.status === 'stream') {
            const finalUrl = data.url;
            console.log(`✅ Success: ${finalUrl}`);
            
            // Return the URL to your frontend
            res.json({ 
                success: true,
                uri: finalUrl 
            });
        } else {
            console.log(`❌ Cobalt Error: ${data.text}`);
            res.status(500).json({ error: data.text || "Cobalt processing failed" });
        }

    } catch (err) {
        console.error(`⚠️ Backend Error:`, err.message);
        res.status(500).json({ 
            error: "Failed to connect to Cobalt. Is the .sh script running?",
            details: err.message 
        });
    }
});

// IMPORTANT: Bind to 0.0.0.0 so the public internet can reach the container
app.listen(port, '0.0.0.0', () => {
    console.log(`\n✨ API is live on port ${port}`);
    console.log(`🔗 Local test: http://localhost:${port}/video_stream?id=dQw4w9WgXcQ\n`);
});