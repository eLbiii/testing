/* ----------  СМЕНА ТЕМЫ  ---------- */
const toggle = document.getElementById('themeToggle');
const html = document.documentElement;
(function () {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') html.setAttribute('data-theme', 'dark');
})();
toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

/* ----------  ДАННЫЕ  ---------- */
const matchData = [
    { name: "Северо-кавказский медицинский колледж", logo: "img/SKM.png", id: "skmk" },
    { name: "Ставропольский многопрофильный колледж", logo: "img/SMK.png", id: "smk" },
    { name: "Ставропольский колледж связи имени Героя Советского Союза В.А. Петрова", logo: "img/SKS.png", id: "sks" },
    { name: "Ставропольский региональный многопрофильный колледж", logo: "img/SRMK.png", id: "srmk" },
    { name: "Ставропольский кооперативный техникум", logo: "img/SKT.png", id: "skt" },
    { name: "Ставропольский региональный колледж вычислительной техники и электроники", logo: "img/SRKVT.png", id: "srk" }
];

/* ----------  ПЕРЕМЕННЫЕ  ---------- */
let userFio = '', userGroup = '', userCourse = '';
let currentContest = 1;
let currentQuestion = 0;
let score = 0;
let studentAnswers = []; // все ответы ученика
let selectedPair = { logo: null, name: null };

/* ----------  ФОРМА ВХОДА  ---------- */
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    userFio = fio.value.trim();
    userGroup = group.value.trim();
    userCourse = course.value;
    if (!userFio || !userGroup || !userCourse) return;

    loginForm.classList.add('hidden');
    currentContest = 1;
    loadContest();
});

