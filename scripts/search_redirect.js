document.getElementById('search-button').addEventListener('click', () => {
    console.log('Search button clicked');
    const isResultsPage = window.location.pathname.includes('results.html');
    const query = document.getElementById('recipe-search').value.trim();
    if (query && !isResultsPage) {
        // Omdirigera till resultatsidan. Med sökparametern i URL.
        window.location.href = `./pages/results.html?query=${encodeURIComponent(query)}`;
    } else if (query && isResultsPage) {
        window.location.href = `./results.html?query=${encodeURIComponent(query)}`;
    }
});