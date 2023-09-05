"use strict";

import * as cardDecks from "./mock-data/card-decks.js";
// import * as hands from "./mock-data/player-hands";

// Functions
function randomNumber() {
  return Math.floor(Math.random() * cardValues.length) + 1;
}

/**
 * TODO: possibly best to create global variables of placeholders for storing the index location
 * of the dealer and player. This game only has the two players and is the player is stored in
 * the 0 index always but I believe it's good practice not to hardcode items when I remember
 * and realize to.
 */

// #region Player Setup
/**
 * Global Variable
 * players gets reset by handleDeal fn()
 */
let players = [];

function setPlayers() {
  let names = ["Player", "Dealer"];

  // initializes global variable
  players = names.map((name) => ({
    Name: name,
    Count: 0,
    IsActivePlayer: false,
    Hand: [],
    Status: {
      Blackjack: false,
      Stand: false,
      Bust: false,
      Hit: false
    }
  }));
}
// #endregion Player Setup

// #region Card Deck Managment
/**
 * Global Variable
 * gets reset by handleDeal fn()
 */
let cardDeck = [];
const cardValues = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
const cardSuits = ["Spades", "Diamonds", "Clubs", "Hearts"];

function cardWeightCheck(value) {
  // Takes in value from cardValues[]
  switch (value) {
    case "J":
    case "Q":
    case "K":
      return 10;
    case "A": {
      return {
        firstWeight: 1,
        secondWeight: 11,
      };
    }
    default:
      return parseInt(value);
  }
}

function createNewDeck() {
  let newDeck = [];

  for (let i = 0; i < cardValues.length; i++) {
    for (let j = 0; j < cardSuits.length; j++) {
      let weight = cardWeightCheck(cardValues[i]);
      let value = cardValues[i];
      let suit = cardSuits[j];
      let card = {
        Value: value,
        Suit: suit,
        Weight: weight,
      };
      newDeck.push(card);
    }
  }
  return newDeck;
}

function shuffleDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    // Generate random number between 0 and 51 (0 and deck.length are inclusive);
    let shuffleNumber = Math.floor(Math.random() * deck.length);
    // "Pull" this card and place in temp container
    let temp = deck[i];
    // "Pull" the card from the random index location (shuffleNumber) and set it to the current index location (i)
    deck[i] = deck[shuffleNumber];
    // Set the card in the temp container to random the random index location
    deck[shuffleNumber] = temp;
  }
  return deck;
}

function pullCard(cardNumber = 1, pop = true, popNumber = 0) {
  // popNumber defines how many cards will be popped from the card deck then exits the function
  if (popNumber !== 0) {
    for (let i = 0; i < popNumber; i++) {
      cardDeck.pop();
    }
  } else {
    let pulledCard = cardDeck[cardDeck.length - cardNumber];

    if (pop) {
      cardDeck.pop();
    }

    return pulledCard;
  }
}

function setDeck() {
  let newDeck = createNewDeck();
  // initializes global variable
  cardDeck = shuffleDeck(newDeck);
  // Testing deck scenarios
  // cardDeck = cardDecks.set12;
}
// #endregion Card Deck Management

// #region Game Actions
function handleDeal() {
  /*
    1. Initialize our players
    2. Create a new deck
    3. "Pull" cards from the bottom of the deck and deal to the players
    4. Remove the pulled cards from the deck
    5. Update players count
    6. Update players status
    7. Render the players cards and count
    8. Check game status
  */
  setPlayers();
  setDeck();
  // Simulates dealing of cards by alternating between the players
  let playerDealtCards = [pullCard(1, false), pullCard(3, false)];
  let dealerDealtCards = [pullCard(2, false), pullCard(4, false)];

  players.forEach((player) => {
    for (const prop in player) {
      if ((prop === "Name") && (player[prop] === "Dealer")) {
        player.Hand.push(...dealerDealtCards);
        break;
      }

      if ((prop === "Name") && (player[prop] === "Player")) {
        player.Hand.push(...playerDealtCards);
        player.IsActivePlayer = true;
        break;
      }
    }
  });

  pullCard(undefined, undefined, 4);
  updatePlayersCount();

  // TODO: check update player status to see if active Player status needs updating at this point
  // TODO: possible fn() refactor to handle situations where all players require updatePlayerStatus or just a single player
  players.forEach((player) => {
    updatePlayerStatus(player);
  });

  renderCards();
  renderCount(null, true);
  checkGameStatus();
}