/* ----------  КОНКУРСЫ  ---------- */
const contests = {
    1: {
        title: "Конкурс 1 – Знатоки истории колледжа",
        questions: [
            {
                q: "Официальной датой создания государственного бюджетного профессионального образовательного учреждения «Ставропольский региональный колледж вычислительной техники и электроники» является…",
                a: ["24 июня 1985 г.", "1 сентября 1993 г.", "23 июня 1986 г."],
                correct: 0
            },
            {
                q: "Кто был первым директором образовательной организации",
                a: ["Агаджанов Георгий Георгиевич", "Аблеев Феликс Мусеевич", "Тащенко Марина Ростиславовна"],
                correct: 1
            },
            {
                q: "По какому адресу располагается наш колледж?",
                a: ["ул. Доваторцев, 66Г", "ул. Доваторцев, 66", "2-й Юго-Западный проезд, 2В"],
                correct: 1
            },
            {
                q: "Выберите ВСЕ специальности нашего учебного заведения:",
                a: ["Сетевое и системное администрирование",
                    "Информационные системы и программирование",
                    "Разработка электронных устройств и систем",
                    "Кибербезопасность",
                    "Анализ данных и бизнес-аналитика",
                    "Разработка программного обеспечения и игр"],
                correct: [0, 1, 2], // индексы правильных
                type: 'checkbox'
            }
        ]
    },
    2: { title: "Конкурс 2 – Соотнесите эмблемы учебных заведений СПО г. Ставрополя", type: 'match', data: matchData },
    3: {
        title: "Конкурс 3 – Угадай СПО",
        type: 'input',
        questions: [
            { q: "В радиусе 82 м от этого учебного заведения расположены: Государственная инспекция труда в Ставропольском крае, гостиница «Ставрополь», Дворец культуры и спорта. Что это за ОУ?", correct: "Северо-кавказский медицинский колледж" },
            { q: "В радиусе 82 м от этого учебного заведения расположены: ТЦ Лотус, МФЦ предоставления государственных и муниципальных услуг в г. Ставрополе, Строительно-торговая компания Аква Строй. Что это за ОУ?", correct: "Ставропольский многопрофильный колледж" },
            { q: "В радиусе 82 м от этого учебного заведения расположены: Гимназия №30, Поликлиника №7. Что это за ОУ?", correct: "Колледж связи" },
            { q: "В радиусе 82 м от этого учебного заведения расположены: Средняя школа №37, ТЦ \"Союз\", Детский сад №77. Что это за ОУ?", correct: "Ставропольский региональный многопрофильный колледж" },
            { q: "В радиусе 82 м от этого учебного заведения расположены: Центр медицинских комиссий и справок, ЖК \"Александровский парк\", Региональный реабилитационный центр. Что это за ОУ?", correct: "Ставропольский кооперативный техникум" },
            { q: "В радиусе 82 м от этого учебного заведения расположены: ТЦ Космос, Магнит Экстра, Баскетбольная академия им. Дмитрия Соколова. Что это за ОУ?", correct: "СРКВТиЭ" }
        ]
    },
    4: {
        title: "Конкурс 4 – Ребусы",
        type: 'rebus',
        questions: [
            { img: 'img/rebuses/R1.png',  correct: 'адрес' },
            { img: 'img/rebuses/R2.png',  correct: 'браузер' },
            { img: 'img/rebuses/R3.png',  correct: 'клиент' },
            { img: 'img/rebuses/R4.png',  correct: 'логика' },
            { img: 'img/rebuses/R5.png',  correct: 'модель' },
            { img: 'img/rebuses/R6.png',  correct: 'окно' },
            { img: 'img/rebuses/R7.png',  correct: 'пароль' },
            { img: 'img/rebuses/R8.png',  correct: 'проводник' },
            { img: 'img/rebuses/R9.png',  correct: 'программа' },
            { img: 'img/rebuses/R10.png', correct: 'программист' },
            { img: 'img/rebuses/R11.png', correct: 'пуск' },
            { img: 'img/rebuses/R12.png', correct: 'таблица' },
            { img: 'img/rebuses/R13.png', correct: 'ячейка' },
            { img: 'img/rebuses/R14.png', correct: 'адаптер' },
            { img: 'img/rebuses/R15.png', correct: 'администратор' },
            { img: 'img/rebuses/R16.png', correct: 'конфигурация' },
            { img: 'img/rebuses/R17.png', correct: 'драйвер' },
            { img: 'img/rebuses/R18.png', correct: 'терминал' },
            { img: 'img/rebuses/R19.png', correct: 'дистрибутив' },
            { img: 'img/rebuses/R20.png', correct: 'плата' },
            { img: 'img/rebuses/R21.png', correct: 'сортировка' },
            { img: 'img/rebuses/R22.png', correct: 'команда' },
            { img: 'img/rebuses/R23.png', correct: 'интерфейс' },
            { img: 'img/rebuses/R24.png', correct: 'алгоритм' },
            { img: 'img/rebuses/R25.png', correct: 'диаграмма' },
            { img: 'img/rebuses/R26.png', correct: 'запрос' },
            { img: 'img/rebuses/R27.png', correct: 'протокол' },
            { img: 'img/rebuses/R28.png', correct: 'модем' },
            { img: 'img/rebuses/R29.png', correct: 'каталог' },
            { img: 'img/rebuses/R30.png', correct: 'провайдер' }
        ]
    },
    5: {
        title: "Конкурс 5 – Ответь на вопросы",
        type: 'quiz',
        directions: {
            "1-2": [
                {
                    name: "Устройство компьютера (1-2 курс)",
                    questions: [
                        { q: "Компьютер это -", a: ["устройство для обработки аналоговых сигналов", "устройство для хранения информации любого вида", "многофункциональное электронное устройство для работы с информацией", "электронное вычислительное устройство для обработки чисел"], correct: 3 },
                        { q: "Производительность работы компьютера (быстрота выполнения операций) зависится от:", a: ["тактовый частоты процессора", "объема обрабатываемой информации", "быстроты нажатия на клавиши", "размера экрана монитора"], correct: 1 },
                        { q: "Система взаимосвязанных технических устройств, выполняющих ввод, хранение, обработку и вывод информации называется:", a: ["программное обеспечение", "компьютерное обеспечение", "аппаратное обеспечение", "системное обеспечение"], correct: 3 },
                        { q: "Устройство для визуального воспроизведения символьной и графической информации -", a: ["процессор", "клавиатура", "сканер", "монитор"], correct: 4 },
                        { q: "Какое устройство не находится в системном блоке?", a: ["видеокарта", "процессор", "сканер", "жёсткий диск", "сетевая карта"], correct: 3 },
                        { q: "Дисковод - это устройство для", a: ["чтения/записи данных с внешнего носителя", "хранения команд исполняемой программы", "долговременного хранения информации", "обработки команд исполняемой программы"], correct: 1 },
                        { q: "Какое устройство не является периферийным?", a: ["жесткий диск", "принтер", "сканер", "модем", "web-камера"], correct: 1 },
                        { q: "Принтер с чернильной печатающей головкой, которая под давлением выбрасывает чернила из ряда мельчайших отверстий на бумагу, называется", a: ["сублимационный", "матричный", "струйный", "жёсткий", "лазерный"], correct: 3 },
                        { q: "Программа - это последовательность…", a: ["команд для компьютера", "электрических импульсов", "нулей и единиц", "текстовых знаков"], correct: 1 },
                        { q: "При выключении компьютера вся информация теряется …", a: ["на гибком диске", "на жестком диске", "на CD-ROM диске", "в оперативной памяти"], correct: 4 },
                        { q: "Для долговременного хранения пользовательской информации служит:", a: ["внешняя память", "процессор", "дисковод", "оперативная память"], correct: 1 },
                        { q: "Перед отключением компьютера информацию можно сохранить:", a: ["в оперативной памяти", "во внешней памяти", "в регистрах процессора", "на дисководе"], correct: 2 },
                        { q: "Наименьшая адресуемая часть памяти компьютера:", a: ["байт", "бит", "файл", "машинное слово"], correct: 2 },
                        { q: "Магнитный диск предназначен для:", a: ["обработки информации", "хранения информации", "ввода информации", "вывода информации"], correct: 2 },
                        { q: "Где хранится выполняемая в данный момент программа и обрабатываемые ею данные?", a: ["во внешней памяти", "в оперативной памяти", "в процессоре", "на устройстве ввода"], correct: 2 },
                        { q: "Компакт-диск, предназначенный для многократной записи новой информации называется:", a: ["CD-ROM", "CD-RW", "DVD-ROM", "CD-R"], correct: 2 },
                        { q: "Программа – это…", a: ["обрабатываемая информация, представленная в памяти компьютера в специальной форме", "электронная схема, управляющая работой внешнего устройства", "описание последовательности действий, которые должен выполнить компьютер для решения поставленной задачи обработки данных", "программно управляемое устройство для выполнения любых видов работы с информацией"], correct: 3 },
                        { q: "Информация называется данными, если она представлена…", a: ["в виде текста из учебника", "в числовом виде", "в двоичном компьютерном коде", "в виде команд для компьютера"], correct: 3 }
                    ]
                }
            ],
            "3-4": [
                {
                    name: "Сетевое и системное администрирование (3-4 курс)",
                    questions: [
                        { q: "Какой команды в командной строке (cmd) нет?", a: ["ping", "ipconfig", "format", "reboot"], correct: 4 },
                        { q: "Что такое IP-адрес?", a: ["Адрес сайта в интернете", "Уникальный числовой идентификатор устройства в сети", "Пароль для Wi-Fi", "Протокол передачи данных"], correct: 2 },
                        { q: "Вам дали IP-адрес 192.168.1.45 и маску подсети 255.255.255.0. Чему равен номер сети?", a: ["192.168.1.0", "192.168.0.0", "192.168.1.45", "255.255.255.0"], correct: 1 },
                        { q: "Что такое маска подсети и для чего она нужна?", a: ["Это фильтр для спама в почте", "Это настройка, которая определяет, какая часть IP-адреса относится к сети, а какая — к конкретному устройству", "Это пароль для администратора сети", "Это специальный адрес для выхода в интернет"], correct: 2 },
                        { q: "Ситуация: Пользователь жалуется, что не может зайти на сайт yandex.ru, но при этом доступ к другим сайтам есть. Ваши действия? Выберите самый логичный первый шаг.", a: ["Перезагрузить маршрутизатор", "Попросить пользователя пропинговать сайт командой ping yandex.ru", "Проверить настройки DNS на компьютере пользователя", "Сразу позвонить провайдеру"], correct: 1 }
                    ]
                },
                {
                    name: "Программирование (3-4 курс)",
                    questions: [
                        { q: "Что выведет этот код на Python? print(2 + 2 * 2)", a: ["6", "8", "Ошибку", "222"], correct: 1 },
                        { q: "Для чего в программировании нужен цикл?", a: ["Для красивого оформления кода", "Для многократного повторения одних и тех же действий", "Для подключения к интернету", "Для хранения данных"], correct: 2 },
                        { q: "Найдите ошибку в строке кода: if user_age = 18:", a: ["Не хватает точки с запятой", "Неправильный оператор сравнения (нужно ==)", "Не объявлена переменная user_age", "Ошибки нет"], correct: 2 },
                        { q: "Что такое переменная в программировании?", a: ["Это значение, которое не может меняться", "Это контейнер с именем, в котором хранятся данные, и эти данные можно изменять", "Это строка текста в программе", "Это ошибка в коде"], correct: 2 },
                        { q: "Дан код:\n\nnumbers = [1, 2, 3, 4, 5]\ntotal = 0\nfor num in numbers:\n    total = total + num\nprint(total)\n\nЧто выведет этот код?", a: ["15", "12345", "0", "Ошибку"], correct: 1 }
                    ]
                },
                {
                    name: "Веб-разработка (3-4 курс)",
                    questions: [
                        { q: "Какой тег отвечает за создание ссылки на другой сайт?", a: ["<link>", "<a>", "<href>", "<url>"], correct: 2 },
                        { q: "Для чего используется CSS?", a: ["Для программирования логики сайта", "Для хранения данных пользователей", "Для оформления и стилизации внешнего вида сайта", "Для создания структуры сайта"], correct: 3 },
                        { q: "Какого цвета будет текст на кнопке?\n<button style=\"color: white; background-color: blue;\">Купить</button>", a: ["Синего", "Белого", "Черного", "Красного"], correct: 2 },
                        { q: "Для чего нужен JavaScript в веб-разработке?", a: ["Для описания структуры веб-страницы", "Для стилизации внешнего вида страницы", "Для добавления интерактивности (анимации, реакция на действия пользователя)", "Для хранения данных на сервере"], correct: 3 },
                        { q: "Как сделать так, чтобы при нажатии на кнопку с id=\"myButton\" на экране появлялось сообщение \"Привет!\"?", a: ["document.getElementById(\"myButton\").style.display = \"Привет!\";", "document.getElementById(\"myButton\").onclick = function() { alert(\"Привет!\"); };", "<button id=\"myButton\" onshow=\"Привет!\">", "#myButton { content: \"Привет!\"; }"], correct: 2 }
                    ]
                },
                {
                    name: "Специалист по информационным системам (3-4 курс)",
                    questions: [
                        { q: "Что такое база данных (БД)?", a: ["Стол для работы с информацией", "Программа для создания презентаций", "Упорядоченный набор данных, хранящихся в компьютере", "Системный блок компьютера"], correct: 3 },
                        { q: "Что чаще всего означает значок \"шестеренка\" 🛠 в интерфейсе программы?", a: ["Выход", "Справка", "Настройки", "Домой"], correct: 3 },
                        { q: "Компания хранит данные о клиентах в Excel-таблице. Это база данных?", a: ["Да, это полноценная база данных", "Нет, это просто электронная таблица", "Это реляционная база данных", "Это не база данных, потому что там нет формул"], correct: 2 },
                        { q: "Что такое CRM-система?", a: ["Система для управления компьютерными сетями", "Система для управления взаимоотношениями с клиентами", "Система для создания веб-сайтов", "Система для программирования"], correct: 2 },
                        { q: "В компании путаница: отдел продаж не видит, какие заказы уже выполнены, а склад не знает, какие заказы новые. Какое типовое программное решение может помочь?", a: ["Установить новую операционную систему на все компьютеры", "Купить компьютер помощнее", "Внедрить ERP- или CRM-систему, которая объединит данные всех отделов", "Купить всем сотрудникам новые телефоны"], correct: 3 }
                    ]
                },
                {
                    name: "Радиоаппаратостроение (3-4 курс)",
                    questions: [
                        { q: "Что измеряют в Амперах (А)?", a: ["Напряжение", "Сопротивление", "Силу тока", "Мощность"], correct: 3 },
                        { q: "Для чего нужен резистор в электрической цепи?", a: ["Для усиления сигнала", "Для хранения электрического заряда", "Для ограничения тока", "Для выпрямления тока"], correct: 3 },
                        { q: "Посмотрите на схему. Что нужно сделать, чтобы лампочка загорелась? (Схема: батарейка, провод, выключатель, лампочка. Выключатель разомкнут.)", a: ["Увеличить напряжение", "Замкнуть выключатель", "Добавить еще одну батарейку", "Перевернуть батарейку"], correct: 2 },
                        { q: "Что делает транзистор в большинстве электронных схем?", a: ["Создает магнитное поле", "Усиливает или переключает электрические сигналы", "Измеряет температуру", "Хранит электрический заряд"], correct: 2 },
                        { q: "В устройстве перегорел предохранитель. Какой самый важный принцип нужно соблюсти при его замене?", a: ["Вставить предохранитель большего номинала", "Вставить предохранитель такого же номинала", "Заменить предохранитель кусочком проволоки", "Перевернуть предохранитель другой стороной"], correct: 2 }
                    ]
                },
                {
                    name: "Администраторы баз данных (3-4 курс)",
                    questions: [
                        { q: "На каком языке \"разговаривают\" с большинством баз данных?", a: ["Java", "SQL", "C++", "Python"], correct: 2 },
                        { q: "Что такое запрос (query) к базе данных?", a: ["Вопрос к системному администратору", "Просьба предоставить или изменить какие-либо данные", "Жалоба на работу системы", "Новый компьютер для базы данных"], correct: 2 },
                        { q: "Какая команда отвечает за ВЫБОРКУ данных из таблицы?", a: ["DELETE", "INSERT", "SELECT", "UPDATE"], correct: 3 },
                        { q: "Что такое первичный ключ (Primary Key) в таблице базы данных?", a: ["Самый важной столбец с данными", "Столбец, который не может быть пустым", "Столбец, значения которого уникально идентифицируют каждую запись в таблице", "Пароль для доступа к базе данных"], correct: 3 },
                        { q: "Дан запрос:\n\nSELECT * FROM Users WHERE City = 'Москва' ORDER BY LastName;\n\nЧто он делает?", a: ["Удаляет всех пользователей из Москвы", "Выбирает всех пользователей из Москвы и сортирует их по фамилии", "Добавляет нового пользователя из Москвы", "Считает количество пользователей в Москве"], correct: 2 }
                    ]
                }
            ]
        }
    }
};

