// Import recipes from the data file
// Importation des recettes depuis le fichier de données
import { recipes } from "../data/recipes.js";


export class Search {
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

                                            // BARRE DE RECHERCHE (SEARCH BAR)

  // Checks if there is a match for a given ingredient in a list
  // Vérifie s'il y a une correspondance pour un ingrédient donné dans une liste
  IngredientMatch(ingredients, searchTerm) {
    searchTerm = searchTerm.toLowerCase();
  
    for (let i = 0; i < ingredients.length; i++) {
      const anIngredient = ingredients[i];
      const { ingredient } = anIngredient;
  
      if (ingredient.toLowerCase().includes(searchTerm)) {
        return true;
      }
    }
  
    return false;
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
  // Recherche des recettes en fonction d'un terme de recherche (recherche principale)
  searchRecipes(searchTerms) {
    const filteredRecipes = [];
    searchTerms = searchTerms.trim().toLowerCase();
    for (const recipe of this.data) {
      const { name, description, ingredients } = recipe;
      const lowerCaseName = name.toLowerCase();
      const lowerCaseDescription = description.toLowerCase();
      const Ingredient = this.IngredientMatch(ingredients, searchTerms);
      if (
        lowerCaseName.includes(searchTerms) ||
        lowerCaseDescription.includes(searchTerms) ||
        Ingredient
      ) {
        filteredRecipes.push(recipe);
      }
    }
    return filteredRecipes;
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
  for (let i = 0; i < ingredientTags.length; i++) {
    const anIngredient = ingredientTags[i];
    if (anIngredient.isSelected) {
      let tempFilteredRecipes = [];
      for (let j = 0; j < filteredRecipes.length; j++) {
        const recipe = filteredRecipes[j];
        const matchingIngredients = [];
        for (let k = 0; k < recipe.ingredients.length; k++) {
          const item = recipe.ingredients[k];
          const { ingredient } = item;
          if (ingredient.toLowerCase() === anIngredient.name.toLowerCase()) {
            matchingIngredients.push(item);
          }
        }
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
  for (let i = 0; i < appareilTags.length; i++) {
    const anAppareil = appareilTags[i];
    if (anAppareil.isSelected) {
      let tempFilteredRecipes = [];
      for (let j = 0; j < filteredRecipes.length; j++) {
        const recipe = filteredRecipes[j];
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
  for (let i = 0; i < ustensilTags.length; i++) {
    const anUstensile = ustensilTags[i];
    if (anUstensile.isSelected) {
      let tempFilteredRecipes = [];
      for (let j = 0; j < filteredRecipes.length; j++) {
        const recipe = filteredRecipes[j];
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
  // Créer un getter pour les données
  get recipesData() {
    return this.data;
  }
}
