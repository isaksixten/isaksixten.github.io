document.addEventListener('DOMContentLoaded', () => {
    const recipeContainer = document.getElementById('recipe-container');
    const apiKey = '5aae3ecf799d4622b3b34d3cfd55a76c'; // Tagit bort min API-key inför inlämning

    //Hämta recept från spoonacular API.
    async function fetchRecipes(query = '', isResultsPage = false) {
        try {
            let url;
            if (!isResultsPage) {
                url = `https://api.spoonacular.com/recipes/random?number=5&apiKey=${apiKey}`;
            } else {
                url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${apiKey}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            console.log("Data received:", data);
            
            let recipes;
            
            if (!isResultsPage) {
                recipes = data.recipes
            } else {
                recipes = data.results;
            }

            // Spara data från resultatsidan för att minimera antalet queries som görs till API:n
            if (isResultsPage) {
                sessionStorage.setItem(query, JSON.stringify(recipes));
                sessionStorage.setItem('searchResults', JSON.stringify(recipes));
            }

            displayRecipes(recipes, isResultsPage);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }

    // Visa de inhämtade recepten. Olika logik för resultat och startsidan.
    function displayRecipes(recipes, isResultsPage) {
        recipeContainer.innerHTML = ''; 

        if (!recipes || recipes.length === 0) {
            recipeContainer.innerHTML = '<p>No recipes found. Please try another search term.</p>';
            return;
        }

        const urlParams = new URLSearchParams(window.location.search); // Om vi är på resultatsidan blir urlParams vår search string
        const query = urlParams.get('query') || ''; // Om urlParams existerar query annars inget.
        
        recipes.forEach(recipe => {
            let viewButtonLink;

            if (!isResultsPage) {
                viewButtonLink = `pages/recipe_detail.html?id=${recipe.id}&query=${encodeURIComponent(query)}`; // Skillnaden mellan resultat och index är att vi måste dirigeras till olika pages när vi trycker på view recipe, baserat på folder structure.
            } else {
                viewButtonLink = `recipe_detail.html?id=${recipe.id}&query=${encodeURIComponent(query)}`;
            }
            const recipeCard = create_recipe_card(recipe, viewButtonLink)
            recipeContainer.appendChild(recipeCard);
        });
    }
    
    function create_recipe_card(recipe, viewButtonLink) { //Skapar ett recipe card baserat på informationen vi hämtat, samt hur vi ska dirigeras.
        const recipeCard = document.createElement('article');
        recipeCard.classList.add('recipe-card');
        const img = document.createElement('img');
        img.src = recipe.image;
        img.alt = recipe.title;
        recipeCard.appendChild(img);
        const title = document.createElement('h2');
        title.textContent = recipe.title;
        recipeCard.appendChild(title);
        recipeCard.appendChild(create_view_button(viewButtonLink));
        return recipeCard
    }
    
    function create_view_button(viewButtonLink) { // Skapar själva knappen för ett visst card. 
        const viewButton = document.createElement('a');
        viewButton.href = viewButtonLink;
        viewButton.textContent = "View Recipe";
        viewButton.classList.add('btn');
        return viewButton
    }

    // Koll om vi är på resultatsidan.
    const isResultsPage = window.location.pathname.includes('results.html');

    if (isResultsPage) {
        // Om vi är på resultatsidan kolla om vi har gjort sökningen innan och därmed redan har lagrat sökresultaten.
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query');

        const storedData = sessionStorage.getItem(query);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData); // Om lagrad data finns försök att använda den för att skapa receptkorten
                displayRecipes(parsedData, isResultsPage);
            } catch (e) {
                console.error('Failed to parse stored data:', e);
                recipeContainer.innerHTML = '<p>Failed to load stored search results. Please try again.</p>';
            }
        } else if (query) { //Annars hämta ny data.
            fetchRecipes(query, isResultsPage);
        } else {
            recipeContainer.innerHTML = '<p>No search term provided. Please go back and enter a search term.</p>';
        }
    } else {
        // Om vi är på startsidan hämta slumpmässiga recept oavsett.
        fetchRecipes('', isResultsPage);
    }


    }
);