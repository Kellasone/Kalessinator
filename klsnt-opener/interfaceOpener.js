const wrapper = document.createElement('div');
wrapper.id = 'wrapper';
wrapper.classList.add('game-cursor');

const innerImage = document.createElement('div');
innerImage.id = 'innerImage';

innerImage.addEventListener('click', async function (event) {
    let currentPlayer = await getCurrentUserId();
    if(allowed_players.includes(currentPlayer.name)){
        let mainWindow = document.getElementsByClassName('klsnt-window-container')[0];
        let currentVisibilityStatus = mainWindow.style.getPropertyValue('display');
        if (currentVisibilityStatus === 'none')
            mainWindow.style.display = 'block';
        else
            mainWindow.style.display = 'none';
    } else {
        document.querySelector('body').remove();
        alert("How about no?");
    }

});

wrapper.appendChild(innerImage);

document.querySelector('body').appendChild(wrapper);