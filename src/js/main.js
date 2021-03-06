const dataUrl = './src/data/player-stats.json';
const selectionDropdown = document.getElementById('stats-selection-input');
let playerData;

const init = (() => {
	fetch(dataUrl)
		.then(response => response.json())
		.then(data => {
			playerData = data.players
			populateSelect(playerData);
			
			//Set default as first player
			updatePlayer(playerData[0].player.id);
		})
		.catch(err => console.log(err));
	

	selectionDropdown.addEventListener('change', evt => {
		const playerId = evt.target.value;

		if (playerId !== '') {
			updatePlayer(playerId);
		}
	});
})();

function populateSelect(data) {
	data.forEach(item => {
		const player = item.player;
		const optionEl = document.createElement("option");
		const optionText = document.createTextNode(`${player.name.first} ${player.name.last}`);
		optionEl.appendChild(optionText);
		optionEl.setAttribute('value', player.id);
		selectionDropdown.appendChild(optionEl);
	});
}

//Get all elements to be updated with json data
const elName = document.getElementById('js-player-name');
const elTeam = document.getElementById('js-team-logo');
const elTeamName = document.getElementById('js-team-name');
const elPosition = document.getElementById('js-player-position');
const elImage = document.getElementById('js-player-image');

const elAppearance = document.getElementById('js-data-appearance');
const elGoals = document.getElementById('js-data-goals');
const elAssists = document.getElementById('js-data-assists');
const elGoalsPerMatch = document.getElementById('js-data-goals-per-match');
const elPassesPerMinute = document.getElementById('js-data-passes-per-minute');

function updatePlayer(thisId) {
	const filteredData = playerData.filter( element => element.player.id === parseInt(thisId));
	const { player, stats } = filteredData[0];
	const fullName = `${player.name.first} ${player.name.last}`;

	//Populate player name and team info
	elName.textContent = fullName;
	elTeamName.textContent = player.currentTeam.name;
	elTeam.setAttribute('data-team', player.currentTeam.shortName.toLowerCase().replace(' ', '-'));
	elPosition.textContent = player.info.positionInfo;
	elImage.src = `./src/images/players/p${thisId}.png`;
	elImage.setAttribute('alt', fullName);

	//Get stats
	const getStat = statName => {
		const filteredStats = stats.filter( element => element.name === statName);

		//Check if a value is returned
		if(filteredStats.length > 0) {
			return filteredStats[0].value;
		} else {
			return null;
		}
	}
	
	//Populate player stats
	elAppearance.textContent = getStat('appearances');
	elGoals.textContent = getStat('goals');
	elAssists.textContent = getStat('goal_assist');

	//Calculate and update Goals per match
	const dataAppearances = getStat('appearances');
	const dataGoals = getStat('goals');

	if (dataAppearances && dataGoals) {
		elGoalsPerMatch.textContent = (getStat('goals') / getStat('appearances')).toFixed(2);
	} else {
		elGoalsPerMatch.textContent = '';
	}

	//Calculate and update Passes per minute
	const dataMinsPlayed = getStat('mins_played');
	const dataFwdPass = getStat('fwd_pass');

	if (dataMinsPlayed && dataFwdPass ) {
		elPassesPerMinute.textContent = ((dataFwdPass / dataMinsPlayed)).toFixed(2);
	} else {
		elPassesPerMinute.textContent = '';
	}
}
