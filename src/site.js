import { ToDoList, ToDo } from "./todo";
import { header, footer, sideBar, renderToDoList } from "./render";
import "iconify-icon";
import { format, parse } from "date-fns";

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
    if (target.classList.contains("toDoItem")) {
      if (target.classList.contains("closed")) {
        target.classList.remove("closed");
        target.classList.add("open");
        for (const child of target.children) {
          if (child.id != "title") {
            child.style.display = "block";
          }
        }
      } else {
        target.classList.remove("open");
        target.classList.add("closed");
        for (const child of target.children) {
          if (child.id != "title") {
            child.style.display = "none";
          }
        }
      }
    }
  }

  amendField(target, toDoItem) {
    const buttonDiv = target.closest("div");
    const field = buttonDiv.id.slice(3);
    const fieldDiv = buttonDiv.closest("#" + field);
    let inputValue = fieldDiv.children[0].children[0].value;

    if (field === "dueDate") {
      const newDueDate = parse(inputValue, "yyyy-MM-dd\'T\'HH:mm", new Date())
      toDoItem.dueDate = newDueDate;
      inputValue = "Due: " + format(newDueDate, "yyyy/MM/dd HH:mm");
      
    } else {
      toDoItem[field] = inputValue;    
    }
    fieldDiv.innerHTML = "";
    fieldDiv.textContent = inputValue;
  }

  clickToEdit(target, toDoItem) {
    const yesButton = document.createElement("div");
    yesButton.id = "yes" + target.id;
    yesButton.innerHTML =
      '<iconify-icon icon="mdi:check" style="color: black;"></iconify-icon>';

    const noButton = document.createElement("div");
    noButton.innerHTML =
      '<iconify-icon icon="mdi:close-thick" style="color: black;"></iconify-icon>';

    let prefill = target.textContent;
    target.innerHTML = "";
    target.style.display = "flex";

    const inputField = document.createElement("div");

    if (target.id === "dueDate") {
      prefill = format(toDoItem.dueDate, "yyyy-MM-dd HH:MM");
      inputField.innerHTML =
        "<input id='input' type='datetime-local' value='" + prefill + "'>";
    } else {
      inputField.innerHTML =
        "<input id='input' type='text' value='" + prefill + "'>";
    }

    yesButton.addEventListener("click", (e) =>
      this.amendField(e.target, toDoItem)
    );

    target.appendChild(inputField);
    target.appendChild(yesButton);
    target.appendChild(noButton);
  }

  render(ToDoListDiv) {
    const toDoList = this._toDoLists[this._currentToDoList];
    for (const [i, todo] of toDoList.list.entries()) {
      const toDoDiv = document.createElement("div");
      toDoDiv.id = i;
      toDoDiv.classList.add("toDoItem");
      toDoDiv.classList.add("closed");

      const titleDiv = document.createElement("div");
      titleDiv.id = "title";
      titleDiv.textContent = todo.title;
      titleDiv.style.fontWeight = "bold";

      const descriptionDiv = document.createElement("div");
      descriptionDiv.id = "description";
      descriptionDiv.style.display = "none";
      descriptionDiv.textContent = todo.description;

      const dueDateDiv = document.createElement("div");
      dueDateDiv.id = "dueDate";
      dueDateDiv.style.display = "none";
      dueDateDiv.textContent =
        "Due: " + format(todo.dueDate, "yyyy/MM/dd HH:mm");

      toDoDiv.appendChild(titleDiv);
      toDoDiv.appendChild(descriptionDiv);
      toDoDiv.appendChild(dueDateDiv);

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