function handleHit(delay = 0) {
  let activePlayerIndex = players.findIndex(
    (player) => player.IsActivePlayer === true
  );

  const activePlayer = players[activePlayerIndex], { Name } = players[activePlayerIndex];
  const pulledCard = pullCard();

  activePlayer.Hand.push(pulledCard);

  const latestCardIndex = activePlayer.Hand.length - 1;
  const { Value: latestCardValue } = activePlayer.Hand[latestCardIndex];

  updatePlayersCount(false, activePlayerIndex);
  updatePlayerStatus(activePlayer);
  renderSingleCard(latestCardIndex, latestCardValue, Name);
  renderCount(activePlayerIndex);
  checkGameStatus();
}
// #endregion Game Actions

// #region Player Management
function sumCount1({ Hand }) {
  let count = 0;
  let aceCountWeightTracker = [];

  for (let i = 0; i < Hand.length; i++) {
    if (Hand[i].Value === "A") {
      let one = Hand[i].Weight.firstWeight;
      let eleven = Hand[i].Weight.secondWeight;

      if (count + eleven <= 21) {
        count += eleven;
        aceCountWeightTracker.push(11);
        // console.log("added 11 --> ", count);
      } else {
        count += one;
        aceCountWeightTracker.push(1);
        // console.log("added 1 --> ", count);
      }
    } else {
      count += Hand[i].Weight;

      if (aceCountWeightTracker.length !== 0 && count > 21) {
        // console.log("previous count: ", count);
        for (let j = 0; j < aceCountWeightTracker.length; j++) {
          if (aceCountWeightTracker[j] === 11) {
            count -= 10;
            aceCountWeightTracker[j] = 1;
            // console.log("subtracted 10 -->", count);
            if (count <= 21) {
              break;
            }
          }
        }
      }
      // console.log(count);
    }
  }
  return count;
}

function sumCount({ Hand }) {
  let count = 0;
  let aceTracker = [];

  for (let i = 0; i < Hand.length; i++) {
    // Variable setup to avoid rewriting same snippets of code checks as arguments in IF statements
    let value = Hand[i].Value;
    let isAce = value === "A" ? true : false;
    let aceOne = isAce ? Hand[i].Weight.firstWeight : 0;
    let aceEleven = isAce ? Hand[i].Weight.secondWeight : 0;
    let aceTrackerIsEmpty = (aceTracker.length === 0) ? true : false;
    let weight = 0;
    // console.log("---------- Current Card ----------");
    // console.log(`value: ${value}, aceTracker: [${aceTracker}], count: ${count}`);
    if (isAce) {
      /*
        IF is an Ace
        IF statement does not require argument check for bust.
        This is because it only matters whether the card is an Ace.
        Afterwards, a check would occur to determine what weight of the card would carry.
        Finally, after a weight is determined, the weight would be added to the current count.
        The occurance and weight of the Ace in hand would then be recorded and the loop would continue until expended.
      */
      "First IF"
      weight = (count + aceEleven > 21) ? aceOne : aceEleven;
      // console.log(`weight: ${weight}`);
      count += weight;
      aceTracker.push(weight);
      // console.log(`Added ${weight}`);
    } else {
      // IF is NOT an Ace
      weight = Hand[i].Weight;
      // console.log(`weight: ${weight}`);
    }

    let countBusts = ((count + weight) > 21) ? true : false;

    // Summation Logic
    if (!isAce && aceTrackerIsEmpty) {
      // IF NOT an Ace AND there are no Aces in hand
      // could be refactored to include OR (!isAce && !aceTrackerIsEmpty && !countBusts) since logic is the same
      // console.log("Second IF");
      count += weight;
    }

    if (!isAce && !aceTrackerIsEmpty && countBusts) {
      /*
        IF NOT an Ace AND there are Aces in hand AND count would bust
        Add the weight of the current card to the count.
        Iterate over each recorded Ace occurance in hand.
        (Each occurance is handled by determining whether the occurance has been evaluated with a weight of 11 or 1)
        IF the occurance of an Ace was evaluated with the weight of 11 then subtract ten from the count.
        This results in a count with the Ace evaluated with the weight of 1 instead of the previous evaluation of 1.
        Update the Ace occurance's weight.
        Then check whether the count no longer busts.and break out of the loop if it does not.
        IF count no longer busts exit the loop else continue iterating until the loop is expended.
        (
          NOTE: 
          A second occurance of an Ace with the weight of 11 is unlikely given this would bust the player.
          This logic is handled in the First IF statment.
          The continuation of this for loop is primarily a sanity check
        )
      */
      // console.log("Third IF");
      count += weight;
      // console.log(`Updated count: ${count}`);
      for (let j = 0; j < aceTracker.length; j++) {
        if (aceTracker[j] === 11) {
          count -= 10;
          aceTracker[j] = 1;
          // console.log(`Subtracted 10 --> ${count}`);
          if (count <= 21) {
            break;
          }
        }
      }
    }

    if (!isAce && !aceTrackerIsEmpty && !countBusts) {
      // Is NOT an Ace, there are Aces in hand, AND count would NOT bust
      // console.log("Fourth IF");
      count += weight;
    }
    // console.log(`Final iteration count: ${count}`);
    // console.log("--------------------");
  }
  return count;
}

