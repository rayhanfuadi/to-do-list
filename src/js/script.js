let inputNama = prompt('Masukan Nama Anda', 'Ehan');
const namaUser = document.getElementById('namaUser');
const isiNama = document.createElement('p');
isiNama.textContent = `Nama: ${inputNama}`;
namaUser.appendChild(isiNama);

let role = prompt('Role Anda', 'Ui/Ux Designer')
const isiRole = document.createElement('p');
isiRole.textContent = `Role: ${role}`;
namaUser.appendChild(isiRole);

const input = document.querySelector("input");
const addButton = document.querySelector("#addButton");
const todosHTML = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter")
let filter = '';
const dateFilterInput = document.querySelector("#dateFilter");
const refreshButton = document.getElementById('refreshButton');
let dateFilter = '';

showTodos();

function getTodoHTML(todo, index) {
    if (filter && filter != todo.status) {
        return '';
    }
    if (dateFilter && dateFilter != todo.date) {
        return '';
    }

    let checked = todo.status === "completed" ? "checked" : "";
    return `
        <div class="todo flex justify-between gap-x-[16px] bg-black p-[16px] rounded-[12px] shadow-box2">
            <div class="grid justify-items-start content-between">
                <div class="flex items-center gap-x-[6px]">
                    <label class="flex items-center gap-x-2" for="${index}">
                        <input for="${index}" onclick="updateStatus(this)" id="${index}" class="peer" type="checkbox" ${checked}>
                        <span class="${checked} text-light font-medium peer-checked:text-gray peer-checked:line-through cursor-pointer">${todo.text}</span>
                    </label>
                </div>
                <span class="text-primary text-[12px] flex gap-x-[4px] items-center lg:text-[16px] lg:mb-[12px]">
                    <img class="text-primary" src="img/clock.svg">
                    <span class="text-light">${todo.time}</span>, ${todo.date}
                </span>
            </div>
            <div class="grid justify-items-end content-between text-nowrap">
                <p class="text-gray text-[12px] mb-[8px] lg:text-[16px] lg:mb-[12px]">Kategori: <span class="text-light">${todo.level}</span></p>
                <div class="flex items-center gap-x-[4px] mb-[8px] lg:mb-[16px]">
                  <p class=" w-fit h-fit text-center text-[10px] px-[4px] py-[2px] rounded-full text-light lg:text-[16px]">
                      Status: 
                  </p>
                  <p class="bg-[#282507] w-fit h-fit text-center text-[10px] px-[8px] py-[2px] rounded-[8px] text-primary lg:text-[16px] lg:mb-[16px]">
                      ${todo.status === 'completed' ? 'Done' : 'Pending'}
                  </p>
                </div>
                <a data-index="${index}" onclick="remove(this)" class="flex w-fit h-fit justify-center gap-x-[4px] bg-merah py-[2px] px-[8px] rounded-[8px] hover:bg-hoverm hover:ease-in transition-all duration-100" href="#">
                    <img src="img/trash.svg" alt="">
                    <p class="text-light font-medium text-[10px] lg:text-[16px]">Hapus</p>
                </a>
            </div>
        </div>
    `;
}


function showTodos() {
    if (todosJson.length == 0) {
        todosHTML.innerHTML = '';
        emptyImage.style.display = 'block';
        return;
    }
    let filteredTodos = todosJson;
    if (filter) {
        filteredTodos = filteredTodos.filter(todo => todo.status === filter);
    }
    if (dateFilter) {
        filteredTodos = filteredTodos.filter(todo => todo.date === dateFilter);
    }
    todosHTML.innerHTML = filteredTodos.map(getTodoHTML).join('');
    emptyImage.style.display = filteredTodos.length === 0 ? 'block' : 'none';
}


dateFilterInput.addEventListener('change', (e) => {
    dateFilter = e.target.value ? new Date(e.target.value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '';
    showTodos();
});

refreshButton.addEventListener('click', () => {
    dateFilter = '';  
    dateFilterInput.value = '';  
    showTodos();
});

function addTodo(todo)  {
  input.value = "";
  todosJson.unshift({ 
    name: todo, 
    status: "pending" 
  });
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

addButton.addEventListener('click', function() {
    let todoText = input.value.trim();
    const todoLevel = document.getElementById('level').value;
    const selectedDate = document.getElementById('dateInput').value;
    const currentDateTime = new Date();
    const currentTime = currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, options) : currentDateTime.toLocaleDateString(undefined, options);

    if (todoText) {
        const todo = {
            text: todoText,
            level: todoLevel,
            time: currentTime,
            date: currentDate,
            status: 'pending'
        };
        todosJson.push(todo);
        localStorage.setItem('todos', JSON.stringify(todosJson));
        showTodos();
        input.value = '';
    }
});

function setTodayDate() {
    const dateInput = document.getElementById('dateInput');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
}

window.onload = setTodayDate;

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
  const confirmDelete = confirm("Yakin ingin menghapus todo ini?");
  if (!confirmDelete) return;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
    const confirmDelete = confirm("Yakin ingin menghapus semua todo?");
    if (!confirmDelete) return;
    todosJson = [];
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
});