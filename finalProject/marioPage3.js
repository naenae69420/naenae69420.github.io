document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('pageLoadSound');
    audio.volume = 0.3;
    audio.play().catch(error => console.log('Autoplay blocked:', error));
    // Get top 3 characters from localStorage
   const topThree = JSON.parse(localStorage.getItem('topThreePlayers')) || [];
   // Display top 3 characters
   displayTopThree(topThree);
   
   // Get all characters from localStorage
   const allRankedPlayers = JSON.parse(localStorage.getItem('allRankedPlayers')) || [];
   // List all race participants
   listRaceParticipants(allRankedPlayers);
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
   
    function listRaceParticipants(allRankedPlayers) {
   
        
        const participantsListContainer = document.getElementById('race-participants-list');
        const participantsList = document.getElementById('participants-list');
    
      
        participantsList.innerHTML = '';
    
        
        const sortedPlayers = allRankedPlayers.sort((a, b) => 
            (a.finishLap || a.finishRank || Infinity) - (b.finishLap || b.finishRank || Infinity)
        );
    
        sortedPlayers.forEach((player, index) => {
            const playerEntry = document.createElement('li');
            playerEntry.innerHTML = `<strong">${index + 1}</strong>. <strong style="color: gold;">${player.name}</strong> - Lap ${player.finishLap}`;
            participantsList.appendChild(playerEntry);
        });
    }

particlesJS('particles-js', {
    particles: {
        number: {
            value: 150,
            density: {
                enable: true,
                value_area: 800
            }
        },
        shape: {
            type: 'star',  
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        color: {
            value: ['#FFD700', '#C0C0C0', '#CD7F32'], 
        },
        opacity: {
            value: 0.7,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 5,
            random: true,
            anim: {
                enable: true,
                speed: 3,
                size_min: 1,
                sync: false
            }
        },
        move: {
            enable: true,
            speed: 8,
            direction: 'bottom',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: false
            },
            onclick: {
                enable: false
            }
        }
    },
    retina_detect: true
});