/* ----------  ОСНОВНОЕ ПЕРЕКЛЮЧЕНИЕ КОНКУРСОВ  ---------- */
function loadContest() {
    const contest = contests[currentContest];
    if (!contest) { showFinalResult(); return; }

    if (contest.type === 'match') {
        testContainer.classList.add('hidden');
        stubContest.classList.add('hidden');
        initMatch();
        matchContest.classList.remove('hidden');
    } else if (contest.type === 'input') {
        testContainer.classList.remove('hidden');
        matchContest.classList.add('hidden');
        stubContest.classList.add('hidden');
        showInputContest(contest.questions);
    } else if (contest.type === 'rebus') {
        testContainer.classList.remove('hidden');
        matchContest.classList.add('hidden');
        stubContest.classList.add('hidden');
        showRebusContest(contest.questions);
    } else if (contest.type === 'quiz' && contest.directions) {
        // 5-й конкурс – выбираем направления по курсу
        const dirs = contest.directions[userCourse];
        if (!dirs) { nextContest(); return; }
        testContainer.classList.remove('hidden');
        matchContest.classList.add('hidden');
        stubContest.classList.add('hidden');
        // объединяем все вопросы выбранного курса в один массив
        const questions = dirs.flatMap(d => d.questions);
        qTotal.textContent = questions.length;
        currentQuestion = 0;
        score = 0;
        showQuizContest(questions);
    } else if (contest.type === 'stub') {
        testContainer.classList.add('hidden');
        matchContest.classList.add('hidden');
        stubContest.classList.remove('hidden');
        document.getElementById('stubNum').textContent = currentContest;
        setTimeout(() => nextContest(), 1000);
    } else { // обычный тест
        matchContest.classList.add('hidden');
        stubContest.classList.add('hidden');
        testContainer.classList.remove('hidden');
        const questions = contest.questions || contest.variants?.[userCourse] || [];
        qTotal.textContent = questions.length;
        currentQuestion = 0;
        score = 0;
        showQuestion(questions);
    }
}

