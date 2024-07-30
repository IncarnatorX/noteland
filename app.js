let notesContainer = document.querySelector(".notes-container");
let newNoteBtn = document.querySelector(".new-note-btn");

let placeholder = document.querySelector(".placeholder");
let noteIndicator = document.querySelector(".note-indicator");
let newNote = document.querySelector(".new-note");
let noteView = document.querySelector(".note-view");
let backdrop = document.querySelector(".backdrop");
let taskCreator = document.querySelector(".task-creator");

let inputTitle = document.querySelector("#input-title");
let inputContent = document.querySelector("#input-content");

let taskInput = document.querySelector("#task-input");
let createTaskBtn = document.querySelector(".create-task-btn");

let notes = [];
if (localStorage.getItem("Notes")) {
  JSON.parse(localStorage.getItem("Notes")).forEach((note) => notes.push(note));
} else {
  notes = [];
}

function initalSettings() {
  placeholder.style.display = "flex";
  noteIndicator.style.display = "none";
  newNote.style.display = "none";
  noteView.style.display = "none";
  taskCreator.style.display = "none";
}

function notesLengthUI() {
  placeholder.style.display = "none";
  noteIndicator.style.display = "flex";
  newNote.style.display = "none";
  noteView.style.display = "none";
  taskCreator.style.display = "none";
}

function toggleNotesUI() {
  if (notes.length > 0) {
    notesLengthUI();
  } else {
    initalSettings();
  }
}

toggleNotesUI();

document.querySelector("h1").addEventListener("click", toggleNotesUI);

// NEW NOTE BUTTON LISTENER
newNoteBtn.addEventListener("click", () => {
  placeholder.style.display = "none";
  noteIndicator.style.display = "none";
  newNote.style.display = "flex";
  noteView.style.display = "none";
  inputTitle.focus();
});
//Creating the note
document.querySelector(".create-note").addEventListener("click", () => {
  if (inputTitle.value !== "" && inputContent.value !== "") {
    let note = {
      title: inputTitle.value,
      content: inputContent.value,
      tasks: [],
    };

    notes.push(note);

    let currentNoteIndex = notes.indexOf(note);

    addNoteToContainer(note, currentNoteIndex);
    addToLocalStorage();
    inputTitle.focus();
  } else {
    alert("Title and content can't be empty.");
  }
});

//Cancelling of the note
document.querySelector(".cancel-note").addEventListener("click", () => {
  toggleNotesUI();
  clearInputs();
});

//FUNCTION responsible to create the note, append to container and add a click listener to each created note
function addNoteToContainer(note, currentNoteIndex) {
  let mainDiv = document.createElement("div");
  mainDiv.className = "note";

  let title = document.createElement("h4");
  title.className = "note-title";
  title.textContent = note.title;

  let content = document.createElement("p");
  content.className = "note-content";
  content.textContent = note.content;

  mainDiv.append(title, content);
  notesContainer.append(mainDiv);

  mainDiv.addEventListener("click", () => {
    placeholder.style.display = "none";
    noteIndicator.style.display = "none";
    newNote.style.display = "none";
    noteView.style.display = "flex";
    backdrop.style.display = "none";
    taskCreator.style.display = "none";

    let noteViewHeading = document.querySelector(".note-view-heading");
    let noteViewContent = document.querySelector(".note-view-content");

    if (noteViewHeading === null && noteViewContent === null) {
      note_view(mainDiv, note, currentNoteIndex);
    } else {
      noteViewHeading.remove();
      noteViewContent.remove();
      note_view(mainDiv, note, currentNoteIndex);
    }
  });

  clearInputs();
}

function clearInputs() {
  inputTitle.value = "";
  inputContent.value = "";
  inputTitle.focus();
}

