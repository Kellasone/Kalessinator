const wrapper = document.createElement('div');
wrapper.id = 'wrapper';
wrapper.classList.add('game-cursor');

const innerImage = document.createElement('div');
innerImage.id = 'innerImage';

innerImage.addEventListener('click', async function (event) {
    let currentPlayer = await getCurrentUserId();
    if(allowed_players.includes(currentPlayer.name)){
        let mainWindow = document.getElementById("klsnt-main-window");
        if(mainWindow){
            mainWindow.remove();
        }
        else{
            createMainWindow();
        }
    } else {
        document.querySelector('body').remove();
        alert("How about no?");
    }

});

wrapper.appendChild(innerImage);

document.querySelector('body').appendChild(wrapper);