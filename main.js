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

// Lotto logic
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

// Teachable Machine Logic
const URL = "https://teachablemachine.withgoogle.com/models/5hgO6xt91/";
let model, labelContainer, maxPredictions;

async function initModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    const loadingDiv = document.getElementById('loading-model');
    
    loadingDiv.style.display = 'block';
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    loadingDiv.style.display = 'none';

    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = '';
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

const imageInput = document.getElementById('image-input');
const uploadButton = document.getElementById('upload-button');
const imagePreview = document.getElementById('image-preview');

uploadButton.addEventListener('click', () => imageInput.click());

imageInput.addEventListener('change', async (e) => {
    if (!model) await initModel();
    
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.onload = async () => {
            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);
            await predict(img);
        };
    };
    reader.readAsDataURL(file);
});

async function predict(imgElement) {
    const prediction = await model.predict(imgElement);
    labelContainer.innerHTML = '';
    
    // Sort predictions by probability
    prediction.sort((a, b) => b.probability - a.probability);

    prediction.forEach(p => {
        const classPrediction = `<div class="prediction-row">
            <span class="label">${p.className}:</span>
            <span class="probability">${(p.probability * 100).toFixed(2)}%</span>
            <div class="progress-bar"><div class="progress" style="width: ${p.probability * 100}%"></div></div>
        </div>`;
        labelContainer.innerHTML += classPrediction;
    });
}
