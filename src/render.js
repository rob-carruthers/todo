import { format, parse, isValid } from "date-fns";

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
  const yesButtonDiv = target.closest("div");
  const noButtonDiv = yesButtonDiv.nextSibling;
  const field = yesButtonDiv.id.slice(3);
  const fieldDiv = yesButtonDiv.closest("#" + field);
  let renderValue = fieldDiv.children[0].children[0].value;

  if (field === "dueDate") {
    const cancelValue = noButtonDiv.getAttribute("cancelvalue").slice(5);
    newValue = parse(renderValue, "yyyy-MM-dd'T'HH:mm", new Date());
    // Check to see if the entered date is valid
    if (!isValid(newValue)) {
      newValue = parse(cancelValue, "yyyy/MM/dd HH:mm", new Date());
      fieldDiv.classList.add("fieldError");
    } else {
      fieldDiv.classList.remove("fieldError");
    }
    renderValue = "Due: " + format(newValue, "yyyy/MM/dd HH:mm");
  } else {
    if (renderValue === "") {
      const cancelValue = noButtonDiv.getAttribute("cancelvalue");
      newValue = cancelValue;
      renderValue = cancelValue;
      fieldDiv.classList.add("fieldError");
    } else {
      newValue = renderValue;
      fieldDiv.classList.remove("fieldError");
    }
  }
  fieldDiv.innerHTML = "";
  fieldDiv.textContent = renderValue;
  fieldDiv.classList.remove("editing");

  return { field: field, newValue: newValue };
}

function renderModalBox(prompt) {
  const modalDiv = document.createElement("div");
  modalDiv.id = "modalDialog";

  const modalBox = document.createElement("div");
  modalBox.id = "modalBox";

  const modalText = document.createElement("div");
  modalText.id = "modalText";
  modalText.textContent = prompt;

  modalBox.appendChild(modalText);
  modalDiv.appendChild(modalBox);

  return modalDiv;
}

function renderModalRenameDialog(parentDiv) {
  const modalDiv = renderModalBox("Enter new name:");
  const modalBox = modalDiv.querySelector("#modalBox");

  const modalInput = document.createElement("input");
  modalInput.id = "modalInput";

  const modalButtonsDiv = document.createElement("div");
  modalButtonsDiv.id = "modalButtonsDiv";

  const renameButton = document.createElement("div");
  renameButton.classList.add("modalButton");
  renameButton.id = "renameToDoList";
  renameButton.textContent = "Rename";

  const cancelButton = document.createElement("div");
  cancelButton.classList.add("modalButton");
  cancelButton.id = "modalDeleteCancel";
  cancelButton.textContent = "Cancel";

  modalBox.appendChild(modalInput);
  modalButtonsDiv.appendChild(renameButton);
  modalButtonsDiv.appendChild(cancelButton);
  modalBox.appendChild(modalButtonsDiv);
  parentDiv.appendChild(modalDiv);

  return { modalDiv, renameButton, cancelButton };
}

function renderModalDeleteDialog(parentDiv) {
  const modalDiv = renderModalBox("Really delete?");
  const modalBox = modalDiv.querySelector("#modalBox");

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

  modalButtonsDiv.appendChild(deleteButton);
  modalButtonsDiv.appendChild(cancelButton);
  modalBox.appendChild(modalButtonsDiv);
  parentDiv.appendChild(modalDiv);

  return { modalDiv, deleteButton, cancelButton };
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
    noButton.setAttribute("cancelValue", prefill);
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
      const cancelValue = e.target
        .closest("#noButton")
        .getAttribute("cancelValue");
      targetDiv.textContent = cancelValue;
      targetDiv.classList.remove("editing");
    });

    target.appendChild(inputField);
    target.appendChild(yesButton);
    target.appendChild(noButton);

    return yesButton;
  }
}

function renderToDoItemActionButtons() {
  const actionButtonsDiv = document.createElement("div");
  actionButtonsDiv.style.display = "none";

  const archiveToDoButton = document.createElement("div");
  archiveToDoButton.classList.add("toDoButton");
  archiveToDoButton.classList.add("archiveToDoButton");
  archiveToDoButton.textContent = "Archive";

  const deleteToDoButton = document.createElement("div");
  deleteToDoButton.textContent = "Delete";
  deleteToDoButton.classList.add("toDoButton");
  deleteToDoButton.classList.add("deleteToDoButton");

  actionButtonsDiv.appendChild(archiveToDoButton);
  actionButtonsDiv.appendChild(deleteToDoButton);

  return actionButtonsDiv;
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
  renderModalDeleteDialog,
  renderModalRenameDialog,
  renderToDoItemActionButtons,
};
