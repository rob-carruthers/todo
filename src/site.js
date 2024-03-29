import { ToDoList, ToDo } from "./todo";
import {
  header,
  footer,
  sideBar,
  renderClickOpenClose,
  renderClickToEdit,
  renderAmendField,
  renderToDoItem,
  renderModalDeleteDialog,
  renderModalRenameDialog,
  renderModalArchiveDialog,
  renderToDoItemActionButtons,
} from "./render";
import "iconify-icon";
import { add, parse } from "date-fns";

class ToDoHandler {
  constructor() {
    this.toDoLists = {};
    this.currentToDoList = null;
    this.archive = null;

    this.contentDiv = document.createElement("div");
    this.contentDiv.id = "content";

    this.toDoListDiv = document.createElement("div");
    this.toDoListDiv.id = "ToDoListDiv";

    this.selectorDiv = document.createElement("div");
    this.selectorDiv.id = "selectorDiv";

    this.sideBarDiv = sideBar();
    this.sideBarDiv.appendChild(this.selectorDiv);

    this.contentDiv.appendChild(this.sideBarDiv);
    this.contentDiv.appendChild(this.toDoListDiv);
  }

  add(toDoList) {
    this.toDoLists[toDoList.uuid] = toDoList;
  }

  toDoClickOpenClose(target) {
    renderClickOpenClose(target);
  }

  amendField(target, toDoItem) {
    let amendedItem = renderAmendField(target);
    toDoItem[amendedItem.field] = amendedItem.newValue;
    this.saveToLocalStorage();
  }

  clickToEdit(target, toDoItem) {
    const field = target.closest(".editableField");
    if (field != null && !field.classList.contains("editing")) {
      const yesButton = renderClickToEdit(target);

      yesButton.addEventListener("click", (e) =>
        this.amendField(e.target, toDoItem)
      );
    }
  }

  changePriority(target, toDoItem) {
    for (let element of Array.from(target.parentElement.children)) {
      element.classList.remove("activated");
    }

    toDoItem.priority = target.id;
    target.classList.add("activated");

    this.saveToLocalStorage();
  }

  setToDoEventHandlers(toDoDiv, todo) {
    toDoDiv.addEventListener("click", (e) => this.toDoClickOpenClose(e.target));
    for (const child of toDoDiv.children) {
      if (child.id != "priority") {
        child.addEventListener("click", (e) =>
          this.clickToEdit(e.target, todo)
        );
      } else {
        child.addEventListener("click", (e) =>
          this.changePriority(e.target, todo)
        );
      }
    }
  }

  addToDoItem() {
    const newToDoItem = new ToDo();
    newToDoItem.title = "New todo";
    newToDoItem.description = "Description";
    newToDoItem.dueDate = add(new Date(), { days: 1 });
    newToDoItem.priority = 0;
    this.toDoLists[this.currentToDoList].list[newToDoItem.uuid] = newToDoItem;

    const toDoDiv = renderToDoItem(
      newToDoItem.title,
      newToDoItem.description,
      newToDoItem.dueDate,
      newToDoItem.priority
    );
    this.setToDoEventHandlers(toDoDiv, newToDoItem);

    const actionButtonsDiv = renderToDoItemActionButtons();
    const deleteToDoButton =
      actionButtonsDiv.querySelector(".deleteToDoButton");
    const archiveToDoButton =
      actionButtonsDiv.querySelector(".archiveToDoButton");

    deleteToDoButton.addEventListener("click", (e) =>
      this.deleteToDoItemConfirm(e.target, newToDoItem)
    );
    archiveToDoButton.addEventListener("click", (e) =>
      this.archiveToDoItemConfirm(e.target, newToDoItem)
    );
    toDoDiv.appendChild(actionButtonsDiv);

    this.toDoListDiv.appendChild(toDoDiv);

    this.saveToLocalStorage();
    this.updateSelectorCounts();
  }

