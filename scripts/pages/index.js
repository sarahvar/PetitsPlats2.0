import { Recipes } from "../../factories/Recipes.js";
import { Select } from "../../factories/Select.js";

const recipes = new Recipes();

let selectIngredients, selectAppareils, selectUstensiles;
let searchResult = [...recipes.data];
let searchTerms = '';

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

const handleSelectOnResetEvent = () => {
  recipes.searchRecipeExt(searchTerms, selectIngredients.listItem, selectAppareils.listItem, selectUstensiles.listItem )
}

const resetSelects = () => {
  selectAppareils.updateListItem(loadAppareils(searchResult));
  selectUstensiles.updateListItem(loadUstensils(searchResult));
  selectIngredients.updateListItem(loadIngredients(searchResult));
}

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

document.addEventListener("DOMContentLoaded", () => {
  initializeEvents();

  selectIngredients = new Select({
    selectElement: "#selectIngredients",
    defaultSelectLabel: "Ingrédients",
    initialListItem: loadIngredients(recipes.data),
    searchEventCallback: handleSelectIngredientOnSearchEvent,
    deleteTagEventCallBack: (tags) => {
      searchResult = recipes.searchRecipeExt(searchTerms, tags, selectAppareils.listItem, selectUstensiles.listItem )
      recipes.displaySearchResult({
        searchTerms: "",
        result : searchResult
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
      searchResult = recipes.searchRecipeExt(searchTerms, selectIngredients.listItem, tags, selectUstensiles.listItem )
      recipes.displaySearchResult({
        searchTerms: "",
        result : searchResult
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
      searchResult = recipes.searchRecipeExt(searchTerms, selectIngredients.listItem, selectAppareils.listItem, tags )
      recipes.displaySearchResult({
        searchTerms: "",
        result : searchResult
      });
      resetSelects();
    },
    resetEventCallBack: handleSelectOnResetEvent
  });

  recipes.displayRecipes();
});