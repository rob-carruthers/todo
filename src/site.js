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
} from "./render";
import "iconify-icon";
import { add } from "date-fns";

class ToDoHandler {
  constructor() {
    this._toDoLists = {};
    this._currentToDoList = null;

    this._contentDiv = document.createElement("div");
    this._contentDiv.id = "content";

    this._toDoListDiv = document.createElement("div");
    this._toDoListDiv.id = "ToDoListDiv";

    this._selectorDiv = document.createElement("div");
    this._selectorDiv.id = "selectorDiv";

    this._sideBarDiv = sideBar();
    this._sideBarDiv.appendChild(this._selectorDiv);

    this._contentDiv.appendChild(this._sideBarDiv);
    this._contentDiv.appendChild(this._toDoListDiv);
  }

  get currentToDoList() {
    return this._currentToDoList;
  }

  set currentToDoList(value) {
    this._currentToDoList = value;
  }

  add(toDoList) {
    this._toDoLists[toDoList.uuid] = toDoList;
  }

  toDoClickOpenClose(target) {
    renderClickOpenClose(target);
  }

  amendField(target, toDoItem) {
    let amendedItem = renderAmendField(target);
    toDoItem[amendedItem.field] = amendedItem.newValue;
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
    this._toDoLists[this._currentToDoList].add(newToDoItem);

    const toDoDiv = renderToDoItem(
      newToDoItem.title,
      newToDoItem.description,
      newToDoItem.dueDate,
      newToDoItem.priority
    );
    this.setToDoEventHandlers(toDoDiv, newToDoItem);

    const deleteToDoButton = document.createElement("div");
    deleteToDoButton.textContent = "Delete";
    deleteToDoButton.style.display = "none";
    deleteToDoButton.classList.add("deleteToDoButton");

    deleteToDoButton.addEventListener("click", (e) =>
      this.deleteToDoItem(e.target, newToDoItem)
    );

    toDoDiv.appendChild(deleteToDoButton);

    this._toDoListDiv.appendChild(toDoDiv);
  }

  deleteToDoItem(target, targetToDoItem) {
    const modalButtons = renderModalDeleteDialog(document.body);
    const deleteButton = modalButtons.deleteButton;
    const cancelButton = modalButtons.cancelButton;
    const modalDiv = modalButtons.modalDiv;

    deleteButton.addEventListener("click", () => {
      const toDoDiv = target.closest(".toDoItem");
      const toDoList = this._toDoLists[this._currentToDoList].list;
      const isTarget = (toDoItem) => toDoItem === targetToDoItem;
      const toDoItemIndex = toDoList.findIndex(isTarget);

      toDoDiv.remove();
      toDoList.splice(toDoItemIndex, 1);
      modalDiv.remove();
    });

    cancelButton.addEventListener("click", () => modalDiv.remove());
  }

  switchToDoList(target) {
    const newToDoListuuid = target.getAttribute("uuid");

    for (let element of Array.from(this._selectorDiv.children)) {
      element.classList.remove("selected");
    }
    target.classList.add("selected");

    this._currentToDoList = newToDoListuuid;
    this.clearToDoListDiv();
    this.renderToDoList();
  }

  addToDoList(target) {
    const newToDoList = new ToDoList("New List");
    this._toDoLists[newToDoList.uuid] = newToDoList;

    const toDoListSelector = document.createElement("div");
    toDoListSelector.classList.add("toDoListSelector");
    toDoListSelector.textContent = newToDoList.title;
    toDoListSelector.setAttribute("uuid", newToDoList.uuid);

    toDoListSelector.addEventListener("click", (e) =>
      this.switchToDoList(e.target)
    );

    this._selectorDiv.appendChild(toDoListSelector);
  }

  deleteToDoList(button) {
    const targetUUID = button.getAttribute("toDoListuuid");
    const selector = Array.from(this._selectorDiv.children).filter((el) => {
      return el.getAttribute("uuid") === targetUUID;
    })[0];
    const previousSibling = selector.previousSibling;
    const nextSibling = selector.nextSibling;

    const modalButtons = renderModalDeleteDialog(document.body);
    const deleteButton = modalButtons.deleteButton;
    const cancelButton = modalButtons.cancelButton;
    const modalDiv = modalButtons.modalDiv;

    deleteButton.addEventListener("click", () => {
      delete this._toDoLists[this._currentToDoList];
      selector.remove();
      if (previousSibling) {
        previousSibling.click();
      } else {
        nextSibling.click();
      }
      modalDiv.remove();
    });
    cancelButton.addEventListener("click", () => modalDiv.remove());
  }

  renderSelectors() {
    const addNewToDoListButton = document.createElement("div");
    addNewToDoListButton.id = "addNewToDoList";
    addNewToDoListButton.textContent = "New todo list";
    addNewToDoListButton.addEventListener("click", (e) =>
      this.addToDoList(e.target)
    );
    this._sideBarDiv.prepend(addNewToDoListButton);

    for (const [uuid, toDoList] of Object.entries(this._toDoLists)) {
      const toDoListSelector = document.createElement("div");
      toDoListSelector.classList.add("toDoListSelector");
      toDoListSelector.textContent = toDoList.title;
      toDoListSelector.setAttribute("uuid", uuid);
      if (uuid === this._currentToDoList) {
        toDoListSelector.classList.add("selected");
      }

      toDoListSelector.addEventListener("click", (e) =>
        this.switchToDoList(e.target)
      );

      this._selectorDiv.appendChild(toDoListSelector);
    }
  }

  clearToDoListDiv() {
    this._toDoListDiv.textContent = "";
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
    this._currentToDoList = exampleTodoList.uuid;
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
  }

  renderToDoList() {
    console.log(Object.keys(this._toDoLists).length);
    const numToDoLists = Object.keys(this._toDoLists).length;
    const toDoList = this._toDoLists[this._currentToDoList];
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

    addNewToDoItemButton.addEventListener("click", () => this.addToDoItem());

    this._toDoListDiv.appendChild(toDoListButtonsDiv);

    for (const [uuid, todo] of toDoList.list.entries()) {
      const toDoDiv = renderToDoItem(
        todo.title,
        todo.description,
        todo.dueDate,
        todo.priority
      );
      toDoDiv.setAttribute("uuid", todo.uuid);

      this.setToDoEventHandlers(toDoDiv, todo);

      const deleteToDoButton = document.createElement("div");
      deleteToDoButton.textContent = "Delete";
      deleteToDoButton.style.display = "none";
      deleteToDoButton.classList.add("deleteToDoButton");

      deleteToDoButton.addEventListener("click", (e) =>
        this.deleteToDoItem(e.target, todo)
      );

      toDoDiv.appendChild(deleteToDoButton);

      this._toDoListDiv.appendChild(toDoDiv);
    }
  }

  renderInitial() {
    this.createExampleToDos();
    this.renderSelectors();
    this.renderToDoList();

    document.body.appendChild(header());
    document.body.appendChild(this._contentDiv);
    document.body.appendChild(footer());
  }
}

const handler = new ToDoHandler();
handler.renderInitial();
