import { recipes } from "../data/recipes.js";

export class Recipes {
  #data = [];
  #recipeContainer = null;
  #totalRecipes = null;

  constructor() {
    this.#data = [...recipes];
    this.#recipeContainer = document.querySelector("#recipes");
    this.#totalRecipes = document.querySelector("#totalRecipes");
  }

  _generateHTMLCard(recipe, ingredientInsertHtml) {
    return `
      <article class="recipe">
          <img src=../assets/images/${recipe.image} alt=${recipe.name} loading="lazy" />
          <h2 class="recipe-h2">${recipe.name}</h2>
          <section class="recipe-header">
            <span class="recipe-small-title">recette</span>
            <p class="recipe-content">
              ${recipe.description}
            </p>
          </section>
          <section class="recipe-ingredient">
            <span class="recipe-small-title">Ingrédients</span>
            <ul class="recipe-container-ingredient">
            ${ingredientInsertHtml}
            </ul>
          </section>
        </article>
      `;
  }

  _generateHTMLIngredient(ingredient) {
    if (ingredient.unit === "" || ingredient.unit === undefined) {
      if (ingredient.quantity) {
        return `
        <li>
          <span class="recipe-title">${ingredient.ingredient}</span>
          <span class="recipe-subtitle">${ingredient.quantity}</span>
        </li>
        `;
      } else {
        return `
        <li>
          <span class="recipe-title">${ingredient.ingredient}</span>
          <span class="recipe-subtitle">-</span>
        </li>
        `;
      }
    } else {
      return `
        <li>
          <span class="recipe-title">${ingredient.ingredient}</span>
          <span class="recipe-subtitle">${ingredient.quantity} ${ingredient.unit}</span>
        </li>
        `;
    }
  }

  _hasIngredientMatch(ingredients, searchTerm) {
    const matchingIngredients = ingredients.filter((anIngredient) => {
      const { ingredient } = anIngredient;
      return ingredient.toLowerCase() === searchTerm.toLowerCase();
    });
    return matchingIngredients.length > 0;
  }

  _hasAppareilMatch(anAppareil, searchTerm) {
    return anAppareil.toLowerCase().includes(searchTerm);
  }

  _hasUstensilesMatch(ustensiles, searchTerm) {
    const matchingUstensiles = ustensiles.filter((anUstensile) => {
      return anUstensile.toLowerCase() === searchTerm.toLowerCase();
    });
    return matchingUstensiles.length > 0;
  }

  searchRecipes(searchTerms) {
    searchTerms = searchTerms.toLowerCase()
    return this.#data.filter((recipe) => {
      const { name, description, ingredients } = recipe;
      const lowerCaseName = name.toLowerCase();
      const lowerCaseDescription = description.toLowerCase();
      const hasIngredient = this._hasIngredientMatch(ingredients, searchTerms);
      return lowerCaseName.includes(searchTerms) || lowerCaseDescription.includes(searchTerms) || hasIngredient;
    })
  }

  searchRecipeExt(searchTerms, ingredientTags, appareilTags, ustensilTags) {
    let filteredRecipes = [];

    searchTerms = searchTerms.trim();
    if (searchTerms !== "") {
      filteredRecipes = this.searchRecipes(searchTerms);
    }

    if (filteredRecipes.length === 0) {
      filteredRecipes = [...this.#data];
    }

      let filteredRecipesByIngredient = [];
      ingredientTags.forEach((anIngredient) => {
        if (anIngredient.isSelected) {
          const tempFilteredRecipes = filteredRecipes.filter((recipe) => {
            const matchingIngredients = recipe.ingredients.filter((item) => {
              const { ingredient } = item;
              return ingredient.toLowerCase() === anIngredient.name.toLowerCase();
            });
            return matchingIngredients.length > 0;
          });
          filteredRecipesByIngredient = [
            ...filteredRecipesByIngredient,
            ...tempFilteredRecipes,
          ];
        }
      })
      if (filteredRecipesByIngredient.length > 0) {
        filteredRecipes = [...filteredRecipesByIngredient];
      }

      let filteredRecipesByAppareil = [];
      appareilTags.forEach((anAppareil) => {
        if (anAppareil.isSelected) {
          const tempFilteredRecipes = filteredRecipes.filter((recipe) => {
            return this._hasAppareilMatch(recipe.appliance, anAppareil.name)
          });
          filteredRecipesByAppareil = [
            ...filteredRecipesByAppareil,
            ...tempFilteredRecipes,
          ];
        }
      })
      if (filteredRecipesByAppareil.length > 0) {
        filteredRecipes = [...filteredRecipesByAppareil];
      }

      let filteredRecipesByUstensiles = [];
      ustensilTags.forEach((anUstensile) => {
        if (anUstensile.isSelected) {
          const tempFilteredRecipes = filteredRecipes.filter((recipe) => {
            return this._hasUstensilesMatch(recipe.ustensils, anUstensile.name)
          });
          filteredRecipesByUstensiles = [
            ...filteredRecipesByUstensiles,
            ...tempFilteredRecipes,
          ];
        }
      })
      if (filteredRecipesByUstensiles.length > 0) {
        filteredRecipes = [...filteredRecipesByUstensiles];
      }
    return filteredRecipes
  }

  displayRecipes(recipes) {
    if (!recipes) {
      recipes = this.#data;
    }

    if (this.#totalRecipes) {
      this.#totalRecipes.innerHTML = `${recipes.length} recettes`;
    }

    this.#recipeContainer.innerHTML = "";
    const recipeCards = recipes.map((recipe) => {
      let ingredientInsertHtml = recipe.ingredients
        .map((ingredient) => this._generateHTMLIngredient(ingredient))
        .join("");

      return this._generateHTMLCard(recipe, ingredientInsertHtml);
    });

    this.#recipeContainer.innerHTML += recipeCards.join("");
  }

  displaySearchResult({ searchTerms, result }) {
    if (this.#totalRecipes) {
      this.#totalRecipes.innerHTML = `${result.length} recettes`;
    }

    if (result.length > 0) {
      this.displayRecipes(result);
      return;
    }

    this.#recipeContainer.innerHTML = "";
    this.#recipeContainer.innerHTML = `
      <div class="notFound">
        <p>Aucune recette contient <strong>${searchTerms}</strong>. Vous pouvez chercher "tarte aux pommes", "poisson"</p>
      </div>
      `;
  }

  get data() {
    return this.#data;
  }
}