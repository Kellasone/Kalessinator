const wrapper = document.createElement('div');
wrapper.id = 'wrapper';
wrapper.classList.add('game-cursor');

const innerImage = document.createElement('div');
innerImage.id = 'innerImage';

innerImage.addEventListener('click', function (event) {
    let mainWindow = document.getElementsByClassName('klsnt-window-container')[0];
    let currentVisibilityStatus = mainWindow.style.getPropertyValue('visibility');
    if (currentVisibilityStatus === 'hidden')
        mainWindow.style.visibility = 'visible';
    else
        mainWindow.style.visibility = 'hidden';
});

wrapper.appendChild(innerImage);

document.querySelector('body').appendChild(wrapper);