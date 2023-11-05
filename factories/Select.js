export class Select {
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
    #initialListItems = [];
  
    constructor({
                  selectElement = null,
                  initialListItem,
                  defaultSelectLabel = "Sélection...",
                  searchEventCallback = null,
                  deleteTagEventCallBack = null,
                  resetEventCallBack = null
                }) {
      if (selectElement === null) {
        throw Error("HTML Select is required !");
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
      this.searchInput = content.querySelector(
        ".select__content__search > .select__content__search-inputSearch"
      );
  
      this.tags = document.getElementById("tags");
      this.defaultLabel = defaultSelectLabel;
  
      this.onSearchEvent = searchEventCallback;
      this.onResetEvent = resetEventCallBack;
      this.onDeleteTagEvent = deleteTagEventCallBack;
  
      this.init();
  
      this.#initialListItems = [...initialListItem];
      this.listItem = [...initialListItem];
      this.createListIteù(this.listItem);
    }
  
    init() {
      this._setupEventListeners();
    }
  
    createListIteù(listOfItems) {
      this.options.innerHTML = "";
      listOfItems.forEach((item) => {
        this._createItem(item);
      });
      this.optionsItems = this.options.querySelectorAll("li");
    }
  
    deselectItemByName(name) {
      this.optionsItems.forEach((li) => {
        if (li.innerText === name) {
          li.classList.remove("selected");
        }
      });
  
      this.listItem = this.listItem.map((item) => {
        if (item.name === name) {
          item.isSelected = false
        }
        return item
      });
    }
  
    removeTag(tagToRemove) {
      console.log('REMOVE TAGS :', tagToRemove.innerText )
      // deselect item
      this.tags.removeChild(tagToRemove);
      this.deselectItemByName(tagToRemove.innerText)
  
      this.select.classList.toggle("select--active");
  
      if (this.onDeleteTagEvent) {
        console.log("ON DELETE TAG EVENT");
        this.onDeleteTagEvent(this.listItem)
      }
  
    }
  
    createTag(name) {
      const newTag = document.createElement("span");
      const image = document.createElement("img");
      image.className = "img";
      image.src = "../assets/Vector.svg";
      image.alt = "Vector cross";
      newTag.textContent = name;
  
  
      newTag.appendChild(image);
      newTag.addEventListener("click", (event) => {
        this.removeTag(event.target.parentNode)
      });
  
      this.tags.appendChild(newTag);
    }
  
    _setupEventListeners() {
      this.selectBtn.addEventListener("click", () => {
        this.select.classList.toggle("select--active");
      });
      this.searchInput.addEventListener("input", () => {
        this._searchItems();
      });
    }
  
    _handleItemClick(currentLi) {
  
      if (currentLi.classList.contains("selected")) {
        currentLi.classList.remove("selected");
        this.select.classList.remove("select--active");
        this.searchInput.value = "";
        this.btnLabel.innerText = this.defaultLabel;
      } else {
        console.log('OPTIONS === > ',this.optionsItems)
        this.optionsItems.forEach((li) => {
          li.classList.remove("selected");
        });
        currentLi.classList.add("selected");
        this.btnLabel.innerText = currentLi.innerText;
        this.selectedItem = currentLi.innerText;
  
        this.createTag(currentLi.innerText)
      }
  
      this.listItem = this.listItem.map((item) => {
        return {
          name: item.name,
          isSelected: item.name === currentLi.innerText //!item.isSelected
        };
      });
  
      if (this.onSearchEvent) {
        this.onSearchEvent(this.selectedItem);
      }
      this.select.classList.toggle("select--active");
    }
  
    _createItem({ name, isSelected }) {
      let li = document.createElement("li");
      li.textContent = name;
      li.className = isSelected ? "selected" : "";
      li.addEventListener("click", () => {
        this._handleItemClick(li);
      });
      this.options.appendChild(li);
    }
  
    _unselectAllItems(emitEvent = false) {
      console.log("UNSELECT ALL");
      this.optionsItems.forEach((li) => {
        if (li.classList.contains("selected")) {
          li.classList.remove("selected");
        }
      });
  
      this.btnLabel.innerText = this.defaultLabel;
      this.listItem = [...this.#initialListItems];
      this.createListIteù(this.listItem);
  
      if ((this.onResetEvent !== null) && (emitEvent)) {
        console.log("ON RESET EVENT");
        this.onResetEvent();
      }
    }
  
    _searchItems() {
      const searchedValue = this.searchInput.value.toLowerCase().trim();
      const filteredItems = this.listItem.filter((item) =>
        item.name.toLowerCase().includes(searchedValue)
      );
  
      if (filteredItems.length > 0) {
        this.createListIteù(filteredItems);
      } else {
        this.options.innerHTML = "<p class='noIngredient'> Aucun ingrédient </p>";
      }
    }
  
    // get selectedItem() {
    //   return this.selectedItem;
    // }
  
    get listItem() {
      return this.listItem;
    }
  
    updateListItem(newListItem) {
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
      this.createListIteù(this.listItem);
    }
  
    reset() {
      this.selectedItem = "";
      this._unselectAllItems();
      this.tags.innerHTML = "";
    }
  }