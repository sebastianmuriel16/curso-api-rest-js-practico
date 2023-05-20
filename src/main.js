//Data
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    Headers: {
        'Content-TYpe': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
        "language": navigator.language || "es-ES"
    }
});
const lazyLoader = new IntersectionObserver((entries) => { // implementa la carga lenta de imagenes
    entries.map((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.src = url;
        }
    })
});

function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'))
    let movies;
    if (item) {
        movies = item;
    } else {
        movies = {};
    }

    return movies;
}
function likeMovie(movie) {
    // movie.id
    const likedMovies = likedMoviesList();

    if (location.hash == '') {
        homePage();
    }

    if (likedMovies[movie.id]) {
        delete likedMovies[movie.id];
    } else {
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
}



//Utils
function createMovies(htmlContent, movies,// DRY dont repeat yourself
    { lazyLoad = false,
        clean = true, } = {},) {
    //const movies = data.results;
    let moviesarray = [];

    if (clean) {
        htmlContent.innerHTML = ''; //evitar duplicida 
    }

    movies.map(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.setAttribute('class', 'movie-container');

        const movieBtn = document.createElement('button');
        movieBtn.setAttribute('class', 'movie-btn');
        likedMoviesList()[movie.id] && movieBtn.classList.toggle('movie-btn--liked');
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
            getLikedMovies();
        })

        const movieImg = document.createElement('img');
        movieImg.setAttribute('class', 'movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);
        movieImg.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`
        })

        movieImg.onerror = () => {//cargar imagenes por defecto
            movieImg.src = './imgs/404.jpg';
        }

        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }
        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
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
    createMovies(trendingMoviesPreviewList, movies, true);



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
    maxPage = data.total_pages;
    headerCategoryTitle.innerHTML = categoryname;
    createMovies(genericSection, movies, { lazyLoad: true });
}

function loadMoreByCategory(id) {
    return async function () { // closures js para su ejecicion se requiere doble ()()
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 10;
        const pageIsNotMax = page < maxPage;

        if (scrollIsBottom && pageIsNotMax) { //cargar mas peliculas   
            page++;
            const { data } = await api('discover/movie', {
                params: {
                    with_genres: id,
                    page,
                }
            })
            const movies = data.results;
            createMovies(genericSection, movies, { lazyLoad: true, clean: false });
        }
    }
}

async function getMoviesBySearch(query) {
    const { res, data } = await api('search/movie', {
        params: {
            query,
        }
    })
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage);
    createMovies(genericSection, movies)


}

function loadMoreBysearch(query) {
    return async function () { // closures js para su ejecicion se requiere doble ()()
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 10;
        const pageIsNotMax = page < maxPage;

        if (scrollIsBottom && pageIsNotMax) { //cargar mas peliculas   
            page++;
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page,
                }
            })
            const movies = data.results;
            createMovies(genericSection, movies, { lazyLoad: true, clean: false });
        }
    }
}


async function getTrendingMovies() {
    const { res, data } = await api('/trending/movie/day')
    const movies = data.results;
    createMovies(genericSection, movies, { lazyLoad: true, clean: true });
    maxPage = data.total_pages;

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerHTML = 'Load more';
    // btnLoadMore.addEventListener('click', () => {
    //     loadMore();
    //     btnLoadMore.style.display = 'none';
    // })
    // genericSection.appendChild(btnLoadMore);




}
async function loadMore() {

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 10;
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) { //cargar mas peliculas   
        page++;
        const { res, data } = await api('/trending/movie/day', {
            params: {
                page: page,
            }
        })
        const movies = data.results;
        createMovies(genericSection, movies, { lazyLoad: true, clean: false });
    }

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

function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies)

    createMovies(likedMoviesListArticle, moviesArray, { lazyLoad: true, clean: true })
}