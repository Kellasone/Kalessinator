function transformArmy(armyContainer) {
    let army = [];
    for (let i = 0; i < 8; i++) {
        let troop = armyContainer.children[i].children[0].id.slice(16);
        army.push(troop);
    }
    return army;
}

function repopulateGBGArmySlot(currentArmy, elementId) {
    for (let i = 0; i < 8; i++) {
        document.getElementById(elementId + '-slot_' + i).firstChild.remove();
    }
    populateGBGArmySlot(currentArmy, elementId)
}

function sortArmy(currentArmy) {
    for (let i = currentArmy.length-2; i > -1; i--) {
        if((currentArmy[i] ==='empty') && (currentArmy[i+1] !=='empty')) {
            currentArmy.push(currentArmy[i])
            currentArmy.splice(i,1);
            i++;
        }
    }
    return currentArmy;
}

function insertUnit(unit, selectedArmy) {
    let i = 0;
    while(selectedArmy[i] !=='empty' && i<selectedArmy.length){
        i++;
    }

    if (i<selectedArmy.length){
        selectedArmy[i] = unit;
    }
    return selectedArmy;
}

function createChangeArmyWindow() {
    let newWindow = document.createElement('div');
    newWindow.classList.add('klsnt-window-container')
    newWindow.id = 'klsnt-change-army-window';
    newWindow.style.width = '400px';
    newWindow.style.height = '200px';

    let windowTop = localStorage.getItem('klsnt-' + newWindow.id + '-top');
    let windowLeft = localStorage.getItem('klsnt-' + newWindow.id + '-left');

    if (windowTop && windowLeft) {
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
    dragElement(newWindow, windowHeader);

    let windowContent = document.createElement('div');
    windowContent.classList.add('klsnt-change-army-content');

    let armyContainer = document.createElement('div');
    armyContainer.classList.add('klsnt-army-container');
    armyContainer.id = 'klsnt-change-army-current';

    for (let i = 0; i < 8; i++) {
        let armySlot = document.createElement('div');
        armySlot.classList.add('klsnt-army-slot');
        armySlot.id = 'klsnt-change-army-slot_' + i;
        armyContainer.appendChild(armySlot)


        armySlot.addEventListener('click', () => {
            let armyContainer = document.getElementById('klsnt-change-army-current');
            let currentArmy = transformArmy(armyContainer);
            currentArmy[i] = 'empty';
            currentArmy = sortArmy(currentArmy);
            repopulateGBGArmySlot(currentArmy, "klsnt-change-army");
        })
    }

    windowContent.appendChild(armyContainer);

    const dropdownErasMenu = document.createElement('select');

    for (let key in troops){
        const erasOption = document.createElement('option');
        erasOption.value = troops[key]['id'];
        erasOption.innerText = troops[key]['description'];
        dropdownErasMenu.appendChild(erasOption);
    }

    const saveButton = document.createElement('div');
    saveButton.classList.add('klsnt-button');
    saveButton.innerText="Save army";

    saveButton.addEventListener('click', () =>{
        let army = transformArmy(document.getElementById("klsnt-change-army-current"));
        localStorage.setItem('gbgArmy', JSON.stringify(army));
        repopulateGBGArmySlot(army,'klsnt-army');
        document.getElementById('klsnt-change-army-window').remove();
    })

    windowContent.appendChild(dropdownErasMenu);


    newWindow.appendChild(windowContent);

    document.querySelector('body').appendChild(newWindow);

    let selectTroopsContainer = document.createElement('div');
    selectTroopsContainer.classList.add('klsnt-army-container');
    selectTroopsContainer.id = 'klsnt-change-army-select';

    for (let i = 0; i < 7; i++) {
        let armySlot = document.createElement('div');
        armySlot.classList.add('klsnt-army-slot');
        armySlot.id = 'klsnt-change-army-select-slot_' + i;
        selectTroopsContainer.appendChild(armySlot)

        armySlot.addEventListener('click', () => {
            let unit = armySlot.children[0].id.slice(16);

            let selectedArmy = transformArmy(document.getElementById('klsnt-change-army-current'));
            let newSelectedArmy = insertUnit(unit, selectedArmy)
            newSelectedArmy = sortArmy(newSelectedArmy);
            repopulateGBGArmySlot(newSelectedArmy, "klsnt-change-army")
        })
    }

    windowContent.appendChild(selectTroopsContainer);
    windowContent.appendChild(saveButton);

    let savedArmy = JSON.parse(localStorage.getItem('gbgArmy'));
    if (savedArmy) {
        populateGBGArmySlot(savedArmy, 'klsnt-change-army');
    } else {
        populateGBGArmySlot(['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'], 'klsnt-change-army')
    }

    let units = troops["sav"]["units"];
    units.push('rogue');
    populateGBGArmySlot(units, "klsnt-change-army-select");


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
    if (savedArmy) {
        populateGBGArmySlot(savedArmy, 'klsnt-army');
    } else {
        populateGBGArmySlot(['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'], 'klsnt-army')
    }

    let changeArmyButton = document.createElement('div');
    changeArmyButton.classList.add('klsnt-button');
    changeArmyButton.innerText = 'Change army';

    changeArmyButton.addEventListener('click', () => {
        createChangeArmyWindow();
    })

    content.appendChild(changeArmyButton);
    content.appendChild(document.createElement('hr'));
}

function populateGBGArmySlot(tempArmy, elementId) {
    for (let i = 0; i < tempArmy.length; i++) {
        let span = document.createElement('span');
        span.id = 'klsnt-army-slot-' + tempArmy[i];
        document.getElementById(elementId + '-slot_' + i).appendChild(span);
    }
}