
const QuranDataCtrl = (function () {
    return {
        getSectionData: async function (sectionName, sectionNumber) {
            sectionName = sectionName.toLowerCase();
            let sectionFileName = sectionName;

            if (sectionName === 'five') {
                sectionFileName = 'five';
                sectionName = 'fives';
            }

            const sectionData = await fetch(`quranData/${sectionName}/${sectionFileName}${sectionNumber}.json`);
            return sectionData.json();
        }
    }
})();

const StorageCtrl = (function () {

    return {
        getGameDataFromStorage: function () {
            let gameRawData = localStorage.getItem('gameRawData');

            if (gameRawData === null) {
                return null;
            } else {
                return JSON.parse(gameRawData);
            }
        },
        storeGameDataToStorage: function (gameData) {
            localStorage.setItem('gameRawData', JSON.stringify(gameData));
        },
        deleteGameDataInStorage: function () {
            localStorage.removeItem('gameRawData');
        }
    }
})();

const GameCtrl = (function () {

    const gameData = {
        dataLoaded: false,
        numPlayers: 0,
        numRounds: 0,
        quranSection: '',
        quranSectionNumber: '1',
        playerNames: [],
        currPlayerIndex: 0,
        currRound: 0,
        playerScores: [],
        sectionData: [],
        wordIndex: 0,
        gameEndIndex: 0
    }

    return {
        loadGameData: function (options) {
            gameData.numPlayers = options.numPlayers;
            gameData.numRounds = options.numRounds;
            gameData.quranSection = options.quranSection;
            gameData.quranSectionNumber = options.quranSectionNumber;
            gameData.playerNames = options.playerNames;
            gameData.currPlayerIndex = options.currPlayerIndex;
            gameData.currRound = options.currRound;
            gameData.playerScores = options.playerScores;
            gameData.sectionData = options.sectionData;
            gameData.wordIndex = options.wordIndex;
            gameData.gameEndIndex = options.gameEndIndex;

            // for help
            gameData.dataLoaded = true;
        },
        getGameData: function () {
            return gameData;
        },
        isDataLoaded: function () {
            return gameData.dataLoaded;
        },
        setDataLoaded: function (value) {
            gameData.dataLoaded = value;
        },
        getCurrWord: function () {
            // send the current word
            return gameData.sectionData[gameData.wordIndex];
        },
        addScoreToPlayer: function (playerIndex) {

        },
        nextRound: function () {
            if (gameData.currRound < gameData.numRounds) {
                gameData.currRound++;
                return true; // game continue
            } else {
                return false; // game end
            }
        },
        getCurrRound: function () {
            return gameData.currRound;
        },
        getNumRounds: function () {
            return gameData.numRounds;
        },
        updateGameRound: function () {

        },
        setCurrPlayerIndex: function (index) {
            gameData.currPlayerIndex = index;
        },
        updatePlayerScore: function (index, score) {
            gameData.playerScores[index] = gameData.playerScores[index] + score;
        },
        getplayerScore: function (index) {
            return gameData.playerScores[index];
        },
        setWordIndex: function (wordIndex) {
            gameData.wordIndex = wordIndex;
        },
        moveWordIndex: function () {
            gameData.wordIndex++;
        },
        getCurrPlayerIndex: function () {
            return gameData.currPlayerIndex;
        },
        moveToNextPlayer: function () {
            if (gameData.currPlayerIndex === gameData.numPlayers - 1) {
                gameData.currPlayerIndex = 0;
            } else {
                gameData.currPlayerIndex++;
            }
        },
        restartGame: function () {
            gameData.currPlayerIndex = 0;
            gameData.currRound = 1;

            for (let i = 0; i < gameData.playerScores.length; i++) {
                gameData.playerScores[i] = 0;
            }

            // randomize the section data
            let j, temp;

            for (let i = gameData.sectionData.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                temp = gameData.sectionData[i];
                gameData.sectionData[i] = gameData.sectionData[j];
                gameData.sectionData[j] = temp;
            }

            gameData.wordIndex = 0;
        }
    }
})();