function updatePlayersCount(allPlayers = true, activePlayerIndex = null) {
  if (allPlayers === true) {
    players.forEach((player) => {
      const count = sumCount(player);
      player.Count = count;
    });
  }

  if (allPlayers === false && activePlayerIndex !== null) {
    const activePlayer = players[activePlayerIndex];
    const count = sumCount(activePlayer);
    activePlayer.Count = count;
  }
}

function updatePlayerStatus(player, stand = false) {
  /*
    1. Accepts the passed player object and destructures the Name from the player
    2. Checks whether the passed player obejct is the Dealer or a Player
      a. Then checks the player objects count which returns status updates for the player object
    3. Iterate over the list of players
      a. Iterate over the current player object properties
      b. If the current iteration Name property value is equivalent to the passed player object Name property value
        1. Update the current iteration player object Status property with the status updates
  */
  const { Name } = player;
  // console.log("---------- LOG PASSED PLAYER ----------");
  // console.log(player);
  // console.log("------------------");
  let statusUpdates = Name !== "Dealer" ? checkPlayerCount(player) : checkDealerCount(player);

  if (stand) {
    statusUpdates.Stand = true;
  }

  for (let i = 0; i < players.length; i++) {
    let selectedPlayer = players[i];
    let playerUpdated = false;

    for (const prop in selectedPlayer) {
      if (prop === "Name" && player[prop] === Name) {
        player.Status = { ...player.Status, ...statusUpdates };
        playerUpdated = true;
        // console.log("---------- LOG UPDATED PLAYER ----------");
        // console.log(player);
        // console.log("------------------");
        break; // prevents iterating over entire property list
      }
    }

    if (playerUpdated) {
      // breaks the loop to quit iterating as the player has already been updated
      break;
    }
  }
  // console.log("---------- LOG CURRENT PLAYER ----------");
  // console.log(player);
  // console.log("------------------");
}

function checkPlayerCount(player) {
  // console.log("CHECK PLAYER COUNT USED");
  let { Blackjack, Stand, Bust, Hit } = player.Status;
  const { Count } = player;

  if (Count === 21) {
    Blackjack = true;
    Stand = true;
    Hit = false;
  }

  if (Count > 21) {
    Bust = true;
    Stand = true;
    Hit = false;
  }

  if (Count !== 21 && Count < 21) {
    Hit = true;
  }

  return { Blackjack: Blackjack, Stand: Stand, Bust: Bust, Hit: Hit };
}

