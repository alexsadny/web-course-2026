// Состояние игры (храним данные отдельно от верстки)
let secret = '';
let history = [];
let attempts = 0;

// Элементы интерфейса
const input = document.getElementById('guessInput');
const checkBtn = document.getElementById('checkBtn');
const newGameBtn = document.getElementById('newGameBtn');
const errorMsg = document.getElementById('errorMsg');
const historyList = document.getElementById('historyList');
const attemptsDisplay = document.getElementById('attemptsDisplay');
const statusMsg = document.getElementById('statusMsg');

// ФУНКЦИЯ 1: Генерация случайного 4-значного числа с неповторяющимися цифрами
function generateSecret() {
    let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    // Перемешиваем массив цифр случайным образом
    digits.sort(() => Math.random() - 0.5);
    // Берем первые 4 цифры и склеиваем в строку
    return digits.slice(0, 4).join('');
}

// ФУНКЦИЯ 2: Валидация ввода (только 4 разные цифры)
function validateInput(val) {
    // Проверка регулярным выражением: ровно 4 цифры (от 0 до 9)
    if (!/^\d{4}$/.test(val)) return false;
    
    // Превращаем строку в Set (набор уникальных значений)
    let uniqueDigits = new Set(val.split(''));
    // Если размер Set равен 4, значит все цифры разные
    return uniqueDigits.size === 4;
}

// ФУНКЦИЯ 3: Подсчет быков и коров
function calculateBullsAndCows(guess, secretStr) {
    let bulls = 0;
    let cows = 0;
    for (let i = 0; i < 4; i++) {
        if (guess[i] === secretStr[i]) {
            bulls++; // Цифра и позиция совпадают
        } else if (secretStr.includes(guess[i])) {
            cows++; // Цифра есть, но на другой позиции
        }
    }
    return { bulls, cows };
}

// ФУНКЦИЯ 4: Отрисовка истории из массива (как требовалось в задании)
function renderHistory() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.guess} — ${item.bulls} бык(а/ов), ${item.cows} коров(ы)`;
        historyList.appendChild(li);
    });
    attemptsDisplay.textContent = `Попыток: ${attempts}`;
}

// ФУНКЦИЯ 5: Сброс и запуск новой игры
function startNewGame() {
    secret = generateSecret();
    history = [];
    attempts = 0;
    
    input.value = '';
    input.disabled = false;
    checkBtn.disabled = false;
    errorMsg.classList.add('hidden');
    statusMsg.textContent = '';
    
    renderHistory();
    // Раскомментируй строку ниже, если хочешь подглядывать ответ в консоли для тестов
    // console.log("Секретное число:", secret); 
}

// ФУНКЦИЯ 6: Обработка хода игрока
function handleGuess() {
    const guess = input.value;
    
    if (!validateInput(guess)) {
        errorMsg.classList.remove('hidden');
        return; // Прерываем выполнение, попытка не засчитывается
    }
    
    errorMsg.classList.add('hidden');
    attempts++;

    const result = calculateBullsAndCows(guess, secret);
    
    // Добавляем результат в массив состояния
    history.push({ 
        guess: guess, 
        bulls: result.bulls, 
        cows: result.cows 
    });
    
    renderHistory();

    // Проверка на победу
    if (result.bulls === 4) {
        statusMsg.textContent = `Победа! Угадано за ${attempts} попыток.`;
        input.disabled = true; // Блокируем поле ввода
        checkBtn.disabled = true; // Блокируем кнопку проверки
    }
    
    input.value = ''; // Очищаем поле для следующего ввода
}

// Привязываем события к кнопкам
checkBtn.addEventListener('click', handleGuess);
newGameBtn.addEventListener('click', startNewGame);
// Чтобы отправлять ответ по нажатию Enter
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !checkBtn.disabled) handleGuess();
});

// Запускаем игру при первой загрузке скрипта
startNewGame();