document.addEventListener('DOMContentLoaded', () => {
    // Get top 3 characters from localStorage
    const topThree = JSON.parse(localStorage.getItem('topThreePlayers')) || [];
    
    // Display top 3 characters
    displayTopThree(topThree);
});

async function displayTopThree(topThree) {
    const podiumContainer = document.getElementById('podium-container');
    if (!podiumContainer) return;
    
    // Create podium display
    const podiumPositions = [
        { place: '1st', className: 'first-place' },
        { place: '2nd', className: 'second-place' },
        { place: '3rd', className: 'third-place' }
    ];
    
    for (let i = 0; i < Math.min(3, topThree.length); i++) {
        const character = topThree[i];
        try {
            // Fetch character data from API
            const response = await fetch(`https://super-mario-bros-character-api.onrender.com/api/${character.name}`);
            const data = await response.json();
            
            const characterDiv = document.createElement('div');
            characterDiv.className = `podium-position ${podiumPositions[i].className}`;
            
            characterDiv.innerHTML = `
                <h3 style="color: white; text-align: center;">${podiumPositions[i].place} Place</h3>
                <div class="character-card">
                    <h4 style="color: white;">${data.name}</h4>
                    <img src="${data.image}" alt="${data.name}" style="max-height: 150px; width: auto;">
                    <p style="color: white;">Final Speed: ${character.speed}</p>
                </div>
            `;
            
            podiumContainer.appendChild(characterDiv);
        } catch (error) {
            console.error(`Error fetching data for ${character.name}:`, error);
        }
    }
}