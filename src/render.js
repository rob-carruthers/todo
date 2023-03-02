import { format, parse } from "date-fns";

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

function renderClickOpenClose(target) {
  if (target.classList.contains("toDoItem")) {
    if (target.classList.contains("closed")) {
      target.classList.remove("closed");
      target.classList.add("open");
      for (const child of target.children) {
        if (child.id != "title") {
          child.style.display = "inline-flex";
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

function renderAmendField(target) {
  let newValue = undefined;
  const buttonDiv = target.closest("div");
  const field = buttonDiv.id.slice(3);
  const fieldDiv = buttonDiv.closest("#" + field);
  let renderValue = fieldDiv.children[0].children[0].value;
  console.log(renderValue);

  if (field === "dueDate") {
    newValue = parse(renderValue, "yyyy-MM-dd'T'HH:mm", new Date());
    renderValue = "Due: " + format(newValue, "yyyy/MM/dd HH:mm");
  } else {
    newValue = renderValue;
  }
  fieldDiv.innerHTML = "";
  fieldDiv.textContent = renderValue;

  return { field: field, newValue: newValue };
}

function renderClickToEdit(target) {
  const field = target.closest(".editableField").id;
  if (field != "priority") {
    const yesButton = document.createElement("div");
    yesButton.id = "yes" + target.id;
    yesButton.innerHTML =
      '<iconify-icon icon="mdi:check" style="color: black;"></iconify-icon>';

    const noButton = document.createElement("div");
    noButton.innerHTML =
      '<iconify-icon icon="mdi:close-thick" style="color: black;"></iconify-icon>';

    const prefill = target.textContent;
    target.innerHTML = "";
    target.style.display = "flex";

    const inputField = document.createElement("div");

    if (target.id === "dueDate") {
      inputField.innerHTML =
        "<input id='input' type='datetime-local' value='" +
        prefill.slice(5).replace(/\s+/g, "T").replace(/\//g, "-") +
        "'>";
    } else {
      inputField.innerHTML =
        "<input id='input' type='text' value='" + prefill + "'>";
    }

    target.appendChild(inputField);
    target.appendChild(yesButton);
    target.appendChild(noButton);

    return yesButton;
  }
}

function renderToDoItem(title, description, dueDate, priority) {
  const toDoDiv = document.createElement("div");
  toDoDiv.classList.add("toDoItem");
  toDoDiv.classList.add("closed");

  const titleDiv = document.createElement("div");
  titleDiv.id = "title";
  titleDiv.classList.add("editableField");
  titleDiv.textContent = title;
  titleDiv.style.fontWeight = "bold";

  const descriptionDiv = document.createElement("div");
  descriptionDiv.id = "description";
  descriptionDiv.classList.add("editableField");
  descriptionDiv.style.display = "none";
  descriptionDiv.textContent = description;

  const dueDateDiv = document.createElement("div");
  dueDateDiv.id = "dueDate";
  dueDateDiv.classList.add("editableField");
  dueDateDiv.style.display = "none";
  dueDateDiv.textContent = "Due: " + format(dueDate, "yyyy/MM/dd HH:mm");

  const priorityDiv = document.createElement("div");
  priorityDiv.id = "priority";
  priorityDiv.classList.add("editableField");
  priorityDiv.style.display = "none";
  for ( let [priorityIndex, priorityName] of ["High", "Medium", "Low"].entries()) {
    const priorityIndicator = document.createElement("div");
    priorityIndicator.textContent = priorityName;
    priorityIndicator.classList.add("priorityIndicator");
    if ( priority == priorityIndex ) {
      priorityIndicator.classList.add("activated")
    }
    priorityDiv.appendChild(priorityIndicator);
  }

  toDoDiv.appendChild(titleDiv);
  toDoDiv.appendChild(descriptionDiv);
  toDoDiv.appendChild(dueDateDiv);
  toDoDiv.appendChild(priorityDiv);

  return toDoDiv;
}

export {
  header,
  footer,
  sideBar,
  renderToDoItem,
  renderClickToEdit,
  renderClickOpenClose,
  renderAmendField,
};
