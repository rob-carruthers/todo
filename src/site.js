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

  ToDoClickOpenClose(target) {
    renderClickOpenClose(target);
  }

  amendField(target, toDoItem) {
    let amendedItem = renderAmendField(target);
    toDoItem[amendedItem.field] = amendedItem.newValue;
  }

  clickToEdit(target, toDoItem) {
    const yesButton = renderClickToEdit(target);

    yesButton.addEventListener("click", (e) =>
      this.amendField(e.target, toDoItem)
    );
  }

  render(ToDoListDiv) {
    const toDoList = this._toDoLists[this._currentToDoList];
    for (const [i, todo] of toDoList.list.entries()) {
      const toDoDiv = renderToDoItem(
        todo.title,
        todo.description,
        todo.dueDate
      );
      toDoDiv.id = i;

      toDoDiv.addEventListener("click", (e) =>
        this.ToDoClickOpenClose(e.target)
      );
      for (const child of toDoDiv.children) {
        child.addEventListener("click", (e) =>
          this.clickToEdit(e.target, todo)
        );
      }

      ToDoListDiv.appendChild(toDoDiv);
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
testTodo2.priority = 0;
testTodo2.completed = false;

const allToDos = new ToDoList("All");
allToDos.add(testTodo1);
allToDos.add(testTodo2);

const contentDiv = document.createElement("div");
contentDiv.id = "content";

const ToDoListDiv = document.createElement("div");
ToDoListDiv.id = "ToDoListDiv";

handler.add(allToDos);

document.body.appendChild(header());
contentDiv.appendChild(sideBar());
contentDiv.appendChild(ToDoListDiv);
handler.render(ToDoListDiv);
document.body.appendChild(contentDiv);
document.body.appendChild(footer());
