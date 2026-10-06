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

// 【最も確実な修正方法】JavaScriptから直接文字の色を書き換える
function updateColor() {
    if (timerId !== null) {
        timerDisplay.text.color = '#007bff'; // 進行中は鮮やかなブルー
    } else {
        timerDisplay.text.color = '#333333'; // 停止中は黒っぽい色
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
    updateColor(); // 色を確実に変える
});

// ストップボタン
stopButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    updateColor(); // 色を確実に変える
});

// リセットボタン
resetButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    elapsedTime = 0;
    timerDisplay.textContent = '00:00:00';
    updateColor(); // 色を確実に変える
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

// --- スマホ用：画面タップ＆長押し操作 ---
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
