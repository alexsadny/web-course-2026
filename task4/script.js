// === СОСТОЯНИЕ ПРИЛОЖЕНИЯ (State) ===
let secretNumber = '';
let history = []; // Массив объектов { guess: '1234', bulls: 1, cows: 2 }
let isGameOver = false;

// === ЭЛЕМЕНТЫ DOM ===
const guessInput = document.getElementById('guess-input');
const checkBtn = document.getElementById('check-btn');
const newGameBtn = document.getElementById('new-game-btn');
const errorMsg = document.getElementById('error-msg');
const attemptsCount = document.getElementById('attempts-count');
const historyList = document.getElementById('history-list');

// === ЛОГИЧЕСКИЕ ФУНКЦИИ ===

// 1. Генерация 4-значного числа с неповторяющимися цифрами
function generateSecretNumber() {
    let digits = [];
    while (digits.length < 4) {
        const randomDigit = Math.floor(Math.random() * 10).toString();
        if (!digits.includes(randomDigit)) {
            digits.push(randomDigit);
        }
    }
    return digits.join('');
}

// 2. Валидация ввода (только цифры, ровно 4, все разные)
function validateInput(value) {
    if (!/^\d{4}$/.test(value)) {
        return { isValid: false, message: 'Введите ровно 4 цифры (без букв и символов).' };
    }
    
    // Используем структуру Set (множество) для проверки уникальности, прямо как в Python/C++
    const uniqueDigits = new Set(value.split(''));
    if (uniqueDigits.size !== 4) {
        return { isValid: false, message: 'Все 4 цифры должны быть разными.' };
    }

    return { isValid: true };
}

// 3. Подсчет быков и коров
function calculateBullsAndCows(guess, secret) {
    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < 4; i++) {
        if (guess[i] === secret[i]) {
            bulls++; // Цифра угадана и на своем месте
        } else if (secret.includes(guess[i])) {
            cows++; // Цифра есть, но на другом месте
        }
    }
    return { bulls, cows };
}

// === УПРАВЛЕНИЕ ИНТЕРФЕЙСОМ (View) ===

// Отрисовка интерфейса на основе текущего состояния массива
function render() {
    // Очищаем список
    historyList.innerHTML = '';
    
    // Обновляем счетчик
    attemptsCount.textContent = history.length;

    // Генерируем элементы списка из массива history
    history.forEach(item => {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        // Если это победный ход, добавляем специальный класс
        if (item.bulls === 4) {
            li.classList.add('win');
            li.innerHTML = `<span class="history-guess">${item.guess}</span> 
                            <span>Победа! Угадано за ${history.length} попыток</span>`;
        } else {
            li.innerHTML = `<span class="history-guess">${item.guess}</span> 
                            <span>${item.bulls} бык(ов), ${item.cows} коров(ы)</span>`;
        }
        
        historyList.appendChild(li);
    });

    // Блокируем поле и кнопку проверки, если игра окончена
    guessInput.disabled = isGameOver;
    checkBtn.disabled = isGameOver;
}

// Обработка попытки пользователя
function handleGuess() {
    if (isGameOver) return;

    const guess = guessInput.value.trim();
    
    // Скрываем прошлую ошибку
    errorMsg.classList.add('hidden');

    // Проверяем валидацию
    const validation = validateInput(guess);
    if (!validation.isValid) {
        errorMsg.textContent = validation.message;
        errorMsg.classList.remove('hidden');
        return; // Попытка не засчитывается
    }

    // Считаем быков и коров
    const result = calculateBullsAndCows(guess, secretNumber);
    
    // Добавляем результат в историю
    history.push({
        guess: guess,
        bulls: result.bulls,
        cows: result.cows
    });

    // Проверяем победу
    if (result.bulls === 4) {
        isGameOver = true;
    }

    // Очищаем поле ввода и перерисовываем интерфейс
    guessInput.value = '';
    render();
}

// Сброс и старт новой игры
function startNewGame() {
    secretNumber = generateSecretNumber();
    history = [];
    isGameOver = false;
    guessInput.value = '';
    errorMsg.classList.add('hidden');
    // Для проверки при разработке можно раскомментировать строку ниже:
    // console.log('Секретное число:', secretNumber); 
    render();
}

// === ОБРАБОТЧИКИ СОБЫТИЙ ===
checkBtn.addEventListener('click', handleGuess);
newGameBtn.addEventListener('click', startNewGame);

guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleGuess();
    }
});

// Запуск первой игры при загрузке страницы
startNewGame();