const videoIds = ["dQw4w9WgXcQ", "jNQXAC9IVRw"];

const fetchFromMyInstance = async (videoId) => {
  try {
    const response = await fetch("http://localhost:9000/", {
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

    const data = await response.json();

    // Cobalt v10 logic
    if (data.status === 'stream' || data.url) {
      console.log(`✅ Success [${videoId}]: ${data.url}`);
    } else {
      console.log(`❌ Instance Error [${videoId}]:`, data.text || data);
    }
  } catch (err) {
    console.log(`⚠️ Connection Failed: Is your Docker instance running on port 9000?`);
  }
};

fetchFromMyInstance(videoIds[0]);