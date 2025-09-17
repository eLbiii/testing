/* ======================  ЖДЁМ DOM  ====================== */
document.addEventListener('DOMContentLoaded', () => {

/* ======================  ЭЛЕМЕНТЫ DOM  ====================== */
const loginForm   = document.getElementById('loginForm');
const fio         = document.getElementById('fio');
const group       = document.getElementById('group');
const course      = document.getElementById('course');

const testContainer = document.getElementById('testContainer');
const matchContest  = document.getElementById('matchContest');
const stubContest   = document.getElementById('stubContest');
const resultBox     = document.getElementById('resultBox');

const qNum   = document.getElementById('qNum');
const qTotal = document.getElementById('qTotal');
const qTitle = document.getElementById('qTitle');
const answers= document.getElementById('answers');

const dFio   = document.getElementById('dFio');
const dGroup = document.getElementById('dGroup');
const dScore = document.getElementById('dScore');
const rTitle = document.getElementById('rTitle');
const rText  = document.getElementById('rText');

/* ======================  ТЕМА  ====================== */
const toggle = document.getElementById('themeToggle');
const html   = document.documentElement;
(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') html.setAttribute('data-theme', 'dark');
})();
toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

/* ======================  ДАННЫЕ  ====================== */
const matchData = [
    { name: "Северо-кавказский медицинский колледж", logo: "img/SKM.png", id: "skmk" },
    { name: "Ставропольский многопрофильный колледж", logo: "img/SMK.png", id: "smk" },
    { name: "Ставропольский колледж связи имени Героя Советского Союза В.А. Петрова", logo: "img/SKS.png", id: "sks" },
    { name: "Ставропольский региональный многопрофильный колледж", logo: "img/SRMK.png", id: "srmk" },
    { name: "Ставропольский кооперативный техникум", logo: "img/SKT.png", id: "skt" },
    { name: "Ставропольский региональный колледж вычислительной техники и электроники", logo: "img/SRKVT.png", id: "srk" }
];

/* ======================  ПЕРЕМЕННЫЕ  ====================== */
let userFio = '', userGroup = '', userCourse = '';
let currentContest  = 1;
let currentQuestion = 0;
let totalScore      = 0;   // правильных ответов ВСЕГО
let studentAnswers  = [];
let selectedPair    = { logo: null, name: null };

/* ======================  ВХОД  ====================== */
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    userFio   = fio.value.trim();
    userGroup = group.value.trim();
    userCourse = course.value;
    if (!userFio || !userGroup || !userCourse) return;

    loginForm.classList.add('hidden');
    currentContest = 1;
    loadContest();
});

/* ======================  КОНКУРСЫ (объект)  ====================== */
const contests = { /* тот же самый большой объект, что у вас */ };

/* ======================  ЗАГРУЗКА КОНКУРСА  ====================== */
function loadContest() {
    const c = contests[currentContest];
    if (!c) { showFinalResult(); return; }

    if (c.type === 'match') {
        testContainer.classList.add('hidden');
        stubContest.classList.add('hidden');
        initMatch();
        matchContest.classList.remove('hidden');
    } else if (c.type === 'input') {
        testContainer.classList.remove('hidden');
        matchContest.classList.add('hidden');
        stubContest.classList.add('hidden');
        showInputContest(c.questions);
    } else if (c.type === 'rebus') {
        testContainer.classList.remove('hidden');
        matchContest.classList.add('hidden');
        stubContest.classList.add('hidden');
        showRebusContest(c.questions);
    } else if (c.type === 'quiz' && c.directions) {
        const dirs = c.directions[userCourse];
        if (!dirs) { nextContest(); return; }
        testContainer.classList.remove('hidden');
        matchContest.classList.add('hidden');
        stubContest.classList.add('hidden');
        const questions = dirs.flatMap(d => d.questions);
        qTotal.textContent = questions.length;
        currentQuestion = 0;
        showQuizContest(questions);
    } else if (c.type === 'stub') {
        testContainer.classList.add('hidden');
        matchContest.classList.add('hidden');
        stubContest.classList.remove('hidden');
        document.getElementById('stubNum').textContent = currentContest;
        setTimeout(() => nextContest(), 1000);
    } else {   // обычный тест (радиокнопки / чекбоксы)
        matchContest.classList.add('hidden');
        stubContest.classList.add('hidden');
        testContainer.classList.remove('hidden');
        const questions = c.questions || c.variants?.[userCourse] || [];
        qTotal.textContent = questions.length;
        currentQuestion = 0;
        showQuestion(questions);
    }
}

