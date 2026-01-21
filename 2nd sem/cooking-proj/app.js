// ============================================
// RecipeApp Module (IIFE Encapsulation)
// ============================================
const RecipeApp = (() => {
    // --- PRIVATE DATA (Hidden from Console) ---
    const recipes = [
        {
            id: 1,
            title: "Classic Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "A creamy Italian pasta dish.",
            category: "pasta",
            ingredients: ["Spaghetti", "2 Large Eggs", "100g Pancetta", "50g Pecorino Romano", "Black Pepper"],
            steps: [
                "Bring a large pot of salted water to a boil.",
                {
                    text: "Prepare the creamy base",
                    substeps: [
                        "Whisk eggs in a bowl",
                        "Add grated cheese and pepper to eggs",
                        {
                            text: "Pro Tip",
                            substeps: ["Ensure eggs are at room temperature"]
                        }
                    ]
                },
                "Cook pasta until al dente.",
                "Combine pasta with pancetta and egg mixture away from direct heat."
            ]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Tender chicken pieces in a spiced tomato sauce.",
            category: "curry",
            ingredients: ["Chicken Breast", "Yogurt", "Garam Masala", "Tomato Puree", "Cream"],
            steps: ["Marinate chicken", "Grill chicken", "Simmer in sauce"]
        },
        {
            id: 3,
            title: "Homemade Croissants",
            time: 180,
            difficulty: "hard",
            description: "Buttery, flaky French pastries.",
            category: "baking",
            ingredients: ["Flour", "Yeast", "Sugar", "Lots of Butter", "Milk"],
            steps: ["Prepare dough", "Laminate with butter layers", "Proof and bake"]
        },
        {
            id: 4,
            title: "Greek Salad",
            time: 15,
            difficulty: "easy",
            description: "Fresh vegetables and feta cheese.",
            category: "salad",
            ingredients: ["Cucumber", "Tomatoes", "Feta", "Olives"],
            steps: ["Chop vegetables", "Toss with olive oil", "Add feta on top"]
        }
    ];

    // --- PRIVATE STATE ---
    let currentFilter = 'all';
    let currentSort = 'none';
    
    // Tracks which sections are expanded: { recipeId: { ing: true, steps: false } }
    let expandedState = {};

    // --- DOM REFERENCES ---
    const recipeContainer = document.querySelector('#recipe-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortButtons = document.querySelectorAll('.sort-btn');

    // --- RECURSIVE FUNCTION (For Nested Steps) ---
    const renderStepsRecursive = (steps, level = 0) => {
        const listType = level === 0 ? 'ol' : 'ul';
        const indentClass = level > 0 ? 'nested-step' : '';
        
        let html = `<${listType} class="${indentClass}">`;
        
        steps.forEach(step => {
            if (typeof step === 'string') {
                // Base Case: It's just a string
                html += `<li>${level > 0 ? '↳ ' : ''}${step}</li>`;
            } else if (typeof step === 'object') {
                // Recursive Step: It has substeps
                html += `<li>
                    <strong>${step.text}</strong>
                    ${renderStepsRecursive(step.substeps, level + 1)}
                </li>`;
            }
        });
        
        html += `</${listType}>`;
        return html;
    };

    // --- PURE LOGIC FUNCTIONS ---
    const getFilteredRecipes = (data) => {
        if (currentFilter === 'all') return data;
        if (currentFilter === 'quick') return data.filter(r => r.time < 30);
        return data.filter(r => r.difficulty === currentFilter);
    };

    const getSortedRecipes = (data) => {
        const copy = [...data];
        if (currentSort === 'name') return copy.sort((a, b) => a.title.localeCompare(b.title));
        if (currentSort === 'time') return copy.sort((a, b) => a.time - b.time);
        return copy;
    };

    // --- RENDERING ---
    const render = () => {
        const processedRecipes = getSortedRecipes(getFilteredRecipes(recipes));
        
        recipeContainer.innerHTML = processedRecipes.map(recipe => {
            // Get current toggle state for this specific card
            const state = expandedState[recipe.id] || { ing: false, steps: false };

            return `
                <div class="recipe-card">
                    <h3>${recipe.title}</h3>
                    <div class="recipe-meta">
                        <span>⏱️ ${recipe.time} min</span>
                        <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
                    </div>
                    
                    <div class="toggle-controls">
                        <button class="toggle-btn" onclick="RecipeApp.toggleSection(${recipe.id}, 'ing')">
                            ${state.ing ? 'Hide Ingredients' : 'Show Ingredients'}
                        </button>
                        <button class="toggle-btn" onclick="RecipeApp.toggleSection(${recipe.id}, 'steps')">
                            ${state.steps ? 'Hide Steps' : 'Show Steps'}
                        </button>
                    </div>

                    <div class="expanded-content">
                        ${state.ing ? `
                            <div class="ingredients-list">
                                <h4>Ingredients</h4>
                                <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
                            </div>
                        ` : ''}
                        
                        ${state.steps ? `
                            <div class="steps-list">
                                <h4>Preparation</h4>
                                ${renderStepsRecursive(recipe.steps)}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        updateActiveButtonStyles();
    };

    const updateActiveButtonStyles = () => {
        filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === currentFilter));
        sortButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.sort === currentSort));
    };

    // --- PUBLIC API ---
    return {
        init: function() {
            console.log("RecipeApp initializing...");
            
            // Setup Listeners
            filterButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    currentFilter = e.target.dataset.filter;
                    this.updateDisplay();
                });
            });

            sortButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    currentSort = e.target.dataset.sort;
                    this.updateDisplay();
                });
            });

            this.updateDisplay();
            console.log("RecipeApp ready!");
        },

        toggleSection: function(id, section) {
            if (!expandedState[id]) {
                expandedState[id] = { ing: false, steps: false };
            }
            expandedState[id][section] = !expandedState[id][section];
            render();
        },

        updateDisplay: function() {
            render();
            const visibleCount = getFilteredRecipes(recipes).length;
            console.log(`Displaying ${visibleCount} recipes (Filter: ${currentFilter}, Sort: ${currentSort})`);
        }
    };
})();

// Initialize the app
RecipeApp.init();