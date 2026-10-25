document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Clock
    function updateClock() {
        const now = new Date();
        const clockElement = document.getElementById("LiveClock");
        if (clockElement) {
            clockElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 2. NASA A
    const NASA_API_KEY = "lboWwlbqU7S06cKHW0A5Iwc0dQfkLkmjac39pYhk";
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const titleHeading = document.getElementById("nasaTitle");
            const imageWrapper = document.getElementById("nasaImgWrap");
            if (titleHeading) titleHeading.textContent = data.title;
            if (imageWrapper && data.media_type === "image") {
                imageWrapper.innerHTML = `<img src="${data.url}" alt="${data.title}">`;
            }
        })
        .catch(error => {
            console.warn("Error fetching NASA data:", error);
            const titleHeading = document.getElementById("nasaTitle");
            if (titleHeading) titleHeading.textContent = "Could not load NASA image.";
        });

    // Weather
    const WEATHER_API_KEY = "0164622a857df146c56fd307c0082d5d";
    const searchBtn = document.getElementById("searchBtn");
    const cityInput = document.getElementById("cityInput");

    if (searchBtn && cityInput) {
        searchBtn.addEventListener("click", () => {
            const city = cityInput.value.trim();
            if (city) getWeather(city);
        });

        cityInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                const city = cityInput.value.trim();
                if (city) getWeather(city);
            }
        });
    }

    async function getWeather(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("City not found");
            const data = await response.json();
            updateWeatherDOM(data);
        } catch (error) {
            alert(error.message);
        }
    }

    function updateWeatherDOM(data) {
        document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById("description").textContent = data.weather[0].description;
        document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
        document.getElementById("wind").textContent = `Wind: ${data.wind.speed} m/s`;
    }

    // Video
    const introVideo = document.getElementById("introVideo");
    const introOverlay = document.getElementById("introOverlay");
    let playbackStarted = false;

    function showDashboard() {
        if (introOverlay) introOverlay.classList.add("hidden");
    }

    const startupTimeout = setTimeout(() => {
        if (!playbackStarted) {
            console.warn("Intro video playback timeout; displaying dashboard.");
            showDashboard();
        }
    }, 4000);

    if (introVideo) {
        introVideo.addEventListener("playing", () => {
            playbackStarted = true;
            clearTimeout(startupTimeout);
        }, { once: true });

        introVideo.play().catch(error => {
            console.log("Autoplay restricted by browser; showing dashboard:", error);
            clearTimeout(startupTimeout);
            showDashboard();
        });

        introVideo.addEventListener("ended", showDashboard);
        introVideo.addEventListener("error", () => {
            clearTimeout(startupTimeout);
            showDashboard();
        });
    }
});
