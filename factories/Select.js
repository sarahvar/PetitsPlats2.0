export class Select {
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

  // Constructeur initialise la classe Select avec les paramètres fournis
  constructor({
                selectElement = null,
                initialListItem,
                defaultSelectLabel = "Sélection...",
                searchEventCallback = null,
                deleteTagEventCallBack = null,
                resetEventCallBack = null
              }) {
    if (selectElement === null) {
      throw Error("HTML Select is required!");
    }

    if (typeof selectElement !== "string") {
      this.select = selectElement;
    } else {
      this.select = document.querySelector(selectElement);
    }

    this.selectBtn = this.select.querySelector(".select__btn");
    this.btnLabel = this.selectBtn.firstElementChild;
    const content = this.select.querySelector(".select__content");
    this.options = content.querySelector(".select__content-options");
    this.searchInput = content.querySelector(".select__content__search > .select__content__search-inputSearch");
    this.tags = document.getElementById("tags");
    this.defaultLabel = defaultSelectLabel;

    this.onSearchEvent = searchEventCallback;
    this.onResetEvent = resetEventCallBack;
    this.onDeleteTagEvent = deleteTagEventCallBack;

    this.init();

    this.initialListItems = [...initialListItem];
    this.listItem = [...initialListItem];
    this.createListItems(this.listItem);
  }

  // Méthode d'initialisation, configure les écouteurs d'événements
  init() {
    this.setupEventListeners();
  }

  // Crée des éléments de liste dans le conteneur des options
  createListItems(listOfItems) {
    this.options.innerHTML = "";
    listOfItems.forEach((item) => {
      this.createListItemElement(item);
    });
    this.optionsItems = this.options.querySelectorAll("li");
  }

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

  // Supprime une balise et désélectionne l'élément correspondant
  removeTag(tagToRemove) {
    console.log('REMOVE TAGS:', tagToRemove.innerText)
    this.tags.removeChild(tagToRemove);
    this.deselectItemByName(tagToRemove.innerText);
    this.select.classList.toggle("select--active");

    if (this.onDeleteTagEvent) {
      console.log("ON DELETE TAG EVENT");
      this.onDeleteTagEvent(this.listItem);
    }
  }

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
      this.removeTag(event.target.parentNode);
    });

    this.tags.appendChild(newTag);
  }

  // Configure les écouteurs d'événements pour le bouton de sélection et la saisie de recherche
  setupEventListeners() {
    this.selectBtn.addEventListener("click", () => {
      this.toggleSelect();
    });
    this.searchInput.addEventListener("input", () => {
      this.searchItems();
    });
  }

  // Gère les événements de clic sur les éléments de liste
  handleListItemClick(currentLi) {
    if (currentLi.classList.contains("selected")) {
      this.deselectListItem(currentLi);
    } else {
      this.selectListItem(currentLi);
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
    this.toggleSelect();
  }

  // Crée un élément de liste dans le conteneur des options
  createListItemElement({ name, isSelected }) {
    let li = document.createElement("li");
    li.textContent = name;
    li.className = isSelected ? "selected" : "";
    li.addEventListener("click", () => {
      this.handleListItemClick(li);
    });
    this.options.appendChild(li);
  }

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

  // Recherche des éléments en fonction de la valeur d'entrée
  searchItems() {
    const searchedValue = this.searchInput.value.toLowerCase().trim();
    const filteredItems = this.listItem.filter((item) =>
      item.name.toLowerCase().includes(searchedValue)
    );

    if (filteredItems.length > 0) {
      this.createListItems(filteredItems);
    } else {
      this.displayNoIngredientMessage();
    }
  }

  // Getter pour la liste des éléments sélectionnés
  get selectedItems() {
    return this.listItem;
  }

  // Met à jour la liste des éléments avec de nouvelles valeurs
  updateSelectedItems(newListItem) {
    const updatedListItem = newListItem.map((item) => {
      const index = this.listItem.findIndex((findItem) => item.name === findItem.name);
      if (index >= 0) {
        return {
          name: item.name,
          isSelected: this.listItem[index].isSelected
        };
      }
      return item;
    });

    this.listItem = [...updatedListItem];
    this.createListItems(this.listItem);
  }

  // Réinitialise la sélection et les balises à leur état initial
  resetSelection() {
    this.selectedItem = "";
    this.unselectAllItems();
    this.clearTags();
  }

  // Toggle la classe "select--active" sur l'élément select
  toggleSelect() {
    this.select.classList.toggle("select--active");
  }

  // Désélectionne un élément de liste
  deselectListItem(li) {
    li.classList.remove("selected");
    this.select.classList.remove("select--active");
    this.searchInput.value = "";
    this.btnLabel.innerText = this.defaultLabel;
  }

  // Sélectionne un élément de liste
  selectListItem(li) {
    this.optionsItems.forEach((listItem) => {
      listItem.classList.remove("selected");
    });
    li.classList.add("selected");
    this.btnLabel.innerText = li.innerText;
    this.selectedItem = li.innerText;

    this.createTag(li.innerText);
  }

  // Affiche un message "Aucun ingrédient"
  displayNoIngredientMessage() {
    this.options.innerHTML = "<p class='noIngredient'> Aucun ingrédient </p>";
  }

  // Efface toutes les balises
  clearTags() {
    this.tags.innerHTML = "";
  }
}
