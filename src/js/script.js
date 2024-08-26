const input = document.querySelector("input");
const addButton = document.querySelector("#addButton");
const todosHTML = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter")
let filter = '';

showTodos();

function getTodoHTML(todo, index){
    if (filter && filter != todo.status){
        return '';
    }
    let checked = todo.status == "completed" ? "checked" : "";
    return `
        <div class="todo flex justify-between gap-x-[16px] bg-black p-[16px] rounded-[12px] shadow-box2">
            <div class="grid justify-items-start content-between">
                <div class="flex items-center gap-x-[6px]">
                    <label for="${index}">
                        <input for="${index}" onclick="updateStatus(this)" class="peer" id="checkbox1" type="checkbox" ${checked}>
                        <span
                            class="${checked} text-light font-medium peer-checked:text-gray peer-checked:line-through cursor-pointer">${todo.name}</span>
                    </label>
                </div>
                <span class="text-primary text-[12px] flex gap-x-[4px]"><img class="text-primary"
                        src="img/clock.svg">10:00
                    Am</span>
            </div>
            <div class="grid justify-items-end content-between text-nowrap">
                <p class="text-gray text-[12px] mb-[8px]">Kategori: <span class="text-light">Low</span></p>
                <p
                    class="bg-[#282507] w-fit h-fit text-center text-[10px] font-medium px-[8px] py-[2px] rounded-full text-primary mb-[8px]">
                    Done</p>
                <a data-index="${index}" onclick="remove(this)" class="flex w-fit h-fit justify-center gap-x-[4px] bg-merah py-[2px] px-[8px] rounded-full" href="#">
                    <img src="img/trash.svg" alt="">
                    <p class="text-light font-medium text-[10px]">Hapus</p>
                </a>
            </div>
        </div>
    `;
}

function showTodos(){
    if(todosJson.length == 0){
        todosHTML.innerHTML = '';
        emptyImage.style.display = 'block';
    } else {
        todosHTML.innerHTML = todosJson.map(getTodoHTML).join('');
        emptyImage.style.display = 'none';
    }
}

function addTodo(todo)  {
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
    todosJson = [];
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
});