import { ToDoList, ToDo } from "./todo";
import { header, footer, sideBar, renderToDoList } from "./render";
import "iconify-icon";


const testTodo = new ToDo();
testTodo.title = "Test";
testTodo.description = "A test task.";
testTodo.dueDate = new Date(2023, 5, 1, 0, 0);
testTodo.priority = 0;
testTodo.completed = false;

const testTodoList = new ToDoList("Test List");
testTodoList.add(testTodo);

const contentDiv = document.createElement("div");
contentDiv.id = "content";

const ToDoListDiv = document.createElement("div");
ToDoListDiv.id = "ToDoListDiv";

document.body.appendChild(header());
contentDiv.appendChild(sideBar());
contentDiv.appendChild(ToDoListDiv);
renderToDoList(ToDoListDiv, testTodoList);
document.body.appendChild(contentDiv);
document.body.appendChild(footer());
