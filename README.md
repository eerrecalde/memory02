# Memory Game

## Instructions

- Clone the project from github: `git clone git@github.com:eerrecalde/memory02.git`
- Run the app by opening the index.html file with a browser 

#### Game parts
- There are 16 cards, two sets of 8 unique cards
- Timer to know how long it takes you to resolve the game
- Rating with stars (explained below)
- Amount of moves
- Reset button

#### Configure the game
- `maxTimeoutMinutes` (default 2) the time given to resolve the game
- `cardsShowTimeout` (default: 1000) the rating stars via the config variable
- `initialRating` (default: 3) the amount of stars the user starts with

#### When you loose
- You loose if you don't get the matching pairs before the timeout

#### Winning conditions
- You win if you match all the card pairs before the timeout runs out
- Try to get the best rating possible (explained below)
- The timeout is set in 2 minutes, and can be configured from the config variable

#### Rating
- The more cards you flip the more the rating will be decreased
- The rating starts decreasing after the 8th card is being flipped 
and it will continue decreasing for every 4 flips until it reaches 0 (the lowest rating)

#### Moves
- For every pair of cards is flipped will count as 1 move.

## Dependencies
There are no dependencies needed to run the app

However, in case of needing to test the code style, please run the following npm installation:
`npm i -D eslint-config-airbnb-base eslint-config-airbnb-base eslint-plugin-import eslint`

#### Test code style
Run `npm run eslint` to test code style