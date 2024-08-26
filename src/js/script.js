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
                    <label class="flex items-center gap-x-2" for="${index}">
                        <input for="${index}" onclick="updateStatus(this)" id="${index}" class="peer" type="checkbox" ${checked}>
                        <span
                            class="${checked} text-light font-medium peer-checked:text-gray peer-checked:line-through cursor-pointer">${todo.text}</span>
                    </label>
                </div>
                <span class="text-primary text-[12px] flex gap-x-[4px]"><img class="text-primary"
                        src="img/clock.svg">${todo.time}</span>
            </div>
            <div class="grid justify-items-end content-between text-nowrap">
                <p class="text-gray text-[12px] mb-[8px]">Kategori: <span class="text-light">${todo.level}</span></p>
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

addButton.addEventListener('click', function() {
    let todoText = input.value.trim();
    const todoLevel = document.getElementById('level').value;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (todoText) {
        const todo = {
            text: todoText,
            level: todoLevel,  // Simpan level agenda
            time: currentTime,  // Simpan waktu saat ini
            status: 'pending'
        };
        todosJson.push(todo);
        localStorage.setItem('todos', JSON.stringify(todosJson));
        showTodos();
        input.value = '';
    }
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



// Kalender
const calendarWrapper = document.querySelector(".calendar");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const yearSelect = document.getElementById("calendar-year");
const todosSection = document.querySelector(".todos");

let currentDate = new Date();
let currentIndex = 0;
let todosData = {}; // Penyimpanan memori terpisah untuk setiap tanggal

function generateYearsOptions() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 50; i <= currentYear + 50; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
}

function generateDatesForMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let dates = [];

    for (let i = 1; i <= daysInMonth; i++) {
        const dayDate = new Date(year, month, i);
        const weekDay = dayDate.toLocaleString('default', { weekday: 'short' });
        const monthName = dayDate.toLocaleString('default', { month: 'long' });

        dates.push({
            month: monthName,
            day: i,
            weekDay: weekDay,
            isToday: dayDate.toDateString() === new Date().toDateString(),
            dateKey: `${year}-${month + 1}-${i}`
        });
    }
    return dates;
}

function renderTodosForDate(dateKey) {
    todosSection.innerHTML = ''; // Kosongkan konten sebelumnya
    const todosForDate = todosData[dateKey] || [];
    if (todosForDate.length === 0) {
        todosSection.innerHTML = '<p class="text-light font-medium text-[24px]">Tidak Ada Agenda</p>';
    } else {
        todosForDate.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.className = 'todo-item';
            todoElement.innerHTML = `<p>${todo}</p>`;
            todosSection.appendChild(todoElement);
        });
    }
}

function handleDateClick(dateKey) {
    // Menampilkan todos yang ada untuk tanggal yang dipilih
    renderTodosForDate(dateKey);
}

function renderCalendar(dates, startIndex) {
    calendarWrapper.innerHTML = '';

    for (let i = startIndex; i < startIndex + 5; i++) {
        if (i >= dates.length) break;
        const date = dates[i];

        const isCenter = i === startIndex + 2;
        const dateClass = date.isToday || isCenter ? 
            'grid text-dark min-w-[62px] rounded-[12px] gap-y-[8px] py-[6px] bg-primary text-center shadow-box1 cursor-pointer' : 
            'grid text-light min-w-[62px] rounded-[12px] gap-y-[8px] py-[6px] bg-black text-center shadow-box1 cursor-pointer';

        const calendarDate = document.createElement('div');
        calendarDate.className = dateClass;
        calendarDate.innerHTML = `
            <p class="font-medium text-[14px]">${date.month}</p>
            <p class="font-semibold text-[20px]">${date.day}</p>
            <p class="text-[14px]">${date.weekDay}</p>
        `;
        
        // Event listener untuk handle klik pada tanggal
        calendarDate.addEventListener('click', () => handleDateClick(date.dateKey));
        
        calendarWrapper.appendChild(calendarDate);
    }
}

function updateCalendar() {
    const dates = generateDatesForMonth(currentDate);
    renderCalendar(dates, currentIndex);
}

yearSelect.addEventListener("change", () => {
    currentDate.setFullYear(parseInt(yearSelect.value));
    currentIndex = 0; // Reset index to start from the beginning of the month
    updateCalendar();
});

nextButton.addEventListener("click", () => {
    const dates = generateDatesForMonth(currentDate);
    if (currentIndex + 1 < dates.length) {
        currentIndex += 1;
    } else {
        currentIndex = 0;
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    updateCalendar();
});

prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex -= 1;
    } else {
        const dates = generateDatesForMonth(currentDate);
        currentIndex = dates.length - 1;
        currentDate.setMonth(currentDate.getMonth() - 1);
    }
    updateCalendar();
});

// Initial render
generateYearsOptions();
yearSelect.value = currentDate.getFullYear();

const todayDate = new Date();
if (todayDate.getFullYear() === currentDate.getFullYear() && todayDate.getMonth() === currentDate.getMonth()) {
    currentIndex = todayDate.getDate() - 3;
    if (currentIndex < 0) {
        currentIndex = 0;
    }
} else {
    currentIndex = 0;
}

updateCalendar();