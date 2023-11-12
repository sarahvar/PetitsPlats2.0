// Import necessary modules
// Importation des modules nécessaires
import { Recettes } from "../../factories/Recettes.js";
import { Select } from "../../factories/Select.js";

// Create an instance of the Recettes class
// Création d'une instance de la classe Recettes
const recipes = new Recettes();

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
  recipes.displaySearchResult({
    searchTerms: searchTerms,
    result: searchResult
  });

  selectIngredients.updateListItem(loadIngredients(searchResult));
  selectAppareils.updateListItem(loadAppareils(searchResult));
  selectUstensiles.updateListItem(loadUstensils(searchResult));
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

  selectAppareils.updateListItem(loadAppareils(filteredResults));
  selectUstensiles.updateListItem(loadUstensils(filteredResults));

  recipes.displaySearchResult({
    searchTerms: searchTerms,
    result: filteredResults
  });

  selectIngredients.updateListItem(loadIngredients(filteredResults));
};

// Function to handle search event on select appliance
// Fonction pour gérer l'événement de recherche sur la sélection d'appareils
const handleSelectApplianceOnSearchEvent = (searchTerms) => {
  const filteredResults = searchResult.filter((element) => {
    return element.appliance === searchTerms;
  });

  searchResult = [...filteredResults];

  selectIngredients.updateListItem(loadIngredients(filteredResults));
  selectUstensiles.updateListItem(loadUstensils(filteredResults));

  recipes.displaySearchResult({
    searchTerms: searchTerms,
    result: filteredResults
  });

  selectAppareils.updateListItem(loadAppareils(filteredResults));
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

  selectIngredients.updateListItem(loadIngredients(filteredResults));
  selectAppareils.updateListItem(loadAppareils(filteredResults));

  recipes.displaySearchResult({
    searchTerms: searchTerms,
    result: filteredResults
  });

  selectUstensiles.updateListItem(loadUstensils(filteredResults));
};

// Function to handle reset event on selects
// Fonction pour gérer l'événement de réinitialisation sur les sélections
const handleSelectOnResetEvent = () => {
  recipes.searchRecipeExt(searchTerms, selectIngredients.listItem, selectAppareils.listItem, selectUstensiles.listItem);
}

// Function to reset all selects
// Fonction pour réinitialiser toutes les sélections
const resetSelects = () => {
  selectAppareils.updateListItem(loadAppareils(searchResult));
  selectUstensiles.updateListItem(loadUstensils(searchResult));
  selectIngredients.updateListItem(loadIngredients(searchResult));
}

// Function to initialize events on page load
// Fonction pour initialiser les événements lors du chargement de la page
const initializeEvents = () => {
  const searchValue = document.getElementById("search");

  searchValue.addEventListener("keyup", () => {
    searchTerms = searchValue.value;
    const callSearch = debounce(() => {
      searchRecipes(searchTerms);
    }, 300);
    if (searchTerms.length >= 3) {
      callSearch();
    } else {
      recipes.displayRecipes();
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

  // Create Select instances
  // Création des instances de Select
  selectIngredients = new Select({
    selectElement: "#selectIngredients",
    defaultSelectLabel: "Ingrédients",
    initialListItem: loadIngredients(recipes.data),
    searchEventCallback: handleSelectIngredientOnSearchEvent,
    deleteTagEventCallBack: (tags) => {
      searchResult = recipes.searchRecipeExt(searchTerms, tags, selectAppareils.listItem, selectUstensiles.listItem)
      recipes.displaySearchResult({
        searchTerms: "",
        result: searchResult
      });

      resetSelects();
    },
    resetEventCallBack: handleSelectOnResetEvent
  });

  selectAppareils = new Select({
    selectElement: "#selectAppareils",
    defaultSelectLabel: "Appareils",
    initialListItem: loadAppareils(recipes.data),
    searchEventCallback: handleSelectApplianceOnSearchEvent,
    deleteTagEventCallBack: (tags) => {
      searchResult = recipes.searchRecipeExt(searchTerms, selectIngredients.listItem, tags, selectUstensiles.listItem)
      recipes.displaySearchResult({
        searchTerms: "",
        result: searchResult
      });
      resetSelects();
    },
    resetEventCallBack: handleSelectOnResetEvent
  });

  selectUstensiles = new Select({
    selectElement: "#selectUstensiles",
    defaultSelectLabel: "Ustensils",
    initialListItem: loadUstensils(recipes.data),
    searchEventCallback: handleSelectUstensilsOnSearchEvent,
    deleteTagEventCallBack: (tags) => {
      searchResult = recipes.searchRecipeExt(searchTerms, selectIngredients.listItem, selectAppareils.listItem, tags)
      recipes.displaySearchResult({
        searchTerms: "",
        result: searchResult
      });
      resetSelects();
    },
    resetEventCallBack: handleSelectOnResetEvent
  });

  recipes.displayRecipes();
});