/* ----------  ОБЫЧНЫЙ ТЕСТ (радиокнопки)  ---------- */
function showQuestion(questions) {
    const q = questions[currentQuestion];
    qNum.textContent = currentQuestion + 1;
    qTitle.textContent = q.q;
    answers.innerHTML = '';

    if (q.type === 'checkbox') {
        // множественный выбор
        q.a.forEach((txt, idx) => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" name="q" value="${idx}"> ${txt}`;
            answers.appendChild(label);
        });
        const btn = document.createElement('button');
        btn.textContent = 'Ответить';
        btn.onclick = () => nextCheckboxQuestion(questions);
        answers.appendChild(btn);
    } else {
        // одиночный выбор
        q.a.forEach((txt, idx) => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="radio" name="q" value="${idx}"> ${txt}`;
            label.querySelector('input').addEventListener('change', () => nextRadioQuestion(questions));
            answers.appendChild(label);
        });
    }
}

function nextRadioQuestion(questions) {
    const selected = parseInt(document.querySelector('input[name="q"]:checked').value);
    studentAnswers.push({ contest: currentContest, question: currentQuestion, userAnswer: selected, correct: questions[currentQuestion].correct });
    if (selected === questions[currentQuestion].correct) score++;
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion(questions);
    } else {
        nextContest();
    }
}

function nextCheckboxQuestion(questions) {
    const checked = Array.from(document.querySelectorAll('input[name="q"]:checked')).map(ch => parseInt(ch.value));
    const correct = questions[currentQuestion].correct; // массив индексов
    const isPerfect = checked.length === correct.length && correct.every(i => checked.includes(i));
    studentAnswers.push({ contest: currentContest, question: currentQuestion, userAnswer: checked, correct });

    if (isPerfect) score++;
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion(questions);
    } else {
        nextContest();
    }
}

/* ----------  КВИЗ-РАДИОКНОПКИ (5-й конкурс, 1-2 и 3-4 курс)  ---------- */
function showQuizContest(questions) {
    qTotal.textContent = questions.length;
    currentQuestion = 0;
    score = 0;
    showQuizQuestion(questions);
}

function showQuizQuestion(questions) {
    const q = questions[currentQuestion];
    qNum.textContent = currentQuestion + 1;
    qTitle.textContent = q.q;
    answers.innerHTML = '';

    q.a.forEach((txt, idx) => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="radio" name="q" value="${idx}"> ${txt}`;
        label.querySelector('input').addEventListener('change', () => nextQuizQuestion(questions));
        answers.appendChild(label);
    });
}

