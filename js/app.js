/*
 * Create a list that holds all of your cards
 */

/*
 * Configurable variables
 */
const config = {
  cardsShowTimeout: 1000, // timeout in milliseconds
  initialRating: 3,
  maxTimeoutMinutes: 2,
};

// Only the unique cards to avoid repetition. We'll generate a new
const uniqueCards = [
  {
    faClass: 'fa fa-diamond',
    isOpen: false,
    isLocked: false,
  },
  {
    faClass: 'fa fa-paper-plane-o',
    isOpen: false,
    isLocked: false,
  },
  {
    faClass: 'fa fa-anchor',
    isOpen: false,
    isLocked: false,
  },
  {
    faClass: 'fa fa-bolt',
    isOpen: false,
    isLocked: false,
  },
  {
    faClass: 'fa fa-cube',
    isOpen: false,
    isLocked: false,
  },
  {
    faClass: 'fa fa-leaf',
    isOpen: false,
    isLocked: false,
  },
  {
    faClass: 'fa fa-bicycle',
    isOpen: false,
    isLocked: false,
  },
  {
    faClass: 'fa fa-bomb',
    isOpen: false,
    isLocked: false,
  },
];

/*
 * Global variables used along the file
 */

// HTML selectors variables
const ulElement = document.querySelector('.deck');
const resetElement = document.querySelector('.restart');
const modalNode = document.querySelector('.result');
const resultTextNode = modalNode.querySelector('.result__text');
const starsNode = document.querySelector('.score-panel .stars');
const movesNode = document.querySelector('.moves');
const timerNode = document.querySelector('.timer');
let interval;
let time;
// Variables needed
let shuffledCards = [];
let openedCards = [];
let cardsClickFreeze = false;
let moves;
let rating;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Have only corrected eslint errors, but didn't change functionality itself
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  const tmpArray = [...array];
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = tmpArray[currentIndex];
    tmpArray[currentIndex] = tmpArray[randomIndex];
    tmpArray[randomIndex] = temporaryValue;
  }

  return tmpArray;
}

// Duplicates the amount of unique cards before passing it into the shuffle function
function shuffleCards(cards) {
  return shuffle(
    // By doing parse of an stringified array, we avoid the elements
    // inside the array to be copied by reference
    [...JSON.parse(JSON.stringify(cards)), ...JSON.parse(JSON.stringify(cards))],
  );
}

/**
 * Displays the result
 *
 * @param {String} res
 */
function displayModal(res) {
  modalNode.classList.add('show');
  resultTextNode.innerHTML = res;
}

/**
 * Hides the result
 */
function hideResult() {
  modalNode.classList.remove('show');
}

/**
 * Generates a list of li elements for cards with corresponding i and
 * adds everything to the ul element
 *
 * @param {Array} cards
 */
function generateCardsHtmlFragment(cards) {
  const fragment = document.createDocumentFragment();

  cards.forEach(card => {
    const li = document.createElement('li');
    const icon = document.createElement('i');
    li.className = 'card';
    icon.className = card.faClass;
    li.appendChild(icon);
    fragment.appendChild(li);
  });

  ulElement.innerHTML = '';
  ulElement.appendChild(fragment);
}

/**
 * Updates timer variable and DOM element
 *
 * @param {*} m
 * @param {*} s
 */
function updateTimerHtml(m, s) {
  // Enforce double digits
  const seconds = s > 9 ? s : `0${s}`;
  const minutes = m > 9 ? s : `0${m}`;
  time = `00:${minutes}:${seconds}`;
  timerNode.innerText = time;
}

/**
 * Resets the moves variable as well as the number of moves in the DOM
 */
function resetMoves() {
  moves = 0;
  movesNode.innerText = moves;
}

/**
 * Stops the timer
 */
function stopTimer() {
  clearInterval(interval);
}

/**
 * Sets the timer variable and the initial value in the DOM
 */
