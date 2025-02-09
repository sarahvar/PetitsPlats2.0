//SEARCH WITH TAGS IN INGREDIENTS, APPLIANCES AND UTENSILS
//RECHERCHE AVEC LES TAGS DANS LES INGREDIENTS, APPAREILS ET USTENSILES


export class FilterTags {
  // Class properties
  // Propriétés de classe
  select = null;
  selectBtn = null;
  options = null;
  optionsItems = null;
  searchInput = null;
  defaultLabel = "";
  selectedItem = "";
  tags = null;
  btnLabel = null;

  onSearchEvent = null;
  onResetEvent = null;
  onDeleteTagEvent = null;

  listItem = [];
  initialListItems = [];

  // Constructor initializes the Select class with provided parameters
  // Le constructeur initialise la classe Select avec les paramètres fournis
  constructor({
                selectElement = null,
                initialListItem,
                defaultSelectLabel = "Sélection...",
                searchEventCallback = null,
                deleteTagEventCallBack = null,
                resetEventCallBack = null
              }) {
    // Check if HTML Select element is provided
    // Vérifiez si l'élément HTML Select est fourni
    if (selectElement === null) {
      throw Error("HTML Select is required!");
    }
    // If selectElement is a string, find the corresponding DOM element
    // Si selectElement est une chaîne de caractères, recherchez l'élément DOM correspondant
    if (typeof selectElement !== "string") {
      this.select = selectElement;
    } else {
      this.select = document.querySelector(selectElement);
    }

    // Initialize other properties and set up initial list items
    // Initialisez les autres propriétés et configurez les éléments de la liste initiale
    this.selectBtn = this.select.querySelector(".select__btn");
    this.btnLabel = this.selectBtn.firstElementChild;
    const content = this.select.querySelector(".select__content");
    this.options = content.querySelector(".select__content-options");
    this.searchInput = content.querySelector(".select__content__search > .select__content__search-inputSearch");
    this.tags = document.getElementById("tags");
    this.defaultLabel = defaultSelectLabel;


    // Assign callback functions
    // Affectez les fonctions de callback
    this.onSearchEvent = searchEventCallback;
    this.onResetEvent = resetEventCallBack;
    this.onDeleteTagEvent = deleteTagEventCallBack;

    // Initialize the instance
    // Initialisez l'instance
    this.init();

    // Set initial and current list items
    // Définissez les éléments de liste initiaux et actuels
    this.initialListItems = [...initialListItem];
    this.listItem = [...initialListItem];
    this.createListItems(this.listItem);
    // Sort the initial list items alphabetically by name
  this.initialListItems = [...initialListItem].sort((a, b) => a.name.localeCompare(b.name));

  // Set the current list items
  this.listItem = [...this.initialListItems];
  this.createListItems(this.listItem);
  }

  // Initialization method, sets up event listeners
  // Méthode d'initialisation, configure les écouteurs d'événements
  init() {
    this.setupEventListeners();
  }

  // Creates list items in the options container
  // Crée des éléments de liste dans le conteneur des options
  createListItems(listOfItems) {
    this.options.innerHTML = "";
    listOfItems.forEach((item) => {
      this. createItemElement(item);
    });
    this.optionsItems = this.options.querySelectorAll("li");
  }

  // Deselects an item by its name
  // Désélectionne un élément par son nom
  deselectItemByName(name) {
    this.optionsItems.forEach((li) => {
      if (li.innerText === name) {
        li.classList.remove("selected");
      }
    });

    this.listItem = this.listItem.map((item) => {
      if (item.name === name) {
        item.isSelected = false;
      }
      return item;
    });
  }

  // Removes a tag and deselects the corresponding item
  // Supprime une balise et désélectionne l'élément correspondant
  removeTag(tagToRemove) {
    console.log('REMOVE TAGS:', tagToRemove.innerText);
  
    if (this.tags.contains(tagToRemove)) {
      tagToRemove.remove();
  
      this.deselectItemByName(tagToRemove.innerText);
      this.select.classList.remove("select--active");
  
      if (this.onDeleteTagEvent) {
        console.log("ON DELETE TAG EVENT");
        this.onDeleteTagEvent(this.listItem);
      }
    } else {
      console.error("Error: tagToRemove is not a child of this.tags");
    }
  }

// Creates a tag element and adds it to the tags container
  // Crée un élément de balise et l'ajoute au conteneur des balises
  createTag(name) {
    const newTag = document.createElement("span");
    const image = document.createElement("img");
    image.className = "img";
    image.src = "../assets/Vector.svg";
    image.alt = "Vector cross";
    newTag.textContent = name;

    newTag.appendChild(image);
    newTag.addEventListener("click", (event) => {
      this.removeTag(event.currentTarget);
    });

    this.tags.appendChild(newTag);
    let selectedItem = this.listItem.find(c => c.name == name);
    if (selectedItem) {
      selectedItem.isSelected = true;
    }
  }

