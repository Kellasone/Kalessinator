function createChangeArmyWindow() {
    let newWindow = document.createElement('div');
    newWindow.classList.add('klsnt-window-container')
    newWindow.id='klsnt-change-army-window';
    newWindow.style.width = '400px';
    newWindow.style.height = '200px';

    let windowTop = localStorage.getItem('klsnt-' + newWindow.id + '-top');
    let windowLeft = localStorage.getItem('klsnt-' + newWindow.id + '-left');

    if(windowTop && windowLeft ){
        newWindow.style.top = windowTop;
        newWindow.style.left = windowLeft;
    }

    let windowHeader = document.createElement('div');
    windowHeader.classList.add("klsnt-window-header");
    windowHeader.innerText = "Change army";

    let klsntCloseButton = document.createElement('div');
    klsntCloseButton.classList.add('klsnt-close-button');
    windowHeader.appendChild(klsntCloseButton);

    klsntCloseButton.addEventListener('click', () => {
        newWindow.remove();
    })


    newWindow.appendChild(windowHeader);
    dragElement(newWindow,windowHeader);

    document.querySelector('body').appendChild(newWindow);
}

async function populateSettingsContent() {
    while (!document.getElementById('klsnt-settings-content')) {
        await wait(200);
    }

    const content = document.getElementById('klsnt-settings-content');
    const gbgArmyLabel = document.createElement('label');
    gbgArmyLabel.innerText = "Gbg Army";
    content.appendChild(gbgArmyLabel);

    const armyContainer = document.createElement('div');
    armyContainer.classList.add('klsnt-army-container');

    for (let i = 0; i < 8; i++) {
        let armySlot = document.createElement('div');
        armySlot.classList.add('klsnt-army-slot');
        armySlot.id = 'klsnt-army-slot_' + i;
        armyContainer.appendChild(armySlot)
    }

    content.appendChild(armyContainer);

    let savedArmy = JSON.parse(localStorage.getItem('gbgArmy'));
    if(savedArmy){
        populateGBGArmySlot(savedArmy);
    } else {
        populateGBGArmySlot(['empty','empty','empty','empty','empty','empty','empty','empty'])
    }

    let changeArmyButton = document.createElement('div');
    changeArmyButton.classList.add('klsnt-button');
    changeArmyButton.innerText = 'Change army';

    changeArmyButton.addEventListener('click', () =>{
        createChangeArmyWindow();
    })

    content.appendChild(changeArmyButton);
    content.appendChild(document.createElement('hr'));
}

function populateGBGArmySlot(tempArmy) {
    for (let i = 0; i < 8; i++) {
        let span = document.createElement('span');
        span.id = 'klsnt-army-slot-' + tempArmy[i];
        document.getElementById('klsnt-army-slot_'+i).appendChild(span);
    }
}