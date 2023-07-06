// using const variables here as using var will attach them to global window scope
const MoviesGridContainer = document.getElementById("movies-grid-container");
const moviesGrid = document.getElementById("movies-grid");
const loadMoreMoviesButton = document.getElementById("load-more-movies-btn");

const searchButton = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const closeSearchButton = document.getElementById("close-search-btn");

const searchMoviesGridContainer = document.getElementById(
  "search-movies-grid-container"
);
const searchMoviesGrid = document.getElementById("search-movies-grid");

const movieDialog = document.getElementById("movie-dialog");

// const variable cannot be altered, it must be declared using let
let displayedPages = 1;

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

function createMovieDialog(movieDetails, movieVideos) {
  return `
    <h1 class="movie-dialog-title">${movieDetails.title}</h1>
    <div class="movie-dialog-media-container">
      <div>
        <img class="movie-dialog-backdrop-poster" src="https://image.tmdb.org/t/p/w500${
          movieDetails.backdrop_path
        }" alt="${movieDetails.title} backdrop poster.">
      </div>
      ${
        movieVideos.results.length !== 0
          ? `<div><iframe class="movie-dialog-video" src="https://www.youtube.com/embed/${movieVideos.results[0].key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
          : ""
      }
    </div>
    <div class="movie-dialog-info-container">
      <p>Runtime: ${movieDetails.runtime} min</p>
      <p>Release date: ${movieDetails.release_date}</p>
      <div class="movie-dialog-genres">
        ${movieDetails.genres
          .map((genre) => {
            return `<p class="movie-dialog-genre">${genre.name}</p>`;
          })
          .join("")}
      </div>
      <p>${movieDetails.overview}</p>
    </div>
    <button id="movie-dialog-close-btn">❌</button>
  `;
}

document.addEventListener("click", async (event) => {
  if (event.target.closest(".movie-card")) {
    const movieId = event.target.closest(".movie-card").dataset.movieId;
    try {
      const baseURL = `https://api.themoviedb.org/3/movie/${movieId}`;
      const apikey = "b55c170bfdfea258df28f3ba96c063b4";
      const url = new URL(baseURL);
      url.searchParams.append("api_key", apikey);
      const response = await fetch(url);
      const data = await response.json();
      const movieDetails = data;

      const baseURL2 = `https://api.themoviedb.org/3/movie/${movieId}/videos`;
      const url2 = new URL(baseURL2);
      url2.searchParams.append("api_key", apikey);
      const response2 = await fetch(url2);
      const data2 = await response2.json();
      const movieVideos = data2;

      movieDialog.innerHTML = createMovieDialog(movieDetails, movieVideos);
      movieDialog.style.display = "block";
      movieDialog.showModal();

      movieDialogCloseButton = document.getElementById(
        "movie-dialog-close-btn"
      );

      movieDialogCloseButton.addEventListener("click", (event) => {
        event.preventDefault();
        movieDialog.close();
        movieDialog.style.display = "none";
      });
    } catch (error) {
      console.log(error);
    }
  }
});
