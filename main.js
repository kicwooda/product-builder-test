const generateButton = document.getElementById('generate-button');
const numbersDisplay = document.getElementById('numbers-display');
const themeButton = document.getElementById('theme-button');
const body = document.body;

// Theme logic
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeButton.textContent = 'Light Mode';
}

themeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    let theme = 'light';
    if (body.classList.contains('dark-mode')) {
        theme = 'dark';
        themeButton.textContent = 'Light Mode';
    } else {
        themeButton.textContent = 'Dark Mode';
    }
    localStorage.setItem('theme', theme);
});

generateButton.addEventListener('click', () => {
    const lottoNumbers = generateLottoNumbers();
    displayNumbers(lottoNumbers);
});

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function displayNumbers(numbers) {
    numbersDisplay.innerHTML = '';
    numbers.forEach((number, index) => {
        setTimeout(() => {
            const numberBall = document.createElement('div');
            numberBall.classList.add('number-ball');
            numberBall.textContent = number;
            numbersDisplay.appendChild(numberBall);
        }, index * 100);
    });
}
