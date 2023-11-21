// Import necessary modules
// Importation des modules nécessaires
import {  Search } from "../../factories/Search.js";
import { FilterTags } from "../../factories/FilterTags.js";
import { displayRecipes,  displaySearchResult } from "../../factories/Display.js";

// Create an instance of the Recipes class
// Création d'une instance de la classe Recettes
const recipes = new   Search();

// Initialize Select instances and variables
// Initialisation des instances de Select et des variables
let selectIngredients, selectAppareils, selectUstensiles;
let searchResult = [...recipes.data];
let searchTerms = '';

// Function to remove duplicate objects in an array based on a specified property
// Fonction pour supprimer les objets en double dans un tableau en fonction d'une propriété spécifiée
const removeDuplicateObjects = (array, property) => {
  const uniqueIds = [];

  return  array.filter(element => {
    const isDuplicate = uniqueIds.includes(element[property]);

    if (!isDuplicate) {
      uniqueIds.push(element[property]);
      return true;
    }
    return false;
  });
}

// Function to load ingredients from recipes, removing duplicates
// Fonction pour charger les ingrédients à partir des recettes, en supprimant les doublons
const loadIngredients = (fromRecipes) => {
  const ingredients = [];
  fromRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      ingredients.push({
        name: ingredient.ingredient,
        isSelected: false
      });
    });
  });
  return removeDuplicateObjects(ingredients, "name");
};

// Function to load appareils (appliances) from recipes, removing duplicates
// Fonction pour charger les appareils à partir des recettes, en supprimant les doublons
const loadAppareils = (fromRecipes) => {
  const appareils = [];
  for (const recipe of fromRecipes) {
    appareils.push({
      name: recipe.appliance,
      isSelected: false
    });
  }
  return removeDuplicateObjects(appareils, "name");
};

// Function to load ustensils from recipes, removing duplicates
// Fonction pour charger les ustensiles à partir des recettes, en supprimant les doublons
const loadUstensils = (fromRecipes) => {
  const ustensils = [];
  for (const recipe of fromRecipes) {
    for (const ustensil of recipe.ustensils) {
      ustensils.push({
        name: ustensil,
        isSelected: false
      });
    }
  }
  return removeDuplicateObjects(ustensils, "name");
};

// Function to implement debounce for a callback function
// Fonction pour mettre en œuvre la fonction de délai d'attente pour une fonction de rappel
const debounce = (callback, timeout = 200) => {
  let debounceTimeoutId = null;

  return (...args) => {
    window.clearTimeout(debounceTimeoutId);
    debounceTimeoutId = window.setTimeout(() => {
      debounceTimeoutId = null;
      callback.apply(null, args);
    }, timeout);
  };
};

// Function to search recipes based on input search terms
// Fonction pour rechercher des recettes en fonction des termes de recherche
const searchRecipes = (searchTerms) => {
  searchResult = recipes.searchRecipes(searchTerms);
  displaySearchResult({
    searchTerms: searchTerms,
    result: searchResult
  });

  selectIngredients.  updateSelectedItems(loadIngredients(searchResult));
  selectAppareils.  updateSelectedItems(loadAppareils(searchResult));
  selectUstensiles.  updateSelectedItems(loadUstensils(searchResult));
};

// Function to handle search event on select ingredient
// Fonction pour gérer l'événement de recherche sur la sélection d'ingrédients
const handleSelectIngredientOnSearchEvent = (searchTerms) => {
  const filteredResults = searchResult.filter((element) => {
    const temp = element.ingredients.filter((ingredient) => {
      return ingredient.ingredient.toLowerCase() === searchTerms.toLowerCase();
    });
    return temp.length > 0;
  });

  searchResult = [...filteredResults];

  selectAppareils.  updateSelectedItems(loadAppareils(filteredResults));
  selectUstensiles.  updateSelectedItems(loadUstensils(filteredResults));

  displaySearchResult({
    searchTerms: searchTerms,
    result: filteredResults
  });

  selectIngredients.  updateSelectedItems(loadIngredients(filteredResults));
};

// Function to handle search event on select appliance
// Fonction pour gérer l'événement de recherche sur la sélection d'appareils
const handleSelectApplianceOnSearchEvent = (searchTerms) => {
  const filteredResults = searchResult.filter((element) => {
    return element.appliance === searchTerms;
  });

  searchResult = [...filteredResults];

  selectIngredients.  updateSelectedItems(loadIngredients(filteredResults));
  selectUstensiles.  updateSelectedItems(loadUstensils(filteredResults));

  displaySearchResult({
    searchTerms: searchTerms,
    result: filteredResults
  });

  selectAppareils.  updateSelectedItems(loadAppareils(filteredResults));
};

