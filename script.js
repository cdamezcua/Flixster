var moviesGrid = document.getElementById("movies-grid");
var loadMoreMoviesButton = document.getElementById("load-more-movies-btn");
var displayedPages = 1;

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
      const divMovieCard = document.createElement("div");
      divMovieCard.classList.add("movie-card");

      const h1Title = document.createElement("h1");
      h1Title.classList.add("movie-title");
      h1Title.textContent = movie.title;

      const imgPoster = document.createElement("img");
      imgPoster.classList.add("movie-poster");
      const imgPosterBaseURL = "https://image.tmdb.org/t/p/w500";
      const imgPosterURL = imgPosterBaseURL + movie.poster_path;
      imgPoster.setAttribute("src", imgPosterURL);
      imgPoster.setAttribute("alt", movie.title + " poster.");

      const pVoteAverage = document.createElement("p");
      pVoteAverage.classList.add("movie-votes");
      pVoteAverage.textContent = "⭐️ " + movie.vote_average;

      divMovieCard.appendChild(h1Title);
      divMovieCard.appendChild(imgPoster);
      divMovieCard.appendChild(pVoteAverage);

      moviesGrid.appendChild(divMovieCard);
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
