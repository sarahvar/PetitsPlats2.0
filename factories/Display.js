//DISPLAY RECIPES
//AFFICHAGE DES RECETTES
import { recipes } from "../data/recipes.js";
const recipeContainer = document.querySelector("#recipes");
let totalRecipes = document.querySelector("#totalRecipes");

// Generates HTML for a recipe card
// Génère du HTML pour une carte de recette
function generateHTMLCard(recipe, ingredientInsertHtml) {
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
function generateHTMLIngredient(ingredient) {
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
// Displays recipes in the DOM
// Affiche les recettes dans le DOM
export function displayRecipes(data) {
  if (!data) {
    data = recipes;
  }

  if (totalRecipes) {
    totalRecipes.innerHTML = `${data.length} recettes`;
  }

  recipeContainer.innerHTML = "";
  const recipeCards = data.map((recipe) => {
    let ingredientInsertHtml = recipe.ingredients
      .map((ingredient) => generateHTMLIngredient(ingredient))
      .join("");

    return generateHTMLCard(recipe, ingredientInsertHtml);
  });

  recipeContainer.innerHTML += recipeCards.join("");
}

// Displays search results in the DOM
// Affiche les résultats de la recherche dans le DOM
export function displaySearchResult({ searchTerms, result }) {
  if (totalRecipes) {
    totalRecipes.innerHTML = `${result.length} recettes`;
  }

  if (result.length > 0) {
    displayRecipes(result);
    return;
  }

  recipeContainer.innerHTML = "";
  recipeContainer.innerHTML = `
      <div class="notFound">
        <p>Aucune recette contient <strong>${searchTerms}</strong>. Vous pouvez chercher "tarte aux pommes", "poisson"</p>
      </div>
      `;
}