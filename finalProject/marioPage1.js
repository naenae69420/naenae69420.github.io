let characterCache = {};

document.addEventListener('DOMContentLoaded', () => {
    // Use Promise.all for parallel loading and implement a timeout
    Promise.race([
        preloadCharacterData(),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Preload timeout')), 5000)
        )
    ]).catch(error => {
        console.warn("Character preload failed or timed out:", error);
        // Fallback to on-demand loading if preload fails
    });

    document.getElementById('characterSelect').addEventListener('change', debounce(apiData, 300));
});

async function preloadCharacterData() {
    try {
        // Use fetch with timeout and abort controller
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('https://super-mario-bros-character-api.onrender.com/api/all', {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        const data = await response.json();
        
        // Use bulk assignment and reduce for faster processing
        characterCache = data.reduce((cache, character) => {
            cache[character.name.toLowerCase()] = character;
            return cache;
        }, {});
    } catch (error) {
        console.warn("Partial or failed character preload:", error);
    }
}

async function apiData() {
    const characterSelect = document.querySelector('#characterSelect');
    const characterName = characterSelect.value.toLowerCase();
    
    if (!characterName) {
        toggleContinueButton(false);
        return;
    }

    try {
        const cachedCharacter = characterCache[characterName];
        
        if (cachedCharacter) {
            populateCharacterDetails(cachedCharacter);
            return;
        }
        
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
        console.error("Error fetching character data:", error);
        alert("Please wait around 30 seconds for data to load! Only needed on the first try");
    }
}

function populateCharacterDetails(data) {
    const nameElement = document.getElementById('name');
    const strengthElement = document.getElementById('strength');
    const originElement = document.getElementById('origin');
    const imageElement = document.getElementById('character-image');

    nameElement.innerText = capitalizeFirstLetter(data.name ?? 'Unknown');
    strengthElement.innerText = data.strength ?? 'N/A';
    originElement.innerText = data.origin ?? 'Unknown';
    
    imageElement.src = data.image ?? '';

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