/* ======================  ОБЫЧНЫЙ ТЕСТ  ====================== */
function showQuestion(list) {
    const q = list[currentQuestion];
    qNum.textContent = currentQuestion + 1;
    qTitle.textContent = q.q;
    answers.innerHTML = '';

    if (q.type === 'checkbox') {
        q.a.forEach((txt, idx) => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" name="q" value="${idx}"> ${txt}`;
            answers.appendChild(label);
        });
        const btn = document.createElement('button');
        btn.textContent = 'Ответить';
        btn.onclick = () => nextCheckboxQuestion(list);
        answers.appendChild(btn);
    } else {
        q.a.forEach((txt, idx) => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="radio" name="q" value="${idx}"> ${txt}`;
            label.querySelector('input').addEventListener('change', () => nextRadioQuestion(list));
            answers.appendChild(label);
        });
    }
}

function nextRadioQuestion(list) {
    const sel = +document.querySelector('input[name="q"]:checked').value;
    studentAnswers.push({ contest: currentContest, question: currentQuestion, userAnswer: sel, correct: list[currentQuestion].correct });
    if (sel === list[currentQuestion].correct) totalScore++;
    currentQuestion++;
    currentQuestion < list.length ? showQuestion(list) : nextContest();
}

function nextCheckboxQuestion(list) {
    const checked = [...document.querySelectorAll('input[name="q"]:checked')].map(ch => +ch.value);
    const correct = list[currentQuestion].correct;
    const ok = checked.length === correct.length && correct.every(i => checked.includes(i));
    studentAnswers.push({ contest: currentContest, question: currentQuestion, userAnswer: checked, correct });
    if (ok) totalScore++;
    currentQuestion++;
    currentQuestion < list.length ? showQuestion(list) : nextContest();
}

/* ======================  КВИЗ 5-го конкурса  ====================== */
function showQuizContest(list) {
    qTotal.textContent = list.length;
    currentQuestion = 0;
    showQuizQuestion(list);
}
function showQuizQuestion(list) {
    const q = list[currentQuestion];
    qNum.textContent = currentQuestion + 1;
    qTitle.textContent = q.q;
    answers.innerHTML = '';
    q.a.forEach((txt, idx) => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="radio" name="q" value="${idx}"> ${txt}`;
        label.querySelector('input').addEventListener('change', () => nextQuizQuestion(list));
        answers.appendChild(label);
    });
}
function nextQuizQuestion(list) {
    const sel = +document.querySelector('input[name="q"]:checked').value;
    studentAnswers.push({ contest: currentContest, question: currentQuestion, userAnswer: sel, correct: list[currentQuestion].correct });
    if (sel === list[currentQuestion].correct) totalScore++;
    currentQuestion++;
    currentQuestion < list.length ? showQuizQuestion(list) : nextContest();
}

/* ======================  ПОЛЕ ВВОДА (конкурс 3)  ====================== */
function showInputContest(list) {
    qTotal.textContent = list.length;
    currentQuestion = 0;
    showInputQuestion(list);
}
function showInputQuestion(list) {
    const q = list[currentQuestion];
    qNum.textContent = currentQuestion + 1;
    qTitle.textContent = q.q;
    answers.innerHTML = `
        <input type="text" id="inputAnswer" placeholder="Напишите название ОУ" autocomplete="off">
        <button id="inputSubmit">Ответить</button>`;
    document.getElementById('inputSubmit').addEventListener('click', () => nextInputQuestion(list));
    document.getElementById('inputAnswer').addEventListener('keypress', e => {
        if (e.key === 'Enter') nextInputQuestion(list);
    });
}
function nextInputQuestion(list) {
    const userText = document.getElementById('inputAnswer').value.trim();
    const correct  = list[currentQuestion].correct;
    studentAnswers.push({ contest: currentContest, question: currentQuestion, userAnswer: userText, correct });
    if (userText.toLowerCase() === correct.toLowerCase()) totalScore++;
    currentQuestion++;
    currentQuestion < list.length ? showInputQuestion(list) : nextContest();
}

