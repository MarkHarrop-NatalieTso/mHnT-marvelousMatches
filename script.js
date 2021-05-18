const marvelApp = {};
marvelApp.NUMBER_CHARACTERS = 8;

marvelApp.apiUrl = "https://gateway.marvel.com/v1/public/characters";
marvelApp.apiKey = "a3134eefb2e9287cec66be10c3f7e87f";
marvelApp.privKey = "2ba98ab85aadbb6df982e71ce51d61e40fd027bd";
marvelApp.characterIdArray = [
    1009368,
    1009220,
    1009351,
    1009664,
    1009417,
    1009407,
    1009189,
    1009697,
    1009610,
    1009187,
    1009577,
    1009562,
    1009282,
    1009652,
    1010743,
    1009338,
    1009718,
    1009465,
    1009504,
    1009265
]


marvelApp.ts = new Date().getTime();
marvelApp.hash = MD5(marvelApp.ts + marvelApp.privKey + marvelApp.apiKey).toString();

// function to get data from API
marvelApp.getCharacter = async (characterId) => {
    const url = new URL(`${marvelApp.apiUrl}/${characterId}`);
    url.search = new URLSearchParams({
        ts: marvelApp.ts,
        apikey: marvelApp.apiKey,
        hash: marvelApp.hash
    });
    const response = await fetch(url)
    return response.json()
}

// function to shuffle array of info from API
marvelApp.shuffle = array => {
    // for loop swaps two objs in array at a time to *shuffle
    for (let i = 0; i < array.length; i++) {
        let j = Math.floor(Math.random() * array.length);
        let k = Math.floor(Math.random() * array.length);
        if (k == j) {
            if (k == (array.length - 1)) {
                j--;
            } else {
                j++;
            }
        };
        let temp = array[k];
        array[k] = array[j];
        array[j] = temp;
    }
    return array;
}

// function to get and store array of requested info from API
marvelApp.getCharacterArray = async quantity => {
    const characterIds = [];
    // for loop to select random ids of quantity given from character id array to be used on game board
    for (let i = 0; i < quantity; i++) {
        let characterId;
        // loop to check for duplicate id in array
        do {
            characterId = marvelApp.characterIdArray[Math.floor(Math.random() * 20)];
        } while (characterIds.includes(characterId));
        characterIds.push(characterId);
    }

    // Pull data from 8 random characters from Marvel API
    // Store character name img and id in an array
    const characterData = [];
    // for each loop to get the data needed for ids chosen above
    for (let i = 0; i < characterIds.length; i++) {
        const characterId = characterIds[i];
        const character = await marvelApp.getCharacter(characterId);
        characterData.push({
            id: character.data.results[0].id,
            imgUrl: "https" + character.data.results[0].thumbnail.path.slice(4) + "." + character.data.results[0].thumbnail.extension,
            name: character.data.results[0].name
            });
        characterData.push({
            id: character.data.results[0].id,
            imgUrl: "https" + character.data.results[0].thumbnail.path.slice(4) + "." + character.data.results[0].thumbnail.extension,
            name: character.data.results[0].name
        });
    };
    const shuffled = marvelApp.shuffle(characterData);
    marvelApp.makeCards(shuffled);
}

// 16 tiles with Marvel logo will appear 'face down' on the game board.
marvelApp.makeCards = data => {
    const gameboard = document.querySelector(".innerGameboard");

    data.forEach(dataObject => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("characterCard");

        const cardBack = document.createElement("img");
        cardBack.classList.add("backCard");
        cardBack.src = "./assets/Marvel-Logo-Square.jpeg";
        cardBack.alt = "Marvel Logo"
        
        const cardPiece = document.createElement("img");
        cardPiece.classList.add("faceCard");
        cardPiece.src = dataObject.imgUrl;
        cardPiece.alt = dataObject.name;
        cardPiece.setAttribute("id", dataObject.id);

        cardDiv.appendChild(cardBack);
        cardDiv.appendChild(cardPiece);

        gameboard.appendChild(cardDiv);
    });
}

// Declare variables to use in our functions below
marvelApp.timePassed = 0;
marvelApp.milliseconds = 0; marvelApp.seconds = 0; marvelApp.minutes = 0;
marvelApp.timer = document.querySelector("#stopwatch");
marvelApp.stoptime = true;

marvelApp.startTimer = () => {
  if (marvelApp.stoptime == true) {
        marvelApp.stoptime = false;
        marvelApp.timerCycle();
    }
}

marvelApp.stopTimer = () => {
  if (marvelApp.stoptime === false) {
    marvelApp.stoptime = true;
  }
}

marvelApp.timerCycle = () => {
    if (marvelApp.stoptime === false) {
        marvelApp.milliseconds = parseInt(marvelApp.milliseconds);
        marvelApp.seconds = parseInt(marvelApp.seconds);
        marvelApp.minutes = parseInt(marvelApp.minutes);
        marvelApp.milliseconds = marvelApp.milliseconds + 1;
    if (marvelApp.milliseconds === 100) {
        marvelApp.seconds = marvelApp.seconds + 1;
        marvelApp.milliseconds = 0;
    }
    if (marvelApp.seconds === 60) {
        marvelApp.minutes = marvelApp.minutes + 1;
        marvelApp.seconds = 0;
    }
    if (marvelApp.milliseconds < 10 || marvelApp.milliseconds === 0) {
        marvelApp.milliseconds = '0' + marvelApp.milliseconds;
    }
    if (marvelApp.seconds < 10 || marvelApp.seconds === 0) {
        marvelApp.seconds = '0' + marvelApp.seconds;
    }
    if (marvelApp.minutes < 10 || marvelApp.minutes === 0) {
        marvelApp.minutes = '0' + marvelApp.minutes;
    }

    marvelApp.timer.innerHTML = marvelApp.minutes + ':' + marvelApp.seconds + ':' + marvelApp.milliseconds;
    setTimeout("marvelApp.timerCycle()", 10);
  }
}

