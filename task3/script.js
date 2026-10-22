// 1. Хранилище данных (состояние)
let tasks = [];
let currentFilter = 'all'; // 'all', 'active', 'completed'

// 2. Получение ссылок на элементы интерфейса
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const warning = document.getElementById('warning');
const taskList = document.getElementById('taskList');
const activeCountEl = document.getElementById('activeCount');
const completedCountEl = document.getElementById('completedCount');
const filterBtns = document.querySelectorAll('.filter-btn');

// 3. Главная функция отрисовки (рендера)
function render() {
    taskList.innerHTML = ''; // Очищаем список перед новой отрисовкой

    // Применяем фильтр к массиву
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; 
    });

    // Отрисовываем отфильтрованные задачи
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        // Обертка для галочки и текста
        const div = document.createElement('div');
        div.classList.add('task-content');

        // Чекбокс выполнения
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));

        // Текст задачи
        const span = document.createElement('span');
        span.classList.add('task-text');
        span.textContent = task.text;

        div.appendChild(checkbox);
        div.appendChild(span);

        // Кнопка удаления
        const delBtn = document.createElement('button');
        delBtn.classList.add('delete-btn');
        delBtn.textContent = 'Удалить';
        delBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(div);
        li.appendChild(delBtn);
        taskList.appendChild(li);
    });

    // Обновляем статистику
    const completedCount = tasks.filter(t => t.completed).length;
    const activeCount = tasks.length - completedCount;
    activeCountEl.textContent = activeCount;
    completedCountEl.textContent = completedCount;
}

// 4. Функция добавления задачи
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        warning.classList.remove('hidden'); // Показываем предупреждение
        return;
    }
    warning.classList.add('hidden'); // Прячем предупреждение

    const newTask = {
        id: Date.now(), // Уникальный ID на основе времени
        text: text,
        completed: false
    };

    tasks.push(newTask); // Добавляем в массив данных
    taskInput.value = ''; // Очищаем поле ввода
    render(); // Перерисовываем интерфейс
}

// 5. Функция переключения статуса "Выполнено"
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    render();
}

// 6. Функция удаления
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    render();
}

// 7. Обработчики событий (Event Listeners)
addBtn.addEventListener('click', addTask);

// Отправка по нажатию Enter
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
});

// Переключение фильтров
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active')); // Сбрасываем цвета кнопок
        e.target.classList.add('active'); // Красим нажатую
        
        currentFilter = e.target.dataset.filter; // Берем значение из data-filter="all/active/completed"
        render();
    });
});

// Запускаем рендер при старте, чтобы отобразить нули в статистике
render();