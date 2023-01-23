// Define variables for the game state

const cards: string[] = ['|', '|', '||', '||', '|||', '|||'];
let numberOfMoves = 0;
let selectedCards: HTMLElement[] = [];
let gameStarted = false;
let timerStarted = false;
let timer : any;
let startTime: any;

const cardElements = document.querySelectorAll('.card');
cardElements.forEach((card) => {
  card.classList.add('disabled');
});

document.querySelector('.reset-btn').classList.add('disabled');

const moves = document.querySelector('.moves');
const countTime = document.querySelector('.timer');

// Create a function called "initializeGame" that sets up the initial state of the game,
// such as shuffling the cards and setting all of them to be face-down

const initializeGame = () => {
  timerStarted = false;
  numberOfMoves = 0;
  countTime.textContent = 'Time left: 60s';
  gameStarted = true;
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  // Assign the shuffled cards to the card elements
  const cardElementsNewPos = document.querySelectorAll('.card');

  cardElementsNewPos.forEach((card, index) => {
    card.setAttribute('data-card', cards[index]);
  });
  if (!timerStarted) {
    let timeLeft = 60;
    startTime = Date.now();
    timerStarted = true;
    timer = setInterval(() => {
      timeLeft -= 1;
      countTime.textContent = `Time left: ${timeLeft}s`;
      if (timeLeft < 0) {
        alert('Game Over. You ran out of time!');
        clearInterval(timer);
        timerStarted = false;
        timeLeft = 60;
        countTime.textContent = `Time left: ${timeLeft}s`;

        cardElements.forEach((card) => {
          card.classList.remove('flipped');
          card.classList.remove('matched');
          card.classList.add('disabled');
        });
        document.querySelector('.reset-btn').classList.remove('disabled');
        const inactiveStartButton = document.querySelector('.btn-1');
        inactiveStartButton.classList.add('disabled');
        numberOfMoves = 0;
      }
    }, 1000);
  }
};

const startButton = document.querySelector('.btn-1');
startButton.addEventListener('click', () => {
  gameStarted = true;
  if (gameStarted) {
    cardElements.forEach((card) => {
      card.classList.remove('disabled');
    });
  }

  initializeGame();
});

// Create a function called "handleCardClick"
// that takes in the index of the clicked card as a parameter.
// This function will handle the logic for flipping a card,
// checking if it matches the previously selected card, and updating the game state accordingly.

const handleCardClick = (event: any): void => {
  const clickedCard = event.target;
  // Increment the numberOfMoves variable by one after each click
  numberOfMoves += 1;
  moves.textContent = `Number of Moves: ${numberOfMoves}`;

  if (!gameStarted) {
    return;
  }
  if (selectedCards.length === 2) {
    return;
  }
  clickedCard.classList.add('flipped');
  if (selectedCards.length === 0) {
    selectedCards.push(clickedCard);
  }
  if (!selectedCards.includes(clickedCard)) {
    selectedCards.push(clickedCard);
    if (selectedCards[0].getAttribute('data-card') === clickedCard.getAttribute('data-card')) {
      selectedCards[0].classList.add('matched');
      clickedCard.classList.add('matched');
      selectedCards = [];
    }
  } else {
    // Update the game state
    setTimeout(() => {
      selectedCards.forEach((card) => {
        card.classList.remove('flipped');
        card.classList.remove('matched');
      });

      selectedCards = [];
      // Check if all cards have been matched
      if (document.querySelectorAll('.flipped.matched').length === cards.length) {
        alert(`Congratulations! You won the game in ${numberOfMoves} moves and ${(Date.now() - startTime) / 1000} seconds`);
        clearInterval(timer);
        gameStarted = false;

        const cardsFaceDown = document.querySelectorAll('.matched');
        cardsFaceDown.forEach((card) => {
          card.classList.remove('flipped');
          card.classList.remove('matched');
          card.classList.add('disabled');
          document.querySelector('.reset-btn').classList.remove('disabled');
        });

        const inactiveStartButton = document.querySelector('.btn-1');
        inactiveStartButton.classList.add('disabled');
      }
    }, 1500);
  }
};

// To listen card clicks
const listenCardClicks = document.querySelectorAll('.card');
listenCardClicks.forEach((card) => card.addEventListener('click', handleCardClick));

// Create a method called "resetGame" that sets the game back to its initial state,
// allowing the player to start over.

const resetGame = (): void => {
  document.querySelectorAll('.game-over').forEach((card) => {
    card.classList.remove('game-over');
  });
  gameStarted = true;
  cardElements.forEach((card) => {
    card.classList.remove('disabled');
  });
  numberOfMoves = 0;
  moves.textContent = `Number of Moves: ${numberOfMoves}`;
  selectedCards = [];
  const machetCards = document.querySelectorAll('.matched');
  const flippedCards = document.querySelectorAll('.flipped');
  machetCards.forEach((card) => {
    card.classList.remove('matched');
    card.classList.remove('flipped');
  });
  flippedCards.forEach((card) => {
    card.classList.remove('matched');
    card.classList.remove('flipped');
  });

  initializeGame();
};

// Add a button that calls this method when clicked.
const resetBtn = document.querySelector('.reset-btn');
resetBtn.addEventListener('click', resetGame);

selectedCards.forEach((card) => {
  setTimeout(() => {
    card.classList.remove('flipped');
    card.classList.remove('matched');
  }, 1000);
});
