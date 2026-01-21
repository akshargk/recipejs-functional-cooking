const RecipeApp = (() => {
    'use strict';

    const recipes = [
        { id:1, title:"Classic Spaghetti Carbonara", time:25, difficulty:"easy", description:"A creamy Italian pasta dish.",
          ingredients:["Spaghetti","2 Large Eggs","100g Pancetta","50g Pecorino Romano","Black Pepper"],
          steps:["Boil water","Mix eggs & cheese","Combine all"] },

        { id:2, title:"Chicken Tikka Masala", time:45, difficulty:"medium", description:"Spiced tomato curry.",
          ingredients:["Chicken","Yogurt","Garam Masala","Tomato","Cream"],
          steps:["Marinate","Grill","Simmer"] },

        { id:3, title:"Homemade Croissants", time:180, difficulty:"hard", description:"Buttery pastries.",
          ingredients:["Flour","Yeast","Butter","Milk"],
          steps:["Prepare dough","Laminate","Bake"] },

        { id:4, title:"Greek Salad", time:15, difficulty:"easy", description:"Fresh vegetables.",
          ingredients:["Cucumber","Tomato","Feta","Olives"],
          steps:["Chop","Mix","Serve"] }
    ];

    let currentFilter = 'all';
    let currentSort = 'none';
    let searchQuery = '';
    let debounceTimer;
    let favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || {};
    let expandedState = {};

    const recipeContainer = document.querySelector('#recipe-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const searchInput = document.querySelector('#search-input');
    const clearSearchBtn = document.querySelector('#clear-search');
    const recipeCount = document.querySelector('#recipe-count');

    const applySearch = data =>
        !searchQuery ? data :
        data.filter(r =>
            r.title.toLowerCase().includes(searchQuery) ||
            r.ingredients.some(i => i.toLowerCase().includes(searchQuery))
        );

    const applyFilter = data => {
        if (currentFilter === 'favorites') return data.filter(r => favorites[r.id]);
        if (currentFilter === 'quick') return data.filter(r => r.time < 30);
        if (currentFilter === 'all') return data;
        return data.filter(r => r.difficulty === currentFilter);
    };

    const applySort = data => {
        const copy = [...data];
        if (currentSort === 'name') return copy.sort((a,b)=>a.title.localeCompare(b.title));
        if (currentSort === 'time') return copy.sort((a,b)=>a.time-b.time);
        return copy;
    };

    const render = data => {
        recipeContainer.innerHTML = data.map(r => {
            const state = expandedState[r.id] || { ing:false, steps:false };
            return `
            <div class="recipe-card">
                <button class="favorite-btn" data-id="${r.id}">
                    ${favorites[r.id] ? '❤️' : '🤍'}
                </button>

                <h3>${r.title}</h3>
                <div class="recipe-meta">
                    ⏱ ${r.time} min
                    <span class="difficulty ${r.difficulty}">${r.difficulty}</span>
                </div>

                <div class="toggle-controls">
                    <button class="toggle-btn" onclick="RecipeApp.toggle(${r.id},'ing')">Ingredients</button>
                    <button class="toggle-btn" onclick="RecipeApp.toggle(${r.id},'steps')">Steps</button>
                </div>

                ${state.ing ? `<div class="ingredients-list"><ul>${r.ingredients.map(i=>`<li>${i}</li>`).join('')}</ul></div>`:''}
                ${state.steps ? `<div class="steps-list"><ul>${r.steps.map(s=>`<li>${s}</li>`).join('')}</ul></div>`:''}
            </div>`;
        }).join('');
    };

    const updateDisplay = () => {
        let data = applySearch(recipes);
        data = applyFilter(data);
        data = applySort(data);
        recipeCount.textContent = `Showing ${data.length} of ${recipes.length} recipes`;
        render(data);
    };

    filterButtons.forEach(btn =>
        btn.addEventListener('click', e => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            updateDisplay();
        })
    );

    sortButtons.forEach(btn =>
        btn.addEventListener('click', e => {
            sortButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentSort = e.target.dataset.sort;
            updateDisplay();
        })
    );

    recipeContainer.addEventListener('click', e => {
        if (e.target.classList.contains('favorite-btn')) {
            const id = e.target.dataset.id;
            favorites[id] = !favorites[id];
            localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
            updateDisplay();
        }
    });

    searchInput.addEventListener('input', e => {
        clearTimeout(debounceTimer);
        clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
        debounceTimer = setTimeout(() => {
            searchQuery = e.target.value.toLowerCase();
            updateDisplay();
        }, 300);
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        updateDisplay();
    });

    return {
        init() { updateDisplay(); },
        toggle(id, type) {
            expandedState[id] ??= { ing:false, steps:false };
            expandedState[id][type] = !expandedState[id][type];
            updateDisplay();
        }
    };
})();

RecipeApp.init();
