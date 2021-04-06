const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filterInput = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() {
  // Tetiklenecek eventleri bir fonksiyon içerisinde tutma

  form.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodoToUI);
  secondCardBody.addEventListener("click", deleteTodo);
  filterInput.addEventListener("keyup", filterTodos);
  clearButton.addEventListener("click", clearAllTodos);
}

function addTodo(e) {
  // Inputlardan değerleri alma
  // Dataları UI'a ve storage'a eklemek için fonksiyonlara gönderme
  // UI'da işlem sonlarında bildirim gösterme

  const newTodo = todoInput.value.trim(); // Trim => Başta ve sondaki boşlukları siliyor
  if (newTodo === "") {
    showAlert("danger", "Lütfen Bir Todo Girin");
  } else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert("success", "Todo Başarılı Bir Şekilde Eklendi");
  }

  e.preventDefault();
}

function addTodoToUI(newTodo) {
  // Todoları UI'a ekleme

  const listItem = document.createElement("li");
  listItem.className = "list-group-item d-flex justify-content-between";

  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class = 'fa fa-remove'></i>";

  listItem.appendChild(document.createTextNode(newTodo));
  listItem.appendChild(link);

  todoList.appendChild(listItem);
  todoInput.value = "";
}

function showAlert(type, message) {
  // Olası hatalarda ve işlem sonlarında kullanıcıya UI'da bildirim gösterme

  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  firstCardBody.appendChild(alert);

  setTimeout(function () {
    // setTimeOut => Zamanlayıcı
    alert.remove();
  }, 3000);
}

function getTodosFromStorage() {
  // Local storage içerisinde array kontrolü ve bu arrayi dönme

  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

function addTodoToStorage(newTodo) {
  // Todoyu local storage'a ekleme

  let todos = getTodosFromStorage();
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodoToUI() {
  // Sayfa her yenilendiğinde todoları UI'a ekleme

  let todos = getTodosFromStorage();

  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
}

function deleteTodo(e) {
  // Seçilen todoyu UI'dan silme ve storage'dan silmek için fonksiyona gönderme

  if (e.target.className === "fa fa-remove") {
    e.target.parentElement.parentElement.remove();
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    showAlert("success", "Todo Başarıyla Silindi");
  }
}

function deleteTodoFromStorage(deleteTodo) {
  // Seçilen todoyu storage'dan silme

  let todos = getTodosFromStorage();
  todos.forEach(function (todo, index) {
    if (todo === deleteTodo) {
      todos.splice(index, 1); // Arrayden değer siliyor
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

function filterTodos(e) {
  // Todo listesinin içerisinde arama yapma

  const filterValue = e.target.value.toLowerCase();
  const listItems = document.querySelectorAll(".list-group-item");

  listItems.forEach(function (listItem) {
    const text = listItem.textContent.toLowerCase();
    if (text.indexOf(filterValue) === -1) {
      // Bulamadığı Zaman
      listItem.setAttribute("style", "display : none !important");
    } else {
      listItem.setAttribute("style", "display : block !important");
    }
  });
}

function clearAllTodos() {
  // Bütün todoları UI'dan ve storage'dan silme

  let todos = getTodosFromStorage();
  if (localStorage.getItem("todos") === null) {
    showAlert("danger", "Silinebilecek Bir Todo Bulunamadı");
  } else {
    if (confirm("Tümünü Silmek İstediğinize Emin Misiniz?")) {
      while (todoList.firstElementChild != null) {
        todoList.removeChild(todoList.firstElementChild);
      }
      localStorage.removeItem("todos");
      showAlert("success", "Bütün Todolar Başarılı Bir Şekilde Silindi");
    }
  }
}
