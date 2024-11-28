document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('pageLoadSound');
    audio.volume = 0.3;
    audio.play().catch(error => console.log('Autoplay blocked:', error));
    // Get top 3 characters from localStorage
   const topThree = JSON.parse(localStorage.getItem('topThreePlayers')) || [];

   displayTopThree(topThree);
    //get ranked players
   const allRankedPlayers = JSON.parse(localStorage.getItem('allRankedPlayers')) || [];

   listRaceParticipants(allRankedPlayers);
   listFavoredRankings();
   });
   
   async function displayTopThree(topThree) {
    const podiumContainer = document.getElementById('podium-container');
    if (!podiumContainer) return;
 
    const podiumPositions = [
     { place: '1st', className: 'first-place', imageUrl: 'images/first.png' },
     { place: '2nd', className: 'second-place', imageUrl: 'images/second.png' },
     { place: '3rd', className: 'third-place', imageUrl: 'images/third.png' }
    ];
 
    for (let i = 0; i < Math.min(3, topThree.length); i++) {
       const character = topThree[i];
       try {
          // Fetch character data from API
          const response = await fetch(`https://super-mario-bros-character-api.onrender.com/api/${character.name}`);
          const data = await response.json();
 
          const characterDiv = document.createElement('div');
          characterDiv.className = `podium-position ${podiumPositions[i].className}`;
 
          // Create an image element for the place
          const placeImage = document.createElement('img');
          placeImage.src = podiumPositions[i].imageUrl;
          placeImage.alt = `${podiumPositions[i].place} Place`;
          placeImage.style = "max-height: 50px; width: auto; display: block; margin: 0 auto;";
 
          // Add the content inside the character card
          characterDiv.innerHTML = `
             <div class="character-card">
             <h4 style="color: white; text-align: center; font-weight: bold;">${data.name}</h4>
             <img src="${data.image}" alt="${data.name}" style="max-height: 150px; width: auto; display: block; margin: 0 auto;">
             <p style="color: white; font-weight: bold; text-align: center;">Final Speed: ${character.speed}</p>
             </div>
          `;
          
          // Add place image at the top
          characterDiv.prepend(placeImage);
          
          // Append to the podium container
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

        const favoredRankings = JSON.parse(localStorage.getItem('favored'));
        const myName = favoredRankings && Array.isArray(favoredRankings) ? favoredRankings[0].name : ''; 
    
        const sortedPlayers = allRankedPlayers.sort((a, b) => 
            (a.finishLap || a.finishRank || Infinity) - (b.finishLap || b.finishRank || Infinity)
        );
        
        sortedPlayers.forEach((player, index) => {
            const playerEntry = document.createElement('li');
            const nameColor = player.name === myName ? 'red' : 'gold';
            const playerName = player.name === myName ? `${player.name} (You)` : player.name;
    
            playerEntry.innerHTML = `<strong>${index + 1}</strong>. <strong style="color: ${nameColor};">${playerName}</strong> - Lap ${player.finishLap}`;
            participantsList.appendChild(playerEntry);
        });
    }
    

    function listFavoredRankings() {
        const favoredRankings = JSON.parse(localStorage.getItem('favored'));
        if (favoredRankings && Array.isArray(favoredRankings)) {
          const myName = favoredRankings[0].name; 
          const favoredRankingsList = document.getElementById('favored-rankings-list');
          favoredRankingsList.innerHTML = '';
          
          const sortedPlayers = favoredRankings.sort((a, b) => b.speed - a.speed);
          
          sortedPlayers.forEach((player, index) => {
            const playerEntry = document.createElement('li');
            const nameColor = player.name === myName ? 'red' : 'gold';
            const playerName = player.name === myName ? `${player.name} (You)` : player.name;
            
            playerEntry.innerHTML = `<strong>${index + 1}</strong>. <strong style="color: ${nameColor};">${playerName}</strong> - Speed: ${player.speed}`;
            favoredRankingsList.appendChild(playerEntry);
          });
        } else {
          console.log("No favored rankings found.");
        }
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