function nextQuizQuestion(questions) {
    const selected = parseInt(document.querySelector('input[name="q"]:checked').value);
    studentAnswers.push({ contest: currentContest, question: currentQuestion, userAnswer: selected, correct: questions[currentQuestion].correct });
    if (selected === questions[currentQuestion].correct) score++;
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuizQuestion(questions);
    } else {
        nextContest(); // идём дальше без диплома
    }
}

/* ----------  ПОЛЕ ВВОДА (конкурс 3)  ---------- */
function showInputContest(questions) {
    qTotal.textContent = questions.length;
    currentQuestion = 0;
    score = 0;
    showInputQuestion(questions);
}

function showInputQuestion(questions) {
    const q = questions[currentQuestion];
    qNum.textContent = currentQuestion + 1;
    qTitle.textContent = q.q;

    answers.innerHTML = `
        <input type="text" id="inputAnswer" placeholder="Напишите название ОУ" autocomplete="off">
        <button id="inputSubmit">Ответить</button>
    `;

    document.getElementById('inputSubmit').addEventListener('click', () => nextInputQuestion(questions));
    document.getElementById('inputAnswer').addEventListener('keypress', e => {
        if (e.key === 'Enter') nextInputQuestion(questions);
    });
}

function nextInputQuestion(questions) {
    const userText = document.getElementById('inputAnswer').value.trim();
    const correct = questions[currentQuestion].correct;
    studentAnswers.push({ contest: currentContest, question: currentQuestion, userAnswer: userText, correct });

    if (userText.toLowerCase() === correct.toLowerCase()) score++;
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showInputQuestion(questions);
    } else {
        nextContest();
    }
}

