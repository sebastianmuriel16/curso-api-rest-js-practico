searchBtn.addEventListener('click', () => {
    location.hash = `#search=${searchFormInput.value}`;// location es para saber la ubucacionde la url
})

trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
})

arrowBtn.addEventListener('click', async () => {
    window.history.back();
})


const navigator = () => {
    console.log({ location })

    if (location.hash.startsWith('#trends')) {
        trendsPage()
    }
    else if (location.hash.startsWith('#search=')) {
        searchPage()
    }
    else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage()
    }
    else if (location.hash.startsWith('#category=')) {
        categoriesPage()
    }
    else {
        homePage()
    }

    window.scrollTo(0, 0);
}
window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

const homePage = () => {
    console.log('home')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesMovies();
}
const searchPage = () => {
    console.log('search')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, query] = location.hash.split('=') //=> ['#search', 'buscado'] el termino para elelmentos buscados suele ser query
    getMoviesBySearch(query);

}
const movieDetailsPage = () => {
    console.log('movie')

    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_, movieId] = location.hash.split('=')
    getMovieById(movieId);
}
const categoriesPage = () => {
    console.log('categories')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, categoryData] = location.hash.split('=') //=> ['#category', 'idname']
    const [categoryId, categoryName] = categoryData.split('-') // solo re renombran los iteradores
    getMoviesByCategory(categoryId, decodeURI(categoryName)); // decorate es para quitar reemplazos de caracteres raros ejemplo: %20

}

const trendsPage = () => {
    console.log('trends')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias';

    getTrendingMovies();
}
