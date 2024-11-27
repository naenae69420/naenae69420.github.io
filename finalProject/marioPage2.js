document.addEventListener('DOMContentLoaded', () => {
    const sound = document.getElementById('marioSoundTrack');
    sound.volume = 0.3;
    const characterName = localStorage.getItem('selectedCharacter');

    if (!characterName) {
        alert("No character selected!");
        return;
    }

    const characterList = [
        "mario", "luigi", "princess peach", "bowser", "yoshi", "wario", 
        "donkey kong", "diddy kong", "toad", "goomba", "koopa troopa", 
        "princess daisy", "rosalina", "toadette", "bowser jr", "waluigi", 
        "shy guy"
    ];

    const filteredList = characterList.filter(char => char !== characterName);

    const randomCharacters = [];
    while (randomCharacters.length < 4) {
        const randomIndex = Math.floor(Math.random() * filteredList.length);
        const randomChar = filteredList[randomIndex];
        if (!randomCharacters.includes(randomChar)) {
            randomCharacters.push(randomChar);
        }
    }

    displayCharacters(characterName, randomCharacters);

    setupWordInteractivity();
});

const characters = [
    { name: "", speed: 0, total: 0 }, 
    { name: "", speed: 0, total: 0 }, 
    { name: "", speed: 0, total: 0 }, 
    { name: "", speed: 0, total: 0 },
    { name: "", speed: 0, total: 0 }
];

async function displayCharacters(selectedCharacter, randomCharacters) {
    const selectedCharacterContainer = document.getElementById('selected-character-container');
    selectedCharacterContainer.innerHTML = '';

    const selectedCharDiv = document.createElement('div');
    selectedCharDiv.classList.add('character', 'selected');
    
    await fetchCharacterData(selectedCharacter, selectedCharDiv);

    selectedCharacterContainer.appendChild(selectedCharDiv);

    const opponentContainer = document.getElementById('opponent-characters-container');
    opponentContainer.innerHTML = '';

    for (const char of randomCharacters) {
        const randomCharDiv = document.createElement('div');
        randomCharDiv.classList.add('character');
        
        await fetchCharacterData(char, randomCharDiv);
        opponentContainer.appendChild(randomCharDiv);
    }
}

