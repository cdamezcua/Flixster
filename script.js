var MoviesGridContainer = document.getElementById("movies-grid-container");
var moviesGrid = document.getElementById("movies-grid");
var loadMoreMoviesButton = document.getElementById("load-more-movies-btn");

var searchButton = document.getElementById("search-btn");
var searchInput = document.getElementById("search-input");
var closeSearchButton = document.getElementById("close-search-btn");

var searchMoviesGridContainer = document.getElementById(
  "search-movies-grid-container"
);
var searchMoviesGrid = document.getElementById("search-movies-grid");

var movieDialog = document.getElementById("movie-dialog");

var displayedPages = 1;

function createMovieCard(movie) {
  return `
    <div class="movie-card" data-movie-id="${movie.id}">
      <div class="movie-title-container">
        <h1 class="movie-title">${movie.title}</h1>
      </div>
      <div class="movie-poster-container">
        <img class="movie-poster" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster.">
        <p class="movie-votes">${movie.vote_average}</p>
      </div>
    </div>
  `;
}

async function loadNowPlayingMoviesPage(page) {
  try {
    const baseURL = "https://api.themoviedb.org/3/movie/now_playing";
    const apikey = "b55c170bfdfea258df28f3ba96c063b4";
    const language = "en-US";

    const url = new URL(baseURL);
    url.searchParams.append("api_key", apikey);
    url.searchParams.append("language", language);
    url.searchParams.append("page", page);

    const response = await fetch(url);
    const data = await response.json();

    const movies = data.results;
    movies.forEach((movie) => {
      moviesGrid.innerHTML += createMovieCard(movie);
    });
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", loadNowPlayingMoviesPage(1));

loadMoreMoviesButton.addEventListener("click", (event) => {
  event.preventDefault();
  ++displayedPages;
  loadNowPlayingMoviesPage(displayedPages);
});

function showMoviesGridContainer() {
  MoviesGridContainer.style.display = "block";
  searchMoviesGridContainer.style.display = "none";
}

function showSearchMoviesGridContainer() {
  MoviesGridContainer.style.display = "none";
  searchMoviesGridContainer.style.display = "block";
}

searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  searchInput.style.display = "block";
  closeSearchButton.style.display = "block";
  searchButton.style.display = "none";
  searchInput.value = "";
  searchInput.focus();
});

closeSearchButton.addEventListener("click", (event) => {
  event.preventDefault();
  searchInput.style.display = "none";
  closeSearchButton.style.display = "none";
  searchButton.style.display = "block";
  showMoviesGridContainer();
});

searchInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    if (searchInput.value !== "") {
      showSearchMoviesGridContainer();
    } else {
      showMoviesGridContainer();
    }
    searchMoviesGrid.innerHTML = "";
    try {
      const baseURL = "https://api.themoviedb.org/3/search/movie";
      const apikey = "b55c170bfdfea258df28f3ba96c063b4";
      const query = searchInput.value;

      const url = new URL(baseURL);
      url.searchParams.append("api_key", apikey);
      url.searchParams.append("query", query);

      const response = await fetch(url);
      const data = await response.json();

      const movies = data.results;
      movies.forEach((movie) => {
        searchMoviesGrid.innerHTML += createMovieCard(movie);
      });
    } catch (error) {
      console.log(error);
    }
  }
});

function createMovieDialog(movie) {
  while (movieDialog.firstChild) {
    movieDialog.removeChild(movieDialog.firstChild);
  }
  movieDialog.id = "movie-dialog";
  const h1MovieDialogTitle = document.createElement("h1");
  h1MovieDialogTitle.classList.add("movie-dialog-title");
  h1MovieDialogTitle.textContent = movie.title;
  movieDialog.appendChild(h1MovieDialogTitle);
  const movieDialogCloseButton = document.createElement("button");
  movieDialogCloseButton.id = "movie-dialog-close-btn";
  movieDialogCloseButton.textContent = "Close";
  movieDialog.appendChild(movieDialogCloseButton);
  const movieDialogBackdropPosterContainer = document.createElement("div");
  movieDialogBackdropPosterContainer.classList.add(
    "movie-dialog-backdrop-poster-container"
  );
  const imgMovieDialogBackdropPoster = document.createElement("img");
  imgMovieDialogBackdropPoster.classList.add("movie-dialog-backdrop-poster");
  imgMovieDialogBackdropPoster.src = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
  imgMovieDialogBackdropPoster.alt = `${movie.title} backdrop poster.`;
  movieDialogBackdropPosterContainer.appendChild(imgMovieDialogBackdropPoster);
  movieDialog.appendChild(movieDialogBackdropPosterContainer);
  const pMovieDialogRuntime = document.createElement("p");
  pMovieDialogRuntime.textContent = `Runtime: ${movie.runtime} min`;
  const pMovieDialogReleaseDate = document.createElement("p");
  movieDialog.appendChild(pMovieDialogRuntime);
  pMovieDialogReleaseDate.textContent = `Release date: ${movie.release_date}`;
  movieDialog.appendChild(pMovieDialogReleaseDate);
  const genres = movie.genres;
  const divMovieDialogGenres = document.createElement("div");
  divMovieDialogGenres.classList.add("movie-dialog-genres");
  genres.forEach((genre) => {
    const pMovieDialogGenre = document.createElement("p");
    pMovieDialogGenre.classList.add("movie-dialog-genre");
    pMovieDialogGenre.textContent = genre.name;
    divMovieDialogGenres.appendChild(pMovieDialogGenre);
  });
  movieDialog.appendChild(divMovieDialogGenres);
  const pMovieDialogOverview = document.createElement("p");
  pMovieDialogOverview.textContent = movie.overview;
  movieDialog.appendChild(pMovieDialogOverview);
  console.log(movieDialog);
}

document.addEventListener("click", async (event) => {
  if (event.target.closest(".movie-card")) {
    const movieId = event.target.closest(".movie-card").dataset.movieId;
    try {
      const baseURL = `https://api.themoviedb.org/3/movie/${movieId}`;
      const apikey = "b55c170bfdfea258df28f3ba96c063b4";

      const url = new URL(baseURL);
      url.searchParams.append("api_key", apikey);

      console.log(url);

      const response = await fetch(url);
      const data = await response.json();

      const movie = data;
      createMovieDialog(movie);
      document.body.appendChild(movieDialog);
      movieDialog.showModal();

      movieDialogCloseButton = document.getElementById("movie-dialog-close-btn");

      movieDialogCloseButton.addEventListener("click", (event) => {
        event.preventDefault();
        movieDialog.close();
      });
    } catch (error) {
      console.log(error);
    }
  }
});
