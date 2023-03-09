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

  addToDoItem(toDoListDiv) {
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

    toDoListDiv.appendChild(toDoDiv);
  }

  renderSelectors(selectorDiv) {
    for (const [i, toDoList] of this._toDoLists.entries()) {
      const toDoListSelector = document.createElement("div");
      toDoListSelector.classList.add("toDoListSelector");
      toDoListSelector.textContent = toDoList.title;
      toDoListSelector.id = i;
      if (i === this._currentToDoList) {
        toDoListSelector.classList.add("selected");
      }
      selectorDiv.appendChild(toDoListSelector);
    }
  }

  renderToDoList(toDoListDiv) {
    const addNewToDoItemButton = document.createElement("div");
    addNewToDoItemButton.id = "addNewToDoItem";
    addNewToDoItemButton.textContent = "New todo";

    addNewToDoItemButton.addEventListener("click", (e) =>
      this.addToDoItem(toDoListDiv)
    );

    toDoListDiv.appendChild(addNewToDoItemButton);
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

      toDoListDiv.appendChild(toDoDiv);
    }
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

const contentDiv = document.createElement("div");
contentDiv.id = "content";

const ToDoListDiv = document.createElement("div");
ToDoListDiv.id = "ToDoListDiv";

handler.add(defaultToDos);
handler.add(workToDos);

const selectorDiv = document.createElement("div");
selectorDiv.id = "selectorDiv";

handler.renderSelectors(selectorDiv);

document.body.appendChild(header());

const sideBarDiv = sideBar();
sideBarDiv.appendChild(selectorDiv);
contentDiv.appendChild(sideBarDiv);
contentDiv.appendChild(ToDoListDiv);
handler.renderToDoList(ToDoListDiv);
document.body.appendChild(contentDiv);
document.body.appendChild(footer());