/* ----------  РЕБУСЫ (конкурс 4)  ---------- */
function showRebusContest(questions) {
    qTotal.textContent = questions.length;
    currentQuestion = 0;
    score = 0;
    showRebusQuestion(questions);
}

function showRebusQuestion(questions) {
    const q = questions[currentQuestion];
    qNum.textContent = currentQuestion + 1;
    qTitle.textContent = 'Разгадайте ребус';

    // описание только перед ПЕРВЫМ ребусом
    if (currentQuestion === 0) {
        qTitle.insertAdjacentHTML('afterend', `
        `);
    }

    // картинка
    answers.innerHTML = `
        <img src="${q.img}" alt="ребус" class="rebus-img">
        <input type="text" id="rebusAnswer" placeholder="Ваш ответ" autocomplete="off">
        <button id="rebusSubmit">Ответить</button>
    `;

    document.getElementById('rebusSubmit').addEventListener('click', () => nextRebusQuestion(questions));
    document.getElementById('rebusAnswer').addEventListener('keypress', e => {
        if (e.key === 'Enter') nextRebusQuestion(questions);
    });
}

function nextRebusQuestion(questions) {
    const userText = document.getElementById('rebusAnswer').value.trim();
    const correct = questions[currentQuestion].correct;
    studentAnswers.push({ contest: currentContest, question: currentQuestion, userAnswer: userText, correct });

    if (userText.toLowerCase() === correct.toLowerCase()) score++;
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showRebusQuestion(questions);
    } else {
        nextContest();
    }
}

