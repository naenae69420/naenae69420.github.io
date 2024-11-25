document.getElementById('characterSelect').addEventListener('change', apiData);

async function apiData() {
    const characterName = document.querySelector('#characterSelect').value;
    const continueButton = document.getElementById('continueButton');

    if (characterName === "") {
        // Disable the button if no character is selected
        continueButton.disabled = true;
        continueButton.style.pointerEvents = 'none'; // Hide button when no character is selected
        return;
    }

    try {
        const response = await fetch(`https://super-mario-bros-character-api.onrender.com/api/${characterName}`);
        const data = await response.json();

        if (data.message) {
            alert(data.message);  
            return;
        }

        document.getElementById('name').innerText = data.name;
        document.getElementById('strength').innerText = data.strength;
        document.getElementById('origin').innerText = data.origin;
        document.getElementById('character-image').src = data.image;
        continueButton.disabled = false;
        continueButton.style.display = 'inline-block'; // Show button after selecting a character

    } catch (error) {
        console.log(error);
    }
}

function saveCharacter() {
    const characterName = document.getElementById('characterSelect').value;
    if (characterName) {
        // Store the selected character in localStorage for marioPage3 use
        localStorage.setItem('selectedCharacter', characterName);
        
        // Redirect to the next page
        console.log(characterName);
        window.location.href = 'marioPage2.html'; 
    }
}
