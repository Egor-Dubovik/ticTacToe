const gameBoard = document.querySelector('.game__board');
const boardCells = document.querySelectorAll('.board__cell');
const infoMove = document.querySelector('.info__move span');
const infoMoveBox = document.querySelector('.info__move');
const menuBtn = document.querySelector('.info__menu-btn');
const menuGame = document.querySelector('.info__menu');
const rivalBox = document.querySelector('.menu__rival-btns');
const rivalPc = document.getElementById('PC');
const rivalPr = document.getElementById('PR');
const rivalBtns = document.querySelectorAll('.menu__rival-btn');
const closeBtn = document.querySelector('.menu__close-btn');
const scoreX = document.getElementById('score-X');
const scoreO = document.getElementById('score-O');
const scoreDraw = document.getElementById('score-draw');
const moveBtnsBox = document.querySelector('.menu__move-btns');
const moveBtns = document.querySelectorAll('.menu__move-btn');
const menuMove = document.querySelector('.menu__move');

let move = 0;
let rival = 'PC';
let personMove = false;
let fail = false;
let moveFirst = 'person';

gameBoard.addEventListener('click', displayMove);
rivalPc.addEventListener('click', chooseRivalPc)
rivalPr.addEventListener('click', chooseRivalPr)

moveBtnsBox.addEventListener('click', choiceOfPriority)
//открытие меню при клике
menuBtn.addEventListener('click', () => {
	menuGame.classList.add('active');
});
//закрытие меню
closeBtn.addEventListener('click', () => {
	menuGame.classList.remove('active');
	resetBoard();
});

let simbolsArr = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
const winPositions = [
	[0, 1, 2,],
	[3, 4, 5],
	[6, 7, 8,],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];
//выбор игры с человеком
function chooseRivalPr() {
	rivalPr.classList.add('active');
	rivalPc.classList.remove('active');
	rival = 'person';

	menuMove.classList.add('hidden')
	infoMoveBox.classList.remove('hidden')
	resetScore();
}

// выбор Игры с ПК
function chooseRivalPc() {
	rivalPc.classList.add('active');
	rivalPr.classList.remove('active');
	rival = 'PC'

	menuMove.classList.remove('hidden');
	infoMoveBox.classList.add('hidden');
	resetScore();
}

//выбор очерёдности хода
function choiceOfPriority(e) {
	if (e.target.classList.contains('menu__move-btn')) {
		moveBtns.forEach(btn => btn.classList.remove('active'));
		e.target.classList.add('active');
		resetScore();

		if (e.target.id === 'first') {
			moveFirst = 'person'
		} else {
			moveFirst = 'PC'
		}
	}
}

//отображение хода игрока
function displayMove(e) {
	if (e.target.textContent === '') {
		let simbol = (move % 2 === 0) ? e.target.textContent = 'X' : e.target.textContent = 'O';
		simbolsArr[e.target.dataset.index] = simbol;
		infoMove.textContent = simbol === 'X' ? simbol = 'O' : simbol = 'X';
		move++;
		personMove = false;

		findFail();
		if (rival === 'PC') {
			startGameWithPc();
		}

		checkWiner();
	}
}

//ходит ПК
function startGameWithPc() {
	if (fail === true) {
		takeLosingCell();
	} else {
		generateRandomCell();
	}
	personMove = true;
	move++;
	checkWiner();
}

// занимает пройгрышную позицию, для защиты
function takeLosingCell() {
	for (let i = 0; i < boardCells.length; i++) {
		if (+boardCells[i].dataset.index === findFail()) {
			boardCells[i].textContent = move % 2 === 0 ? 'X' : 'O';
			simbolsArr[i] = move % 2 === 0 ? 'X' : 'O';

			fail = false;
			return;
		}
	}
}
//генерация рандомной клетки
function generateRandomCell() {
	let freeCells = [];
	for (let i = 0; i < simbolsArr.length; i++) {
		if (simbolsArr[i] === ' ') {
			freeCells.push(i)
		}
	}

	let randomNumb = Math.floor(Math.random() * freeCells.length);
	let randomFreeCell = freeCells[randomNumb];

	for (let i = 0; i < boardCells.length; i++) {
		if (
			+boardCells[i].dataset.index === randomFreeCell
		) {
			boardCells[i].textContent = move % 2 === 0 ? 'X' : 'O';;
			simbolsArr[i] = move % 2 === 0 ? 'X' : 'O';;
			return;
		}
	}
}

//вернёт пройгрышную позицию, которую нужно занять
function findFail() {
	for (let i = 0; i < winPositions.length; i++) {
		let winPosition = simbolsArr[winPositions[i][0]] + simbolsArr[winPositions[i][1]] + simbolsArr[winPositions[i][2]];

		switch (winPosition) {
			case 'XX ':
				fail = true;
				return winPositions[i][2];

			case ' XX':
				fail = true;
				return winPositions[i][0];

			case 'X X':
				fail = true;
				return winPositions[i][1];
		}
	}
}

//вспомогательные функции
function checkWiner() {
	for (let i = 0; i < winPositions.length; i++) {
		if (
			simbolsArr[winPositions[i][0]] == 'X' && simbolsArr[winPositions[i][1]] == 'X' && simbolsArr[winPositions[i][2]] == 'X'
		) {
			displayScore('X', winPositions[i][0], winPositions[i][1], winPositions[i][2]);
			return;
		} else if (
			simbolsArr[winPositions[i][0]] == 'O' && simbolsArr[winPositions[i][1]] == 'O' && simbolsArr[winPositions[i][2]] == 'O'
		) {
			displayScore('O', winPositions[i][0], winPositions[i][1], winPositions[i][2]);
			return;
		}
	}

	let count = 0;
	simbolsArr.forEach(cell => (cell !== ' ') ? count++ : count += 0);
	if (count === 9) displayScore('draw');
}
//отображает балы и выйгрышные позиции
function displayScore(winer, p1 = null, p2 = null, p3 = null) {
	if (p1 !== null && p2 !== null && p3 !== null) {
		boardCells[p1].classList.add('win');
		boardCells[p2].classList.add('win');
		boardCells[p3].classList.add('win');
	}

	let figure = document.getElementById(`score-${winer}`);
	figure.textContent = Number(figure.textContent) + 1;
	resetBoard();
}

//сбрасываем счёт
function resetScore() {
	scoreX.textContent = '0';
	scoreO.textContent = '0';
	scoreDraw.textContent = '0';
}

//сброс поля игры
function resetBoard() {
	gameBoard.style.pointerEvents = 'none';
	setTimeout(() => {
		boardCells.forEach(cell => {
			cell.textContent = '';
			cell.classList.remove('win');
			gameBoard.style.pointerEvents = 'auto';
		});
	}, 800)

	simbolsArr = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
	move = 0;
	personMove = false;
	fail = false;

	if (moveFirst === 'PC' && rival === 'PC') {
		setTimeout(() => {
			startGameWithPc();
		}, 800)
	}
	infoMove.textContent = "X";
}