function checkDealerCount(player) {
  // console.log("CHECK DEALER COUNT USED")
  let { Blackjack, Stand, Bust, Hit } = player.Status;
  let { Count } = player;
  // console.log(typeof (Count));

  if (Count === 21) {
    Blackjack = true;
    Stand = true;
    Hit = false;
  }

  if (Count > 21) {
    Bust = true;
    Stand = true;
    Hit = false;
  }

  if (Count >= 17) {
    /**
     * TODO: implement options in game. one option would be to allow dealer to hit on soft 17
     *    dealer has 17 including an Ace being counted as 11, the dealer must hit
     */
    Stand = true;
    Hit = false;
  }

  if (Count !== 21 && Count < 17 && Count < 21) {
    Hit = true;
  }

  return { Blackjack: Blackjack, Stand: Stand, Bust: Bust, Hit: Hit };
}
// #endregion Player Management

function checkGameStatus() {
  const dealerPosition = players.findIndex(({ Name }) => Name === "Dealer");
  const dealer = players[dealerPosition];
  const { Blackjack: dealerBlackjack, Stand: dealerStand, Bust: dealerBust, Hit: dealerHit } = dealer.Status;
  const playerPosition = players.findIndex(({ Name }) => Name === "Player");
  const player = players[playerPosition];
  const { Blackjack, Stand, Bust, Hit } = player.Status;

  if (Blackjack) {
    player.IsActivePlayer = false;
    dealer.IsActivePlayer = true;
    const dealersSecondCardRendered = renderDealerSecondCardAndCount(dealerPosition, 2000);
    const hitDelay = dealersSecondCardRendered ? 1500 : 3500;
    const modalDelay = dealersSecondCardRendered ? 1500 : 4000;

    if (dealerBlackjack) {
      setModalMessage("PUSH!");
      return displayModal(modalDelay);
    }

    if ((!dealerBlackjack && dealerStand) || dealerBust) {
      setModalMessage(`Blackjack!
      Congratulations, Player wins!`);
      return displayModal(modalDelay);
    }

    if (dealerHit) {
      return setTimeout(() => {
        handleHit();
      }, hitDelay)
    }
  }

  if ((!Blackjack && Stand) && !Bust) {
    player.IsActivePlayer = false;
    dealer.IsActivePlayer = true;
    const dealersSecondCardRendered = renderDealerSecondCardAndCount(dealerPosition);
    const hitDelay = dealersSecondCardRendered ? 1600 : 1500;
    const modalDelay = 1500;


    if (dealerBlackjack) {
      setModalMessage(`Dealer wins!`);
      return displayModal(modalDelay);
    }

    if (!dealerBlackjack && dealerStand && !dealerBust) {
      if (player.Count > dealer.Count) {
        setModalMessage(`Player wins!`);
      }

      if (player.Count < dealer.Count) {
        setModalMessage(`Dealer wins!`);
      }

      if (player.Count === dealer.Count) {
        setModalMessage(`PUSH!`);
      }
      return displayModal(modalDelay);
    }

    if (dealerBust) {
      setModalMessage(`Player wins!`);
      return displayModal(modalDelay);
    }

    if (dealerHit) {
      return setTimeout(() => {
        handleHit();
      }, hitDelay);
    }
  }

  if (Bust) {
    renderDealerSecondCardAndCount(dealerPosition, 1500);
    setModalMessage(`Dealer wins!`);
    return displayModal(3000);
  }

  // TODO: remove this check. The hit button will handle hit for the player
  if (Hit) {
    // probably just wait for the player to take action
    // probably do something if auto play is incorporated
  }
}

// #region UI Management

// #region elements and event listeners

// #region modal 
const modalContainer = document.getElementById("container-modal");
const modalContentContainer = document.getElementById("container-modal-content");
const modalMessageContainer = document.getElementById("container-modal-message");
const modalMessage = document.getElementById("modal-message");
const playAgainButton = document.getElementById("button-play-again");
const exitButton = document.getElementById("button-exit");

playAgainButton.addEventListener("click", () => {
  resetGame();
  handleDeal();
  console.log("handleDeal called from playagain event listener");
});

exitButton.addEventListener("click", () => {
  resetGame();
})

// #endregion modal

// #region buttons
// const allButtons = document.querySelectorAll("button");
const dealButton = document.getElementById("button-deal");
const hitButton = document.getElementById("button-hit");
const standButton = document.getElementById("button-stand");

dealButton.addEventListener("click", () => {
  handleDeal();
});

hitButton.addEventListener("click", () => {
  handleHit();
});