function resetTimer() {
  // Set the starting time
  const countDate = new Date().getTime();

  if (interval) {
    clearInterval(interval);
  }

  timerNode.innerText = '00:00:00';

  // Update the count every second
  interval = setInterval(() => {
    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the count date
    const distance = now - countDate;

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const maxMilliseconds = config.maxTimeoutMinutes * 1000 * 60;

    // Display the result in the element with id="demo"
    updateTimerHtml(minutes, seconds);

    // If the count is bigger than maximum we show a message
    if (distance >= maxMilliseconds) {
      clearInterval(interval);
      displayModal('Time out... Game Over :(<br><a class="restart" href="#">Play Again</a>');
    }
  }, 1000);
}

/**
 * Generates a list of li elements for stars with corresponding i and adds everything to
 * the ul element.
 * Also resets rating as default
 *
 * @param {Number} max
 */
function generateAndResetRating() {
  const fragment = document.createDocumentFragment();

  rating = config.initialRating || 3;

  for (let i = 0; i < rating; i += 1) {
    const li = document.createElement('li');
    const icon = document.createElement('i');
    icon.className = 'fa fa-star';
    li.appendChild(icon);
    fragment.appendChild(li);
  }
  starsNode.innerHTML = '';
  starsNode.appendChild(fragment);
}

/**
 * Initializes the app
 */
function init() {
  shuffledCards = shuffleCards(uniqueCards);
  generateCardsHtmlFragment(shuffledCards);
  resetMoves();
  generateAndResetRating();
  resetTimer();
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you
 *    call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another
 *    function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in
 *      another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's
 *      symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality
 *      in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this
 *      functionality in another function that you call from this one)
 */

/**
 * Updates moves variable and DOM
 *
 */
function updateMoves() {
  moves += 1;

  // Updating moves number
  movesNode.innerText = moves;
}

/**
 * Updates rating variable and DOM
 * Will reduce the rating in 1 for every 4 moves starting from the 4th move
 * So rating will reduce from move 8, and then 12, 16, ... until rating is 0
 */
function updateRating() {
  const starListNodes = starsNode.querySelectorAll('li');
  if (rating === 0 || !(moves > 4 && moves % 4 === 0)) {
    return;
  }

  rating -= 1;

  // Updating stars classes in the DOM
  starListNodes[rating].classList.add('used');
}

/**
 * Freezes card click to prevent user interaction while showing the non matching pair
 *
 * @param {Boolean} flag
 */
function freezeCards(flag) {
  ulElement.classList.toggle('freeze', flag);
  cardsClickFreeze = flag;
}

/**
 * Toggles display card action
 *
 * @param {Object} card
 * @param {HTMLElement} cardNode
 */
function toggleDisplay(card, cardNode) {
  const tmpObj = { ...card };
  cardNode.classList.toggle('show');
  cardNode.classList.toggle('open');
  tmpObj.isOpen = !tmpObj.isOpen;
  return tmpObj;
}

/**
 * Keeps the opened cards in a list of max 2 actively opened card
 *
 * @param {Object} card
 * @returns {Array} The list of opened cards
 */
function addOpenedCard(cards, card) {
  return [].concat(cards, card);
}

/**
 * Checks for matching pair of cards
 *
 * @param {Object} c1 Card to match with
 * @param {Object} c2 Card to match with
 * @returns {Boolean} The result of the matching check
 */
function isMatchingPair(c1, c2) {
  return c1.faClass === c2.faClass;
}

/**
 * Locks card list (adds isLocked property to provided card list)
 *
 * @param {Array} list Opened cards list
 * @returns {Array} processed list of cards
 */
function addLockedCards(list) {
  const tmpArr = [...list];
  return tmpArr.map(c => {
    c.isLocked = true;
    c.isOpen = false;

    return c;
  });
}

/**
 * Resets shuffledCards array from open cards
 *
 * @param {Array} list shuffledCards list to be processed
 * @returns {Array} processed shuffledCards
 */
