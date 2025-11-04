// API Keys
const API_KEYS = {
    weather: '550a0cf7456470fbbab8eb22153a2cce',
    news: '4fdaf603c4594304b9ae686cb33efa90',
    omdb: '22a0aa70',
    nasa: 'D12b2fWzARmaGcB8qASrDA46qChWcPBByuerqR1n'
};

// Navigation 'DEMO_KEY' //
const navButtons = document.querySelectorAll('.nav-button');
const sections = document.querySelectorAll('.section');

navButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        createRipple(e, button);

        // Remove active class from all buttons and sections
        navButtons.forEach(btn => btn.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Show corresponding section
        const page = button.dataset.page;
        document.getElementById(`${page}-section`).classList.add('active');
    });
});

// Weather API
document.getElementById('get-weather').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value.trim();

    if (!city) {
        showSnackbar('Please enter a city name');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEYS.weather}&units=metric`
        );

        if (!response.ok) throw new Error('City not found');

        const data = await response.json();
        displayWeather(data);
        showSnackbar('Weather data loaded! ☀️');
    } catch (error) {
        displayError('weather-result', 'Could not fetch weather data. Please check the city name.');
    } finally {
        showLoading(false);
    }
});

function displayWeather(data) {
    const result = document.getElementById('weather-result');
    result.innerHTML = `
        <div class="weather-card">
            <div class="weather-main">
                <div class="weather-icon">${getWeatherIcon(data.weather[0].main)}</div>
                <div>
                    <div class="weather-temp">${Math.round(data.main.temp)}°C</div>
                    <div style="font-size: 20px; color: var(--md-sys-color-on-surface-variant);">
                        ${data.name}, ${data.sys.country}
                    </div>
                    <div style="font-size: 16px; color: var(--md-sys-color-on-surface-variant); text-transform: capitalize;">
                        ${data.weather[0].description}
                    </div>
                </div>
            </div>
            <div class="weather-info">
                <div class="weather-item">
                    <span class="weather-label">Feels Like</span>
                    <span class="weather-value">${Math.round(data.main.feels_like)}°C</span>
                </div>
                <div class="weather-item">
                    <span class="weather-label">Humidity</span>
                    <span class="weather-value">${data.main.humidity}%</span>
                </div>
                <div class="weather-item">
                    <span class="weather-label">Wind Speed</span>
                    <span class="weather-value">${data.wind.speed} m/s</span>
                </div>
                <div class="weather-item">
                    <span class="weather-label">Pressure</span>
                    <span class="weather-value">${data.main.pressure} hPa</span>
                </div>
            </div>
        </div>
    `;
}

function getWeatherIcon(weather) {
    const icons = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Snow': '❄️',
        'Thunderstorm': '⛈️',
        'Drizzle': '🌦️',
        'Mist': '🌫️',
        'Fog': '🌫️'
    };
    return icons[weather] || '🌤️';
}

// News API
document.getElementById('get-news').addEventListener('click', async () => {
    const topic = document.getElementById('news-topic').value.trim() || 'technology';

    showLoading(true);

    try {
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&pageSize=6&language=en&sortBy=publishedAt&apiKey=${API_KEYS.news}`
        );

        if (!response.ok) throw new Error('Failed to fetch news');

        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            displayNews(data.articles);
            showSnackbar('News loaded! 📰');
        } else {
            displayError('news-result', 'No news articles found for this topic. Try another search term.');
        }
    } catch (error) {
        displayError('news-result', 'Could not fetch news. Please try again later.');
    } finally {
        showLoading(false);
    }
});

