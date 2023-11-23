//SEARCH WITH TAGS IN INGREDIENTS, APPLIANCES AND UTENSILS
//RECHERCHE AVEC LES TAGS DANS LES INGREDIENTS, APPAREILS ET USTENSILES

export class FilterTags {
  // Class properties
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
  constructor({
    selectElement = null,
    initialListItem,
    defaultSelectLabel = "Sélection...",
    searchEventCallback = null,
    deleteTagEventCallBack = null,
    resetEventCallBack = null
  }) {
    // Check if HTML Select element is provided
    if (selectElement === null) {
      throw Error("HTML Select is required!");
    }
    // If selectElement is a string, find the corresponding DOM element
    if (typeof selectElement !== "string") {
      this.select = selectElement;
    } else {
      this.select = document.querySelector(selectElement);
    }

    // Initialize other properties and set up initial list items
    this.selectBtn = this.select.querySelector(".select__btn");
    this.btnLabel = this.selectBtn.firstElementChild;
    const content = this.select.querySelector(".select__content");
    this.options = content.querySelector(".select__content-options");
    this.searchInput = content.querySelector(".select__content__search > .select__content__search-inputSearch");
    this.tags = document.getElementById("tags");
    this.defaultLabel = defaultSelectLabel;

    // Assign callback functions
    this.onSearchEvent = searchEventCallback;
    this.onResetEvent = resetEventCallBack;
    this.onDeleteTagEvent = deleteTagEventCallBack;

    // Initialize the instance
    this.init();

    // Set initial and current list items
    this.initialListItems = [...initialListItem];
    this.listItem = [...initialListItem];
    this.createListItems(this.listItem);
  }

  // Initialization method, sets up event listeners
  init() {
    this.setupEventListeners();
  }

  // Creates list items in the options container
  createListItems(listOfItems) {
    this.options.innerHTML = "";
    for (const item of listOfItems) {
      this.createItemElement(item);
    }
    this.optionsItems = this.options.querySelectorAll("li");
  }

  // Deselects an item by its name
  deselectItemByName(name) {
    for (const li of this.optionsItems) {
      if (li.innerText === name) {
        li.classList.remove("selected");
      }
    }

    this.listItem = this.listItem.map((item) => {
      if (item.name === name) {
        item.isSelected = false;
      }
      return item;
    });
  }

  // Removes a tag and deselects the corresponding item
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

  // Creates a tag element and adds it to the tags container
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

  // Sets up event listeners for the select button and search input
  setupEventListeners() {
    this.selectBtn.addEventListener("click", () => {
      this.select.classList.toggle("select--active");
    });
    this.searchInput.addEventListener("input", () => {
      this.searchItems();
    });
  }

  // Handles click events on list items
  handleItemClick(currentLi) {
    if (currentLi.classList.contains("selected")) {
      currentLi.classList.remove("selected");
      this.select.classList.remove("select--active");
      this.searchInput.value = "";
      this.btnLabel.innerText = this.defaultLabel;
    } else {
      for (const li of this.optionsItems) {
        li.classList.remove("selected");
      }
      currentLi.classList.add("selected");
      this.btnLabel.innerText = currentLi.innerText;
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

  // Creates a list item in the options container
  createItemElement({ name, isSelected }) {
    let li = document.createElement("li");
    li.textContent = name;
    li.className = isSelected ? "selected" : "";
    li.addEventListener("click", () => {
      this.handleItemClick(li);
    });
    this.options.appendChild(li);
  }

  // Unselects all items and optionally emits the reset event
  unselectAllItems(emitEvent = false) {
    console.log("UNSELECT ALL");
    for (const li of this.optionsItems) {
      if (li.classList.contains("selected")) {
        li.classList.remove("selected");
      }
    }

    this.btnLabel.innerText = this.defaultLabel;
    this.listItem = [...this.initialListItems];
    this.createListItems(this.listItem);

    if ((this.onResetEvent !== null) && (emitEvent)) {
      console.log("ON RESET EVENT");
      this.onResetEvent();
    }
  }

  // Searches items based on the input value
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
  get listItem() {
    return this.listItem;
  }

  // Updates the list of items with new values
  updateSelectedItems(newListItem) {
    const updateSelectedItem = newListItem.map((item) => {
      const index = this.listItem.findIndex((findItem) => item.name === findItem.name);
      if (index >= 0) {
        return {
          name: item.name,
          isSelected: this.listItem[index].isSelected
        };
      }
      return item;
    });

    this.listItem = [...updateSelectedItem];
    this.createListItems(this.listItem);
  }

  // Resets the select and tags to their initial state
  reset() {
    this.selectedItem = "";
    this.unselectAllItems();
    this.tags.innerHTML = "";
  }
}

