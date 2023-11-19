// Importation des recettes depuis le fichier de données
import { recipes } from "../data/recipes.js";

export class Recettes {
  // Propriétés de classe
  data = [];
  recipeContainer = null;
  totalRecipesElement = null;
  timeCookingElement = null;

  // Constructeur initialise les propriétés de classe avec les recettes fournies et sélectionne les éléments DOM
  constructor() {
    this.data = [...recipes];
    this.recipeContainer = document.querySelector("#recipes");
    this.totalRecipesElement = document.querySelector("#totalRecipes");
    this.timeCookingElement = document.querySelector("#timeCooking");
  }

  // Génère du HTML pour une carte de recette
  generateRecipeCardHTML(recipe, ingredientInsertHtml) {
    return `
      <article class="recipe">
          <img src=../assets/images/${recipe.image} alt=${recipe.name} loading="lazy" />
          <span class="timeCooking">${recipe.time}min </span>
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

  // Génère du HTML pour un ingrédient
  generateIngredientHTML(ingredient) {
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

  // Vérifie s'il y a une correspondance pour un ingrédient donné dans une liste
  hasIngredientMatch(ingredients, searchTerm) {
    const matchingIngredients = ingredients.filter((anIngredient) => {
      const { ingredient } = anIngredient;
      return ingredient.toLowerCase() === searchTerm.toLowerCase();
    });
    return matchingIngredients.length > 0;
  }

  // Vérifie s'il y a une correspondance pour un appareil donné
  hasAppareilMatch(anAppareil, searchTerm) {
    return anAppareil.toLowerCase().includes(searchTerm);
  }

  // Vérifie s'il y a une correspondance pour un ustensile donné
  hasUstensilesMatch(ustensiles, searchTerm) {
    const matchingUstensiles = ustensiles.filter((anUstensile) => {
      return anUstensile.toLowerCase() === searchTerm.toLowerCase();
    });
    return matchingUstensiles.length > 0;
  }

  // Recherche des recettes en fonction d'un terme de recherche
  searchRecipes(searchTerms) {
    searchTerms = searchTerms.toLowerCase()
    return this.data.filter((recipe) => {
      const { name, description, ingredients, } = recipe;
      const lowerCaseName = name.toLowerCase();
      const lowerCaseDescription = description.toLowerCase();
      const hasIngredient = this.hasIngredientMatch(ingredients, searchTerms);
      return lowerCaseName.includes(searchTerms) || lowerCaseDescription.includes(searchTerms) || hasIngredient;
    })
  }

  // Recherche des recettes en fonction de plusieurs critères (ingrédient, appareil, ustensile)
  searchRecipesExtended(searchTerms, ingredientTags, appareilTags, ustensilTags) {
    let filteredRecipes = [];

    searchTerms = searchTerms.trim();
    if (searchTerms !== "") {
      filteredRecipes = this.searchRecipes(searchTerms);
    }

    if (filteredRecipes.length === 0) {
      filteredRecipes = [...this.data];
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
          return this.hasAppareilMatch(recipe.appliance, anAppareil.name)
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
          return this.hasUstensilesMatch(recipe.ustensils, anUstensile.name)
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

  // Affiche les recettes dans le DOM
  displayRecipes(recipesToDisplay) {
    if (!recipesToDisplay) {
      recipesToDisplay = this.data;
    }

    if (this.totalRecipesElement) {
      this.totalRecipesElement.innerHTML = `${recipesToDisplay.length} recettes`;
    }

    this.recipeContainer.innerHTML = "";
    const recipeCards = recipesToDisplay.map((recipe) => {
      let ingredientInsertHtml = recipe.ingredients
        .map((ingredient) => this.generateIngredientHTML(ingredient))
        .join("");

      return this.generateRecipeCardHTML(recipe, ingredientInsertHtml);
    });

    this.recipeContainer.innerHTML += recipeCards.join("");
  }

  // Affiche les résultats de la recherche dans le DOM
  displaySearchResult({ searchTerms, result }) {
    if (this.totalRecipesElement) {
      this.totalRecipesElement.innerHTML = `${result.length} recettes`;
    }

    if (result.length > 0) {
      this.displayRecipes(result);
      return;
    }

    this.recipeContainer.innerHTML = "";
    this.recipeContainer.innerHTML = `
      <div class="notFound">
        <p>Aucune recette contient <strong>${searchTerms}</strong>. Vous pouvez chercher "tarte aux pommes", "poisson"</p>
      </div>
      `;
  }

  // Getter pour les données
  get recipesData() {
    return this.data;
  }
}
