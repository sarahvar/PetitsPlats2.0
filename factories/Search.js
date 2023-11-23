// Import recipes from the data file
import { recipes } from "../data/recipes.js";
import { generateHTMLCard, generateHTMLIngredient } from "./Display.js";

export class Search {
  // Class properties
  data = [];
  recipeContainer = null;
  totalRecipes = null;
  timeCooking = null;

  // Constructor initializes class properties with the provided recipes and selects DOM elements
  constructor() {
    this.data = [...recipes];
    this.recipeContainer = document.querySelector("#recipes");
    this.totalRecipes = document.querySelector("#totalRecipes");
    this.timeCooking = document.querySelector("#timeCooking");
  }

  // BARRE DE RECHERCHE (SEARCH BAR)

  // Checks if there is a match for a given ingredient in a list
  IngredientMatch(ingredients, searchTerm) {
    return ingredients.some((anIngredient) =>
      anIngredient.ingredient.toLowerCase() === searchTerm.toLowerCase()
    );
  }

  // Checks if there is a match for a given appareil (appliance)
  AppareilMatch(anAppareil, searchTerm) {
    return anAppareil.toLowerCase().includes(searchTerm);
  }

  // Checks if there is a match for a given ustensile (utensil)
  UstensilesMatch(ustensiles, searchTerm) {
    return ustensiles.some(
      (anUstensile) => anUstensile.toLowerCase() === searchTerm.toLowerCase()
    );
  }

  // Searches for recipes based on a search term
  searchRecipes(searchTerms) {
    searchTerms = searchTerms.toLowerCase();

    return this.data.filter((recipe) => {
      const { name, description, ingredients } = recipe;
      const lowerCaseName = name.toLowerCase();
      const lowerCaseDescription = description.toLowerCase();

      return (
        lowerCaseName.includes(searchTerms) ||
        lowerCaseDescription.includes(searchTerms) ||
        this.IngredientMatch(ingredients, searchTerms)
      );
    });
  }

  // Searches for recipes based on multiple criteria (ingredient, appareil, ustensile)
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
    for (const anIngredient of ingredientTags) {
      if (anIngredient.isSelected) {
        const tempFilteredRecipes = [];
        for (const recipe of filteredRecipes) {
          const matchingIngredients = recipe.ingredients.filter((item) =>
            item.ingredient.toLowerCase() === anIngredient.name.toLowerCase()
          );
          if (matchingIngredients.length > 0) {
            tempFilteredRecipes.push(recipe);
          }
        }
        filteredRecipesByIngredient = [
          ...filteredRecipesByIngredient,
          ...tempFilteredRecipes,
        ];
      }
    }
    if (filteredRecipesByIngredient.length > 0) {
      filteredRecipes = [...filteredRecipesByIngredient];
    }

    let filteredRecipesByAppareil = [];
    for (const anAppareil of appareilTags) {
      if (anAppareil.isSelected) {
        const tempFilteredRecipes = [];
        for (const recipe of filteredRecipes) {
          if (this.AppareilMatch(recipe.appliance, anAppareil.name)) {
            tempFilteredRecipes.push(recipe);
          }
        }
        filteredRecipesByAppareil = [
          ...filteredRecipesByAppareil,
          ...tempFilteredRecipes,
        ];
      }
    }
    if (filteredRecipesByAppareil.length > 0) {
      filteredRecipes = [...filteredRecipesByAppareil];
    }

    let filteredRecipesByUstensiles = [];
    for (const anUstensile of ustensilTags) {
      if (anUstensile.isSelected) {
        const tempFilteredRecipes = [];
        for (const recipe of filteredRecipes) {
          if (this.UstensilesMatch(recipe.ustensils, anUstensile.name)) {
            tempFilteredRecipes.push(recipe);
          }
        }
        filteredRecipesByUstensiles = [
          ...filteredRecipesByUstensiles,
          ...tempFilteredRecipes,
        ];
      }
    }
    if (filteredRecipesByUstensiles.length > 0) {
      filteredRecipes = [...filteredRecipesByUstensiles];
    }

    return filteredRecipes;
  }

  // Getter for the data
  get recipesData() {
    return this.data;
  }
}