/* ======================  РЕБУСЫ (конкурс 4)  ====================== */
function showRebusContest(list) {
    qTotal.textContent = list.length;
    currentQuestion = 0;
    showRebusQuestion(list);
}
function showRebusQuestion(list) {
    const q = list[currentQuestion];
    qNum.textContent = currentQuestion + 1;
    qTitle.textContent = 'Разгадайте ребус';
    answers.innerHTML = `
        <img src="${q.img}" alt="ребус" class="rebus-img">
        <input type="text" id="rebusAnswer" placeholder="Ваш ответ" autocomplete="off">
        <button id="rebusSubmit">Ответить</button>`;
    document.getElementById('rebusSubmit').addEventListener('click', () => nextRebusQuestion(list));
    document.getElementById('rebusAnswer').addEventListener('keypress', e => {
        if (e.key === 'Enter') nextRebusQuestion(list);
    });
}
function nextRebusQuestion(list) {
    const userText = document.getElementById('rebusAnswer').value.trim();
    const correct  = list[currentQuestion].correct;
    studentAnswers.push({ contest: currentContest, question: currentQuestion, userAnswer: userText, correct });
    if (userText.toLowerCase() === correct.toLowerCase()) totalScore++;
    currentQuestion++;
    currentQuestion < list.length ? showRebusQuestion(list) : nextContest();
}

/* ======================  МАТЧИНГ (конкурс 2)  ====================== */
const pairColors = [
    '#ffadad','#ffd6a5','#fdffb6','#caffbf','#9bf6ff',
    '#a0c4ff','#bdb2ff','#ffc6ff','#fffffc','#d0d0d0'
];
let studentPairs = [];
let usedNames = new Set(), usedLogos = new Set();
let currentColor = 0;

