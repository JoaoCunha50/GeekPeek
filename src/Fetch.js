function fetchBooks(genre) {
    // Fetch books from the Google Books API, sorted by relevance
    fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&orderBy=relevance`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const books = data.items; // Array of books from API
            let bookListHTML = '';

            if (books && books.length > 0) {
                // Loop through each book and create the HTML to display it
                books.forEach(book => {
                    const coverUrl = book.volumeInfo.imageLinks?.thumbnail; // Get cover image URL

                    bookListHTML += `
                        <div class="flex items-center p-5 bg-gray-800 rounded-lg shadow-md mb-4 max-w-4xl mx-auto">
                            <div class="flex-1">
                                <h3 class="text-xl font-semibold text-gray-100">${book.volumeInfo.title}</h3>
                                <p class="text-gray-600">${book.volumeInfo.authors?.join(', ') || 'Unknown author'}</p>
                                <p class="text-yellow-500 font-medium">Rating: ${book.volumeInfo.averageRating || 'N/A'}</p>
                                <p class="text-gray-500 text-sm mt-2">${book.volumeInfo.description?.substring(0, 500) || 'No description available'}...</p>
                            </div>
                            <img src="${coverUrl}" alt="${book.volumeInfo.title}" class="w-auto h-auto rounded-md ml-4">
                        </div>`;
                });
            } else {
                bookListHTML = '<p class="text-gray-500">No books found for this genre.</p>';
            }

            // Inject the book list into the page
            document.getElementById('bookList').innerHTML = bookListHTML;
        })
        .catch(error => {
            console.error('Error fetching book data:', error);
            document.getElementById('bookList').innerHTML = '<p class="text-red-500">Error fetching book data.</p>';
        });
}


function fetchAnimes(genre) {
    const query = `
    {
        Page(perPage: 10) { 
            media(type: ANIME, genre: "${genre}", sort: SCORE_DESC) {
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

    // Fetch anime from AniList
    fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    })
    .then(response => response.json())
    .then(data => {
        const animes = data.data.Page.media;  // Get the list of anime

        let animeListHTML = '';

        if (animes && animes.length > 0) {
        // Loop through each anime and create the HTML to display it
        animes.forEach(anime => {
            animeListHTML += `
                <div class="flex items-center p-5 bg-gray-800 rounded-lg shadow-md mb-4 max-w-4xl mx-auto">
                    <div class="flex-1">
                        <h3 class="text-xl font-semibold text-gray-100">${anime.title.english || anime.title.romaji}</h3>
                        <p class="text-yellow-500 font-medium">Rating: ${anime.averageScore || 'N/A'}</p>
                        <p class="text-gray-500 text-sm mt-2">${anime.description?.substring(0, 150) || 'No description available'}...</p>
                    </div>
                    <img src="${anime.coverImage.large}" alt="${anime.title.romaji}" class="w-48 h-auto rounded-md ml-4">
                </div>`;
        });
    } else {
        animeListHTML = '<p class="text-gray-500">No Animes found for this genre.</p>'
    }


        // Inject the sorted anime list into the page
        document.getElementById('animeList').innerHTML = animeListHTML;
    })
    .catch(error => {
        console.error('Error fetching anime data:', error);
        document.getElementById('animeList').innerHTML = '<p>Error fetching anime data.</p>';
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
                        <p class="text-gray-600">Rating: ${movie.vote_average}</p>
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="w-32 rounded-md">
                    </div>`;
            });

            // Inject the movie list into the page
            document.getElementById('movieList').innerHTML = movieListHTML;
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
}
