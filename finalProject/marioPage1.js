let characterCache = {};

document.addEventListener('DOMContentLoaded', () => {
    let music = document.getElementById("marioSpringTrack");
    let musicToggleImage = document.getElementById("musicToggle");
    music.volume = 0.3;
    musicToggleImage.addEventListener("click", function () {
        if (music.paused) {
            music.play();
        } else {
            music.pause();
        }
    });

    
    Promise.race([
        preloadCharacterData(),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Preload timeout')), 5000)
        )
    ]).catch(error => {
        console.warn("Character preload failed or timed out:", error);
    });

    document.getElementById('characterSelect').addEventListener('change', debounce(apiData, 300));
});

async function preloadCharacterData() {
    try {
       
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('https://super-mario-bros-character-api.onrender.com/api/all', {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        const data = await response.json();
        

        characterCache = data.reduce((cache, character) => {
            cache[character.name.toLowerCase()] = character;
            return cache;
        }, {});
    } catch (error) {
        console.warn("Partial or failed character preload:", error);
    }
}
//API CODE USED HERE, minor edits
async function apiData() {
    const characterSelect = document.querySelector('#characterSelect');
    const characterName = characterSelect.value.toLowerCase();
    
    if (!characterName) {
        toggleContinueButton(false);
        hideCharacterDetails();
        return;
    }

    try {
        const cachedCharacter = characterCache[characterName];
        //Loads api data
        if (cachedCharacter) {
            populateCharacterDetails(cachedCharacter);
            return;
        }
        //in case time takes too long, after 3 seconds
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(`https://super-mario-bros-character-api.onrender.com/api/${characterName}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        const data = await response.json();
        
        if (data.message) {
            alert(data.message);
            return;
        }

        characterCache[characterName] = data;
        populateCharacterDetails(data);
    } catch (error) {
        console.error("Error", error);
        alert("Please allow 30 seconds for the data to load. This only applies the first time; after that, you can select another character.");
    }
}
//API CODE USED HERE, for loading items and storing
function populateCharacterDetails(data) {
    const nameElement = document.getElementById('name');
    const strengthElement = document.getElementById('strength');
    const originElement = document.getElementById('origin');
    const imageElement = document.getElementById('character-image');

    nameElement.innerText = capitalizeFirstLetter(data.name ?? 'Unknown');
    strengthElement.innerText = data.strength ?? 'N/A';
    originElement.innerText = data.origin ?? 'Unknown';
    
    imageElement.src = data.image ?? '';
    showCharacterDetails();
    toggleContinueButton(true);
}

function capitalizeFirstLetter(name) {
    return name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : '';
}

function toggleContinueButton(enable) {
    const continueButton = document.getElementById('continueButton');
    continueButton.disabled = !enable;
    continueButton.style.pointerEvents = enable ? 'auto' : 'none';
    continueButton.style.display = enable ? 'inline-block' : 'none';
}

function showCharacterDetails() {
    document.getElementById('results').style.display = 'block'; 
}

function hideCharacterDetails() {
    document.getElementById('results').style.display = 'none'; 
}

function saveCharacter() {
    const characterName = document.getElementById('characterSelect').value;
    if (characterName) {
        localStorage.setItem('selectedCharacter', characterName);
        window.location.href = 'marioPage2.html';
    }
}

// For loading
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}