document.getElementById('search-button').addEventListener('click', () => {
    console.log('Search button clicked');
    const query = document.getElementById('recipe-search').value.trim();
    if (query) {
        // Redirect to the results page with the search query as a URL parameter
        window.location.href = `./pages/results.html?query=${encodeURIComponent(query)}`;
    }
});