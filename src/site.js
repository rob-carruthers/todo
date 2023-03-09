import { ToDoList, ToDo } from "./todo";
import {
  header,
  footer,
  sideBar,
  renderClickOpenClose,
  renderClickToEdit,
  renderAmendField,
  renderToDoItem,
} from "./render";
import "iconify-icon";
import { add } from "date-fns";

class ToDoHandler {
  constructor() {
    this._toDoLists = [];
    this._currentToDoList = 0;

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
    this._toDoLists.push(toDoList);
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
    console.log(this._toDoLists[this._currentToDoList]);
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

    this._toDoListDiv.appendChild(toDoDiv);
  }

  switchToDoList(target, todo) {
    const newToDoListId = parseInt(target.id);
    
    for (let element of Array.from(this._selectorDiv.children)) {
      element.classList.remove("selected");
    }
    target.classList.add("selected");

    this._currentToDoList = newToDoListId;
    this.clearToDoList();
    this.renderToDoList();
  }

  renderSelectors() {
    for (const [i, toDoList] of this._toDoLists.entries()) {
      const toDoListSelector = document.createElement("div");
      toDoListSelector.classList.add("toDoListSelector");
      toDoListSelector.textContent = toDoList.title;
      toDoListSelector.id = i;
      if (i === this._currentToDoList) {
        toDoListSelector.classList.add("selected");
      }

      toDoListSelector.addEventListener("click", (e) => this.switchToDoList(e.target, toDoList));

      this._selectorDiv.appendChild(toDoListSelector);
    }
  }

  clearToDoList() {
    this._toDoListDiv.textContent = "";
  }

  renderToDoList() {
    const addNewToDoItemButton = document.createElement("div");
    addNewToDoItemButton.id = "addNewToDoItem";
    addNewToDoItemButton.textContent = "New todo";

    addNewToDoItemButton.addEventListener("click", (e) => this.addToDoItem());

    this._toDoListDiv.appendChild(addNewToDoItemButton);
    const toDoList = this._toDoLists[this._currentToDoList];
    for (const [i, todo] of toDoList.list.entries()) {
      const toDoDiv = renderToDoItem(
        todo.title,
        todo.description,
        todo.dueDate,
        todo.priority
      );
      toDoDiv.id = i;

      this.setToDoEventHandlers(toDoDiv, todo);

      this._toDoListDiv.appendChild(toDoDiv);
    }
  }

  renderInitial() {
    this.renderSelectors();
    this.renderToDoList();

    document.body.appendChild(header());
    document.body.appendChild(this._contentDiv);
    document.body.appendChild(footer());
  }
}

const handler = new ToDoHandler();

const testTodo1 = new ToDo();
testTodo1.title = "Test";
testTodo1.description = "A test task.";
testTodo1.dueDate = new Date(2023, 5, 1, 0, 0);
testTodo1.priority = 0;
testTodo1.completed = false;

const testTodo2 = new ToDo();
testTodo2.title = "Another test.";
testTodo2.description = "Another test task.";
testTodo2.dueDate = new Date(2023, 5, 1, 0, 0);
testTodo2.priority = 1;
testTodo2.completed = false;

const defaultToDos = new ToDoList("Default");
defaultToDos.add(testTodo1);

const workToDos = new ToDoList("Work");
workToDos.add(testTodo2);

handler.add(defaultToDos);
handler.add(workToDos);

handler.renderInitial();
