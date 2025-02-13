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
    const matchingIngredient = ingredients.find((anIngredient) => {
      const { ingredient } = anIngredient;
      return ingredient.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return matchingIngredient != null;
  }

  // Checks if there is a match for a given appareil (appliance)
  // Vérifie s'il y a une correspondance pour un appareil donné
  AppareilMatch(anAppareil, searchTerm) {
    return anAppareil.toLowerCase().includes(searchTerm.toLowerCase());
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
    searchTerms = searchTerms.toLowerCase();

    return this.data.filter((recipe) => {
      const { name, description, ingredients } = recipe;
      const lowerCaseName = name.toLowerCase();
      const lowerCaseDescription = description.toLowerCase();

      if (lowerCaseName.includes(searchTerms) || lowerCaseDescription.includes(searchTerms)) {
        return true; // Correspondance trouvée dans le nom ou la description
      } else {
        // Aucune correspondance dans le nom ou la description, vérifiez les ingrédients
        const ingredientMatch = this.IngredientMatch(ingredients, searchTerms);
        return ingredientMatch;
      }
    });
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

  // Getter for the data
  // Créer un getter pour les données
  get recipesData() {
    return this.data;
  }
}
