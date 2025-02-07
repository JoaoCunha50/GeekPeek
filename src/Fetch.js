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

function fetchMovies(genre) {
    const apiKey = 'ed674c0f'; // A tua chave API da OMDb
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${genre}&type=movie`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const movies = data.Search; // Filmes da OMDb API
            let movieDetailsList = [];

            if (movies && movies.length > 0) {
                // Loop para obter os detalhes de cada filme
                let fetchDetailsPromises = movies.map(movie => 
                    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(details => {
                            if (details.Response === 'True') {
                                // Adicionar os detalhes do filme à lista
                                movieDetailsList.push(details);
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao obter os detalhes do filme:', error);
                        })
                );

                // Esperar que todas as promessas sejam resolvidas
                Promise.all(fetchDetailsPromises).then(() => {
                    // Ordenar os filmes pelo rating (rating decrescente)
                    movieDetailsList.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));

                    let movieListHTML = '';
                    // Criar o HTML para exibir a lista de filmes
                    movieDetailsList.forEach(details => {
                        const description = details.Plot?.length > 100 
                            ? details.Plot.substring(0, 100) + '...' 
                            : details.Plot || 'Sem descrição disponível';

                        movieListHTML += `
                            <div class="flex items-start p-5 bg-gray-800 rounded-lg shadow-md mb-4 max-w-4xl mx-auto">
                                <div class="flex-1 mr-4">
                                    <h3 class="text-2xl font-semibold text-gray-100 mb-2">${details.Title}</h3>
                                    <p class="text-yellow-500 font-medium">Rating: ${details.imdbRating || 'N/A'}</p>
                                    <p class="text-gray-500 text-sm mt-2">${description}</p>
                                    <p class="text-gray-600 mt-1">Ano: ${details.Year}</p>
                                </div>
                                <img src="${details.Poster}" alt="${details.Title}" class="w-24 h-auto rounded-md">
                            </div>`;
                    });

                    // Injectar a lista de filmes na página
                    document.getElementById('movieList').innerHTML = movieListHTML;
                });
            } else {
                document.getElementById('movieList').innerHTML = '<p class="text-gray-500">Nenhum filme encontrado para este género.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao obter os dados dos filmes:', error);
            document.getElementById('movieList').innerHTML = '<p class="text-red-500">Erro ao obter os dados dos filmes.</p>';
        });
}
