import { useState } from "react";
const HlsPlayer = window.Hls;

export default function LiveTV() {
  const [url, setUrl] = useState("");
  const [channels, setChannels] = useState([]);
  const [currentStream, setCurrentStream] = useState("");

  const loadPlaylist = async () => {
    try {
      const res = await fetch("https://api.allorigins.win/raw?url=" + url);
      const text = await res.text();

      const lines = text.split("\n");
      let parsed = [];

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("#EXTINF")) {
          const name = lines[i].split(",")[1];
          const stream = lines[i + 1];
          parsed.push({ name, stream });
        }
      }

      setChannels(parsed);
    } catch (err) {
      console.error("Failed to load playlist", err);
    }
  };

const playStream = (streamUrl) => {
  setCurrentStream(streamUrl);

  const video = document.getElementById("video-player");
  const HlsPlayer = window.Hls;

  if (HlsPlayer && HlsPlayer.isSupported()) {
    const hls = new HlsPlayer();
    hls.loadSource(streamUrl);
    hls.attachMedia(video);
  } else {
    video.src = streamUrl;
  }
};

  return (
    <div className="live-tv-page">
      <h1>Live TV</h1>

      <div className="live-controls">
        <input
          placeholder="Paste .m3u link..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="btn btn-primary" onClick={loadPlaylist}>
          Load Playlist
        </button>
      </div>

      <div className="live-container">
        <div className="channel-list">
          {channels.map((ch, i) => (
            <div
              key={i}
              className="channel-item"
              onClick={() => playStream(ch.stream)}
            >
              {ch.name}
            </div>
          ))}
        </div>

        <div className="player-section">
          <video id="video-player" controls />
        </div>
      </div>
    </div>
  );
}
