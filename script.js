document.addEventListener("DOMContentLoaded", () => {
  function updateClock() {
    const now = new Date();
    document.getElementById("LiveClock").textContent =  
       now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  setInterval(updateClock, 1000);
  updateClock();

  const API_KEY = "lboWwlbqU7S06cKHW0A5Iwc0dQfkLkmjac39pYhk";
    
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)

    .then(response => response.json())
     .then(data => {
      document.getElementById("nasaTitle").textContent = data.title;
       
      
      if (data.media_type === "image") {
        document.getElementById("nasaImgWrap").innerHTML = `<img src="${data.url}" alt="${data.title}">`;
      } else {
        document.getElementById("nasaImgWrap").innerHTML = "";
      }
    })
    .catch(error => {
      console.error("Error fetching NASA data:", error);
      document.getElementById("nasaTitle").textContent = "Could not load NASA image.";
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const introVideo = document.getElementById("introVideo");
    const introOverlay = document.getElementById("introOverlay");
    let playbackStarted = false;

    function showDashboard() {
        introOverlay.classList.add("hidden");
    }

    const startupTimeout = setTimeout(() => {
        if (!playbackStarted) {
            console.warn("Intro video did not start; showing the dashboard.");
            showDashboard();
        }
    }, 4000);

    introVideo.addEventListener("playing", () => {
        playbackStarted = true;
        clearTimeout(startupTimeout);
    }, { once: true });

    introVideo.play().catch(error => {
        console.log("Intro video could not autoplay; showing the dashboard:", error);
        clearTimeout(startupTimeout);
        showDashboard();
    });

    // Hide overlay when video ends normally
    introVideo.addEventListener("ended", showDashboard);

    // Fallback if video fails to load
    introVideo.addEventListener("error", () => {
        clearTimeout(startupTimeout);
        showDashboard();
    });
});
