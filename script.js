function loadVideo(url) {
    const videoElement = document.getElementById('bg-video');
    while (videoElement.firstChild) videoElement.removeChild(videoElement.firstChild);
    const source = document.createElement('source');
    source.src = url;
    source.type = 'video/mp4';
    videoElement.appendChild(source);
    videoElement.load();
    
    return new Promise((resolve) => {
      videoElement.addEventListener('loadeddata', () => resolve(videoElement), { once: true });
      videoElement.addEventListener('error', () => resolve(videoElement), { once: true });
    });
  }
  
  
  function initTiltEffect() {
      const card = document.querySelector(".profile-card");
      if (!card) return;
    
      let rotX = 0, rotY = 0;
      let targetX = 0, targetY = 0;
      let isHovering = false;
      let rafId = null;
    
      const MAX_TILT = 8;
      const EASE = 0.22;
      const SPRING = 0.15;
      const SCALE_OUT = 1.01;
    
      const animate = () => {
        rotX += (targetX - rotX) * EASE;
        rotY += (targetY - rotY) * EASE;
    
        card.style.transform = `
          perspective(1000px)
          rotateX(${rotX}deg)
          rotateY(${rotY}deg)
          scale(${isHovering ? SCALE_OUT : 1})
        `;
    
        if (!isHovering) {
          targetX *= (1 - SPRING);
          targetY *= (1 - SPRING);
          if (Math.abs(targetX) < 0.01 && Math.abs(targetY) < 0.01) {
            rotX = rotY = targetX = targetY = 0;
            card.style.transform = 'scale(1)';
            rafId = null;
            return;
          }
        }
    
        rafId = requestAnimationFrame(animate);
      };
    
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
    
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
    
        const percentX = dx / (rect.width / 2);
        const percentY = dy / (rect.height / 2);
    
        targetX = -percentY * MAX_TILT;
        targetY = percentX * MAX_TILT; 
    
        isHovering = true;
        if (!rafId) rafId = requestAnimationFrame(animate);
      });
    
      card.addEventListener("mouseenter", () => {
        isHovering = true;
        if (!rafId) rafId = requestAnimationFrame(animate);
      });
    
      card.addEventListener("mouseleave", () => {
        isHovering = false;
      });
    
      window.addEventListener("resize", () => {
        if (rafId) cancelAnimationFrame(rafId);
        rotX = rotY = targetX = targetY = 0;
        card.style.transform = 'scale(1)';
        rafId = null;
      });
    }
  
    document.addEventListener("DOMContentLoaded", () => {
      initTiltEffect();
      loadVideo("video.mp4");
      initVisitsCounter()
    });

    function initVisitsCounter() {
        const visitsElem = document.getElementById("visits");
        if (visitsElem) {
          if (!localStorage.getItem("visited")) {
            fetch("https://abacus.jasoncameron.dev/hit/ktoetotakoy.github.io/fristy")
              .then(() => localStorage.setItem("visited", "true"))
              .catch(() => {});
          }
          const evtSource = new EventSource("https://abacus.jasoncameron.dev/stream/ktoetotakoy.github.io/fristy");
          evtSource.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              if (data?.value) visitsElem.textContent = data.value;
            } catch {}
          };
          evtSource.onerror = () => evtSource.close();
          setTimeout(() => evtSource.close(), 300000);
        }
        }