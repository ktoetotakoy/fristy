(function () {
    if (!document.getElementById("hxrdware-player")) return;
  
    /* ---------- CSS ---------- */
    const style = document.createElement("style");
    style.textContent = `
    .hxrdware-player {
      width: 100%;
      max-width: 540px;
      height: 122px;
      background: rgba(0, 0, 0, 0.43);
      border-radius: 16px;
      backdrop-filter: blur(14px);
      padding: 12px;
      color: #fff;
      font-family: system-ui, sans-serif;
    }
    .hx-top {
      display: flex;
      gap: 12px;
    }
    .hx-cover {
      width: 75px;
      height: 75px;
      border-radius: 8px;
      background-size: cover;
      background-position: center;
    }
    .hx-info {
      flex: 1;
      overflow: hidden;
    }
    .hx-title {
      font-size: 17px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .hx-artist {
      font-size: 14px;
      color: #b3b3b3;
    }
    .hx-bottom {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
      position: relative;
    }
    .hx-time {
      font-size: 13px;
      color: #aaa;
      min-width: 38px;
    }
    .hx-progress {
      flex: 1;
      height: 4px;
      background: #444;
      border-radius: 2px;
      cursor: pointer;
      overflow: hidden;
      margin-right: 50px;
    }
    .hx-bar {
      height: 100%;
      width: 0%;
      background: #fff;
    }
    .hx-play {
  position: absolute;
  right: 0;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: #fff;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 6px 18px rgba(0,0,0,0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hx-play:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 24px rgba(0,0,0,0.45);
}

.hx-play svg {
  width: 20px;
  height: 20px;
  fill: #000;
  display: block;
}

/* Play — лёгкий визуальный сдвиг вправо */
.hx-play .play {
  margin-left: 2px;
}

/* Pause — строго по центру */
.hx-play .pause {
  margin-left: 0;
}

    `;
    document.head.appendChild(style);
  
    /* ---------- HTML ---------- */
    const container = document.getElementById("hxrdware-player");
    container.innerHTML = `
      <div class="hxrdware-player">
        <div class="hx-top">
          <div class="hx-cover"></div>
          <div class="hx-info">
            <div class="hx-title"></div>
            <div class="hx-artist"></div>
          </div>
        </div>
        <div class="hx-bottom">
          <div class="hx-time">0:00</div>
          <div class="hx-progress"><div class="hx-bar"></div></div>
          <button class="hx-play">
            <svg viewBox="0 0 24 24" class="play">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg viewBox="0 0 24 24" class="pause" style="display:none">
              <path d="M6 5h4v14H6zm8 0h4v14h-4z"/>
            </svg>
          </button>
        </div>
        <audio></audio>
      </div>
    `;
  
    /* ---------- CONFIG ---------- */
    const TRACK = {
      title: "back to my day job",
      artist: "wifiskeleton",
      cover: "https://cdn-images.dzcdn.net/images/cover/1a01e722894c647f7c66c4d29059e1ae/500x500.jpg",
      audio: "song.mp3",
      volume: 0.2
    };
  
    /* ---------- JS ---------- */
    const audio = container.querySelector("audio");
    const cover = container.querySelector(".hx-cover");
    const title = container.querySelector(".hx-title");
    const artist = container.querySelector(".hx-artist");
    const time = container.querySelector(".hx-time");
    const progress = container.querySelector(".hx-progress");
    const bar = container.querySelector(".hx-bar");
    const playBtn = container.querySelector(".hx-play");
    const playIcon = playBtn.querySelector(".play");
    const pauseIcon = playBtn.querySelector(".pause");
  
    title.textContent = TRACK.title;
    artist.textContent = TRACK.artist;
    cover.style.backgroundImage = `url(${TRACK.cover})`;
    audio.src = TRACK.audio;
    audio.volume = TRACK.volume;
  
    function fmt(s) {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${m}:${sec.toString().padStart(2,"0")}`;
    }
  
    playBtn.onclick = () => {
      audio.paused ? audio.play() : audio.pause();
    };
  
    audio.onplay = () => {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    };
  
    audio.onpause = () => {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    };
  
    audio.ontimeupdate = () => {
      bar.style.width = (audio.currentTime / audio.duration * 100) + "%";
      time.textContent = fmt(audio.currentTime);
    };
  
    progress.onclick = e => {
      const r = progress.getBoundingClientRect();
      audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
    };
  })();
  