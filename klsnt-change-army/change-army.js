function createChangeArmyWindow(windowId, height , width , windowName) {
    let newWindow = createWindow(windowId, width, height, windowName);
    createContentChangeArmy(newWindow);
}

function addWindowHeader(windowName) {
    let windowHeader = document.createElement('div');
    windowHeader.classList.add("klsnt-window-header");
    windowHeader.innerText = windowName;
    return windowHeader;
}
function addCloseButton(windowHeader, newWindow) {
    let klsntCloseButton = document.createElement('div');
    klsntCloseButton.classList.add('klsnt-close-button');
    windowHeader.appendChild(klsntCloseButton);
    klsntCloseButton.addEventListener('click', () => {
        newWindow.remove();
    })
}

function createContentChangeArmy(newWindow) {
    let windowId = newWindow.id;
    let windowContent;
    let dropdownErasMenu;
    windowContent = addCurrentArmy(windowContent);
    dropdownErasMenu = addDropdownMenu(windowContent);
    addSelectArmy(windowContent);
    addSaveButton(windowId, newWindow, windowContent);

    prepopulateSelectedArmy("klsnt-change-army");
    prepopulateSelectArmy(dropdownErasMenu.selectedOptions[0].value);
}

function addCurrentArmy(windowContent) {
    windowContent = document.createElement('div');
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
    return windowContent;
}
function transformArmy(armyContainer) {
    let army = [];
    for (let i = 0; i < 8; i++) {
        let troop = armyContainer.children[i].children[0].id.slice(16);
        army.push(troop);
    }
    return army;
}
function addDropdownMenu(windowContent) {
    const dropdownErasMenu = document.createElement('select');

    for (let key in troops) {
        const erasOption = document.createElement('option');
        erasOption.value = troops[key]['id'];
        erasOption.innerText = troops[key]['description'];
        dropdownErasMenu.appendChild(erasOption);
    }

    if (localStorage.getItem('armySelectOption')) {
        dropdownErasMenu.selectedIndex = localStorage.getItem('armySelectOption');
    }
    windowContent.appendChild(dropdownErasMenu);

    dropdownErasMenu.addEventListener('change', () => {
        let testName = troops[dropdownErasMenu.selectedOptions[0].value]['units'].slice();
        testName.push('rogue');
        repopulateGBGArmySlot(testName, "klsnt-change-army-select");
        localStorage.setItem('armySelectOption', JSON.stringify(dropdownErasMenu.selectedIndex));
    });

    return dropdownErasMenu;
}
function addSelectArmy(windowContent) {
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
}
function addSaveButton(windowId, newWindow, windowContent) {
    const saveButton = document.createElement('div');

    saveButton.classList.add('klsnt-button');

    saveButton.innerText = "Save army";

    saveButton.addEventListener('click', () => {
        let army = transformArmy(document.getElementById("klsnt-change-army-current"));
        localStorage.setItem('gbgArmy', JSON.stringify(army));
        repopulateGBGArmySlot(army, 'klsnt-army');
        document.getElementById(windowId).remove();
    })

    newWindow.appendChild(windowContent);
    document.querySelector('body').appendChild(newWindow);


    windowContent.appendChild(saveButton);
}
function prepopulateSelectArmy(era) {
    let units = troops[era]["units"].slice();
    units.push('rogue');
    populateGBGArmySlot(units, "klsnt-change-army-select");
}
function repopulateGBGArmySlot(currentArmy, elementId) {
    for (let i = 0; i < currentArmy.length; i++) {
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