function resetOpenCardsList(list) {
  const tmpArray = [...list];
  return tmpArray.map(c => {
    c.isOpen = false;

    return c;
  });
}

/**
 * Flips back cards in the DOM
 *
 * @param {Array} list shuffledCards list to be processed
 * @returns {Array} processed shuffledCards
 */
function flipBackOpenCards(list) {
  openedCards = [];
  const openedCardList = ulElement.querySelectorAll('.card.open');
  openedCardList.forEach(card => {
    const index = [...card.parentNode.children].indexOf(card);
    if (list[index].isLocked) {
      return;
    }
    card.classList.toggle('show');
    card.classList.toggle('open');
  });
}

/**
 * Counts the amount of locked cards
 *
 * @param {Array} list shuffledCards list
 * @returns {Number} Amount of locked cards
 */
function countLocked(list) {
  return list.reduce((acum, card) => (card.isLocked ? acum + 1 : acum), 0);
}

/**
 * Actions to be executed when cards don't match
 */
function cardsMatchAction() {
  addLockedCards(openedCards);
  openedCards = [];
  const countedLocked = countLocked(shuffledCards);
  if (countedLocked === shuffledCards.length) {
    stopTimer();
    displayModal(
      `You won!!<br>This is the time it took you to resolve it: ${time}<br><a class="restart" href="#">Play Again</a>`,
    );
  }
}

/**
 * Actions to be executed when cards match
 */
function cardsDontMatchAction() {
  // Avoid clicks on cards before the timeout is over
  freezeCards(true);

  // We show the cards for a moment before flipping them back
  setTimeout(() => {
    shuffledCards = resetOpenCardsList(shuffledCards);
    flipBackOpenCards(shuffledCards);
    // updateAttempts();
    updateMoves();
    updateRating();
    freezeCards(false);
  }, config.cardsShowTimeout);
}

/**
 * Handles all the card click action
 *
 * @param {HTMLElement} cardNode
 * @param {Number} index
 * @returns
 */
function onCardClick(cardNode, index) {
  shuffledCards[index] = toggleDisplay(shuffledCards[index], cardNode);
  openedCards = addOpenedCard(openedCards, shuffledCards[index]);

  // We don't process the card until next card is clicked
  if (openedCards.length < 2) {
    return;
  }

  const isMatching = isMatchingPair(...openedCards);

  // If a pair of cards matches we handle the relevant actions and avoid the
  // execution of further code with a return
  if (isMatching) {
    cardsMatchAction();
    return;
  }

  // At this point we know that cards don't match

  cardsDontMatchAction();
}

/**
 * Resets the game
 */
function resetGame() {
  hideResult();
  init();
}

// Initialize the app
// init();

displayModal(
  `<small>You have ${
    config.maxTimeoutMinutes
  } minutes to resolve it</small><br><a class="restart" href="#">Start</a>`,
);

// EVENTS LISTENERS

// Event listener for click on cards list
ulElement.addEventListener('click', e => {
  e.preventDefault();

  // Avoid any process if the cards are freezed
  if (cardsClickFreeze) {
    return;
  }

  const clickedElement = e.target.nodeName === 'I' ? e.target.parentNode : e.target;

  // If clicked element isn't a card, we prevent further process
  if (clickedElement.nodeName !== 'LI') {
    return;
  }

  const index = [...clickedElement.parentNode.children].indexOf(clickedElement);

  // Avoid proceeding if the clicked card is already open
  if (shuffledCards[index].isOpen === true) {
    return;
  }
  onCardClick(clickedElement, index);
});

// Event listener for click on reset button
resetElement.addEventListener('click', e => {
  e.preventDefault();
  resetGame();
});

// Event listener for click on reset button in result panel
modalNode.addEventListener('click', e => {
  const btn = e.target;
  e.preventDefault();

  if (!btn || !btn.classList || !btn.classList.contains('restart')) {
    return;
  }

  resetGame();
});