const UiCtrl = (function () {

    const UiSelectors = {
        newGame: '#new-game',
        numPlayers: '#num-players',
        numRounds: '#number-rounds',
        playerNames: '#player-names',
        quranSection: '#quran-section',
        quranSectionNumber: '#quran-section-number',
        createNewGameBtn: '#create-new-game-btn',
        gamePlay: '#game-play',
        currRoundNumber: '#current-round-number',
        question: '#question',
        currPlayer: '#curr-player',
        answer: '#answer',
        score: '#score',
        submitScoreBtn: '#submit-score-btn',
        players: ['#player1', '#player2', '#player3', '#player4'],
        playerGameNames: ['#player1-name', '#player2-name', '#player3-name', '#player4-name'],
        playerGameScores: ['#player1-score', '#player2-score', '#player3-score', '#player4-score'],
        newGameBtn: '#new-game-btn',
        restartGameBtn: '#restart-game-btn',
        answerHeader: '#answer-header',
        answerBody: '#answer-body',
        gameOver: '#game-over'
    }

    return {
        displayCreateGame: function () {
            document.querySelector(UiSelectors.newGame).style.display = 'block';
        },
        hideCreateGame: function () {
            document.querySelector(UiSelectors.newGame).style.display = 'none';
        },
        clearCreateGame: function () {
            document.querySelector(UiSelectors.numPlayers).value = '';
            document.querySelector(UiSelectors.quranSectionNumber).value = '';
            document.querySelector(UiSelectors.playerNames).value = '';
            document.querySelector(UiSelectors.numRounds).value = '';
        },
        displayGamePlay: function () {
            document.querySelector(UiSelectors.gamePlay).style.display = 'block';
        },
        hideGamePlay: function () {
            document.querySelector(UiSelectors.gamePlay).style.display = 'none';
        },
        getUiSelectors: function () {
            return UiSelectors;
        },
        getDataFromCreateGame: function () {
            const newGameData = {
                numPlayers: parseInt(document.querySelector(UiSelectors.numPlayers).value),
                numRounds: parseInt(document.querySelector(UiSelectors.numRounds).value) + 1,
                quranSectionNumber: document.querySelector(UiSelectors.quranSectionNumber).value,
                playerNames: document.querySelector(UiSelectors.playerNames).value.split(','),
                currRound: 1,
                currPlayerIndex: 0,
                wordIndex: 0
            }

            // others that need more computation
            const e = document.querySelector(UiSelectors.quranSection);
            newGameData.quranSection = e.options[e.selectedIndex].text;

            newGameData.playerScores = [];
            for (let i = 0; i < newGameData.numPlayers; i++) {
                newGameData.playerScores.push(0);
            }

            return newGameData;
        },
        setGamePlayData: function (gameData) {

            document.querySelector(UiSelectors.currRoundNumber).textContent = `Round ${gameData.currRound}`;
            document.querySelector(UiSelectors.currPlayer).textContent = `${gameData.playerNames[gameData.currPlayerIndex]}`;
            document.querySelector(UiSelectors.question).innerHTML = gameData.sectionData[0].word;
            document.querySelector(UiSelectors.answerBody).innerHTML = `Translation: ${wordObject.translation}, Occurences: ${wordObject.occurences}`;

            // set the avaiable slots to the data
            for (let i = 0; i < gameData.numPlayers; i++) {
                document.querySelector(UiSelectors.playerGameNames[i]).textContent = gameData.playerNames[i];
                document.querySelector(UiSelectors.playerGameScores[i]).textContent = gameData.playerScores[i];
            }

            // hide the ones that are not available
            for (let i = gameData.numPlayers; i < 4; i++) { //  4 is max num players
                document.querySelector(UiSelectors.players[i]).style.display = 'none';
            }
        },
        disableSubmitButton: function () {
            document.querySelector(UiSelectors.submitScoreBtn).disabled = true;
        },
        showGameOver: function () {
            document.querySelector(UiSelectors.gameOver).style.display = 'block';
        },
        hideGameOver: function () {
            document.querySelector(UiSelectors.gameOver).style.display = 'none';
        },
        displayError: function (errorMessage) {

        },
        showNextPlayerRound: function (name, wordObject) {
            document.querySelector(UiSelectors.currPlayer).textContent = name;
            document.querySelector(UiSelectors.question).innerHTML = wordObject.word;
            document.querySelector(UiSelectors.answerBody).innerHTML = `Translation: ${wordObject.translation}, Occurences: ${wordObject.occurences}`;
        },
        displayGameOver: function (gameData) {

        },
        updateGameRound: function () {

        },
        updatePlayerScore: function (index, score) {
            document.querySelector(UiSelectors.playerGameScores[index]).textContent = score;
        },
        clearScore: function () {
            document.querySelector(UiSelectors.score).value = '';
        },
        nextRound: function (round) {
            document.querySelector(UiSelectors.currRoundNumber).textContent = `Round ${round}`;
        },
        displayBadScoreEffect: function () {
            document.querySelector(UiSelectors.score).classList.add('border-danger');
        },
        removeBadScoreEffect: function () {
            document.querySelector(UiSelectors.score).classList.remove('border-danger');
        }
    }
})();

