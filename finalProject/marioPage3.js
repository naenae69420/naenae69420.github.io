document.addEventListener('DOMContentLoaded', () => {
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
       // Console log of all participants
       console.log("Race Participants:");
       allRankedPlayers.forEach((player, index) => {
           console.log(`${index + 1}. ${player.name} - Finished at Lap ${player.finishLap}`);
       });
   
       // Create participants list container
       const participantsListContainer = document.createElement('div');
       participantsListContainer.id = 'race-participants-list';
       participantsListContainer.style.cssText = `
           position: fixed;
           top: 20px;
           right: 20px;
           background-color: rgba(0,0,0,0.7);
           color: white;
           padding: 15px;
           border-radius: 10px;
           z-index: 1000;
           min-width: 200px;
           max-height: 80vh;
           overflow-y: auto;
       `;
   
       const listTitle = document.createElement('h3');
       listTitle.textContent = 'Race Rankings';
       listTitle.style.textAlign = 'center';
       listTitle.style.marginBottom = '10px';
       participantsListContainer.appendChild(listTitle);
   
       // Create a list element
       const participantsList = document.createElement('ul');
       participantsList.style.listStyleType = 'none';
       participantsList.style.padding = '0';
       participantsList.style.margin = '0';
   
       // Sort players by finish lap (or rank if available)
       const sortedPlayers = allRankedPlayers.sort((a, b) => 
           (a.finishLap || a.finishRank || Infinity) - (b.finishLap || b.finishRank || Infinity)
       );
   
       sortedPlayers.forEach((player, index) => {
           const playerEntry = document.createElement('li');
           playerEntry.textContent = `${index + 1}. ${player.name} - Lap ${player.finishLap}`;
           playerEntry.style.margin = '5px 0';
           playerEntry.style.padding = '5px';
           playerEntry.style.borderBottom = '1px solid rgba(255,255,255,0.2)';
           participantsList.appendChild(playerEntry);
       });
   
       participantsListContainer.appendChild(participantsList);
       document.body.appendChild(participantsListContainer);
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
            type: 'star',  // Using star shape for celebration
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        color: {
            value: ['#FFD700', '#C0C0C0', '#CD7F32'], // Gold, Silver, Bronze colors for first, second, and third places
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