// Function to handle search event on select ustensils
// Fonction pour gérer l'événement de recherche sur la sélection d'ustensiles
const handleSelectUstensilsOnSearchEvent = (searchTerms) => {
  const filteredResults = searchResult.filter((element) => {
    const temp = element.ustensils.filter((ustensils) => {
      return ustensils === searchTerms;
    });
    return temp.length > 0;
  });

  searchResult = [...filteredResults];

  selectIngredients.  updateSelectedItems(loadIngredients(filteredResults));
  selectAppareils.  updateSelectedItems(loadAppareils(filteredResults));

  displaySearchResult({
    searchTerms: searchTerms,
    result: filteredResults
  });

  selectUstensiles.  updateSelectedItems(loadUstensils(filteredResults));
};

// Function to handle reset event on selects
// Fonction pour gérer l'événement de réinitialisation sur les sélections
const handleSelectOnResetEvent = () => {
  recipes.searchRecipeExt(searchTerms, selectIngredients.listItem, selectAppareils.listItem, selectUstensiles.listItem);
}

// Function to reset all selects
// Fonction pour réinitialiser toutes les sélections
const resetSelects = () => {
  selectAppareils.  updateSelectedItems(loadAppareils(searchResult));
  selectUstensiles.  updateSelectedItems(loadUstensils(searchResult));
  selectIngredients.  updateSelectedItems(loadIngredients(searchResult));
}

// Fonction pour initialiser les événements, notamment la recherche
const initializeEvents = () => {
  // Récupère l'élément du champ de recherche par son identifiant "search"
  const searchValue = document.getElementById("search-bar");
// Ajoute un gestionnaire d'événements pour l'événement "keyup" (relâchement de touche) sur le champ de recherche
  searchValue.addEventListener("keyup", () => {
    // Met à jour la variable 'searchTerms' avec la valeur du champ de recherche
    searchTerms = searchValue.value;
     // Utilise la fonction de délai (debounce) pour éviter une recherche instantanée à chaque frappe
    const callSearch = debounce(() => {
      searchRecipes(searchTerms);
    }, 300);
    // Vérifie si la longueur des termes de recherche est supérieure ou égale à 3
    if (searchTerms.length >= 3) {
       // Si oui, appelle la fonction de recherche avec un délai de 300 millisecondes
       callSearch();
    } else {
      // Si la longueur des termes de recherche est inférieure à 3
      // Réinitialise l'affichage des recettes, ainsi que les sélecteurs d'ingrédients, d'appareils et d'ustensiles
      displayRecipes();
      selectIngredients.reset();
      selectAppareils.reset();
      selectUstensiles.reset();
      searchResult = [...recipes.data];
    }
  });
};

// Event listener for page load
// Écouteur d'événement pour le chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  initializeEvents();
                                                 //PARTIE SELECT
  // Create Select instances
  // Créer des instances de sélection
  selectIngredients = new FilterTags({
    selectElement: "#selectIngredients",
    defaultSelectLabel: "Ingrédients",
    initialListItem: loadIngredients(recipes.data),
    searchEventCallback: handleSelectIngredientOnSearchEvent,
    deleteTagEventCallBack: (tags) => {
      searchResult = recipes.searchRecipeExt(searchTerms, tags, selectAppareils.listItem, selectUstensiles.listItem)
      displaySearchResult({
        searchTerms: "",
        result: searchResult
      });

      resetSelects();
    },
    resetEventCallBack: handleSelectOnResetEvent
  });

  selectAppareils = new FilterTags({
    selectElement: "#selectAppareils",
    defaultSelectLabel: "Appareils",
    initialListItem: loadAppareils(recipes.data),
    searchEventCallback: handleSelectApplianceOnSearchEvent,
    deleteTagEventCallBack: (tags) => {
      searchResult = recipes.searchRecipeExt(searchTerms, selectIngredients.listItem, tags, selectUstensiles.listItem)
      displaySearchResult({
        searchTerms: "",
        result: searchResult
      });
      resetSelects();
    },
    resetEventCallBack: handleSelectOnResetEvent
  });

  selectUstensiles = new FilterTags ({
    selectElement: "#selectUstensiles",
    defaultSelectLabel: "Ustensils",
    initialListItem: loadUstensils(recipes.data),
    searchEventCallback: handleSelectUstensilsOnSearchEvent,
    deleteTagEventCallBack: (tags) => {
      searchResult = recipes.searchRecipeExt(searchTerms, selectIngredients.listItem, selectAppareils.listItem, tags)
      displaySearchResult({
        searchTerms: "",
        result: searchResult
      });
      resetSelects();
    },
    resetEventCallBack: handleSelectOnResetEvent
  });

  displayRecipes();
});