//Note view Function
function note_view(mainDiv, note, index) {
  // Heading DIV
  let headingDiv = document.createElement("div");
  headingDiv.className = "note-view-heading";

  let heading = document.createElement("h2");
  heading.textContent = note.title;

  let btnsDiv = document.createElement("div");
  btnsDiv.className = "note-view-btns";

  let newTaskBtn = document.createElement("button");
  newTaskBtn.className = "new-task";
  newTaskBtn.textContent = "New Task";

  let deleteNoteBtn = document.createElement("button");
  deleteNoteBtn.className = "delete-note";
  deleteNoteBtn.textContent = "Delete Note";

  btnsDiv.append(newTaskBtn, deleteNoteBtn);
  headingDiv.append(heading, btnsDiv);

  // Content DIV
  let contentDiv = document.createElement("div");
  contentDiv.className = "note-view-content";

  let para = document.createElement("p");
  para.textContent = note.content;

  contentDiv.append(para);

  //Main Task manager div
  let taskManagerDiv = document.createElement("div");
  taskManagerDiv.className = "task-manager";

  //task list heading
  let tasksListHeading = document.createElement("p");
  tasksListHeading.textContent = "TASKS LISTS";
  tasksListHeading.className = "task-list-title";

  let ongoingTaskListHeading = document.createElement("p");
  ongoingTaskListHeading.textContent = "Your Pending Tasks";
  ongoingTaskListHeading.style.opacity = "0.5";

  //div that contains the ongoing tasks
  let ongoingTasks = document.createElement("div");
  ongoingTasks.className = "ongoing-tasks";

  //HR TAG separating the ongoing and completed tasks
  let hrTag = document.createElement("hr");
  hrTag.className = "hr-tag";

  let completedTaskListHeading = document.createElement("p");
  completedTaskListHeading.textContent = "Completed Tasks";
  completedTaskListHeading.style.opacity = "0.5";

  //DIV that contains the completed tasks
  let completedTasks = document.createElement("div");
  completedTasks.className = "completed-tasks";

  taskManagerDiv.append(
    tasksListHeading,
    ongoingTaskListHeading,
    ongoingTasks,
    hrTag,
    completedTaskListHeading,
    completedTasks
  );

  contentDiv.append(taskManagerDiv);
  noteView.append(headingDiv, contentDiv);

  newTaskBtn.addEventListener("click", () => {
    noteView.style.display = "flex";
    noteView.style.zIndex = "1";

    backdrop.style.display = "flex";
    backdrop.style.opacity = "1";

    taskCreator.style.display = "flex";
    taskInput.focus();
  });

  deleteNoteBtn.addEventListener("click", () => {
    notes.splice(index, 1);
    addToLocalStorage();
    let localNotes = JSON.parse(localStorage.getItem("Notes"));
    localNotes.splice(index, 1);
    mainDiv.remove();
    toggleNotesUI();
  });

  //create task button

  createTaskBtn.onclick = function () {
    let currentIndex = index;

    if (taskInput.value !== "") {
      let task = {
        taskName: taskInput.value,
        completed: false,
      };

      notes[currentIndex].tasks.push(task);

      addToLocalStorage();
      taskInput.value = "";

      //calling the function
      tasksManager(task, ongoingTasks, completedTasks);

      backdrop.style.display = "none";
      taskCreator.style.display = "none";
    }
  };

  //Rendering each task on the screen
  note.tasks.forEach((task) => {
    tasksManager(task, ongoingTasks, completedTasks);
  });
  addToLocalStorage();
}

backdrop.addEventListener("click", () => {
  backdrop.style.display = "none";
  taskCreator.style.display = "none";
});

function tasksManager(task, ongoingTasks, completedTasks) {
  function createCurrentTask() {
    let currentTask = document.createElement("div");
    currentTask.className = "curr-task";

    let checkBoxInput = document.createElement("input");
    checkBoxInput.type = "checkbox";
    checkBoxInput.className = "checkbox";

    let label = document.createElement("label");
    label.textContent = task.taskName;

    currentTask.append(checkBoxInput, label);

    //checkbox click listener
    checkBoxInput.addEventListener("click", () => {
      if (checkBoxInput.checked) {
        createFinishedTask();
        task.completed = true;
        addToLocalStorage();
        currentTask.remove();
      }
    });

    return ongoingTasks.append(currentTask);
  }

  function createFinishedTask() {
    let finishedTaskDiv = document.createElement("div");
    finishedTaskDiv.className = "finish-task";

    //span element for the tick box
    let spanElement = document.createElement("span");
    spanElement.className = "span-check";

    let finishedTaskLabel = document.createElement("p");
    finishedTaskLabel.textContent = task.taskName;

    finishedTaskDiv.append(spanElement, finishedTaskLabel);
    completedTasks.append(finishedTaskDiv);
  }

  if (!task.completed) {
    createCurrentTask();
  } else {
    createFinishedTask();
  }
}

function addToLocalStorage() {
  localStorage.setItem("Notes", JSON.stringify(notes));
}

addToLocalStorage();

function renderNotesFromLS() {
  if (localStorage.getItem("Notes")) {
    let localArray = JSON.parse(localStorage.getItem("Notes"));
    localArray.forEach((note) =>
      addNoteToContainer(note, localArray.indexOf(note))
    );
  }
}

renderNotesFromLS();