  deleteToDoItemConfirm(target, targetToDoItem) {
    const modalButtons = renderModalDeleteDialog(document.body);
    const deleteButton = modalButtons.deleteButton;
    const cancelButton = modalButtons.cancelButton;
    const modalDiv = modalButtons.modalDiv;

    deleteButton.addEventListener("click", () => {
      const toDoDiv = target.closest(".toDoItem");
      const toDoList = this.toDoLists[this.currentToDoList].list;

      toDoDiv.remove();
      delete toDoList[targetToDoItem.uuid];
      modalDiv.remove();
      this.updateSelectorCounts();
    });

    cancelButton.addEventListener("click", () => modalDiv.remove());

    this.saveToLocalStorage();
  }

  archiveToDoItemConfirm(target, targetToDoItem) {
    const modalButtons = renderModalArchiveDialog(document.body);
    const archiveButton = modalButtons.archiveButton;
    const cancelButton = modalButtons.cancelButton;
    const modalDiv = modalButtons.modalDiv;

    archiveButton.addEventListener("click", () => {
      const toDoDiv = target.closest(".toDoItem");
      const toDoList = this.toDoLists[this.currentToDoList].list;

      toDoDiv.remove();
      targetToDoItem.completed = true;
      this.archive.list[targetToDoItem.uuid] = targetToDoItem;
      delete toDoList[targetToDoItem.uuid];
      modalDiv.remove();
      this.updateSelectorCounts();
    });

    cancelButton.addEventListener("click", () => modalDiv.remove());

    this.saveToLocalStorage();
    this.updateSelectorCounts();
  }

  switchToDoList(target, isArchive = false) {
    const selector = target.closest(".toDoListSelector");
    const newToDoListuuid = selector.getAttribute("uuid");

    for (let element of Array.from(this.selectorDiv.children)) {
      element.classList.remove("selected");
    }
    selector.classList.add("selected");

    this.clearToDoListDiv();

    if (isArchive) {
      this.renderToDoList(true);
    } else {
      this.currentToDoList = newToDoListuuid;
      this.renderToDoList();
    }

    this.saveToLocalStorage();
  }

  addToDoList() {
    const newToDoList = new ToDoList("New List");
    this.toDoLists[newToDoList.uuid] = newToDoList;

    const toDoListSelector = document.createElement("div");
    toDoListSelector.classList.add("toDoListSelector");

    const selectorTitle = document.createElement("div");
    selectorTitle.textContent = newToDoList.title;
    selectorTitle.classList.add("toDoListSelectorTitle");

    const selectorCount = document.createElement("div");
    selectorCount.classList.add("toDoListSelectorCount");

    toDoListSelector.appendChild(selectorTitle);
    toDoListSelector.appendChild(selectorCount);
    toDoListSelector.setAttribute("uuid", newToDoList.uuid);

    toDoListSelector.addEventListener("click", (e) =>
      this.switchToDoList(e.target)
    );

    this.selectorDiv.insertBefore(
      toDoListSelector,
      document.getElementById("selectorhr")
    );

    this.saveToLocalStorage();
    this.updateSelectorCounts();
  }

  deleteToDoList(button) {
    const targetUUID = button.getAttribute("toDoListuuid");
    const selector = Array.from(this.selectorDiv.children).filter((el) => {
      return el.getAttribute("uuid") === targetUUID;
    })[0];
    const previousSibling = selector.previousSibling;
    const nextSibling = selector.nextSibling;

    const modalButtons = renderModalDeleteDialog(document.body);
    const deleteButton = modalButtons.deleteButton;
    const cancelButton = modalButtons.cancelButton;
    const modalDiv = modalButtons.modalDiv;

    deleteButton.addEventListener("click", () => {
      delete this.toDoLists[this.currentToDoList];
      selector.remove();
      if (previousSibling) {
        previousSibling.click();
      } else {
        nextSibling.click();
      }
      modalDiv.remove();
    });
    cancelButton.addEventListener("click", () => modalDiv.remove());

    this.saveToLocalStorage();
    this.updateSelectorCounts();
  }