function displayNews(articles) {
    const result = document.getElementById('news-result');
    result.innerHTML = `
        <div class="news-grid">
            ${articles.map(article => `
                <a href="${article.url}" target="_blank" style="text-decoration: none; color: inherit;">
                    <div class="news-card">
                        ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${article.title}" class="news-image" onerror="this.style.display='none'">` : ''}
                        <div class="news-content">
                            <div class="news-title">${article.title}</div>
                            <div class="news-description">${article.description || 'No description available'}</div>
                            <div class="news-source">${article.source.name} • ${new Date(article.publishedAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                </a>
            `).join('')}
        </div>
    `;
}

// Cat API
document.getElementById('get-cat').addEventListener('click', async () => {
    showLoading(true);

    try {
        const response = await fetch('https://api.thecatapi.com/v1/images/search');
        const data = await response.json();
        displayImage('pets-result', data[0].url, 'Random Cat 🐱');
        showSnackbar('Meow! 🐱');
    } catch (error) {
        displayError('pets-result', 'Could not fetch cat image. Please try again.');
    } finally {
        showLoading(false);
    }
});

// Dog API
document.getElementById('get-dog').addEventListener('click', async () => {
    showLoading(true);

    try {
        const response = await fetch('https://api.thedogapi.com/v1/images/search');
        const data = await response.json();
        displayImage('pets-result', data[0].url, 'Random Dog 🐕');
        showSnackbar('Woof! 🐕');
    } catch (error) {
        displayError('pets-result', 'Could not fetch dog image. Please try again.');
    } finally {
        showLoading(false);
    }
});

// Meme API
document.getElementById('get-meme').addEventListener('click', async () => {
    showLoading(true);

    try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();
        const randomMeme = data.data.memes[Math.floor(Math.random() * data.data.memes.length)];
        displayImage('pets-result', randomMeme.url, randomMeme.name);
        showSnackbar('Meme loaded! 😂');
    } catch (error) {
        displayError('pets-result', 'Could not fetch meme. Please try again.');
    } finally {
        showLoading(false);
    }
});

function displayImage(containerId, url, title) {
    const result = document.getElementById(containerId);
    result.innerHTML = `
        <div class="image-container">
            <div>
                <h3 style="text-align: center; margin-bottom: 16px; color: var(--md-sys-color-primary);">${title}</h3>
                <img src="${url}" alt="${title}" class="api-image" onerror="this.src='https://via.placeholder.com/400x400?text=Image+Not+Available'">
            </div>
        </div>
    `;
}

// Movie API - Following the guide exactly
document.getElementById('search-movie').addEventListener('click', async () => {
    const movieName = document.getElementById('movie-search').value.trim();

    if (!movieName) {
        showSnackbar('Please enter a movie name');
        return;
    }

    showLoading(true);

    try {
        // Using the exact format from the guide
        const url = `https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${API_KEYS.omdb}`;
        console.log('Fetching movie from:', url);

        const response = await fetch(url);
        const data = await response.json();

        console.log('Movie response:', data);

        if (data.Response === 'False') {
            throw new Error(data.Error || 'Movie not found');
        }

        displayMovie(data);
        showSnackbar('Movie found! 🎬');
    } catch (error) {
        console.error('Movie API error:', error);
        displayError('movie-result', `Could not fetch movie: ${error.message}`);
    } finally {
        showLoading(false);
    }
});

function displayMovie(movie) {
    const result = document.getElementById('movie-result');
    result.innerHTML = `
        <div class="movie-card">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Poster'}" 
                 alt="${movie.Title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/200x300?text=No+Poster'">
            <div class="movie-info">
                <div class="movie-title">${movie.Title} (${movie.Year})</div>
                <div class="movie-details">
                    <div class="movie-detail-item"><strong>Rating:</strong> ⭐ ${movie.imdbRating !== 'N/A' ? movie.imdbRating + '/10' : 'Not rated'}</div>
                    <div class="movie-detail-item"><strong>Genre:</strong> ${movie.Genre}</div>
                    <div class="movie-detail-item"><strong>Director:</strong> ${movie.Director}</div>
                    <div class="movie-detail-item"><strong>Actors:</strong> ${movie.Actors}</div>
                    <div class="movie-detail-item"><strong>Runtime:</strong> ${movie.Runtime}</div>
                    ${movie.Awards !== 'N/A' ? `<div class="movie-detail-item"><strong>Awards:</strong> ${movie.Awards}</div>` : ''}
                </div>
                <div class="movie-plot">${movie.Plot}</div>
            </div>
        </div>
    `;
}

// Joke API
document.getElementById('get-joke').addEventListener('click', async () => {
    showLoading(true);

    try {
        const response = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode');
        const data = await response.json();

        let jokeText = '';
        if (data.type === 'single') {
            jokeText = data.joke;
        } else {
            jokeText = `${data.setup}<br><br><strong>${data.delivery}</strong>`;
        }

        document.getElementById('misc-result').innerHTML = `
            <div class="joke-card">
                <div class="joke-text">${jokeText}</div>
            </div>
        `;
        showSnackbar('Joke loaded! 😂');
    } catch (error) {
        displayError('misc-result', 'Could not fetch joke. Please try again.');
    } finally {
        showLoading(false);
    }
});

// NASA API - Random NASA Image
document.getElementById('get-nasa').addEventListener('click', async () => {
    showLoading(true);

    try {
        console.log('Fetching random NASA image...');
        
        // More specific search terms that tend to have beautiful images
        const searchTerms = ['nebula', 'galaxy spiral', 'hubble', 'pillars of creation', 'aurora', 'earth from space', 'jupiter clouds', 'saturn rings', 'milky way', 'supernova'];
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        // Using NASA Images API with more results to filter from
        const response = await fetch(
            `https://images-api.nasa.gov/search?q=${randomTerm}&media_type=image&page_size=50`,
            { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`NASA API returned status ${response.status}`);
        }
        
        const data = await response.json();
        console.log('NASA API response:', data);

        if (!data.collection.items || data.collection.items.length === 0) {
            throw new Error('No images found');
        }

        // Filter for items that have images and pick a random one
        const itemsWithImages = data.collection.items.filter(item => item.links && item.links[0]);
        const randomItem = itemsWithImages[Math.floor(Math.random() * itemsWithImages.length)];
        const imageData = randomItem.data[0];
        
        // Get the highest resolution version available
        // NASA provides multiple resolutions - we'll fetch the original
        const nasaId = imageData.nasa_id;
        const assetResponse = await fetch(`https://images-api.nasa.gov/asset/${nasaId}`);
        const assetData = await assetResponse.json();
        
        // Find the largest image (original quality)
        const images = assetData.collection.items.filter(item => item.href.includes('.jpg') || item.href.includes('.png'));
        const highResImage = images[images.length - 1]?.href || randomItem.links[0].href;

        document.getElementById('misc-result').innerHTML = `
            <div class="nasa-card">
                <div class="nasa-title">${imageData.title}</div>
                <div class="nasa-description" style="margin-bottom: 16px; font-size: 12px; color: var(--md-sys-color-on-surface-variant);">
                    ${imageData.date_created ? new Date(imageData.date_created).toLocaleDateString() : ''}
                    ${imageData.photographer ? ` • © ${imageData.photographer}` : ''}
                    ${imageData.center ? ` • ${imageData.center}` : ''}
                </div>
                <div class="image-container">
                    <img src="${highResImage}" alt="${imageData.title}" class="api-image" onerror="this.src='https://via.placeholder.com/800x600?text=Image+Not+Available'">
                </div>
                <div class="nasa-description">${imageData.description || 'No description available'}</div>
            </div>
        `;
        showSnackbar('Random NASA photo loaded! 🚀');
    } catch (error) {
        console.error('NASA API error:', error);
        if (error.name === 'AbortError') {
            displayError('misc-result', 'NASA API is taking too long to respond. Please try again. 🚀');
        } else {
            displayError('misc-result', '⚠️ Could not fetch NASA image. Please try again later! 🚀');
        }
    } finally {
        showLoading(false);
    }
});

// Country API - Following the guide exactly
document.getElementById('get-country').addEventListener('click', async () => {
    showLoading(true);

    try {
        console.log('Fetching countries...');
        // Add fields param to satisfy RestCountries v3.1 API
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,population,area,languages,currencies,flags');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const countries = await response.json();
        console.log('Countries fetched:', countries.length);

        if (!countries || countries.length === 0) {
            throw new Error('No countries data received');
        }

        // Pick random country
        const country = countries[Math.floor(Math.random() * countries.length)];
        console.log('Random country:', country);

        document.getElementById('misc-result').innerHTML = `
            <div class="country-card">
                <div style="text-align: center; margin-bottom: 16px;">
                    <img src="${country.flags?.png || ''}" alt="${country.name?.common || 'Flag'}" style="max-width: 200px; border-radius: 12px; box-shadow: var(--md-sys-elevation-2);">
                </div>
                <div class="country-name">${country.name?.common || 'Unknown'}</div>
                <div class="country-info">
                    <div class="weather-item">
                        <span class="weather-label">Official Name</span>
                        <span class="weather-value">${country.name?.official || 'N/A'}</span>
                    </div>
                    <div class="weather-item">
                        <span class="weather-label">Capital</span>
                        <span class="weather-value">${country.capital?.[0] || 'N/A'}</span>
                    </div>
                    <div class="weather-item">
                        <span class="weather-label">Region</span>
                        <span class="weather-value">${country.region || 'N/A'}</span>
                    </div>
                    <div class="weather-item">
                        <span class="weather-label">Population</span>
                        <span class="weather-value">${country.population ? country.population.toLocaleString() : 'N/A'}</span>
                    </div>
                    <div class="weather-item">
                        <span class="weather-label">Subregion</span>
                        <span class="weather-value">${country.subregion || 'N/A'}</span>
                    </div>
                    <div class="weather-item">
                        <span class="weather-label">Area</span>
                        <span class="weather-value">${country.area ? country.area.toLocaleString() + ' km²' : 'N/A'}</span>
                    </div>
                    <div class="weather-item">
                        <span class="weather-label">Languages</span>
                        <span class="weather-value">${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</span>
                    </div>
                    <div class="weather-item">
                        <span class="weather-label">Currency</span>
                        <span class="weather-value">${country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A'}</span>
                    </div>
                </div>
            </div>
        `;
        showSnackbar('Random country loaded! 🌍');
    } catch (error) {
        console.error('Country API error:', error);
        displayError('misc-result', `Could not fetch country data: ${error.message}`);
    } finally {
        showLoading(false);
    }
});


// Utility Functions
function displayError(containerId, message) {
    document.getElementById(containerId).innerHTML = `
        <div class="error-message">⚠️ ${message}</div>
    `;
}

function showLoading(show) {
    const loader = document.getElementById('loading');
    if (show) {
        loader.classList.add('show');
    } else {
        loader.classList.remove('show');
    }
}

function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
            }
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