standButton.addEventListener("click", () => {
  const playerPosition = players.findIndex(({ Name }) => Name === "Player");
  const player = players[playerPosition];
  updatePlayerStatus(player, true);
  checkGameStatus();
});
// #endregion buttons

// #endregion elements and event listeners

// #region render player cards UI
function getPlayerCardsElement(name) {
  return document.getElementById(`${String(name).toLowerCase()}-cards`);
}

function createCard(cardIndex, cardValue, name, animationMultiplier = null) {
  const card = document.createElement('div');
  card.id = `${name}-card-${cardIndex}`;
  card.classList.add("card");

  if (animationMultiplier !== null) {
    card.style.setProperty("--animation-delay", `${animationMultiplier * 0.4}s`);
  }

  const text = document.createTextNode(cardValue);
  card.appendChild(text);

  return card;
}

function renderSingleCard(cardIndex, cardValue, name) {
  const card = createCard(cardIndex, cardValue, name, null);

  const playerCardsElement = getPlayerCardsElement(name);
  playerCardsElement.appendChild(card);
}

function renderCards() {
  /**
   * This function is executed at the beginning of the game and assumes each player has the same amount of cards.
   * This assumption is TRUE based on the code in handleDeal() which specifically "pulls" two cards for each player.
   * 
   * Outer For Loop: determines which card number to render for the player
   * Inner For Loop: determines which player to render the card for
   * Result: For each player, render the current card number in loop then proceed to the next card number.
   * 
   * UX purposes:
   * The animation-delay property is dynamically set for each card in the createCard fn().
   * This allows the cards to appear in succession as if they're being dealt in this manner 
   */
  let animationCardCount = 0;
  const dealerPosition = players.findIndex(({ Name }) => Name === "Dealer");

  for (let i = 0; i < players[0].Hand.length; i++) {
    for (let j = 0; j < players.length; j++) {
      // This is to prevent rendering the dealer's second card
      if (j === dealerPosition && i > 0) {
        continue;
      }
      const { Value } = players[j].Hand[i];
      const { Name } = players[j];
      const card = createCard(i, Value, Name, animationCardCount);
      animationCardCount++;

      const playerCardsElement = getPlayerCardsElement(Name);
      playerCardsElement.appendChild(card);
    }
  }
}

/**
 * This fn() encapsulates rendering the dealer's second card in hand along with rendering the dealer's hand count
 * The purpose of this fn() is to call one fn() rather than two in multiple locations within the checkGameStatus() fn()
 */
function renderDealerSecondCardAndCount(dealerPosition, delay = 0) {
  const dealer = players[dealerPosition];
  const name = dealer.Name;
  const cardIndex = dealer.Hand.length - 1;
  const { Value } = dealer.Hand[cardIndex];
  const dealerSecondCard = document.getElementById("Dealer-card-1");
  let dealersDealtCardsRendered = true;

  if (dealerSecondCard !== null) {
    return dealersDealtCardsRendered;
  }

  setTimeout(() => {
    renderSingleCard(cardIndex, Value, name);
    renderCount(dealerPosition);
  }, delay)

  return !dealersDealtCardsRendered;
}
// #endregion render player cards UI

// #region render player count UI
function getPlayerCountElement(name) {
  return document.getElementById(`count-${String(name).toLowerCase()}`);
}

function createCountTextNode(count) {
  return document.createTextNode(count.toString());
}

/**
 * This function renders the Count on the UI and handles three separate instances
 * IF reset is set to true, each players count will be cleared on the UI
 * IF activePlayerIndex is NOT null, only the active player's count will be rendered on the UI
 * IF allPlayers is set to true, each players count will be rendered on the UI 
 */
