
document.addEventListener("DOMContentLoaded", () => {

    // Clock
    function updateClock() {
        const clock = document.getElementById("LiveClock");

        if (clock) {
            clock.textContent = new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });
        }
    }

    updateClock();
    setInterval(updateClock, 1000);


    // NASA Astronomy Picture
    const NASA_API_KEY = "YOUR_NASA_API_KEY";

    fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("NASA data could not be loaded");
            }
            return response.json();
        })
        .then(data => {
            const title = document.getElementById("nasaTitle");
            const image = document.getElementById("nasaImgWrap");

            if (title) {
                title.textContent = data.title;
            }

            if (image && data.media_type === "image") {
                const img = document.createElement("img");
                img.src = data.url;
                img.alt = data.title || "NASA Astronomy Picture";

                image.replaceChildren(img);
            }
        })
        .catch(error => {
            console.error("NASA error:", error);

            const title = document.getElementById("nasaTitle");
            if (title) {
                title.textContent = "NASA picture is unavailable right now.";
            }
        });


    // Weather Search
    const WEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY";
    const searchBtn = document.getElementById("searchBtn");
    const cityInput = document.getElementById("cityInput");

    if (searchBtn && cityInput) {
        searchBtn.addEventListener("click", searchWeather);

        cityInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                searchWeather();
            }
        });
    }

    function searchWeather() {
        const city = cityInput.value.trim();

        if (!city) {
            alert("Please enter a city name.");
            return;
        }

        getWeather(city);
    }

    async function getWeather(city) {
        const url = new URL(
            "https://api.openweathermap.org/data/2.5/weather"
        );

        url.searchParams.set("q", city);
        url.searchParams.set("units", "metric");
        url.searchParams.set("appid", WEATHER_API_KEY);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    response.status === 404
                        ? "City not found. Please try another name."
                        : "Weather data could not be loaded. Try again."
                );
            }

            const data = await response.json();
            updateWeatherDOM(data);

        } catch (error) {
            alert(error.message);
        }
    }

    function updateWeatherDOM(data) {
        document.getElementById("cityName").textContent =
            `${data.name}, ${data.sys.country}`;

        document.getElementById("temperature").textContent =
            `${Math.round(data.main.temp)}°C`;

        document.getElementById("description").textContent =
            data.weather[0].description;

        document.getElementById("humidity").textContent =
            `Humidity: ${data.main.humidity}%`;

        document.getElementById("wind").textContent =
            `Wind: ${data.wind.speed} m/s`;
    }

});