function initMatch() {
    studentPairs = []; usedNames.clear(); usedLogos.clear(); currentColor = 0;
    const namesCol = document.getElementById('namesCol');
    const logosCol = document.getElementById('logosCol');
    namesCol.innerHTML = ''; logosCol.innerHTML = '';
    const shuffledLogos = [...matchData].sort(() => Math.random() - 0.5);

    matchData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'match-item'; div.dataset.id = item.id;
        div.textContent = item.name;
        div.addEventListener('click', () => selectName(div));
        namesCol.appendChild(div);
    });
    shuffledLogos.forEach(item => {
        const div = document.createElement('div');
        div.className = 'match-logo'; div.dataset.id = item.id;
        div.innerHTML = `<img src="${item.logo}" alt="logo">`;
        div.addEventListener('click', () => selectLogo(div));
        logosCol.appendChild(div);
    });
    document.getElementById('matchDone').addEventListener('click', checkMatch);
}
function selectLogo(el) {
    if (usedLogos.has(el.dataset.id)) { removePairByLogo(el.dataset.id); return; }
    document.querySelectorAll('.match-logo').forEach(x => x.classList.remove('selected'));
    el.classList.add('selected'); selectedPair.logo = el; tryPair();
}
function selectName(el) {
    if (usedNames.has(el.dataset.id)) { removePairByName(el.dataset.id); return; }
    document.querySelectorAll('.match-item').forEach(x => x.classList.remove('selected'));
    el.classList.add('selected'); selectedPair.name = el; tryPair();
}
function tryPair() {
    if (!selectedPair.logo || !selectedPair.name) return;
    const nameId = selectedPair.name.dataset.id;
    const logoId = selectedPair.logo.dataset.id;
    studentPairs = studentPairs.filter(p => p.nameId !== nameId && p.logoId !== logoId);
    const color = pairColors[currentColor++ % pairColors.length];
    studentPairs.push({ nameId, logoId, color });
    [selectedPair.name, selectedPair.logo].forEach(el => {
        el.style.background = color; el.style.borderColor = color;
    });
    usedNames.add(nameId); usedLogos.add(logoId);
    selectedPair = { logo: null, name: null };
}
function removePairByName(nameId) {
    const pair = studentPairs.find(p => p.nameId === nameId);
    if (!pair) return;
    const [nameEl, logoEl] = [
        document.querySelector(`.match-item[data-id="${nameId}"]`),
        document.querySelector(`.match-logo[data-id="${pair.logoId}"]`)
    ];
    [nameEl, logoEl].forEach(el => { el.style.background = ''; el.style.borderColor = ''; });
    usedNames.delete(nameId); usedLogos.delete(pair.logoId);
    studentPairs = studentPairs.filter(p => p.nameId !== nameId);
}
function removePairByLogo(logoId) {
    const pair = studentPairs.find(p => p.logoId === logoId);
    if (!pair) return;
    const [logoEl, nameEl] = [
        document.querySelector(`.match-logo[data-id="${logoId}"]`),
        document.querySelector(`.match-item[data-id="${pair.nameId}"]`)
    ];
    [logoEl, nameEl].forEach(el => { el.style.background = ''; el.style.borderColor = ''; });
    usedLogos.delete(logoId); usedNames.delete(pair.nameId);
    studentPairs = studentPairs.filter(p => p.logoId !== logoId);
}
function checkMatch() {
    document.querySelectorAll('.match-item, .match-logo').forEach(el => {
        el.classList.remove('ok', 'bad', 'selected');
        el.style.background = ''; el.style.borderColor = '';
    });
    let correctCount = 0;
    studentPairs.forEach(({ nameId, logoId, color }) => {
        const ok = nameId === logoId;
        const nameEl = document.querySelector(`.match-item[data-id="${nameId}"]`);
        const logoEl = document.querySelector(`.match-logo[data-id="${logoId}"]`);
        [nameEl, logoEl].forEach(el => {
            el.style.background = color; el.style.borderColor = color;
            el.classList.add(ok ? 'ok' : 'bad');
        });
        if (ok) correctCount++;
    });
    const total = matchData.length;
    document.getElementById('matchResult').textContent = `Вы соотнесли ${correctCount} из ${total} пар (ошибки красным).`;
    document.getElementById('matchResult').classList.remove('hidden');
    studentAnswers.push({ contest: 2, pairs: [...studentPairs], correctCount, total });
    totalScore += correctCount;
    setTimeout(() => nextContest(), 2500);
}

/* ======================  ПЕРЕХОД К СЛЕДУЮЩЕМУ КОНКУРСУ  ====================== */
function nextContest() {
    currentContest++;
    currentContest > 5 ? showFinalResult() : loadContest();
}

/* ======================  ИТОГОВЫЙ ЭКРАН  ====================== */
function showFinalResult() {
    const totalMax  = (userCourse === '1-2') ? 34 : 46;
    const percent   = Math.round((totalScore / totalMax) * 100) || 0;

    dFio.textContent   = userFio;
    dGroup.textContent = userGroup;
    dScore.textContent = `${percent} % (${totalScore} / ${totalMax})`;

    let title = '', text = '';
    if (percent >= 86) {
        title = 'Поздравляем! 🥳';
        text  = 'Вы показали выдающийся результат! Ваши знания на высшем уровне. Продолжайте в том же духе!';
    } else if (percent >= 71) {
        title = 'Отличная работа! 🎉';
        text  = 'Вы справились на более чем достойном уровне. Есть небольшие области для улучшения, но в целом — впечатляющий результат!';
    } else if (percent >= 51) {
        title = 'Хороший старт! 👍';
        text  = 'Вы показали неплохие знания, но есть возможность для роста. Продолжайте учиться и совершенствоваться!';
    } else {
        title = 'Не отчаивайтесь! 😔';
        text  = 'Это всего лишь один тест. Используйте его как возможность для обучения и улучшения своих знаний. Всё возможно!';
    }
    rTitle.textContent = title;
    rText.textContent  = text;

    testContainer.classList.add('hidden');
    matchContest.classList.add('hidden');
    stubContest.classList.add('hidden');
    resultBox.classList.remove('hidden');
}

/* ======================  КОНЕЦ DOMContentLoaded  ====================== */
}); // закрываем document.addEventListener('DOMContentLoaded', () => {
