import { format } from "date-fns";

function header() {
  const headerDiv = document.createElement("div");
  headerDiv.id = "header";

  const logo = document.createElement("div");
  logo.classList.add("logo");
  logo.textContent = "Go Do";
  headerDiv.appendChild(logo);

  return headerDiv;
}

function footer() {
  const footerDiv = document.createElement("div");
  footerDiv.id = "footer";
  footerDiv.innerHTML =
    '<div>© Rob Carruthers 2023 <a href="https://github.com/rob-carruthers/todo" target="_blank"><iconify-icon icon="mdi:github" style="color: black;"></iconify-icon></a></div>';

  return footerDiv;
}

function sideBar() {
  const sideBarDiv = document.createElement("div");

  sideBarDiv.id = "sideBar";

  return sideBarDiv;
}

function ToDoClickOpenClose(e) {
  if (e.target.classList.contains("toDoItem")) {
    if (e.target.classList.contains("closed")) {
      e.target.classList.remove("closed");
      e.target.classList.add("open");
      for (const child of e.target.children) {
        if (child.id != "title") {
          child.style.display = "block";
        }
      }
    } else {
      e.target.classList.remove("open");
      e.target.classList.add("closed");
      for (const child of e.target.children) {
        if (child.id != "title") {
          child.style.display = "none";
        }
      }
    }
  }
}

function clickToEdit(e) {
  const yesButton = document.createElement("div");
  yesButton.id = "yes" + e.target.id;
  yesButton.innerHTML =
    '<iconify-icon icon="mdi:check" style="color: black;"></iconify-icon>';

  const noButton = document.createElement("div");
  noButton.innerHTML =
    '<iconify-icon icon="mdi:close-thick" style="color: black;"></iconify-icon>';

  const prefill = e.target.textContent;

  e.target.innerHTML = "";
  e.target.style.display = "flex";

  const inputField = document.createElement("div");
  inputField.innerHTML =
    "<input id='input' type='text' value='" + prefill + "'>";

  yesButton.addEventListener("click", (e) => {
    const buttonDiv = e.target.closest("div");
    const fieldDiv = buttonDiv.closest("#" + buttonDiv.id.slice(3));
    const inputValue = fieldDiv.children[0].children[0].value;

    fieldDiv.innerHTML = "";
    fieldDiv.textContent = inputValue;
  });

  e.target.appendChild(inputField);
  e.target.appendChild(yesButton);
  e.target.appendChild(noButton);
}

function renderToDoList(ToDoListDiv, ToDoListInstance) {
  ToDoListInstance.list.forEach((todo) => {
    const toDoDiv = document.createElement("div");
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
    dueDateDiv.textContent = "Due: " + format(todo.dueDate, "yyyy/MM/dd HH:mm");

    toDoDiv.appendChild(titleDiv);
    toDoDiv.appendChild(descriptionDiv);
    toDoDiv.appendChild(dueDateDiv);

    toDoDiv.addEventListener("click", ToDoClickOpenClose);
    for (const child of toDoDiv.children) {
      child.addEventListener("click", clickToEdit);
    }

    ToDoListDiv.appendChild(toDoDiv);
  });
}

export { header, footer, sideBar, renderToDoList };