function renderCount(activePlayerIndex = null, allPlayers = false, reset = false) {
  if (reset === true) {
    players.forEach((player) => {
      const { Name } = player;
      const playerCountElement = getPlayerCountElement(Name);
      playerCountElement.innerText = "";
    });
  }

  if (activePlayerIndex !== null) {
    const { Name, Count } = players[activePlayerIndex];
    const playerCountElement = getPlayerCountElement(Name);
    const text = createCountTextNode(Count);

    /**
     * Waits until card has been dealt before updating the count UI
     * deal-card animation takes 500ms
     * Count UI update will execute 50ms afterwards
     */
    setTimeout(() => {
      playerCountElement.classList.add("card-count");
      playerCountElement.innerText = "";
      playerCountElement.appendChild(text);
    }, 550);

    /**
     * Necessary to remove the card-count class after the animation has been executed
     *    in order to trigger the animation for the next count update 
     * card-count animation takes 500ms
     * (Time until card-count executes) + (Duration of animation) = (Required animation time)
     * 550ms + 500ms = 1050ms
     * card-count class can be removed anytime after 1050ms
     */
    setTimeout(() => {
      playerCountElement.classList.remove("card-count");
    }, 1100);
  }

  // if (allPlayers === true) {
  //   players.forEach((player) => {
  //     const { Name, Count } = player;
  //     const playerCountElement = getPlayerCountElement(Name);
  //     const text = createCountTextNode(Count);

  //     /**
  //      * Waits until all players have been dealt their cards before updating the Count UI
  //      * Explanation for 1200ms:
  //      * The renderCard fn() dynamically assigns the animation delay for each card
  //      *    explanation for this has been described in the fn() description comment
  //      * The animation delay for the final card is determined by
  //      *    the final card index(3) multiplayed by the constant 0.4s resulting in 1.2s
  //      * Count UI update will execute exactly when the final card has been
  //      *    rendered and during it's dealCard animation
  //      */
  //     setTimeout(() => {
  //       playerCountElement.classList.add("count-deal");
  //       playerCountElement.appendChild(text);
  //     }, 1200);

  //     /**
  //      * Necessary to remove the card-count class after the animation has been executed
  //      *    in order to trigger the animation for the next count update 
  //      * countDeal animation takes 1250ms
  //      * (Time until countDeal executes) + (Duration of animation) = (Required animation time)
  //      * 1200ms + 1250ms = 2450ms
  //      * count-deal class can be removed anytime after 2450ms
  //      */
  //     setTimeout(() => {
  //       playerCountElement.classList.remove("count-deal");
  //     }, 2500);
  //   });
  // }

  if (allPlayers === true) {
    const dealerPosition = players.findIndex(({ Name }) => Name === "Dealer");
    for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
      if (playerIndex === dealerPosition) {
        continue;
      }
      const player = players[playerIndex];
      const { Name, Count } = player;
      const playerCountElement = getPlayerCountElement(Name);
      const text = createCountTextNode(Count);


      setTimeout(() => {
        playerCountElement.classList.add("count-deal");
        playerCountElement.appendChild(text);
      }, 1200);

      setTimeout(() => {
        playerCountElement.classList.remove("count-deal");
      }, 2500);
    }
  }
}
// #endregion render player count UI

// #region render modal UI
function setModalMessage(message = null) {
  modalMessage.innerText = "";

  if (message !== null) {
    modalMessage.appendChild(document.createTextNode(message));
  }
}

/**
 * 
 * The implementation of the delay is primarily utilized when executed in the checkGameStatus() to allow
 *    an animation to conclude
 * Specifically, the card rendering, produced by renderDealerCardAndCount(), will have the CSS animation
 *    dealCard that is set for a duration of .5 seconds. The delay for this fn() fulfills the UX.
 * 
 * @param {number} [delay = 0]
 */
function displayModal(delay = 0) {
  setTimeout(() => {
    modalContainer.classList.remove("is-hidden");
    modalContainer.classList.add("modal-container");
  }, delay)
}

function hideModal() {
  modalContainer.classList.remove("modal-container");
  modalContainer.classList.add("is-hidden");
}
// #endregion render modal UI

// #region render reset game UI
function clearCards() {
  document.querySelectorAll(".player-cards").forEach((element) => {
    element.replaceChildren();
  });
}

function resetGame() {
  setModalMessage();
  hideModal();
  clearCards();
  renderCount(null, false, true);
  players = [];
  cardDeck = [];
}
// #endregion render reset game UI

//#endregion UI Management

document.addEventListener('DOMContentLoaded', function () {
  let actionButtons = [hitButton, standButton];
  actionButtons.forEach((btn) => {
    btn.disabled = true;
  });
});