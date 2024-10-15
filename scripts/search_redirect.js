document.getElementById('search-button').addEventListener('click', () => {
    console.log('Search button clicked');
    const query = document.getElementById('recipe-search').value.trim();
    if (query) {
        // Omdirigera till resultatsidan. Med sökparametern i URL.
        window.location.href = `./pages/results.html?query=${encodeURIComponent(query)}`;
    }
});