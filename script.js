var MoviesGridContainer = document.getElementById("movies-grid-container");
var moviesGrid = document.getElementById("movies-grid");
var loadMoreMoviesButton = document.getElementById("load-more-movies-btn");

var searchButton = document.getElementById("search-btn");
var searchForm = document.getElementById("search-form");
var searchInput = document.getElementById("search-input");
var closeSearchButton = document.getElementById("close-search-btn");

var searchMoviesGridContainer = document.getElementById(
  "search-movies-grid-container"
);
var searchMoviesGrid = document.getElementById("search-movies-grid");

var displayedPages = 1;

function createMovieCard(movie) {
  return `
    <div class="movie-card">
      <h1 class="movie-title">${movie.title}</h1>
      <div class="movie-poster-container">
        <img class="movie-poster" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster.">
        <p class="movie-votes">⭐️ ${movie.vote_average}</p>
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

searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  searchButton.style.display = "none";
  MoviesGridContainer.style.display = "none";
  searchForm.style.display = "block";
  searchMoviesGridContainer.style.display = "block";
});

closeSearchButton.addEventListener("click", (event) => {
  event.preventDefault();
  searchForm.style.display = "none";
  searchMoviesGridContainer.style.display = "none";
  searchButton.style.display = "block";
  MoviesGridContainer.style.display = "block";
});

searchInput.addEventListener("keydown", async (event) => {
  console.log("Key pressed.");
  if (event.key === "Enter") {
    event.preventDefault();
    console.log("Enter key pressed.");
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