function capitalizeFirstLetter(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

async function fetchCharacterData(characterName, container) {
    try {
        const response = await fetch(`https://super-mario-bros-character-api.onrender.com/api/${characterName}`);
        const data = await response.json();

        if (data.message) {
            alert(data.message);
            return;
        }

        const speed = (Math.random() * 0.8 + 0.2).toFixed(2);

        const characterNameCapitalized = capitalizeFirstLetter(data.name);

        container.innerHTML = `
            <h3>${characterNameCapitalized}</h3>  <!-- Display the capitalized name -->
            <img src="${data.image}" alt="${characterNameCapitalized}" style="max-height: 150px; width: auto;">
            <p>Speed: ${speed}</p>
        `;

        const character = {
            name: characterNameCapitalized,
            speed: parseFloat(speed),
            image: data.image,
            total: 0
        };

        const existingIndex = characters.findIndex(c => c.name === "" || c.name === character.name);
        if (existingIndex !== -1) {
            characters[existingIndex] = character;
        }
        
        console.log('Current characters array:', characters);
    } catch (error) {
        console.log(error);
    }
}

let currentLap = 0;
let raceCompleted = false;
let rankedPlayers = [];

function updateInfoContainer() {
    const infoContainer = document.getElementById('LapsContainer');
    infoContainer.innerHTML = '';
    
    const lapText = document.createElement('p');
    lapText.innerHTML = `<strong>LAP</strong> ${currentLap}`;
    lapText.style.fontSize = "30px";
    lapText.style.fontWeight = "bold";
    lapText.style.marginBottom = "20px";
    lapText.style.color = "#ffffff";

    infoContainer.appendChild(lapText);

    characters.forEach(character => {
        if (character.speed > 0 && character.total > 0) {
            const characterInfo = document.createElement('p');
            characterInfo.innerHTML = `<strong style="color: #db6635;">${character.name}</strong>: Speed <strong style="color: #db6635;">${character.speed}</strong>, Total: <strong style="color: #db6635;">${character.total}</strong>`;
            characterInfo.style.color = "white";
            infoContainer.appendChild(characterInfo);
        }
    });
}

function handleLap() {
    const goal = 500;

    if (currentLap % 5 === 0) {
            assignPowerUps();
    }

    characters.forEach(character => {
        if (!rankedPlayers.includes(character.name)) {
            const pointsForLap = character.speed * 50;
            character.total += pointsForLap;

            if (character.total >= goal && !rankedPlayers.includes(character.name)) {
                rankedPlayers.push(character.name);

                character.finishLap = currentLap;
            
                const rankingsContainer = document.getElementById('final-rankings-container');
                const rankAnnouncement = document.createElement('p');
                rankAnnouncement.innerHTML = `${getOrdinal(rankedPlayers.length)} place: <span style="color: #db6635;">${character.name}</span>`;
                rankAnnouncement.style.fontSize = "20px";
                rankAnnouncement.style.color = "#ffffff";

                rankAnnouncement.style.fontWeight = "bold";
                rankingsContainer.appendChild(rankAnnouncement);
            }
        }
    });

    if (rankedPlayers.length < characters.length) {
        updateInfoContainer();
    }

    if (rankedPlayers.length === characters.length && !raceCompleted) {
        raceCompleted = true;
        
        const rankingsContainer = document.getElementById('final-rankings-container');
        rankingsContainer.innerHTML = '<h2 style="color: white; font-size: 30px; font-weight: bold; margin-top: 15px;">Final Rankings</h2>';

        
        rankedPlayers.forEach((playerName, index) => {
            const rankMessage = document.createElement('p');
            rankMessage.innerHTML = `${getOrdinal(index + 1)} place: <strong style="color: #db6635;">${playerName}</strong>`;

            rankMessage.style.fontSize = "20px";
            rankMessage.style.color = "#ffffff";

            rankingsContainer.appendChild(rankMessage);
        });

        const topThree = rankedPlayers.slice(0, 3).map(playerName => {
            const character = characters.find(c => c.name === playerName);
            return {
                name: character.name,
                speed: character.speed,
                total: character.total,
                finishLap: character.finishLap
            };
        });
        const allPlayers = rankedPlayers.slice(0, 5).map(playerName => {
            const character = characters.find(c => c.name === playerName);
            return {
                name: character.name,
                speed: character.speed,
                total: character.total,
                finishLap: character.finishLap
            };
        });
        localStorage.setItem('topThreePlayers', JSON.stringify(topThree));
        localStorage.setItem('allRankedPlayers', JSON.stringify(allPlayers));

        const continueButton = document.getElementById('continueButton');
        continueButton.style.display = 'block';

        continueButton.onclick = function() {
            window.location.href = "marioPage3.html";
        };

        rankingsContainer.appendChild(continueButton);
    }
}

function getOrdinal(n) {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = n % 100;

    return n + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}

function assignPowerUps() {
    const rankingsContainer = document.getElementById('final-rankings-container');
    let topDivider = rankingsContainer.querySelector('#top-divider');
    if (!topDivider) {
        topDivider = document.createElement('p');
        topDivider.id = 'top-divider';
        topDivider.textContent = '-----------------------------------------------------------------------------------------';
        topDivider.style.color = 'white';
        rankingsContainer.appendChild(topDivider);
    }
    
    let currentLapPowerupContainer = document.getElementById('current-lap-powerup-container');
    if (!currentLapPowerupContainer) {
        currentLapPowerupContainer = document.createElement('div');
        currentLapPowerupContainer.id = 'current-lap-powerup-container';
        rankingsContainer.appendChild(currentLapPowerupContainer);
    }

    currentLapPowerupContainer.innerHTML = '';

    let lapPowerupHeading = currentLapPowerupContainer.querySelector('h2');
    if (!lapPowerupHeading) {
        lapPowerupHeading = document.createElement('h2');
        lapPowerupHeading.style.color = 'white';
        lapPowerupHeading.style.fontSize = '28px';
        currentLapPowerupContainer.appendChild(lapPowerupHeading);
    }
    lapPowerupHeading.textContent = `Lap ${currentLap} Powerups`;

    characters.forEach(character => {
        if (!rankedPlayers.includes(character.name)) { 
            const powerUp = getRandomPowerUp();
            console.log(powerUp);

            const powerUpMessage = document.createElement('p');
            powerUpMessage.innerHTML = `<strong style="color: #e1a126;">${character.name}</strong> received a power-up: <strong style="color: #e1a126;">${powerUp}</strong>`;
            powerUpMessage.style.fontSize = "20px";
            powerUpMessage.style.color = "#ffffff";

            currentLapPowerupContainer.appendChild(powerUpMessage);

            applyPowerUp(character, powerUp);
        }
    });

    let bottomDivider = rankingsContainer.querySelector('#bottom-divider');
    if (!bottomDivider) {
        bottomDivider = document.createElement('p');
        bottomDivider.id = 'bottom-divider';
        bottomDivider.textContent = '-----------------------------------------------------------------------------------------';
        bottomDivider.style.color = 'white';
        rankingsContainer.appendChild(bottomDivider);
    }
}




function getRandomPowerUp() {
    const powerUps = [
        { name: "Speed Boost", chance: 0.2 }, // 20% chance
        { name: "Empty", chance: 0.2 },       // 20% chance
        { name: "Banana", chance: 0.2 },      // 20% chance
        { name: "Rocket", chance: 0.15 },     // 15% chance
        { name: "Slow", chance: 0.1 },       // 10% chance
        { name: "Shell", chance: 0.1 },      // 10% chance
        { name: "Lightning", chance: 0.05 }   // 5% chance
    ];

    const randomValue = Math.random(); 
    let cumulativeChance = 0;

    for (const powerUp of powerUps) {
        cumulativeChance += powerUp.chance;
        if (randomValue <= cumulativeChance) {
            return powerUp.name;
        }
    }

    return "Empty";
}

function applyPowerUp(character, powerUp) {
    const rankingsContainer = document.getElementById('final-rankings-container');
    let currentLapPowerupContainer = document.getElementById('current-lap-powerup-container');
    
    // Ensure the container exists
    if (!currentLapPowerupContainer) {
        currentLapPowerupContainer = document.createElement('div');
        currentLapPowerupContainer.id = 'current-lap-powerup-container';
        rankingsContainer.appendChild(currentLapPowerupContainer);
    }

    switch (powerUp) {
        case "Speed Boost":
            character.speed = (parseFloat(character.speed) + 0.4).toFixed(2); 
            break;

        case "Empty":
            break;

        case "Banana":
            character.total -= character.speed * 100;
            if (character.total <= 0) {
                character.total = 0;
            }
            break;

        case "Rocket":
            if (character.speed >= 0.45) {
                character.total += character.speed * 100;
            } else {
                character.total += 200;
            }
            break;

        case "Slow":
            character.speed = (parseFloat(character.speed) - 0.25).toFixed(2); 
            if (character.speed <= 0.25) {
                character.speed = 0.25;
            }
            break;

        case "Lightning":
            
            characters.forEach(player => {
                if (player.name !== character.name && !rankedPlayers.includes(player.name)) { 
                    player.total -= 100;
                    if (player.total < 0) {
                        player.total = 0; 
                    }
                }
            });

          
            const lightningMessage = document.createElement('p');
            lightningMessage.id = 'lightning-message';
            lightningMessage.innerHTML = `<strong style="color: red;">All players</strong> except <strong style="color: #e1a126;">${character.name}</strong> were hit by <strong style="color: red;">Lightning</strong>!`;
            lightningMessage.style.fontSize = "20px";
            lightningMessage.style.color = "#ffffff";
            currentLapPowerupContainer.appendChild(lightningMessage);
            break;

        case "Shell": 
        const nonFinishedPlayers = characters.filter(player => !rankedPlayers.includes(player.name));
        if (nonFinishedPlayers.length > 1) {
               
            const validTargets = nonFinishedPlayers.filter(player => player.name !== character.name);
        
            if (validTargets.length > 0) {
  
                const lastPlacePlayer = validTargets.reduce((prev, curr) => (curr.total < prev.total ? curr : prev));
                const target = validTargets
                    .filter(player => player.name !== lastPlacePlayer.name) 
                    .reduce((prev, curr) => (curr.total > prev.total ? curr : prev), { total: -1 }); 
        
                if (target && target.total > 0) {
                    target.total -= target.speed * 150;
                    if (target.total < 0) {
                        target.total = 0; 
                    }
        
             
                    const shellMessage = document.createElement('p');
                    shellMessage.id = 'shell-message';
                    shellMessage.innerHTML = `<strong style="color: #e1a126;">${target.name}</strong> was hit by a <strong style="color: #e1a126;">Shell</strong>! Points reduced by <strong style="color: red;">${(target.speed * 150).toFixed(2)}</strong>.`;
                    shellMessage.style.fontSize = "20px";
                    shellMessage.style.color = "#ffffff";
                    currentLapPowerupContainer.appendChild(shellMessage);
                }
            }
        }
            break;
    }
}

document.getElementById('readyButton').addEventListener('click', () => {
    if (!raceCompleted) {
        currentLap++;

        const readyButton = document.getElementById('readyButton');
        readyButton.textContent = `LAP ${currentLap}`;

        handleLap();
    }
});


function setupWordInteractivity() {
    // Information for each word
    const infoData = {
        Empty: {
            text: "Gain no powerups! Quite the unfortunate event",
            image: "images/empty.png"
        },
        Boost: {
            text: "Gives your character a speed increase",
            image: "images/boost.png"
        },
        Slow: {
            text: "Decreases your overall speed",
            image: "images/slow.png"
        },
        Banana: {
            text: "You get setback in points!",
            image: "images/banana.png"
        },
        Rocket: {
            text: "Provides a boost, propelling you forward at super high speed.",
            image: "images/rocket.png"
        },
        Lightning: {
            text: "Shocks all players except yourself, reducing everyone else's points!",
            image: "images/lightning.png"
        },
        Shell: {
            text: "Devastatingly takes points off player in the lead!",
            image: "images/Shell.png"
        }
    };

    // Add event listeners to each clickable word
    const words = document.querySelectorAll('.clickable-word');
    const infoContainer = document.getElementById('info-container');

    words.forEach(word => {
        word.addEventListener('click', () => {
            const wordId = word.id; 
            const info = infoData[wordId]; // Get corresponding info
            if (info) {
                infoContainer.innerHTML = `
                    <p style="font-size: 1.5rem">${info.text}</p>
                    ${info.image ? `<img src="${info.image}" alt="${wordId}" style="max-width: 100%; margin-top: 10px;">` : ""}
                `;
            } else {
                infoContainer.innerHTML = "<p>No information available.</p>";
            }
        });
    });
}
