document.addEventListener('DOMContentLoaded', () => {
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
    selectedCharDiv.classList.add('character');
    
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

async function fetchCharacterData(characterName, container) {
    try {
        const response = await fetch(`https://super-mario-bros-character-api.onrender.com/api/${characterName}`);
        const data = await response.json();

        if (data.message) {
            alert(data.message);
            return;
        }

        const speed = (Math.random() * 0.9 + 0.1).toFixed(2);

        container.innerHTML = `
            <h3>${data.name}</h3>
            <img src="${data.image}" alt="${data.name}" style="max-height: 150px; width: auto;">
            <p>Speed: ${speed}</p>
        `;

        const character = {
            name: data.name,
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
    const infoContainer = document.getElementById('info-container');
    infoContainer.innerHTML = '';
    
    const lapText = document.createElement('p');
    lapText.textContent = `LAP ${currentLap}`;
    lapText.style.fontSize = "20px";
    lapText.style.fontWeight = "bold";
    lapText.style.marginBottom = "20px";
    lapText.style.color = "#ffffff";

    infoContainer.appendChild(lapText);

    characters.forEach(character => {
        if (character.speed > 0 && character.total > 0) {
            const characterInfo = document.createElement('p');
            characterInfo.innerHTML = `${character.name}: Speed <strong>${character.speed}</strong>, Total: <strong>${character.total}</strong>`;
            infoContainer.appendChild(characterInfo);
        }
    });
}

function handleLap() {
    const goal = 500;

    if (currentLap === 5 || currentLap === 10 || currentLap === 15 || currentLap === 20) {
        assignPowerUps();
    }

    characters.forEach(character => {
        if (!rankedPlayers.includes(character.name)) {
            const pointsForLap = character.speed * 50;
            character.total += pointsForLap;

            if (character.total >= goal && !rankedPlayers.includes(character.name)) {
                rankedPlayers.push(character.name);
            
                const rankingsContainer = document.getElementById('final-rankings-container');
                const rankAnnouncement = document.createElement('p');
                rankAnnouncement.textContent = `${getOrdinal(rankedPlayers.length)} place: ${character.name}`;
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
        rankingsContainer.innerHTML = '<h2 style="color: white;">Final Rankings</h2>';
        
        rankedPlayers.forEach((playerName, index) => {
            const rankMessage = document.createElement('p');
            rankMessage.textContent = `${getOrdinal(index + 1)} place: ${playerName}`;
            rankMessage.style.fontSize = "20px";
            rankMessage.style.fontWeight = "bold";
            rankMessage.style.color = "#ffffff";

            rankingsContainer.appendChild(rankMessage);
        });

        const topThree = rankedPlayers.slice(0, 3).map(playerName => {
            const character = characters.find(c => c.name === playerName);
            return {
                name: character.name,
                speed: character.speed,
                total: character.total
            };
        });
        
        localStorage.setItem('topThreePlayers', JSON.stringify(topThree));

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
        const topDivider = document.createElement('p');
        topDivider.textContent = '-----------------------------------------------------------------------------------------';
        topDivider.style.color = 'white';
        rankingsContainer.appendChild(topDivider);

    characters.forEach(character => {
        const powerUp = getRandomPowerUp();
        console.log(powerUp);

        const powerUpMessage = document.createElement('p');
        powerUpMessage.textContent = `${character.name} received a power-up: ${powerUp}`;
        powerUpMessage.style.fontSize = "20px";
        powerUpMessage.style.fontWeight = "bold";
        powerUpMessage.style.color = "#ffffff";

        rankingsContainer.appendChild(powerUpMessage);

        applyPowerUp(character, powerUp);
    });

    const bottomDivider = document.createElement('p');
    bottomDivider.textContent = '-----------------------------------------------------------------------------------------';
    bottomDivider.style.color = 'white';
    rankingsContainer.appendChild(bottomDivider);
}

function getRandomPowerUp() {
    const powerUps = ["Speed Boost", "Empty", "Banana", "Rocket", "Slow"];
    const randomIndex = Math.floor(Math.random() * powerUps.length);
    return powerUps[randomIndex];
}

function applyPowerUp(character, powerUp) {
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
            if (character.speed <= 0.2) {
                character.speed = 0.2;
            }
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
        Empty: "Gain no powerups! Quite the unfortunate event",
        Boost: "Gives your character a speed increase for a short time.",
        Slow: "Decreases your overall speed",
        Lightning: "Strikes all opponents, reducing their size and speed temporarily.",
        Banana: "You get setback in points!",
        Rocket: "Provides a boost, propelling you forward at super high speed."
    };

    // Add event listeners to each clickable word
    const words = document.querySelectorAll('.clickable-word');
    const infoContainer = document.getElementById('info-container');

    words.forEach(word => {
        word.addEventListener('click', () => {
            const wordId = word.id; 
            const infoText = infoData[wordId]; // Get corresponding info
            if (infoText) {
                infoContainer.innerHTML = `<p>${infoText}</p>`;
            } else {
                infoContainer.innerHTML = "<p>No information available.</p>";
            }
        });
    });
}