function showSnackbar(message) {
    const existing = document.querySelector('.snackbar');
    if (existing) existing.remove();

    const snackbar = document.createElement('div');
    snackbar.className = 'snackbar';
    snackbar.textContent = message;

    if (!document.getElementById('snackbar-styles')) {
        const style = document.createElement('style');
        style.id = 'snackbar-styles';
        style.textContent = `
            .snackbar {
                position: fixed;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: var(--md-sys-color-surface-container-highest);
                color: var(--md-sys-color-on-surface);
                padding: 14px 16px;
                border-radius: 8px;
                box-shadow: var(--md-sys-elevation-3);
                z-index: 1000;
                font-size: 14px;
                opacity: 0;
                animation: snackbar-slide 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            .snackbar.hide {
                animation: snackbar-hide 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            @keyframes snackbar-slide {
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
            @keyframes snackbar-hide {
                to {
                    transform: translateX(-50%) translateY(100px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(snackbar);

    setTimeout(() => {
        snackbar.classList.add('hide');
        setTimeout(() => snackbar.remove(), 300);
    }, 3000);
}

// Allow Enter key to trigger searches
document.getElementById('city-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('get-weather').click();
});

document.getElementById('news-topic').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('get-news').click();
});

document.getElementById('movie-search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('search-movie').click();
});