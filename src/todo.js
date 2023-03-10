import {v4 as uuidv4} from "uuid";

class ToDoList {
  constructor(title) {
    this._title = title;
    this.list = [];
    this._uuid = uuidv4();
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  get uuid() {
    return this._uuid;
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
    this._title = title;
    this._description = description;
    this._dueDate = dueDate;
    this._priority = priority;
    this._completed = false;
    this._uuid = uuidv4();
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this._description = value;
  }

  get dueDate() {
    return this._dueDate;
  }

  set dueDate(value) {
    this._dueDate = value; 
  }

  get priority() {
    return this._priority;
  }

  set priority(value) {
    this._priority = value; 
  }

  get completed() {
    return this._completed;
  }

  set completed(value) {
    this._completed = value; 
  }

  get uuid() {
    return this._uuid;
  }
}

export { ToDoList, ToDo };