/* ----------  МАТЧИНГ (цветные пары, отмена, проверка в конце)  ---------- */
const pairColors = [
    '#ffadad','#ffd6a5','#fdffb6','#caffbf','#9bf6ff',
    '#a0c4ff','#bdb2ff','#ffc6ff','#fffffc','#d0d0d0'
];

let studentPairs = [];
let usedNames = new Set();
let usedLogos  = new Set();
let currentColor = 0;

function initMatch() {
    const namesCol = document.getElementById('namesCol');
    const logosCol = document.getElementById('logosCol');
    namesCol.innerHTML = '';
    logosCol.innerHTML = '';

    studentPairs = [];
    usedNames.clear();
    usedLogos.clear();
    currentColor = 0;

    const shuffledLogos = [...matchData].sort(() => Math.random() - 0.5);

    matchData.forEach(item => {
        const nameDiv = document.createElement('div');
        nameDiv.className = 'match-item';
        nameDiv.dataset.id = item.id;
        nameDiv.textContent = item.name;
        nameDiv.addEventListener('click', () => selectName(nameDiv));
        namesCol.appendChild(nameDiv);
    });

    shuffledLogos.forEach(item => {
        const logoDiv = document.createElement('div');
        logoDiv.className = 'match-logo';
        logoDiv.dataset.id = item.id;
        logoDiv.innerHTML = `<img src="${item.logo}" alt="logo">`;
        logoDiv.addEventListener('click', () => selectLogo(logoDiv));
        logosCol.appendChild(logoDiv);
    });

    document.getElementById('matchDone').addEventListener('click', checkMatch);
}