const App = (function (GameCtrl, UiCtrl, StorageCtrl, QuranDataCtrl) {

    const loadEventListeners = function () {

        const uiSelectors = UiCtrl.getUiSelectors();

        // window.addEventListener("beforeunload", function (event) {
        //     StorageCtrl.storeGameDataToStorage(GameCtrl.getGameData());
        // });

        // create game
        document.querySelector(uiSelectors.createNewGameBtn).addEventListener('click', createNewGame);

        // submit button
        document.querySelector(uiSelectors.submitScoreBtn).addEventListener('click', grabNewScore);

        // menu buttons
        document.querySelector(uiSelectors.newGameBtn).addEventListener('click', onNewGameBtnClick);
        document.querySelector(uiSelectors.restartGameBtn).addEventListener('click', onRestartGameBtnClick);

        // answer body
        document.querySelector(uiSelectors.answerHeader).addEventListener('mouseover', showAnswer);
        document.querySelector(uiSelectors.answerHeader).addEventListener('mouseout', hideAnswer);

        // select quran section
        document.querySelector(uiSelectors.quranSection).addEventListener('change', function () {
            if (this.value === '1') {
                document.querySelector(uiSelectors.quranSectionNumber).placeholder = '1-120';
            } else if (this.value === '2') {
                document.querySelector(uiSelectors.quranSectionNumber).placeholder = '1-60';
            } else if (this.value === '3') {
                document.querySelector(uiSelectors.quranSectionNumber).placeholder = '1-30';
            }
        });
    }

    const showAnswer = function () {
        document.querySelector(UiCtrl.getUiSelectors().answerBody).style.display = 'block';
    }

    const hideAnswer = function () {
        document.querySelector(UiCtrl.getUiSelectors().answerBody).style.display = 'none';
    }

    const createNewGame = async function () {

        // get all the data from ui ctrl
        const newGameData = UiCtrl.getDataFromCreateGame();

        // authenticate options and complain otherwise -> 'Check the entries and try again'
        if (!authentiateDataEntry(newGameData)) {
            UiCtrl.displayError('enter correct values and try again');
            return;
        }

        // read section data and start game play
        await readSectionDataAndStartGamePlay(newGameData, 'error starting new game');

        if (GameCtrl.isDataLoaded()) { // the game create was succesful
            // set game data
            UiCtrl.setGamePlayData(GameCtrl.getGameData());

            UiCtrl.hideCreateGame();
            UiCtrl.displayGamePlay();

            // store data
            StorageCtrl.storeGameDataToStorage(newGameData);
        }
    }

    const authentiateDataEntry = function (gameData) {

        // check for what is, else false
        if ((gameData.numPlayers > 1 && gameData.numPlayers < 5) && (gameData.numPlayers === gameData.playerNames.length)
            && (gameData.quranSection === 'Five' || gameData.quranSection === 'Hizb' || gameData.quranSection === 'Juz')
            && (gameData.numRounds > 1 && gameData.numRounds < 11)) {
            return true;
        }

        return false;
    }

    const readSectionDataAndStartGamePlay = async function (gameData, errorMessage) {
        // get the section data and load game data
        await QuranDataCtrl.getSectionData(gameData.quranSection, gameData.quranSectionNumber)
            .then(sectionData => {

                sectionData = sectionData.rangeHash;
                // randomize the section data
                let j, temp;

                for (let i = sectionData.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    temp = sectionData[i];
                    sectionData[i] = sectionData[j];
                    sectionData[j] = temp;
                }

                gameData.sectionData = sectionData;

                // pass the parsed data into the gamectrl
                GameCtrl.loadGameData(gameData);
            })
            .catch(error => {
                UiCtrl.displayError(errorMessage);
                console.log(errorMessage);

                // UiCtrl.clearCreateGame();
                UiCtrl.displayCreateGame();

                GameCtrl.setDataLoaded(false);
            })
    }

    const onNewGameBtnClick = function () {

        // remove game over if present
        UiCtrl.hideGameOver();

        // clear the former data
        StorageCtrl.deleteGameDataInStorage()

        // hide game play
        UiCtrl.hideGamePlay();

        // display create game
        UiCtrl.clearCreateGame();
        UiCtrl.displayCreateGame();
    }

    const onRestartGameBtnClick = function () {

        // remove game over if present
        UiCtrl.hideGameOver();

        // reset the data to the original
        GameCtrl.restartGame();

        // set game play data
        UiCtrl.setGamePlayData(GameCtrl.getGameData());

        // play game
        gamePlay();
    }

    // recieve a score from UiCtrl -> on the button click, collect the score
    const grabNewScore = function () {

        const uiSelectors = UiCtrl.getUiSelectors();

        const rawScore = document.querySelector(uiSelectors.score).value;
        if (rawScore === '') {
            return;
        }

        GameCtrl.moveWordIndex();

        const score = parseInt(rawScore);
        const currPlayerIndex = GameCtrl.getCurrPlayerIndex();

        UiCtrl.clearScore();
        GameCtrl.updatePlayerScore(currPlayerIndex, score);

        // update the new score
        UiCtrl.updatePlayerScore(currPlayerIndex, GameCtrl.getplayerScore(currPlayerIndex));


        // if round is complete
        if (GameCtrl.getCurrPlayerIndex() === GameCtrl.getGameData().numPlayers - 1) {
            GameCtrl.nextRound();
            UiCtrl.nextRound(GameCtrl.getCurrRound());
        }

        // if all round are exhausted
        if (GameCtrl.getCurrRound() === GameCtrl.getNumRounds()) {
            UiCtrl.showGameOver();
            UiCtrl.disableSubmitButton();
            return;
        }

        // move to next player
        GameCtrl.moveToNextPlayer();

        // resume gameplay
        gamePlay();
    }

    const gamePlay = function () {

        const gameData = GameCtrl.getGameData();

        console.log(gameData.currRound, gameData.numRounds, gameData.wordIndex, gameData.sectionData.length);
        // while there is still a valid round
        if (gameData.currRound <= gameData.numRounds && gameData.wordIndex < gameData.sectionData.length) {

            // for the current player
            if (gameData.currPlayerIndex < gameData.numPlayers) {

                const currWord = GameCtrl.getCurrWord();
                if (currWord === null) {
                    // what to do?
                }
                UiCtrl.showNextPlayerRound(gameData.playerNames[gameData.currPlayerIndex], currWord);
            }
        }
    }

    return {
        init: function () {

            // load event listeners
            loadEventListeners();

            // check if there is data already saved
            let gameData = StorageCtrl.getGameDataFromStorage();

            if (gameData === null) {
                //display the create game screen
                UiCtrl.displayCreateGame();

            } else {
                if (authentiateDataEntry(gameData)) {
                    // load the previous data
                    GameCtrl.loadGameData(gameData);

                    // set game data
                    UiCtrl.setGamePlayData(GameCtrl.getGameData());

                    // display the game play ui
                    UiCtrl.displayGamePlay();
                }
            }

            // start game
            gamePlay();
        }
    }
})(GameCtrl, UiCtrl, StorageCtrl, QuranDataCtrl);

App.init();