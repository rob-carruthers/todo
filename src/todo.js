import {v4 as uuidv4} from "uuid";

class ToDoList {
  constructor(title) {
    this.title = title;
    this.list = {};
    this.uuid = uuidv4();
  }

  add(todo) {
    this.list[todo.uuid] = todo;
  }

  remove(uuid) {
    delete this.list[uuid];
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
