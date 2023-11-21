import { recipes } from "../data/recipes.js";

export class Recettes {
  data = [];
  recipeContainer = null;
  totalRecipes = null;
  timeCooking = null;

  constructor() {
    this.data = [...recipes];
    this.recipeContainer = document.querySelector("#recipes");
    this.totalRecipes = document.querySelector("#totalRecipes");
    this.timeCooking = document.querySelector("#timeCooking");
  }

  generateHTMLCard(recipe, ingredientInsertHtml) {
    let html = '<article class="recipe">';
    html += `<img src=../assets/images/${recipe.image} alt=${recipe.name} loading="lazy" />`;
    html += `<span class="timeCooking">${recipe.time}min </span>`;
    html += `<h2 class="recipe-h2">${recipe.name}</h2>`;
    html += '<section class="recipe-header">';
    html += '<span class="recipe-small-title">recette</span>';
    html += `<p class="recipe-content">${recipe.description}</p>`;
    html += '</section>';
    html += '<section class="recipe-ingredient">';
    html += '<span class="recipe-small-title">Ingrédients</span>';
    html += '<ul class="recipe-container-ingredient">';
    html += ingredientInsertHtml;
    html += '</ul>';
    html += '</section>';
    html += '</article>';
    return html;
  }

  generateHTMLIngredient(ingredient) {
    const { ingredient: name, quantity, unit } = ingredient;
    if (unit === "" || unit === undefined) {
      if (quantity) {
        return `<li><span class="recipe-title">${name}</span><span class="recipe-subtitle">${quantity}</span></li>`;
      } else {
        return `<li><span class="recipe-title">${name}</span><span class="recipe-subtitle">-</span></li>`;
      }
    } else {
      return `<li><span class="recipe-title">${name}</span><span class="recipe-subtitle">${quantity} ${unit}</span></li>`;
    }
  }

  IngredientMatch(ingredients, searchTerm) {
    return ingredients.some(anIngredient => anIngredient.ingredient.toLowerCase() === searchTerm.toLowerCase());
  }

  AppareilMatch(anAppareil, searchTerm) {
    return anAppareil.toLowerCase().includes(searchTerm);
  }

  UstensilesMatch(ustensiles, searchTerm) {
    return ustensiles.some(anUstensile => anUstensile.toLowerCase() === searchTerm.toLowerCase());
  }

  searchRecipes(searchTerms) {
    searchTerms = searchTerms.toLowerCase();
    return this.data.filter(recipe => {
      const { name, description, ingredients } = recipe;
      const lowerCaseName = name.toLowerCase();
      const lowerCaseDescription = description.toLowerCase();
      const Ingredient = this.IngredientMatch(ingredients, searchTerms);
      return lowerCaseName.includes(searchTerms) || lowerCaseDescription.includes(searchTerms) || Ingredient;
    });
  }

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
          const matchingIngredients = recipe.ingredients.filter(item =>
            item.ingredient.toLowerCase() === anIngredient.name.toLowerCase()
          );
          if (matchingIngredients.length > 0) {
            tempFilteredRecipes.push(recipe);
          }
        }
        filteredRecipesByIngredient = [...filteredRecipesByIngredient, ...tempFilteredRecipes];
      }
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
        filteredRecipesByAppareil = [...filteredRecipesByAppareil, ...tempFilteredRecipes];
      }
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
        filteredRecipesByUstensiles = [...filteredRecipesByUstensiles, ...tempFilteredRecipes];
      }
    }

    return (
      filteredRecipesByUstensiles.length > 0
        ? [...filteredRecipesByUstensiles]
        : filteredRecipesByAppareil.length > 0
        ? [...filteredRecipesByAppareil]
        : filteredRecipesByIngredient.length > 0
        ? [...filteredRecipesByIngredient]
        : filteredRecipes
    );
  }

  displayRecipes(recipes) {
    if (!recipes) {
      recipes = this.data;
    }

    if (this.totalRecipes) {
      this.totalRecipes.innerHTML = `${recipes.length} recettes`;
    }

    let recipeHTML = "";
    for (const recipe of recipes) {
      let ingredientInsertHtml = "";
      for (const ingredient of recipe.ingredients) {
        ingredientInsertHtml += this.generateHTMLIngredient(ingredient);
      }

      recipeHTML += this.generateHTMLCard(recipe, ingredientInsertHtml);
    }

    this.recipeContainer.innerHTML = recipeHTML;
  }

  displaySearchResult({ searchTerms, result }) {
    if (this.totalRecipes) {
      this.totalRecipes.innerHTML = `${result.length} recettes`;
    }

    if (result.length > 0) {
      this.displayRecipes(result);
      return;
    }

    this.recipeContainer.innerHTML = `
      <div class="notFound">
        <p>Aucune recette contient <strong>${searchTerms}</strong>. Vous pouvez chercher "tarte aux pommes", "poisson"</p>
      </div>
    `;
  }

  get recipesData() {
    return this.data;
  }
}