  renameToDoList(button) {
    const targetUUID = button.getAttribute("toDoListuuid");
    const selector = Array.from(this.selectorDiv.children).filter((el) => {
      return el.getAttribute("uuid") === targetUUID;
    })[0];

    const modalButtons = renderModalRenameDialog(document.body);
    const renameButton = modalButtons.renameButton;
    const cancelButton = modalButtons.cancelButton;
    const modalDiv = modalButtons.modalDiv;

    cancelButton.addEventListener("click", () => modalDiv.remove());
    renameButton.addEventListener("click", (e) => {
      const newTitle = e.target.parentElement.previousSibling.value;

      if (newTitle === "") {
        e.target.parentElement.previousSibling.value =
          "Please enter a valid name.";
      } else {
        selector.textContent = newTitle;
        this.toDoLists[this.currentToDoList].title = newTitle;
        modalDiv.remove();
      }

      this.saveToLocalStorage();
    });
  }

  updateSelectorCounts() {
    for (const selector of Array.from(this.selectorDiv.children)) {
      if ( selector.id === "" ) {
        const uuid = selector.getAttribute("uuid");
        const count = Object.entries(this.toDoLists[uuid].list).length;
        const countDiv = Array.from(selector.children)[1];
        countDiv.textContent = count;
      }
    }
  }

  renderSelectors() {
    const addNewToDoListButton = document.createElement("div");
    addNewToDoListButton.id = "addNewToDoList";
    addNewToDoListButton.textContent = "New todo list";
    addNewToDoListButton.addEventListener("click", (e) =>
      this.addToDoList(e.target)
    );
    this.sideBarDiv.prepend(addNewToDoListButton);

    for (const [uuid, toDoList] of Object.entries(this.toDoLists)) {
      const toDoListSelector = document.createElement("div");
      toDoListSelector.classList.add("toDoListSelector");

      const selectorTitle = document.createElement("div");
      selectorTitle.textContent = toDoList.title;
      selectorTitle.classList.add("toDoListSelectorTitle");

      const selectorCount = document.createElement("div");
      selectorCount.classList.add("toDoListSelectorCount");

      toDoListSelector.appendChild(selectorTitle);
      toDoListSelector.appendChild(selectorCount);

      toDoListSelector.setAttribute("uuid", uuid);
      if (uuid === this.currentToDoList) {
        toDoListSelector.classList.add("selected");
      }

      toDoListSelector.addEventListener("click", (e) =>
        this.switchToDoList(e.target)
      );

      this.selectorDiv.appendChild(toDoListSelector);
      this.updateSelectorCounts();
    }
    const line = document.createElement("div");
    line.id = "selectorhr";
    line.innerHTML = "<hr/>";
    this.selectorDiv.appendChild(line);

    const archiveSelector = document.createElement("div");
    archiveSelector.classList.add("toDoListSelector");
    archiveSelector.id = "Archive";
    archiveSelector.textContent = "Archive";
    archiveSelector.setAttribute("uuid", this.archive.uuid);
    archiveSelector.addEventListener("click", (e) =>
      this.switchToDoList(e.target, true)
    );
    this.selectorDiv.appendChild(archiveSelector);
  }

  clearToDoListDiv() {
    this.toDoListDiv.textContent = "";
  }

  createExampleToDos() {
    let exampleTodoList = new ToDoList("Default");
    let exampleTodo = new ToDo();
    exampleTodo.title = "Test";
    exampleTodo.description = "A test task.";
    exampleTodo.dueDate = new Date(2023, 5, 1, 0, 0);
    exampleTodo.priority = 0;
    exampleTodo.completed = false;
    exampleTodoList.add(exampleTodo);
    this.currentToDoList = exampleTodoList.uuid;
    this.add(exampleTodoList);

    exampleTodoList = new ToDoList("Work");
    exampleTodo = new ToDo();
    exampleTodo.title = "Another test.";
    exampleTodo.description = "Another test task.";
    exampleTodo.dueDate = new Date(2023, 5, 1, 0, 0);
    exampleTodo.priority = 1;
    exampleTodo.completed = false;
    exampleTodoList.add(exampleTodo);
    this.add(exampleTodoList);

    this.archive = new ToDoList("Archive");
  }

  parseDates(toDoList) {
    for (const [uuid, toDoItem] of Object.entries(toDoList.list)) {
      let dateString = toDoItem.dueDate.slice(0, -8);
      toDoItem.dueDate = parse(dateString, "yyyy-MM-dd'T'HH:mm", new Date());
    }
  }

