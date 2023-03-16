import {v4 as uuidv4} from "uuid";
import { parse } from "date-fns";

class ToDoList {
  constructor(title) {
    this.title = title;
    this.list = [];
    this.uuid = uuidv4();
  }

  add(todo) {
    this.list.push(todo);
  }

  remove(index) {
    this.list.splice(index, 1);
  }
}

class ToDo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = false;
    this.uuid = uuidv4();
  }
}

export { ToDoList, ToDo };
