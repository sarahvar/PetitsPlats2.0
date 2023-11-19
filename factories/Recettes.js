// Import recipes from the data file
// Importation des recettes depuis le fichier de données
import { recipes } from "../data/recipes.js";

export class Recettes {
  // Class properties
  // Propriétés de classe
  data = [];
  recipeContainer = null;
  totalRecipes = null;
  timeCooking = null;
  // Constructor initializes class properties with the provided recipes and selects DOM elements
  // Le constructeur initialise les propriétés de la classe avec les recettes fournies et sélectionne les éléments DOM
  constructor() {
    this.data = [...recipes];
    this.recipeContainer = document.querySelector("#recipes");
    this.totalRecipes = document.querySelector("#totalRecipes");
    this.timeCooking = document.querySelector("#timeCooking");
  }

  // Generates HTML for a recipe card
  // Génère du HTML pour une carte de recette
  generateHTMLCard(recipe, ingredientInsertHtml) {
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

  // Generates HTML for an ingredient
  // Génère du HTML pour un ingrédient
  generateHTMLIngredient(ingredient) {
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

  // Checks if there is a match for a given ingredient in a list
  // Vérifie s'il y a une correspondance pour un ingrédient donné dans une liste
  IngredientMatch(ingredients, searchTerm) {
    const matchingIngredients = ingredients.filter((anIngredient) => {
      const { ingredient } = anIngredient;
      return ingredient.toLowerCase() === searchTerm.toLowerCase();
    });
    return matchingIngredients.length > 0;
  }

  // Checks if there is a match for a given appareil (appliance)
  // Vérifie s'il y a une correspondance pour un appareil donné
  AppareilMatch(anAppareil, searchTerm) {
    return anAppareil.toLowerCase().includes(searchTerm);
  }

  // Checks if there is a match for a given ustensile (utensil)
  // Vérifie s'il y a une correspondance pour un ustensile donné
  UstensilesMatch(ustensiles, searchTerm) {
    const matchingUstensiles = ustensiles.filter((anUstensile) => {
      return anUstensile.toLowerCase() === searchTerm.toLowerCase();
    });
    return matchingUstensiles.length > 0;
  }

  // Searches for recipes based on a search term
  // Recherche des recettes en fonction d'un terme de recherche
  searchRecipes(searchTerms) {
    searchTerms = searchTerms.toLowerCase()
    return this.data.filter((recipe) => {
      const { name, description, ingredients, } = recipe;
      const lowerCaseName = name.toLowerCase();
      const lowerCaseDescription = description.toLowerCase();
      const Ingredient = this.IngredientMatch(ingredients, searchTerms);
      return lowerCaseName.includes(searchTerms) || lowerCaseDescription.includes(searchTerms) || Ingredient;
    })
  }

  // Searches for recipes based on multiple criteria (ingredient, appareil, ustensile)
  // Recherche des recettes en fonction de plusieurs critères (ingrédient, appareil, ustensile)
  searchRecipeExt(searchTerms, ingredientTags, appareilTags, ustensilTags) {
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
            return this.AppareilMatch(recipe.appliance, anAppareil.name)
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
            return this.UstensilesMatch(recipe.ustensils, anUstensile.name)
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

  // Displays recipes in the DOM
  // Affiche les recettes dans le DOM
  displayRecipes(recipes) {
    if (!recipes) {
      recipes = this.data;
    }

    if (this.totalRecipes) {
      this.totalRecipes.innerHTML = `${recipes.length} recettes`;
    }

    this.recipeContainer.innerHTML = "";
    const recipeCards = recipes.map((recipe) => {
      let ingredientInsertHtml = recipe.ingredients
        .map((ingredient) => this.generateHTMLIngredient(ingredient))
        .join("");

      return this.generateHTMLCard(recipe, ingredientInsertHtml);
    });

    this.recipeContainer.innerHTML += recipeCards.join("");
  }

  // Displays search results in the DOM
  // Affiche les résultats de la recherche dans le DOM
  displaySearchResult({ searchTerms, result }) {
    if (this.totalRecipes) {
      this.totalRecipes.innerHTML = `${result.length} recettes`;
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

  // Getter for the data
  // Créer un getter pour les données
  get data() {
    return this.data;
  }
}
