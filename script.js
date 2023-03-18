import firebaseInfo from "./firebase.js";
import { getDatabase, ref, set, get, onValue, push } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js"
// initialize db content
const database = getDatabase(firebaseInfo);
// create reference to db content
    // path to scoreboard array
    const scoreBoardsArrayPath = ref(database, `scoreBoardsArray`);
    // path to questions array
    const questionArrayPath = ref(database, `questionsArray`)


// quiz app
const quizApp = {};

// user points
let userPoints = 0;
// current question
let chosenQuestion = {};

// landingPage
const landingPageDiv = document.querySelector('.landingPage');
    // form
const landingPageForm = document.querySelector('form');
    // input
const landingPageUsernameInput = document.querySelector('#username');
    // button
const landingPageButton = document.querySelector('.landingPageButton');

// playing game page
const playingPageDiv = document.querySelector('.playingPage');
// question h2 element
const playingPageQuestion = document.querySelector('.question');
// points container
const pointDisplay = document.querySelector('.pointsContainer')
pointDisplay.innerHTML = userPoints;
// countdown time container 
const timeContainer = document.querySelector('.timeContainer');
// warning texts
const warningMessage = document.querySelector('.warnings')

// target all MC buttons
const mCButtons = document.querySelectorAll('.mCButton');

// score board page
const scoreBoardPageDiv = document.querySelector('.scoreBoardPage')
    // list of scores  
const listOfScores = document.querySelector('.scoreList');
    // restart button
const restartButton = document.querySelector('.restartButton'); 

// function to hide and make visible pages
const hideAppearFunc = (hiddenPage, appearPage) => {
    hiddenPage.classList.add('hidden');
    appearPage.classList.remove('hidden');
}

// function for the end of the quiz
const endOfTest = () => {
    
    hideAppearFunc(playingPageDiv , scoreBoardPageDiv);
    // push the updated score here?
}

// function for timer
let startingTime = 60;
timeContainer.innerHTML = `Time: ${startingTime}'s`;

// landing page form event listener start
const formSubmitHandler = (event) => {
    event.preventDefault();
    // push what user's username into db
    const usernameInput = landingPageUsernameInput.value.trim();
    
    if (usernameInput) {

        // const scoreBoardsArrayPath = ref(database, `scoreBoardsArray`);

        // push(scoreBoardsArrayPath, playerInfo)

        // return value of userInput to empty string:
        landingPageUsernameInput.value = '';

        // set user points to zero
        let userPoints = 0;

        // set starting time to 60 seconds
        let startingTime = 60;

        // call hideAppearFunc to hide landing page and make visible playing page
        hideAppearFunc(landingPageDiv, playingPageDiv);
        

        // call start timer function to start the timer!
        const countDown = setInterval(function () {

            startingTime--;
            timeContainer.innerHTML = `Time: ${startingTime}'s`;
            if (startingTime <= 58) {
                warningMessage.textContent = 'The hardest choices require the strongest wills - Thanos';
            }
            if (startingTime <= 50) {
                warningMessage.textContent = 'So many snacks, so little time . . . Let\'s go already! - Hangry Venom';
            }
            if (startingTime <= 40) {
                warningMessage.textContent = 'Doom is no one\'s second choice. - Dr. Doom';
            }
            if (startingTime <= 30) {
                warningMessage.textContent = 'Don\'t ever apologize for being the smartest one in the room. - Mysterio';
            }
            if (startingTime <= 10) {
                warningMessage.textContent = 'Your slowing down arachnid! - Doctor Octopus';
            }
            if (startingTime <= 2) {
                warningMessage.textContent = 'Now the outcome is a foregone conclusion! - Green Goblin';
            }
            if (startingTime <= 0) {
                clearInterval(countDown)
                // push username and score to scoreboard
                const playerInfo = {
                    playerName: usernameInput,
                    playerScore: parseInt(pointDisplay.innerHTML)
                };

                push(scoreBoardsArrayPath, playerInfo)

                // Next is to sort the players based on their score
                // then we append usernames with scores to scoreboard page
                // then we need to transition to scoreboard page
                hideAppearFunc(playingPageDiv, scoreBoardPageDiv)

            }
        }, 1000);
        // end of time setup

    }
}