marvelApp.matchedCards = document.getElementsByClassName('matched');

// add event listeners to each card
marvelApp.setUpEventListeners = () => {
    document.querySelectorAll(".characterCard").forEach(query => {
        query.addEventListener("click", function() {
        
        // function to add classes to animate card flipping over when clicked
        const displayCard = () => {
            this.classList.add("disabled");
            this.firstChild.classList.add("flip");
            this.lastChild.classList.add("flip");
        }

        const flipCard = () => {
            flippedCards.push(this);
            if (flippedCards.length === 2) {
                marvelApp.moveCounter();
                if (flippedCards[0].lastChild.id === flippedCards[1].lastChild.id) {
                    marvelApp.matchingCards();
                } else {
                    marvelApp.notMatchingCards();
                }
            }
        }
        
        function solved() {
            if (marvelApp.matchedCards.length === 16) {
                // When user has correctly matched all tiles, stopwatch will stop counting.
                marvelApp.stopTimer();
                // Save final time into a variable
                marvelApp.timePassed = marvelApp.timer.innerHTML;
                
                // Pop up will let user know their time and that they've completed the game.
                const gameboard = document.querySelector(".innerGameboard");
                const popUp = document.createElement("div");
                popUp.classList.add("popup")

                const congratulations = document.createElement("h2")
                const finalMessage = document.createElement("h3");
                const playAgain = document.createElement("button");
                
                congratulations.textContent = "Congratulations!"
                finalMessage.textContent = `You've completed the game in a time of ${marvelApp.timePassed} and with a total number of ${marvelApp.moves} moves.`
                // A button "Play Again?" will show
                playAgain.textContent = "Play Again?";

                marvelApp.playAgain(playAgain);

                popUp.appendChild(congratulations);
                popUp.appendChild(finalMessage);
                popUp.appendChild(playAgain);
                gameboard.appendChild(popUp);
            }
        }
        displayCard();
        marvelApp.startTimer();
        flipCard();
        solved();
        });
    });
}

// If values of two selections match, keep tiles face up.
marvelApp.matchingCards = () => {
    flippedCards[0].classList.add("matched");
    flippedCards[1].classList.add("matched");
    flippedCards = [];
}

// If values of two selections don't match, turn tiles back over.
marvelApp.notMatchingCards = () => {
    flippedCards[0].classList.add("notMatched");
    flippedCards[1].classList.add("notMatched");
    marvelApp.disable();

    setTimeout(function(){
    flippedCards[0].firstChild.classList.remove("flip");
    flippedCards[0].lastChild.classList.remove("flip");
    flippedCards[1].firstChild.classList.remove("flip");
    flippedCards[1].lastChild.classList.remove("flip");
    flippedCards[0].classList.remove("notMatched");
    flippedCards[1].classList.remove("notMatched");

    flippedCards = [];

    marvelApp.enable();
    },1000);
}

// Function to disable cards
marvelApp.disable = () => {
    const cards = document.querySelectorAll(".characterCard");
    cards.forEach(card => {
        card.classList.add("disabled");
    })
}

// Function to enable cards again after disabling
marvelApp.enable = () => {
    const cards = document.querySelectorAll(".disabled");
    cards.forEach(card => {
        card.classList.remove("disabled");
    })
    const matched = document.querySelectorAll(".matched");
    matched.forEach(match => {
        match.classList.add("disabled");
    })
}

// Move counter will count +1 for every 2 cards flipped
marvelApp.moves = 0;

marvelApp.moveCounter = () => {
    marvelApp.moves++;
    const counter = document.getElementById("count");
    counter.innerHTML = marvelApp.moves;
}

// Listen to play again button click event. Popup will disappear. New data will be pulled. 
marvelApp.playAgain = (resetButton) => {
    resetButton.addEventListener("click", function() {
        const popUp = document.querySelector(".popup");
        popUp.parentElement.removeChild(popUp);
        marvelApp.init();
    });
    const innerGameboard = document.querySelector(".innerGameboard");
    innerGameboard.innerHTML = "";
    const timer = document.querySelector("#stopwatch");
    timer.innerHTML = "00:00:00";
    const counter = document.querySelector("#count");
    counter.innerHTML = "0";
    marvelApp.milliseconds = 0;
    marvelApp.seconds = 0;
    marvelApp.minutes = 0;
    marvelApp.moves = 0;
}

// Create marvelApp init function
marvelApp.init = async () => {
    await marvelApp.getCharacterArray(marvelApp.NUMBER_CHARACTERS);
    marvelApp.setUpEventListeners();
    flippedCards = [];
}

// Call the marvelApp init functtion
marvelApp.init();