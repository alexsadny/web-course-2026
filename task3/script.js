// Состояние приложения (массив объектов)
let tasks = [];
let currentFilter = 'all';

// Ссылки на элементы DOM
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const countRemaining = document.getElementById('count-remaining');
const countCompleted = document.getElementById('count-completed');
const filterBtns = document.querySelectorAll('.filter-btn');

// Главная функция отрисовки интерфейса (вызывается при любом изменении данных)
function render() {
    // 1. Фильтруем задачи в зависимости от выбранной вкладки (используем метод filter)
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // для 'all'
    });

    // 2. Очищаем текущий список
    todoList.innerHTML = '';

    // 3. Генерируем HTML-элементы для каждой задачи (используем forEach)
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        // Обработчик события изменения статуса
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '×';
        delBtn.setAttribute('aria-label', 'Удалить задачу');
        // Обработчик события удаления
        delBtn.addEventListener('click', () => deleteTask(task.id));

        // Сборка элемента списка
        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(delBtn);
        
        todoList.appendChild(li);
    });

    // 4. Обновление счетчиков
    const completedTasksCount = tasks.filter(t => t.completed).length;
    const remainingTasksCount = tasks.length - completedTasksCount;
    
    countCompleted.textContent = completedTasksCount;
    countRemaining.textContent = remainingTasksCount;
}

// Функция добавления новой задачи
function addTask() {
    const text = todoInput.value.trim();
    
    // Валидация на пустой ввод
    if (!text) {
        alert('Пожалуйста, введите текст задачи!');
        return;
    }

    // Создание объекта задачи (id через Date.now())
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    todoInput.value = ''; // очистка поля
    render(); // перерисовка UI
}

// Функция переключения статуса задачи
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        render();
    }
}

// Функция удаления задачи
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    render();
}

// === ОБРАБОТЧИКИ СОБЫТИЙ (только через addEventListener) ===

// Клик по кнопке добавления
addBtn.addEventListener('click', addTask);

// Добавление по нажатию клавиши Enter
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Клик по фильтрам
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Убираем активный класс у всех кнопок
        filterBtns.forEach(b => b.classList.remove('active'));
        // Добавляем нажатой кнопке
        e.target.classList.add('active');
        
        // Меняем состояние фильтра и перерисовываем
        currentFilter = e.target.dataset.filter;
        render();
    });
});

// Первичная отрисовка при загрузке страницы
render();