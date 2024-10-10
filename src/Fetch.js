// Function to fetch books
function fetchBooks(genre) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${genre}`)
        .then(response => response.json())
        .then(data => {
            const books = data.items; // Array of books from API
            let bookListHTML = '';

            books.forEach(book => {
                bookListHTML += `
                    <div class="p-4 bg-gray-50 rounded-lg shadow-md">
                        <h3 class="text-xl font-semibold text-gray-800">${book.volumeInfo.title}</h3>
                        <p class="text-gray-600">${book.volumeInfo.authors?.join(', ') || 'Unknown author'}</p>
                        <p class="text-yellow-500 font-medium">Rating: ${book.volumeInfo.averageRating || 'N/A'}</p>
                        <p class="text-gray-500 text-sm mt-2">${book.volumeInfo.description?.substring(0, 100) || 'No description available'}...</p>
                    </div>`;
            });

            document.getElementById('bookList').innerHTML = bookListHTML;
        })
        .catch(error => {
            console.error('Error fetching book data:', error);
        });
}

// Function to fetch animes
function fetchAnimes(genre) {
    const query = `
    {
        Page {
            media(type: ANIME, genre: "${genre}") {
                title {
                    romaji
                    english
                }
                description
                averageScore
                coverImage {
                    large
                }
            }
        }
    }`;

    fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    })
    .then(response => response.json())
    .then(data => {
        const animes = data.data.Page.media;
        let animeListHTML = '';

        animes.forEach(anime => {
            animeListHTML += `
                <div class="flex items-center p-10 bg-gray-50 rounded-lg shadow-md">
                    <div class="flex-1 pr-6">
                        <h3 class="text-xl font-semibold text-gray-800">${anime.title.english || anime.title.romaji}</h3>
                        <p class="text-gray-600">${anime.description || 'No description available'}</p>
                        <p class="text-yellow-500 font-medium">Rating: ${anime.averageScore || 'N/A'}</p>
                    </div>
                    <img src="${anime.coverImage.large}" alt="${anime.title.english} cover" class="w-48 h-auto rounded-md ml-4">
                </div>`;
        });
        

        document.getElementById('animeList').innerHTML = animeListHTML || '<p class="text-gray-500">No animes found.</p>';
    })
    .catch(error => {
        console.error('Error fetching anime data:', error);
        document.getElementById('animeList').innerHTML = '<p class="text-red-500">Failed to fetch animes. Please try again later.</p>';
    });
}


// Function to fetch movies
function fetchMovies(genre) {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&query=${genre}`) // Use your own API key
        .then(response => response.json())
        .then(data => {
            const movies = data.results; // Movies from TMDB API
            let movieListHTML = '';

            // Loop through each movie and create HTML to display it
            movies.forEach(movie => {
                movieListHTML += `
                    <div class="p-4 bg-gray-50 rounded-lg shadow-md">
                        <h3 class="text-xl font-semibold text-gray-800">${movie.title}</h3>
                        <p class="text-gray-600">${movie.overview.substring(0, 100) || 'No description available'}...</p>
                        <p class="text-yellow-500 font-medium">Rating: ${movie.vote_average || 'N/A'}</p>
                    </div>`;
            });

            // Inject the movie list into the page
            document.getElementById('movieList').innerHTML = movieListHTML;
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
}
