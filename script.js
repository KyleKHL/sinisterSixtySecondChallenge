import firebaseInfo from "./firebase.js";
import { getDatabase, ref, set, get, onValue, push } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js"
// initialize db content
const database = getDatabase(firebaseInfo);
// create reference to db content
const dbRef = ref(database);

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
    hiddenPage.classList.add = 'hidden';
    appearPage.classList.remove = 'hidden';
}

// function for the end of the quiz
const endOfTest = () => {
    
    hideAppearFunc(playingPageDiv , scoreBoardPageDiv);
    // push the updated score here?
}

// function for timer
let startingTime = 60;
timeContainer.innerHTML = `${startingTime}'s`;

// empty scoreboard array
const scoreBoardArray = [
    {
        // playerName: usernameInput,
        playerScore: userPoints
    }
];

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
            timeContainer.innerHTML = `${startingTime}'s`;
            if (startingTime <= 58) {
                warningMessage.textContent = 'Your time is limited, make the most of it!';
            }
            if (startingTime <= 50) {
                warningMessage.textContent = 'Tick-tock, the clock is ticking . . .';
            }
            if (startingTime <= 40) {
                warningMessage.textContent = 'Let\'s go! Let\'s go!';
            }
            if (startingTime <= 30) {
                warningMessage.textContent = 'Time waits for no one, especially not you!';
            }
            if (startingTime <= 10) {
                warningMessage.textContent = 'Time is a cruel master and it\'s catching up to you!';
            }
            if (startingTime <= 2) {
                warningMessage.textContent = 'Times up!';
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
            console.log(scoreArray[prop].playerScore)
            console.log(scoreArray[prop].playerName)
            

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


// const questionArray = [
//     {
//         question: 'Who said: "You should have gone for the head ..."',
//         choices: ['Thanos', 'King Pin', 'Ares', 'Galactus'],
//         answer: 1
//     },
//     {
//         question: 'Which of the following villains is NOT a child of Thanos? ',
//         choices: ['Ebony Maw', 'Zehobereri Gamora', 'Cull Obsidian', 'Ronan'],
//         answer: 4
//     },
//     {
//         question: 'This villain wears a golden horned helmet:',
//         choices: ['Magneto', 'Loki', 'Red Skull', 'Ultron'],
//         answer: 2
//     },
//     {
//         question: 'This Spider-man villain is NOT an original member of the sinister six:',
//         choices: ['Doc Oc', 'Kraven', 'Mysterio', 'Venom'],
//         answer: 4
//     },
//     {
//         question: 'Who was the big baddie in the MCU\'s first Guardians of the galaxy?',
//         choices: ['Groot', 'Gamora', 'Thanos', 'Ronan'],
//         answer: 4
//     },
//     {
//         question: 'Which villain is capable of destroying entire universes?',
//         choices: ['Magneto', 'Molecule Man', 'Doc Oc', 'Malekith'],
//         answer: 2
//     },
//     {
//         question: 'Which villain was behind secret wars?',
//         choices: ['Thanos', 'Kang', 'Dr. Doom', 'Galactus'],
//         answer: 3
//     },
//     {
//         question: 'Which of the following villains is regarded as "The Devourer of Worlds"?',
//         choices: ['Galactus', 'Ego', 'Molecule Man', 'The One Above All'],
//         answer: 1
//     },
//     {
//         question: 'Thanos was NOT defeated by which one of following the heroes?',
//         choices: ['Squirrel Girl', 'Spiderman', 'Iron Man', 'Adam Warlock'],
//         answer: 2
//     },
//     {
//         question: 'What villain implanted his mind inside of Spiderman?',
//         choices: ['Dr. Doom', 'Green Goblin', 'Loki', 'Doc Oc'],
//         answer: 3
//     },
//     {
//         question: 'Who was betrayed by the sinister six?',
//         choices: ['Green Goblin', 'Venom', 'Kraven', 'Electro'],
//         answer: 1
//     },
//     {
//         question: 'What villain was originally from Russia?',
//         choices: ['Rhino', 'Dr. Doom', 'Electro', 'Morbius'],
//         answer: 0
//     },
//     {
//         question: 'Who created the Sentinel robots?',
//         choices: ['Dr. Doom', 'Doctor Bolivar Trask', 'William Stryker', 'Doc Oc'],
//         answer: 1
//     },
//     {
//         question: 'Which of the following villains has the sole ambition of exterminating all mutants?',
//         choices: ['Dr. Doom', 'Magneto', 'William Stryker', 'Obadiah Stane'],
//         answer: 3
//     },
//     {
//         question: 'Which villain has a big head . . . like REALLY BIG HEAD?',
//         choices: ['Rhino', 'Chameleon', 'M.O.D.O.K.', 'Apocalypse'],
//         answer: 2
//     },
//     {
//         question: 'What villain managed to defeat the Beyonders?',
//         choices: ['Kang', 'Thanos', 'Loki', 'Dr. Doom'],
//         answer: 3
//     },
//     {
//         question: 'Which of the following villains are immune to aging and death?',
//         choices: ['Gorr', 'Kang', 'Loki', 'Chaos King'],
//         answer: 3
//     },
//     {
//         question: 'Which of the following villains is said to have the greatest military mind in history?',
//         choices: ['Thanos', 'Kang', 'Chaos King', 'Gorr'],
//         answer: 1
//     },
//     {
//         question: 'Which villain withstood a blast from Thanos using the Infinity Gauntlet?',
//         choices: ['Dr. Doom', 'Kang', 'Galactus', 'Ultron'],
//         answer: 0
//     },
//     {
//         question: 'What group is responsible for the incursions?',
//         choices: ['HYDRA', 'The Beyonders', 'Hellfire Club', 'Sinister Six'],
//         answer: 1
//     },
//     {
//         question: 'What villain falls in love with lady Death?',
//         choices: ['Dr. Doom', 'Dormammu', 'Thanos', 'Galactus'],
//         answer: 2
//     },
//     {
//         question: 'Onslaught is an entity created by the consciousness of Dr. Xavier and . . .?',
//         choices: ['Magneto', 'Dr. Doom', 'William Stryker', 'Doctor Bolivar Trask'],
//         answer: 0
//     },
//     {
//         question: 'What villain defeated The Avengers, Fantastic Four, Dr. Doom and Bruce Banner?',
//         choices: ['Dormammu', 'Ego', 'King Pin', 'Onslaught'],
//         answer: 3
//     },
//     {
//         question: 'On his way to power, which villain becomes the Mayor of New York?',
//         choices: ['Taskmaster', 'King Pin', 'Namor', 'Doc Oc'],
//         answer: 2
//     },
//     {
//         question: 'The Thunderbolts are secretly the . . . ?',
//         choices: ['Sinister Six', 'The Thunderbolts', 'Savage Six', 'Masters of Evil'],
//         answer: 3
//     },
//     {
//         question: 'In Civil War, what villain assisted Iron Man to recruit villains to his cause?',
//         choices: ['Zemo', 'Taskmaster', 'Chameleon', 'Mystique'],
//         answer: 0
//     },
//     {
//         question: 'What villain is revealed to actually be a frost giant?',
//         choices: ['Galactus', 'Loki', 'Gorr', 'The Juggernaut'],
//         answer: 1
//     },
//     {
//         question: 'What is the name of the villainous organization that Red Skull leads?',
//         choices: ['HYDRA', 'AIM', 'The Hand', 'The Thunderbolts'],
//         answer: 0
//     },
//     {
//         question: 'Who is the archenemy of Spider-Man and the leader of the Sinister Six?',
//         choices: ['Green Goblin', 'Sandman', 'Venom', 'Doc Oc'],
//         answer: 3
//     },
//     {
//         question: 'What is the name of the villain who possesses the Cosmic Cube, an artifact that can alter reality?',
//         choices: ['Ronan', 'Kang', 'Ultron', 'Red Skull'],
//         answer: 3
//     },
//     {
//         question: 'Who is the primary villain in the Spider-Man comics?',
//         choices: ['Green Goblin', 'Venom', 'Doc Oc', 'Kraven'],
//         answer: 0
//     },
//     {
//         question: 'Who is the leader of the Brotherhood of Mutants?',
//         choices: ['Juggernaut', 'Magneto', 'Mystique', 'Sabretooth'],
//         answer: 1
//     },
//     {
//         question: 'Who is the archenemy of the Punisher?',
//         choices: ['Kingpin', 'Jigsaw', 'Bullseye', 'Taskmaster'],
//         answer: 1
//     },
//     {
//         question: 'What is Thanos\' original name, given to him at birth?',
//         choices: ['Thane', 'Dione', 'George', 'Kratos'],
//         answer: 1
//     },
//     {
//         question: 'What is the name of the villain who possesses the ability to manipulate reality?',
//         choices: ['Enchantress', 'Scarlet Witch', 'Hela', 'Nebula'],
//         answer: 1
//     },
//     {
//         question: 'What is the name of the villain who uses his powers to control minds?',
//         choices: ['Mysterio', 'The Purple Man', 'Electro', 'Scarlet Witch'],
//         answer: 1
//     },
//     {
//         question: 'What is the name of the villain who is a master assassin and mercenary?',
//         choices: ['Sabretooth', 'Bullseye', 'Deadpool', 'Lady Deathstrike'],
//         answer: 1
//     },
//     {
//         question: 'What is the source of the power of the villain Doctor Strange\'s archenemy, Dormammu?',
//         choices: ['Cosmic Radiation', 'The Darkhold', 'The Dark Dimension', 'The Power Cosmic'],
//         answer: 2
//     },
//     {
//         question: 'What is the name of the villain who is a cyborg with enhanced strength and speed?',
//         choices: ['Winter Soldier', 'Deathlok', 'Taskmaster', 'Crossbones'],
//         answer: 1
//     },
//     {
//         question: 'What villain implanted his mind inside of Spiderman?',
//         choices: ['Dr. Doom', 'Green Goblin', 'Loki', 'Doc Oc'],
//         answer: 3
//     },
//     {
//         question: 'Who created the villain Ultron?',
//         choices: ['Tony Stark', 'Reed Richards', 'Hank Pym', 'Doc Oc'],
//         answer: 2
//     },
//     {
//         question: 'What villain created the "superhero team" the Thunderbolts?',
//         choices: ['The Mandarin', 'Green Goblin', 'Zemo', 'Taskmaster'],
//         answer: 3
//     },
//     {
//         question: 'What is the origin of the villain Apocalypse?',
//         choices: ['Born a mutant with godlike powers', 'Created by genetic engineering', 'Possessed by an ancient god', 'Transformed by alien artifact'],
//         answer: 0
//     },
//     {
//         question: 'What is the origin of the villain Green Goblin\'s powers?',
//         choices: ['Scientific Experimentation', 'Magic', 'Mutant Abilities', 'Alien Technology'],
//         answer: 0
//     },
//     {
//         question: 'What is the name of the villain who mastered mind control and hypnosis?',
//         choices: ['The Puppet Master', 'The Purple Man', 'The Hypnotist', 'The Ventriloquist'],
//         answer: 1
//     },
//     {
//         question: 'What is the origin of the Galactus?',
//         choices: ['Created by Celestials', 'Transformed by the Power Cosmic', 'Born a cosmic Entity', 'Transformed by an alien artifact'],
//         answer: 2
//     },
//     {
//         question: 'What is the source of Doctor Doom\'s power?',
//         choices: ['Alien technology', 'Scientific experimentation', 'Mutant Abilities', 'Magic'],
//         answer: 3
//     },
//     {
//         question: 'What is the name the shape-shifting alien race that seeks to conquer the universe?',
//         choices: ['Skrulls', 'Brood', 'Shi\'ar', 'Kree'],
//         answer: 0
//     },
//     {
//         question: 'What is the name of the villain who is a genius scientist and archenemy of the Hulk?',
//         choices: ['The Leader', 'Abomination', 'The Juggernaut', 'Rhino'],
//         answer: 0
//     },
//     {
//         question: 'What is the main weapon of The Mandarin?',
//         choices: ['Sword', 'Scythe', 'Makluan Rings', 'Scimitar'],
//         answer: 2
//     },
//     {
//         question: 'What villain made it a tradition to find Wolverine on his birthday and fight him?',
//         choices: ['Pyro', 'The Juggernaut', 'Sabretooth', 'Lady Deathstrike'],
//         answer: 2
//     },
//     {
//         question: 'What is the name of the villainous organization that manipulated governments and wealthy targets from the shadows as a secret society?',
//         choices: ['The Brotherhood of Evil Mutants', 'The Illuminati', 'Hellfire Club', 'The Masters of Evil'],
//         answer: 2
//     },
//     {
//         question: 'What villain did Spider-man make a deal with to save his aunt May\'s life?',
//         choices: ['Green Goblin', 'Chaos King', 'Mephisto', 'Doc Oc'],
//         answer: 2
//     },
//     {
//         question: 'What is the name of the villain who is a powerful android with the ability to adapt to any situation?',
//         choices: ['Ultron', 'The High Evolutionary', 'Vision', 'Techno'],
//         answer: 0
//     },
//     {
//         question: 'What is the name of the villain who is a former member of the Avengers turned villain, with the ability to absorb and manipulate energy?',
//         choices: ['Klaw', 'Blackout', 'Grim Reaper', 'Wonder Man'],
//         answer: 3
//     },
//     {
//         question: 'What is the name of the villain who is a symbiote offspring of Venom?',
//         choices: ['Riot', 'Agony', 'Toxin', 'Carnage'],
//         answer: 3
//     },
//     {
//         question: 'What is the name of the villain who is a master of illusions and trickery?',
//         choices: ['Mysterio', 'Scarecrow', 'Arcade', 'Chameleon'],
//         answer: 0
//     },
//     {
//         question: 'What is the name of the villain who is a ruthless business magnate and crime lord?',
//         choices: ['Justin Hammer', 'Wilson Fisk', 'Norman Osborn', 'Alexander Pierce'],
//         answer: 1
//     },
//     {
//         question: 'What is the name of the villain who is a powerful mutant with the ability to control magnetic fields?',
//         choices: ['Mister Sinister', 'The Juggernaut', 'Apocalypse', 'Magneto'],
//         answer: 3
//     },
//     {
//         question: 'What villain dropped an enormous stone on Dr. Xavier leaving his legs crippled?',
//         choices: ['The Juggernaut', 'Magneto', 'Sabretooth', 'Lucifer'],
//         answer: 3
//     },
//     {
//         question: 'This group is best known for building the cosmic cube:',
//         choices: ['The Masters of Evil', 'Hellfire Club', 'HYDRA', 'AIM'],
//         answer: 3
//     },
//     {
//         question: 'This team has one goal: to destroy the Fantastic Four . . . ',
//         choices: ['The Hand', 'Sinister Six', 'The Illuminati', 'The Frightful Four'],
//         answer: 3
//     },
//     {
//         question: 'This team raise the dead to fight their battles:',
//         choices: ['AIM', 'HYDRA', 'The Masters of Evil', 'The Hand'],
//         answer: 3
//     },
//     {
//         question: 'What is the name of the cosmic entity that possesses vast cosmic powers and is considered one of the most powerful beings in the Marvel Universe?',
//         choices: ['Galactus', 'The Beyonder', 'Apocalypse', 'Ego'],
//         answer: 1
//     },
//     {
//         question: 'Who is the villainous ruler of the underwater kingdom of Atlantis and frequently battles the Avengers and the Fantastic Four?',
//         choices: ['Namor the Sub-Mariner', 'Black Manta', 'King Shark', 'Aquaman'],
//         answer: 0
//     },
//     {
//         question: 'Which villain is a powerful sorcerer and master of the dark arts who often battles Doctor Strange?',
//         choices: ['Baron Mordo', 'Dormammu', 'Mephisto', 'Nightmare'],
//         answer: 3
//     },
//     {
//         question: 'Who is the offspring of carnage?',
//         choices: ['Anti-venom', 'Agony', 'Toxin', 'Scorn'],
//         answer: 2
//     },
//     {
//         question: 'Who lead the Skrulls in the secret invasion?',
//         choices: ['Super-Skrull', 'Talos', 'Kl\'rt', 'Veranke'],
//         answer: 3
//     },
//     {
//         question: 'Who is the father of the mad-titan thanos?',
//         choices: ['Kronos', 'Ikaris', 'A\'Lars', 'Eros'],
//         answer: 2
//     },
//     {
//         question: 'Who is the mastermind behind the House of M storyline?',
//         choices: ['Scarlet Witch', 'Quicksilver', 'Magneto', 'Professor X'],
//         answer: 2
//     },
//     {
//         question: 'Who is the ruler of the Negative Zone?',
//         choices: ['Annihilus', 'Blastaar', 'Terrax', 'The Beyonder'],
//         answer: 0
//     },
//     {
//         question: 'Who is the leader of the Savage Land Mutates?',
//         choices: ['Sauron', 'Amphibius', 'Garokk', 'Doc Oc'],
//         answer: 0
//     },
//     {
//         question: 'Who is the father of the time-traveling anti-hero Cable?',
//         choices: ['Cyclops', 'Magneto', 'Green Goblin', 'Hank Pym'],
//         answer: 0
//     },
//     {
//         question: 'How many worlds did the Shi\'ar Empire rule over?',
//         choices: ['Ten', 'Hundreds', 'Thousands', 'Millions'],
//         answer: 3
//     },
//     {
//         question: 'Who is the ruler of the Dark Elves of Svartalfheim?',
//         choices: ['Malekith the Accursed', 'Kurse', 'Hela', 'Loki'],
//         answer: 0
//     },
//     {
//         question: 'Who is the villain that was once a member of the X-Men and later turned to the dark side?',
//         choices: ['Beast', 'Legion', 'Cyclops', 'Wolverine'],
//         answer: 2
//     },
//     {
//         question: 'Who is the warlord of the Deviants, a villain to the Eternals?',
//         choices: ['Ikaris', 'Thanos', 'Kro', 'Zuras'],
//         answer: 2
//     },
//     {
//         question: 'Which Sinister Six member was originally a mercenary before becoming a full-time villain?',
//         choices: ['Sandman', 'Electro', 'Vulture', 'Kraven'],
//         answer: 3
//     },
//     {
//         question: 'What is the name of the first comic book appearance of the Sinister Six?',
//         choices: ['Amazing Spider-Man Annual #1', 'Amazing Spider-Man Annual #21', 'Amazing Spider-Man #41', 'Amazing Spider-Man #61'],
//         answer: 0
//     },

// ];
// console.log(questionArray)

const randomQuestionFunction = () => {

    // use get method to retrieve data from db
    get(questionArrayPath).then((data) => {
        const questionArrayData = data.val();
        // select question in array randomly
        const getRandomQuestion = Math.floor(Math.random() * questionArrayData.length);
        chosenQuestion = questionArrayData[getRandomQuestion];
        // append the question to h2
        playingPageQuestion.textContent = chosenQuestion.question;
        // making the text content equal to each of the answers
        mCButtons.forEach(button => {
            const number = button.value;
            button.textContent = chosenQuestion.choices[number];
        })
    
    // use splice method in questionArrayData to stop questions from repeating
        // questionArrayData.splice(getRandomQuestion, 1);

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
            console.log(userPoints)
            pointDisplay.innerHTML = userPoints;
            button.disabled = true;
        } else {
            userPoints = userPoints - 1;
            console.log(userPoints)
            pointDisplay.innerHTML = userPoints;
            button.disabled = true;
        }
        
        setTimeout(randomQuestionFunction, 750)
        button.disabled = false;

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
function addToFirebaseDb(key, value) {

    const customRef = ref(database, key)

    return set(customRef, value)
}

// addToFirebaseDb('scoreBoardsArray', scoreBoardArray);
// addToFirebaseDb('questionsArray', questionArray);