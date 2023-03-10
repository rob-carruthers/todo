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
    '<div id="footerText">© Rob Carruthers 2023 <a href="https://github.com/rob-carruthers/todo" target="_blank"><iconify-icon icon="mdi:github" style="color: black;"></iconify-icon></a></div>';

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

  if (field === "dueDate") {
    newValue = parse(renderValue, "yyyy-MM-dd'T'HH:mm", new Date());
    renderValue = "Due: " + format(newValue, "yyyy/MM/dd HH:mm");
  } else {
    newValue = renderValue;
  }
  fieldDiv.innerHTML = "";
  fieldDiv.textContent = renderValue;
  fieldDiv.classList.remove("editing");

  return { field: field, newValue: newValue };
}

function renderModalDeleteDialog(parentDiv) {
  const modalDiv = document.createElement("div");
  modalDiv.id = "modalDeleteDialog";
  modalDiv.setAttribute("delete", "false");

  const modalBox = document.createElement("div");
  modalBox.id = "modalDeleteBox";
  
  const modalText = document.createElement("div");
  modalText.id = "modalDeleteText";
  modalText.textContent = "Really delete?";

  const modalButtonsDiv = document.createElement("div");
  modalButtonsDiv.id = "modalButtonsDiv";

  const deleteButton = document.createElement("div");
  deleteButton.classList.add("modalButton");
  deleteButton.id = "modalDeleteConfirm";
  deleteButton.textContent = "Delete";

  const cancelButton = document.createElement("div");
  cancelButton.classList.add("modalButton");
  cancelButton.id = "modalDeleteCancel";
  cancelButton.textContent = "Cancel";

  modalBox.appendChild(modalText);
  modalButtonsDiv.appendChild(deleteButton);
  modalButtonsDiv.appendChild(cancelButton);
  modalBox.appendChild(modalButtonsDiv);
  modalDiv.appendChild(modalBox);
  parentDiv.appendChild(modalDiv);

  return({modalDiv, deleteButton, cancelButton});
}

function renderClickToEdit(target) {
  let field = target.closest(".editableField");
  if (field != null) {
    field.classList.add("editing");
    const yesButton = document.createElement("div");
    yesButton.id = "yes" + target.id;
    yesButton.innerHTML =
      '<iconify-icon icon="mdi:check" style="color: black;"></iconify-icon>';

    const noButton = document.createElement("div");
    noButton.id = "noButton";
    noButton.innerHTML =
      '<iconify-icon icon="mdi:close-thick" style="color: black;"></iconify-icon>';

    const prefill = target.textContent;
    noButton.setAttribute('cancelValue', prefill);
    target.innerHTML = "";
    target.style.display = "flex";

    const inputField = document.createElement("div");
    inputField.id = "input";

    if (target.id === "dueDate") {
      inputField.innerHTML =
        "<input id='input' type='datetime-local' value='" +
        prefill.slice(5).replace(/\s+/g, "T").replace(/\//g, "-") +
        "'>";
    } else {
      inputField.innerHTML =
        "<input id='input' type='text' value='" + prefill + "'>";
    }

    noButton.addEventListener("click", (e) => {
      const targetDiv = e.target.closest(".editableField");
      const cancelValue = e.target.closest("#noButton").getAttribute("cancelValue");
      targetDiv.textContent = cancelValue;
      console.log(targetDiv);
      targetDiv.classList.remove("editing");
    });

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
  for (let [priorityIndex, priorityName] of [
    "High",
    "Medium",
    "Low",
  ].entries()) {
    const priorityIndicator = document.createElement("div");
    priorityIndicator.textContent = priorityName;
    priorityIndicator.id = priorityIndex;
    priorityIndicator.classList.add("priorityIndicator");
    if (priority == priorityIndex) {
      priorityIndicator.classList.add("activated");
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
  renderModalDeleteDialog
};