function selectLogo(el) {
    if (usedLogos.has(el.dataset.id)) { removePairByLogo(el.dataset.id); return; }
    document.querySelectorAll('.match-logo').forEach(x => x.classList.remove('selected'));
    el.classList.add('selected');
    selectedPair.logo = el;
    tryPair();
}
function selectName(el) {
    if (usedNames.has(el.dataset.id)) { removePairByName(el.dataset.id); return; }
    document.querySelectorAll('.match-item').forEach(x => x.classList.remove('selected'));
    el.classList.add('selected');
    selectedPair.name = el;
    tryPair();
}
function tryPair() {
    if (!selectedPair.logo || !selectedPair.name) return;
    const nameId = selectedPair.name.dataset.id;
    const logoId = selectedPair.logo.dataset.id;

    studentPairs = studentPairs.filter(p => p.nameId !== nameId && p.logoId !== logoId);

    const color = pairColors[currentColor % pairColors.length];
    currentColor++;

    studentPairs.push({ nameId, logoId, color });

    [selectedPair.name, selectedPair.logo].forEach(el => {
        el.style.background = color;
        el.style.borderColor = color;
    });

    usedNames.add(nameId);
    usedLogos.add(logoId);

    selectedPair = { logo: null, name: null };
}
function removePairByName(nameId) {
    const pair = studentPairs.find(p => p.nameId === nameId);
    if (!pair) return;
    const [nameEl, logoEl] = [
        document.querySelector(`.match-item[data-id="${nameId}"]`),
        document.querySelector(`.match-logo[data-id="${pair.logoId}"]`)
    ];
    [nameEl, logoEl].forEach(el => {
        el.style.background = '';
        el.style.borderColor = '';
    });
    usedNames.delete(nameId);
    usedLogos.delete(pair.logoId);
    studentPairs = studentPairs.filter(p => p.nameId !== nameId);
}
function removePairByLogo(logoId) {
    const pair = studentPairs.find(p => p.logoId === logoId);
    if (!pair) return;
    const [logoEl, nameEl] = [
        document.querySelector(`.match-logo[data-id="${logoId}"]`),
        document.querySelector(`.match-item[data-id="${pair.nameId}"]`)
    ];
    [logoEl, nameEl].forEach(el => {
        el.style.background = '';
        el.style.borderColor = '';
    });
    usedLogos.delete(logoId);
    usedNames.delete(pair.nameId);
    studentPairs = studentPairs.filter(p => p.logoId !== logoId);
}
function checkMatch() {
    document.querySelectorAll('.match-item, .match-logo').forEach(el => {
        el.classList.remove('ok', 'bad', 'selected');
        el.style.background = '';
        el.style.borderColor = '';
    });

    let correctCount = 0;
    studentPairs.forEach(({ nameId, logoId, color }) => {
        const isOk = nameId === logoId;
        const nameEl = document.querySelector(`.match-item[data-id="${nameId}"]`);
        const logoEl = document.querySelector(`.match-logo[data-id="${logoId}"]`);
        [nameEl, logoEl].forEach(el => {
            el.style.background = color;
            el.style.borderColor = color;
            el.classList.add(isOk ? 'ok' : 'bad');
        });
        if (isOk) correctCount++;
    });

    const total = matchData.length;
    document.getElementById('matchResult').textContent = `Вы соотнеси ${correctCount} из ${total} пар (ошибки красным).`;
    document.getElementById('matchResult').classList.remove('hidden');

    studentAnswers.push({ contest: 2, pairs: [...studentPairs], correctCount, total });

    setTimeout(() => nextContest(), 2500);
}

/* ----------  ПЕРЕХОД МЕЖДУ КОНКУРСАМИ  ---------- */
function nextContest() {
    currentContest++;
    if (currentContest > 5) {
        showFinalResult();
    } else {
        loadContest();
    }
}

/* ----------  ИТОГОВАЯ ГРАМОТА (после 5-го)  ---------- */
function showFinalResult() {
    const totalQuestions = 46;          // всего вопросов в любом случае
    const percent = Math.round((score / totalQuestions) * 100) || 0;

    dFio.textContent = userFio;
    dGroup.textContent = userGroup;
    dScore.textContent = `${percent} % (${score} / ${totalQuestions})`;

    let title = '', text = '';
    if (percent >= 86) {
        title = 'Поздравляем! 🥳';
        text = 'Вы показали выдающийся результат! Ваши знания на высшем уровне. Продолжайте в том же духе!';
    } else if (percent >= 71) {
        title = 'Отличная работа! 🎉';
        text = 'Вы справились на более чем достойном уровне. Есть небольшие области для улучшения, но в целом — впечатляющий результат!';
    } else if (percent >= 51) {
        title = 'Хороший старт! 👍';
        text = 'Вы показали неплохие знания, но есть возможность для роста. Продолжайте учиться и совершенствоваться!';
    } else {
        title = 'Не отчаивайтесь! 😔';
        text = 'Это всего лишь один тест. Используйте его как возможность для обучения и улучшения своих знаний. Всё возможно!';
    }
    rTitle.textContent = title;
    rText.textContent = text;

    testContainer.classList.add('hidden');
    matchContest.classList.add('hidden');
    stubContest.classList.add('hidden');
    resultBox.classList.remove('hidden');
}