// on value function to LISTEN for scores to update high score table
onValue(scoreBoardsArrayPath , (data) => {
    if(data.exists()){
        const scoreArray = data.val();

        // create empty updated array to set as score list innerHTML value
        const updatedArray = [];

        // create empty array to sort through
        const scoreSortArray = [];

        // to access the OBJ property loop through the data
        for (let prop in scoreArray){
            // create new li to store data
            const scoreLiElement = document.createElement('li');
                // create div to separate player info left and right
            const playerInfoDiv = document.createElement('div');
            playerInfoDiv.classList.add('playerInfoDivider');
                // create 'p' elements to contain the info
            const paraPlayerName = document.createElement('p');
            const paraPlayerScore = document.createElement('p');
                // create the textnodes for playername and score
            const playerNameTextNode = document.createTextNode(scoreArray[prop].playerName)
            const playerScoreTextNode = document.createTextNode(scoreArray[prop].playerScore)
            // append text nodes to paragraph elements
                paraPlayerName.appendChild(playerNameTextNode);
                paraPlayerScore.appendChild(playerScoreTextNode);
            // append paragraph elements inside of div
                playerInfoDiv.append(paraPlayerName, paraPlayerScore);
            // append div to li element
                scoreLiElement.append(playerInfoDiv);
            // set the value of each li as the score in order to sort
                scoreLiElement.value = scoreArray[prop].playerScore;

            // add li's into array
            scoreSortArray.push(scoreLiElement)
            // sort through the array
            scoreSortArray.sort(function(a, b){
                return b.value - a.value;
            })

        }
        scoreSortArray.forEach(liElement => {
            const newLiElement = liElement.outerHTML;
            updatedArray.push(newLiElement);
        });

        listOfScores.innerHTML = updatedArray.join('');

    }
})

landingPageForm.addEventListener('submit', formSubmitHandler)
// landing page form event listener end

const randomQuestionFunction = () => {

    // use get method to retrieve data from db
    get(questionArrayPath).then((data) => {
        const questionArrayData = data.val();

        const newCopiedArray = [...questionArrayData];
        

        // select question in array randomly
        const getRandomQuestion = Math.floor(Math.random() * newCopiedArray.length);
        chosenQuestion = newCopiedArray[getRandomQuestion];
        // append the question to h2
        playingPageQuestion.textContent = chosenQuestion.question;
        // making the text content equal to each of the answers
        mCButtons.forEach(button => {
            button.classList.remove('correct', 'incorrect');
            button.disabled = false;

            const number = button.value;
            button.textContent = chosenQuestion.choices[number];
        })
        
    // use splice method in questionArrayData to stop questions from repeating
        
        // let removedQuestion = newCopiedArray.splice(getRandomQuestion, 1)
    })
}

randomQuestionFunction();


// add event listener to each on of the multiple choice buttons to evaluate the answer
mCButtons.forEach(button => {

    button.addEventListener('click', function (event) {
        
        const playerChoice =  event.target;
        const selectedAnswer = parseInt(playerChoice.value);
        
        if (selectedAnswer === chosenQuestion.answer) {
            userPoints = userPoints + 1;
            pointDisplay.innerHTML = userPoints;
            event.target.classList.add('correct')
        } else {
            userPoints = userPoints - 1;
            pointDisplay.innerHTML = userPoints;
            event.target.classList.add('incorrect')
        }

        mCButtons.forEach(button => {
            button.disabled = true;
        })
        setTimeout(randomQuestionFunction, 1000)

    })
});


// restart the game 
restartButton.addEventListener('click', function(event){
    hideAppearFunc(scoreBoardPageDiv, landingPageDiv)
    // reset timer
    let startingTime = 60;
    timeContainer.innerHTML = 60;
    // reset score
    let userPoints = 0;
    pointDisplay.innerHTML = 0;
})



// set data
// function addToFirebaseDb(key, value) {

//     const customRef = ref(database, key)

//     return set(customRef, value)
// }

// addToFirebaseDb('scoreBoardsArray', scoreBoardArray);
// addToFirebaseDb('questionsArray', questionArray);

// empty scoreboard array
// const scoreBoardArray = [
//     {
//         // playerName: usernameInput,
//         playerScore: userPoints
//     }
// ];