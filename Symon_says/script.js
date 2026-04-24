const notes = [
  { freq: 261.63 },
  { freq: 277.18 },
  { freq: 293.66 },
  { freq: 311.13 },
  { freq: 329.63 },
  { freq: 349.23 },
  { freq: 369.99 },
  { freq: 392.0 },
  { freq: 415.3 },
  { freq: 440.0 },
  { freq: 466.16 },
  { freq: 493.88 }
];

const startBtn = document.getElementById('start-btn');
const levelText = document.getElementById('level');
const bestScoreText = document.getElementById('best-score');
const statusText = document.getElementById('status');
const countdownText = document.getElementById('countdown');
const keys = document.querySelectorAll('.key');

let sequence = [];
let playerSequence = [];
let round = 0;
let isPlayerTurn = false;
let isAnimating = false;

let audioContext;

const savedBest = localStorage.getItem('simon-best-score');

if (savedBest) {
  bestScoreText.textContent = savedBest;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function playSound(freq) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = freq;

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.4);
}

async function flashKey(index) {
  const key = document.querySelector(`[data-index="${index}"]`);

  key.classList.add('active');
  playSound(notes[index].freq);

  await sleep(500);

  key.classList.remove('active');

  await sleep(200);
}

async function showCountdown() {
  const steps = ['Ready', 'Set', 'Go'];

  for (let step of steps) {
    countdownText.textContent = step;
    await sleep(500);
  }

  countdownText.textContent = '';
}

async function showSequence() {
  isAnimating = true;
  isPlayerTurn = false;
  statusText.textContent = 'Запоминай последовательность';

  for (let index of sequence) {
    await flashKey(index);
  }

  isAnimating = false;
  isPlayerTurn = true;
  statusText.textContent = 'Твой ход';
}

async function startRound() {
  playerSequence = [];

  await showCountdown();
  await showSequence();
}

async function startGame() {
  sequence = [];
  playerSequence = [];
  round = 1;

  levelText.textContent = round;
  statusText.textContent = 'Игра началась';

  const firstRandom = Math.floor(Math.random() * 12);
  sequence.push(firstRandom);

  startBtn.disabled = true;

  await startRound();
}

function endGame() {
  statusText.textContent = `Игра окончена. Вы дошли до уровня ${round}`;

  const bestScore = Number(localStorage.getItem('simon-best-score')) || 0;

  if (round > bestScore) {
    localStorage.setItem('simon-best-score', round);
    bestScoreText.textContent = round;
  }

  startBtn.disabled = false;
  isPlayerTurn = false;
}

async function handlePlayerMove(index) {
  if (!isPlayerTurn || isAnimating) return;

  playerSequence.push(index);

  const key = document.querySelector(`[data-index="${index}"]`);

  key.classList.add('active');
  playSound(notes[index].freq);

  setTimeout(() => {
    key.classList.remove('active');
  }, 250);

  const currentStep = playerSequence.length - 1;

  if (playerSequence[currentStep] !== sequence[currentStep]) {
    endGame();
    return;
  }

  if (playerSequence.length === sequence.length) {
    isPlayerTurn = false;
    statusText.textContent = 'Раунд пройден';

    await sleep(1000);

    round++;
    levelText.textContent = round;

    const randomKey = Math.floor(Math.random() * 12);
    sequence.push(randomKey);

    await startRound();
  }
}

keys.forEach(key => {
  key.addEventListener('click', () => {
    const index = Number(key.dataset.index);
    handlePlayerMove(index);
  });
});

startBtn.addEventListener('click', startGame);
