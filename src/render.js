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

  return sideBarDiv
}

function ToDoClickOpenClose(e) {
  const target = e.target.closest(".toDoItem");
  console.log(target.classList)
  if (target.classList.contains("closed")) {
    console.log("opening toDo");
    target.classList.remove("closed");
    target.classList.add("open");
    for (const child of target.children) {
      if (child.id != "title") {
      child.style.display = "block";
      }
    }
  }
  else {
    console.log("closing toDo");
    target.classList.remove("open");
    target.classList.add("closed");
    for (const child of target.children) {
      if (child.id != "title") {
        child.style.display = "none";
        }
    }
  }

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
    descriptionDiv.style.display = "none";
    descriptionDiv.textContent = todo.description;

    toDoDiv.appendChild(titleDiv);
    toDoDiv.appendChild(descriptionDiv);

    toDoDiv.addEventListener("click", ToDoClickOpenClose);

    ToDoListDiv.appendChild(toDoDiv);
  })
}


export { header, footer, sideBar, renderToDoList };