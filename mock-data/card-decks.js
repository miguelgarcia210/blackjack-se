// #region Player's dealt Blackjack scenarios
// Scenario: Player's dealt Blackjack, Dealer's dealt Blackjack
export const set1 = [
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // D: 21
    { Value: "J", Suit: "spades", Weight: 10 }, // P: 21
    { Value: "J", Suit: "spades", Weight: 10 }, // D: 10
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // P: 11
]

// Scenario: Player's dealt Blackjack, Dealer's dealt Stands
export const set2 = [
    { Value: "7", Suit: "spades", Weight: 7 }, // D: 17
    { Value: "J", Suit: "spades", Weight: 10 }, // P: 21
    { Value: "J", Suit: "spades", Weight: 10 }, // D: 10
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // P: 11
]

// Scenario: Player's dealt Blackjack, Dealer hits twice and Stands
export const set3 = [
    { Value: "3", Suit: "spades", Weight: 3 }, // D: 17
    { Value: "2", Suit: "spades", Weight: 2 }, // D: 14
    { Value: "2", Suit: "spades", Weight: 2 }, // D: 12
    { Value: "J", Suit: "spades", Weight: 10 }, // P: 21
    { Value: "J", Suit: "spades", Weight: 10 }, // D: 10
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // P: 11
]
// #endregion Player's dealt Blackjack scenarios

// #region Player's dealt Stands scenarios

// Scenario: Player's dealt Stands, Dealer's dealt Blackjack
export const set4 = [
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // D: 21
    { Value: "5", Suit: "spades", Weight: 5 }, // P: 16
    { Value: "J", Suit: "spades", Weight: 10 }, // D: 10
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // P: 11
]

// Scenario: Player's dealt Stands, Dealer's dealt Stands : Player > Dealer
export const set5 = [
    { Value: "7", Suit: "spades", Weight: 7 }, // D: 17
    { Value: "7", Suit: "spades", Weight: 7 }, // P: 18
    { Value: "J", Suit: "spades", Weight: 10 }, // D: 10
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // P: 11
]

// Scenario: Player's dealt Stands, Dealer's dealt Stands : Player < Dealer
export const set6 = [
    { Value: "7", Suit: "spades", Weight: 7 }, // D: 17
    { Value: "5", Suit: "spades", Weight: 5 }, // P: 16
    { Value: "J", Suit: "spades", Weight: 10 }, // D: 10
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // P: 11
]

// Scenario: Player's dealt Stands, Dealer's dealt Stands : Player === Dealer
export const set7 = [
    { Value: "7", Suit: "spades", Weight: 7 }, // D: 17
    { Value: "6", Suit: "spades", Weight: 6 }, // P: 17
    { Value: "J", Suit: "spades", Weight: 10 }, // D: 10
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // P: 11
]

// Scenario: Player's dealt Stands, Dealer hits twice and hits Blackjack
export const set8 = [
    { Value: "5", Suit: "spades", Weight: 5 }, // D: 21
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // D: 16
    { Value: "5", Suit: "spades", Weight: 5 }, // D: 15
    { Value: "6", Suit: "spades", Weight: 6 }, // P: 17
    { Value: "J", Suit: "spades", Weight: 10 }, // D: 10
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // P: 11
]

// Scenario: Player's dealt Stands, Dealer hits twice : Player > Dealer 
export const set9 = [
    { Value: "2", Suit: "spades", Weight: 2 }, // D: 18
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // P: 16
    { Value: "5", Suit: "spades", Weight: 5 }, // D: 15
    { Value: "8", Suit: "spades", Weight: 8 }, // P: 19
    { Value: "J", Suit: "spades", Weight: 10 }, // D: 10
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // P: 11
]

// Scenario: Player's dealt Stands, Dealer hits twice : Player < Dealer 
export const set10 = [
    { Value: "2", Suit: "spades", Weight: 2 }, // D: 17
    { Value: "3", Suit: "spades", Weight: 3 }, // D: 15
    { Value: "2", Suit: "spades", Weight: 2 }, // D: 12
    { Value: "5", Suit: "spades", Weight: 5 }, // P: 16
    { Value: "J", Suit: "spades", Weight: 10 }, // D: 10
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // P: 11
]

// Scenario: Player's dealt Stands, Dealer hits twice : Player === Dealer 
export const set11 = [
    { Value: "2", Suit: "spades", Weight: 2 }, // D: 17
    { Value: "3", Suit: "spades", Weight: 3 }, // D: 15
    { Value: "2", Suit: "spades", Weight: 2 }, // D: 12
    { Value: "6", Suit: "spades", Weight: 6 }, // P: 17
    { Value: "J", Suit: "spades", Weight: 10 }, // D: 10
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // P: 11
]

// * Scenario: Player's dealt Stands, Dealer hits twice and Busts
export const set12 = [
    { Value: "7", Suit: "spades", Weight: 7 }, // D: 22
    { Value: "3", Suit: "spades", Weight: 3 }, // D: 15
    { Value: "2", Suit: "spades", Weight: 2 }, // D: 12
    { Value: "6", Suit: "spades", Weight: 6 }, // P: 17
    { Value: "J", Suit: "spades", Weight: 10 }, // D: 10
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // P: 11
]

// * Scenario: Player's dealt Stands at 13, Dealer hits twice and Busts
export const set14 = [
    { Value: "10", Suit: "spades", Weight: 10 }, // D: 26
    { Value: "5", Suit: "spades", Weight: 5 }, // D: 16
    { Value: "9", Suit: "spades", Weight: 9 }, // D: 11
    { Value: "3", Suit: "spades", Weight: 3 }, // P: 13
    { Value: "2", Suit: "spades", Weight: 2 }, // D: 2
    { Value: "K", Suit: "spades", Weight: 10 }, // P: 10
]

// #endregion Player's dealt Stands scenarios

// Scenario: Player hits twice and Busts
export const set15 = [
    { Value: "K", Suit: "spades", Weight: 10 }, // P: 22
    { Value: "6", Suit: "spades", Weight: 6 }, // P: 12
    { Value: "7", Suit: "spades", Weight: 7 }, // D: 17
    { Value: "5", Suit: "spades", Weight: 5 }, // P: 16
    { Value: "J", Suit: "spades", Weight: 10 }, // D: 10
    { Value: "A", Suit: "spades", Weight: { firstWeight: 1, secondWeight: 11 } }, // P: 11
]