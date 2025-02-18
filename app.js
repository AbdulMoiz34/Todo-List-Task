const todoInp = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const addTodoBtn = document.getElementById("add-todo");
const updateTodoBtn = document.getElementById("update-todo");

const todos = JSON.parse(localStorage.getItem("todos")) || [];

let editableTodo = undefined;

// set todos in local storage
function setTodo(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// todo click handler
function todoClickHandler() {
    console.log("called");
    if (!todoInp.value.trim()) {
        alert("please add todo");
        return;
    } else if (todoInp.value.length > 35) {
        alert("The length must be less then 35");
        return;
    }
    todos.push({ complete: false, todo: todoInp.value.trim() });
    setTodo(todos);
    displayTodo(todos);
    todoInp.value = "";
}

// display todo which will display all the todos
function displayTodo(todos) {
    todoList.innerHTML = ``;
    for (let i = 0; i < todos.length; i++) {
        const isComplete = todos[i].complete !== false;
        todoList.innerHTML += `
      <li>
                <div class="${isComplete && 'completed'}">
                    <label><input type="checkbox" onchange="isCompleteHandler(${i})" ${isComplete && "checked"}>${todos[i].todo}</label>
                </div>
                <div class="todo-actions">
                    <i class="fas fa-edit" onclick="editTodo(${i})"></i>
                    <i class="fas fa-trash" onclick="delTodo(${i})"></i>
                </div>
            </li>
        `;
    }

    if (todos.length) {
        document.getElementById("clearAll-todo-container").style.display = "flex";
    } else {
        document.getElementById("clearAll-todo-container").style.display = "none";
    }
}

// display initially if todos is available in localStorage.
displayTodo(todos);

// delete todo 
function delTodo(idx) {
    const confirmDel = confirm("Do you want to delete todo?");
    if (confirmDel) {
        todos.splice(idx, 1);
        setTodo(todos);
        displayTodo(todos);
        alert("Todo has been deleted");
    } else {
        alert("canceled.");
    }
}

// editTodo Handler
function editTodo(idx) {
    const todoObj = todos[idx];
    editableTodo = todoObj;
    todoInp.value = todoObj.todo;
    updateTodoBtn.style.display = "block";
    addTodoBtn.style.display = "none";
    todoInp.focus();
}

// updateTodo Handler
function updateTodo() {
    if (!todoInp.value.trim()) {
        alert("Todo can't be empty.");
        return;
    } else if (todoInp.value.trim() === editableTodo["todo"]) {
        alert("It's previous value");
        return;
    }
    editableTodo["todo"] = todoInp.value;
    setTodo(todos);
    displayTodo(todos);
    updateTodoBtn.style.display = "none";
    addTodoBtn.style.display = "block";
    editableTodo = undefined;
    todoInp.value = "";
}

// complete todo
function isCompleteHandler(idx) {
    event.target.closest("div").classList.toggle("completed");
    const isComplete = todos[idx].complete;
    todos[idx].complete = (isComplete === true) ? false : true;
    setTodo(todos);
}

// Delete all todos
function deleteAllTodos() {
    const confirmDeleteAll = confirm("Are you sure?");
    if (!confirmDeleteAll) return;
    todos.length = 0;
    localStorage.clear();
    todoList.innerHTML = "";
    document.getElementById("clearAll-todo-container").style.display = "none";
}

function allActiveTodos() {
    const activeTodos = todos.filter(todo => !todo.complete);
    displayTodo(activeTodos);
}

// todoNav handler * (all, active , completed)
function todoNavHandler(type) {
    const btns = document.querySelectorAll(".todo-nav>button");
    btns.forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");
    if (type === "completed") {
        const completedTodo = todos.filter(todo => todo.complete);
        if (!completedTodo.length) {
            todoList.innerHTML = `<div>Completed todo is not available!</div>`;
            document.getElementById("clearAll-todo-container").style.display = "none";
        } else {
            displayTodo(completedTodo);
        }
    } else if (type == "active") {
        const activeTodos = todos.filter(todo => !todo.complete);
        if (!activeTodos.length) {
            todoList.innerHTML = `<div>Active todo is not available!</div>`;
            document.getElementById("clearAll-todo-container").style.display = "none";
        } else {
            displayTodo(activeTodos);
        }
    } else {
        displayTodo(todos);
    }
}
function allCompleteTodos() {
    const activeTodos = todos.filter(todo => todo.complete);
    displayTodo(activeTodos);
}
// when user press enter on keyboard this listener will be executed
todoInp.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        if (!editableTodo) {
            todoClickHandler();
        } else {
            updateTodo();
        }
    }
});

updateTodoBtn.addEventListener("click", updateTodo);
addTodoBtn.addEventListener("click", todoClickHandler);