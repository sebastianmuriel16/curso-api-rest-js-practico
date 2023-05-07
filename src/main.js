const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    Headers: {
        'Content-TYpe': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    }
});

//Utils
function createMovies(htmlContent, movies) { // DRY dont repeat yourself
    //const movies = data.results;
    let moviesarray = [];
    htmlContent.innerHTML = ''; //evitar duplicida 
    movies.map(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.setAttribute('class', 'movie-container');

        movieContainer.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`
        })

        const movieImg = document.createElement('img');
        movieImg.setAttribute('class', 'movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

        movieContainer.appendChild(movieImg);
        moviesarray.push(movieContainer);
    })
    htmlContent.append(...moviesarray);
}

function createCategories(htmlContent, categories) {
    htmlContent.innerHTML = ''; // para evitar duplicida
    categories.map(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.setAttribute('class', 'category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.setAttribute('class', 'category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`
        })



        const categorytitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categorytitleText);
        categoryContainer.appendChild(categoryTitle);
        htmlContent.appendChild(categoryContainer);
    })
}

async function getTrendingMoviesPreview() {
    const { res, data } = await api('/trending/movie/day')
    const movies = data.results;
    createMovies(trendingMoviesPreviewList, movies);



}

async function getCategoriesMovies() {
    const { res, data } = await api('/genre/movie/list')
    const categories = data.genres;
    createCategories(categoriesPreviewList, categories);
}

async function getMoviesByCategory(id, categoryname) {
    const { res, data } = await api('discover/movie', {
        params: {
            with_genres: id,
        }
    })
    const movies = data.results;
    headerCategoryTitle.innerHTML = categoryname;
    createMovies(genericSection, movies);
}

async function getMoviesBySearch(query) {
    const { res, data } = await api('search/movie', {
        params: {
            query: query
        }
    })
    const movies = data.results;
    createMovies(genericSection, movies);
}

async function getTrendingMovies() {
    const { res, data } = await api('/trending/movie/day')
    const movies = data.results;
    createMovies(genericSection, movies);


}

async function getMovieById(id) {
    const { data: movie } = await api(`movie/${id}`); // obtiene la informacion de una pelicula en particular
    // {data: movie} => es solo renombrar la variable data      

    const movieImg = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    headerSection.style.backgroundImage = ` linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.35) 19.27%, 
        rgba(0, 0, 0, 0) 29.17%
        ),
        url(${movieImg})`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movieDetailCategoriesList, movie.genres);

    getRelatedMoviesId(id);

}

async function getRelatedMoviesId(id) {
    const { data } = await api(`movie/${id}/recommendations`);

    const relatedMovies = data.results;
    createMovies(relatedMoviesContainer, relatedMovies);
}