  // Sets up event listeners for the select button and search input
  // Configure les écouteurs d'événements pour le bouton de sélection et la saisie de recherche
  setupEventListeners() {
    this.selectBtn.addEventListener("click", () => {
      this.select.classList.toggle("select--active");
    });
    this.searchInput.addEventListener("input", () => {
      this.searchItems();
    });
  }

  // Handles click events on list items
  // Gère les événements de clic sur les éléments de liste
  handleItemClick(currentLi) {
    // Ajoutez cette condition pour vérifier si l'élément actuel est différent de "Ingrédients"
    if (currentLi.innerText !== "Ingrédients") {
      if (currentLi.classList.contains("selected")) {
        currentLi.classList.remove("selected");
        this.select.classList.remove("select--active");
        this.searchInput.value = "";
      } else {
        this.optionsItems.forEach((li) => {
          li.classList.remove("selected");
        });
        currentLi.classList.add("selected");
        this.selectedItem = currentLi.innerText;

        this.createTag(currentLi.innerText);
      }

      this.listItem = this.listItem.map((item) => {
        return {
          name: item.name,
          isSelected: item.name === currentLi.innerText
        };
      });

      if (this.onSearchEvent) {
        this.onSearchEvent(this.selectedItem);
      }
      this.select.classList.toggle("select--active");
    }
  }
  
  // Creates a list item in the options container
// Crée un élément de liste dans le conteneur des options
createItemElement({ name, isSelected }) {
  let li = document.createElement("li");
  li.textContent = name;
  li.className = isSelected ? "selected" : "";

  // Ajoutez l'image seulement si l'élément est sélectionné
  if (isSelected) {
    const image = document.createElement("img");
    image.className = "img my-custom-class";
    image.src = "../assets/xmark-circle.svg";
    image.alt = "xmark-circle";
    
    // Ajoutez un gestionnaire d'événements pour le clic sur l'image
    image.addEventListener("click", (event) => {
      event.stopPropagation(); // Empêche la propagation de l'événement de clic au conteneur li
      this.removeListItem(li);
    });

    li.appendChild(image);
  }

  li.addEventListener("click", () => {
    this.handleItemClick(li);
  });

  this.options.appendChild(li);
}

// Ajoutez cette méthode à votre classe FilterTags
  updateTagsTotal() {
    const totalTags = this.tags.children.length;
    console.log('Total Tags:', totalTags);
    // Vous pouvez faire ce que vous voulez avec le total des tags ici
  }

  // Modifiez votre méthode removeListItem pour appeler updateTagsTotal
  removeListItem(li) {
    // Récupérez le nom de l'élément
    const itemName = li.textContent.trim();

    // Recherchez le tag correspondant dans les enfants de this.tags
    const tagToRemove = Array.from(this.tags.children).find(tag => tag.textContent.trim() === itemName);

    // Si le tag correspondant est trouvé, supprimez-le
    if (tagToRemove) {
      this.removeTag(tagToRemove);
      this.updateTagsTotal(); // Mettez à jour le total des tags après avoir supprimé un tag
    }

    // Supprimez également l'élément de la liste
    li.remove();
  }
  // Unselects all items and optionally emits the reset event
  // Désélectionne tous les éléments et émet éventuellement l'événement de réinitialisation
  unselectAllItems(emitEvent = false) {
    console.log("UNSELECT ALL");
    this.optionsItems.forEach((li) => {
      if (li.classList.contains("selected")) {
        li.classList.remove("selected");
      }
    });

    this.btnLabel.innerText = this.defaultLabel;
    this.listItem = [...this.initialListItems];
    this.createListItems(this.listItem);

    if ((this.onResetEvent !== null) && (emitEvent)) {
      console.log("ON RESET EVENT");
      this.onResetEvent();
    }
  }

  // Searches items based on the input value
  // Recherche des éléments en fonction de la valeur d'entrée
  searchItems() {
    const searchedValue = this.searchInput.value.toLowerCase().trim();
    const filteredItems = this.listItem.filter((item) =>
      item.name.toLowerCase().includes(searchedValue)
    );

    if (filteredItems.length > 0) {
      this.createListItems(filteredItems);
    } else {
      this.options.innerHTML = "<p class='noIngredient'> Aucun ingrédient </p>";
    }
  }

  // Getter for the list of selected items
  // Getter pour la liste des éléments sélectionnés
  get listItem() {
    return this.listItem;
  }

// Updates the list of items with new values
// Met à jour la liste des éléments avec de nouvelles valeurs
updateSelectedItems(newListItem) {
  const updatedListItem = newListItem.map( (item) => {
    const index = this.listItem.findIndex((findItem) => item.name === findItem.name)
    if (index >= 0) {
      return {
        name: item.name,
        isSelected: this.listItem[index].isSelected
      }
    }
    return item;
  })

  this.listItem = [...updatedListItem];
  this.createListItems(this.listItem);
}

// Resets the select and tags to their initial state
// Réinitialise la sélection et les balises à leur état initial
reset() {
  this.selectedItem = "";
  this.unselectAllItems();
  this.tags.innerHTML = "";
}

}