  loadFromLocalStorage() {
    this.toDoLists = JSON.parse(localStorage["toDoLists"]);
    for (const [uuid, toDoList] of Object.entries(this.toDoLists)) {
      this.parseDates(toDoList);
    }
    this.currentToDoList = localStorage["currentToDoList"];
    this.archive = JSON.parse(localStorage["archive"]);
    this.parseDates(this.archive);
  }

  saveToLocalStorage() {
    localStorage["toDoLists"] = JSON.stringify(this.toDoLists);
    localStorage["currentToDoList"] = this.currentToDoList;
    localStorage["archive"] = JSON.stringify(this.archive);
  }

  renderToDoList(isArchive = false) {
    const numToDoLists = Object.keys(this.toDoLists).length;
    let toDoList = undefined;
    if (isArchive) {
      toDoList = this.archive;
    } else {
      toDoList = this.toDoLists[this.currentToDoList];

      const toDoListButtonsDiv = document.createElement("div");
      toDoListButtonsDiv.id = "toDoListButtonsDiv";

      const addNewToDoItemButton = document.createElement("div");
      addNewToDoItemButton.classList.add("toDoListButton");
      addNewToDoItemButton.id = "addNewToDoItem";
      addNewToDoItemButton.textContent = "New todo";
      toDoListButtonsDiv.appendChild(addNewToDoItemButton);

      if (numToDoLists > 1) {
        const deleteToDoListButton = document.createElement("div");
        deleteToDoListButton.classList.add("toDoListButton");
        deleteToDoListButton.id = "deleteToDoList";
        deleteToDoListButton.setAttribute("toDoListuuid", toDoList.uuid);
        deleteToDoListButton.textContent = "Delete List";
        deleteToDoListButton.addEventListener("click", (e) =>
          this.deleteToDoList(e.target)
        );
        toDoListButtonsDiv.appendChild(deleteToDoListButton);
      }

      const renameToDoListButton = document.createElement("div");
      renameToDoListButton.classList.add("toDoListButton");
      renameToDoListButton.id = "renameToDoList";
      renameToDoListButton.setAttribute("toDoListuuid", toDoList.uuid);
      renameToDoListButton.textContent = "Rename todo list";
      toDoListButtonsDiv.appendChild(renameToDoListButton);

      addNewToDoItemButton.addEventListener("click", () => this.addToDoItem());
      renameToDoListButton.addEventListener("click", (e) =>
        this.renameToDoList(e.target)
      );

      this.toDoListDiv.appendChild(toDoListButtonsDiv);
    }

    for (const [uuid, todo] of Object.entries(toDoList.list)) {
      const toDoDiv = renderToDoItem(
        todo.title,
        todo.description,
        todo.dueDate,
        todo.priority
      );
      toDoDiv.setAttribute("uuid", todo.uuid);

      this.setToDoEventHandlers(toDoDiv, todo);

      const actionButtonsDiv = renderToDoItemActionButtons();
      const deleteToDoButton =
        actionButtonsDiv.querySelector(".deleteToDoButton");
      const archiveToDoButton =
        actionButtonsDiv.querySelector(".archiveToDoButton");

      deleteToDoButton.addEventListener("click", (e) =>
        this.deleteToDoItemConfirm(e.target, todo)
      );

      if (isArchive) {
        archiveToDoButton.style.display = "none";
      } else {
        archiveToDoButton.addEventListener("click", (e) =>
          this.archiveToDoItemConfirm(e.target, todo)
        );
      }

      toDoDiv.appendChild(actionButtonsDiv);

      this.toDoListDiv.appendChild(toDoDiv);
    }
  }

  renderInitial() {
    //localStorage.removeItem("toDoLists");
    if (localStorage["toDoLists"]) {
      this.loadFromLocalStorage();
    } else {
      this.createExampleToDos();
    }
    this.renderSelectors();
    this.renderToDoList();
    this.saveToLocalStorage();

    document.body.appendChild(header());
    document.body.appendChild(this.contentDiv);
    document.body.appendChild(footer());
  }
}

const handler = new ToDoHandler();
handler.renderInitial();
