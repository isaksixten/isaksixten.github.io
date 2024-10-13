document.addEventListener('DOMContentLoaded', () => {
    const recipeDetailsContainer = document.getElementById('recipe-details');
    const ingredientsTableBody = document.getElementById('ingredients-table').querySelector('tbody');
    const instructions = document.getElementById('instructions')
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id'); // Hämta receptnummret från URL.
    const query = urlParams.get('query') || ''; // Hämta sökningen från URL.

    const backButton = document.getElementById('back-button');
    backButton.href = `results.html?query=${encodeURIComponent(query)}`; // Rätt länk för att gå tillbaka till ursprungssökning.

    function displayRecipeDetails(recipe) { // Lägger till receptdetaljer i recpite detailscontainer samt instruktioner i instructions sectionen. Kallar på populateIngredientsTable som populerar tabellen med ingredienser.
        if (!recipe) {
            recipeDetailsContainer.innerHTML = '<p>Recipe details could not be loaded.</p>';
            return;
        }

            recipeDetailsContainer.innerHTML = `
            <h1>${recipe.title || 'No title available'}</h1>
            <img src="${recipe.image || 'default-image.jpg'}" alt="${recipe.title || 'Recipe Image'}" />
            <p>${recipe.summary || 'No summary available'}</p>
            <a href="${recipe.sourceUrl || '#'}" class="btn">View Full Recipe on Original Website</a>`;

            instructions.innerHTML = `
            <p>${recipe.instructions || 'No instructions available'}<p>`

            populateIngredientsTable(recipe.extendedIngredients)
    }

    function populateIngredientsTable(ingredients) {
        if (!ingredients || ingredients.length === 0) {
            ingredientsTableBody.innerHTML = '<tr><td colspan="2">No ingredients available.</td></tr>';
            return;
        }

        ingredientsTableBody.innerHTML = '';

        // Såg att recept fanns som inte hade detaljerna i stora bokstäver.
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        // Loopa igenom varje ingrediens och lägg till dess detaljer som rader.
        ingredients.forEach(ingredient => {
            const row = document.createElement('tr');
            const ingredientCell = document.createElement('td');
            const quantityCell = document.createElement('td');

            ingredientCell.textContent = capitalizeFirstLetter(ingredient.name); // Hämtar namn för ingrediens
            quantityCell.textContent = `${ingredient.original.replace(ingredient.originalName, "")}`; // Hämtar kvantitet

            row.appendChild(ingredientCell); // Stoppar in namn och kvantitet i respektive rad.
            row.appendChild(quantityCell);
            ingredientsTableBody.appendChild(row);
        });
    }

    async function fetchRecipeDetailsFromAPI(recipeId) { // Hämtar receptdetaljer från API.
        const apiKey = '5aae3ecf799d4622b3b34d3cfd55a76c';
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
            const recipe = await response.json();
            displayRecipeDetails(recipe);
        } catch (error) {
            recipeDetailsContainer.innerHTML = '<p>Failed to load recipe details. Please try again later.</p>';
            console.error('Error fetching recipe details:', error);
        }
    }

    if (!recipeId) {
        recipeDetailsContainer.innerHTML = '<p>No recipe found. Please try again.</p>';
        return;
    }

    fetchRecipeDetailsFromAPI(recipeId); // Kör igång skapandet av elementet på receptdetaljssidan.

});
