let characterCache = {};

document.addEventListener('DOMContentLoaded', () => {
    preloadCharacterData();
});

document.getElementById('characterSelect').addEventListener('change', debounce(apiData, 300));

async function preloadCharacterData() {
    try {
        const response = await fetch('https://super-mario-bros-character-api.onrender.com/api/all');
        const data = await response.json();
        data.forEach(character => {
            characterCache[character.name] = character;
        });
    } catch (error) {
        console.error("Error preloading character data:", error);
    }
}

async function apiData() {
    const characterName = document.querySelector('#characterSelect').value;
    const continueButton = document.getElementById('continueButton');

    if (!characterName) {
        toggleContinueButton(false);
        return;
    }

    if (characterCache[characterName]) {
        populateCharacterDetails(characterCache[characterName]);
    } else {
        try {
            const response = await fetch(`https://super-mario-bros-character-api.onrender.com/api/${characterName}`);
            const data = await response.json();

            if (data.message) {
                alert(data.message);
                return;
            }

            characterCache[characterName] = data;
            populateCharacterDetails(data);
        } catch (error) {
            console.error("Error fetching character data:", error);
        }
    }
}

function populateCharacterDetails(data) {
    document.getElementById('name').innerText = capitalizeFirstLetter(data.name);
    document.getElementById('strength').innerText = data.strength;
    document.getElementById('origin').innerText = data.origin;
    document.getElementById('character-image').src = data.image;
    toggleContinueButton(true);
}

function capitalizeFirstLetter(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function toggleContinueButton(enable) {
    const continueButton = document.getElementById('continueButton');
    continueButton.disabled = !enable;
    continueButton.style.pointerEvents = enable ? 'auto' : 'none';
    continueButton.style.display = enable ? 'inline-block' : 'none';
}

function saveCharacter() {
    const characterName = document.getElementById('characterSelect').value;
    if (characterName) {
        // Store the selected character in localStorage for future use
        localStorage.setItem('selectedCharacter', characterName);
        
        window.location.href = 'marioPage2.html'; 
    }
}

// Limit API calls
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, delay);
    };
}
