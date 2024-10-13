// Fetch top-rated animes and create slideshow
async function fetchTopAnimes() {
    const response = await fetch('https://api.jikan.moe/v4/top/anime');
    const data = await response.json();
    const animes = data.data.slice(0, 10); // Get the top 10 animes

    const slideshowContainer = document.getElementById('anime-slideshow');
    slideshowContainer.innerHTML = ''; // Clear the container

    animes.forEach((anime, index) => {
        const slide = document.createElement('div');
        slide.className = 'absolute inset-0 transition-transform transform ease-in-out duration-1000';
        slide.style.backgroundImage = `url(${anime.images.webp.large_image_url})`;
        slide.style.backgroundSize = 'contain';
        slide.style.backgroundPosition = 'center';
        slide.style.backgroundRepeat = 'no-repeat';  // Prevent the image from repeatin
        slide.style.opacity = index === 0 ? 1 : 0; // Only show the first slide initially

        const titleOverlay = document.createElement('div');
        titleOverlay.className = 'absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 text-lg font-bold';
        titleOverlay.textContent = anime.title;
        slide.appendChild(titleOverlay);

        slideshowContainer.appendChild(slide);
    });

    startSlideshow(slideshowContainer, animes.length);
}



// Fetch top-rated popular books and create slideshow
async function fetchTopBooks() {
    const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=subject:Fantasy&maxResults=10&orderBy=relevance');  // Change category as needed
    const data = await response.json();
    const books = data.items.slice(0, 10); // Get the top 10 books

    const slideshowContainer = document.getElementById('book-slideshow');
    slideshowContainer.innerHTML = ''; // Clear the container

    books.forEach((book, index) => {
        const slide = document.createElement('div');
        slide.className = 'absolute inset-0 transition-transform transform ease-in-out duration-1000';

        // Ensure we have a book image, or use a placeholder
        const imageUrl = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150';
        slide.style.backgroundImage = `url(${imageUrl})`;

        // Use 'cover' to make the image fill the slide while maintaining its aspect ratio
        slide.style.backgroundSize = 'contain';  // 'contain' scales the image to fill the container
        slide.style.backgroundPosition = 'center';  // 'center' ensures the image is centered in the slide
        slide.style.backgroundRepeat = 'no-repeat';  // Prevent the image from repeating
        slide.style.height = '100%';  // Ensure the image fills the height of the slide container
        slide.style.opacity = index === 0 ? 1 : 0;  // Only show the first slide initially

        // Overlay the title of the book
        const titleOverlay = document.createElement('div');
        titleOverlay.className = 'absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 text-lg font-bold';
        titleOverlay.textContent = book.volumeInfo.title;
        slide.appendChild(titleOverlay);

        slideshowContainer.appendChild(slide);
    });

    startSlideshow(slideshowContainer, books.length);
}

// Fetch top-rated movies and create slideshow
async function fetchTopMovies() {
    const apiKey = 'ed674c0f';
    const response = await fetch(`https://www.omdbapi.com/?s=Avengers&apikey=${apiKey}&type=movie`);

    const data = await response.json();

    if (data.Response === 'True') {
        const movies = data.Search.slice(0, 10); // Get the top 10 movies

        const slideshowContainer = document.getElementById('movie-slideshow');
        slideshowContainer.innerHTML = ''; // Clear the container

        movies.forEach((movie, index) => {
            const slide = document.createElement('div');
            slide.className = 'absolute inset-0 transition-transform transform ease-in-out duration-1000';

            // Ensure we have a movie poster, or use a placeholder
            const imageUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150';
            slide.style.backgroundImage = `url(${imageUrl})`;

            // Use 'contain' to make the image fill the slide while maintaining its aspect ratio
            slide.style.backgroundSize = 'contain';  // 'contain' scales the image to fill the container
            slide.style.backgroundPosition = 'center';  // 'center' ensures the image is centered in the slide
            slide.style.backgroundRepeat = 'no-repeat';  // Prevent the image from repeating
            slide.style.height = '100%';  // Ensure the image fills the height of the slide container
            slide.style.opacity = index === 0 ? 1 : 0;  // Only show the first slide initially

            // Overlay the movie title
            const titleOverlay = document.createElement('div');
            titleOverlay.className = 'absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 text-lg font-bold';
            titleOverlay.textContent = movie.Title;
            slide.appendChild(titleOverlay);

            slideshowContainer.appendChild(slide);
        });

        startSlideshow(slideshowContainer, movies.length);
    } else {
        console.error('Failed to fetch top-rated movies:', data.Error);
    }
}

// Function to start slideshow (same as before)
function startSlideshow(container, numSlides) {
    let currentIndex = 0;

    setInterval(() => {
        const slides = container.children;

        slides[currentIndex].style.opacity = 0;
        currentIndex = (currentIndex + 1) % numSlides;
        slides[currentIndex].style.opacity = 1;
    }, 5000); // 5-second interval between slides
}


