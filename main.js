let startTime = 0;
let elapsedTime = 0;
let timerId = null;

const timerDisplay = document.getElementById('timer');
const timerContainer = document.getElementById('timer-container');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');

const add1sButton = document.getElementById('add1s');
const add10sButton = document.getElementById('add10s');
const add1mButton = document.getElementById('add1m');

// タイマーの状態に応じて色（クラス）を自動更新する関数
function updateColor() {
    if (timerId !== null) {
        timerDisplay.classList.add('running'); // 進行中はブルー
    } else {
        timerDisplay.classList.remove('running'); // 停止時は黒
    }
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0')
    ].join(':');
}

function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    timerDisplay.textContent = formatTime(elapsedTime);
}

function addTime(seconds) {
    if (timerId !== null) return;
    elapsedTime += seconds * 1000;
    timerDisplay.textContent = formatTime(elapsedTime);
}

add1sButton.addEventListener('click', () => addTime(1));
add10sButton.addEventListener('click', () => addTime(10));
add1mButton.addEventListener('click', () => addTime(60));

// スタートボタン
startButton.addEventListener('click', () => {
    if (timerId !== null) return;
    startTime = Date.now() - elapsedTime;
    timerId = setInterval(updateTimer, 1000);
    updateColor();
});

// ストップボタン
stopButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    updateColor();
});

// リセットボタン
resetButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    elapsedTime = 0;
    timerDisplay.textContent = '00:00:00';
    updateColor();
});

// --- PC用：キーボード操作 ---
window.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        if (timerId === null) { startButton.click(); } else { stopButton.click(); }
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault();
        resetButton.click();
    }
});

// --- スマホ・PCクリック共通操作 ---
let touchTimer = null;
let isLongTouch = false;

timerContainer.addEventListener('touchstart', (e) => {
    isLongTouch = false;
    touchTimer = setTimeout(() => {
        isLongTouch = true;
        resetButton.click();
        if (navigator.vibrate) navigator.vibrate(50); 
    }, 600);
});

timerContainer.addEventListener('touchend', (e) => {
    clearTimeout(touchTimer);
    if (!isLongTouch) {
        if (timerId === null) { startButton.click(); } else { stopButton.click(); }
    }
    e.preventDefault();
});

timerContainer.addEventListener('touchmove', () => {
    clearTimeout(touchTimer);
});
