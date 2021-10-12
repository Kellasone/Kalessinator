async function populateSettingsContent() {
    while (!document.getElementById('klsnt-settings-content')) {
        await wait(200);
    }
    const content = document.getElementById('klsnt-settings-content');

    createChangeArmyDivision(content);
}

function createChangeArmyDivision(content) {
    const gbgArmyLabel = document.createElement('label');
    gbgArmyLabel.innerText = "Gbg Army";
    content.appendChild(gbgArmyLabel);

    const armyContainer = document.createElement('div');
    armyContainer.classList.add('klsnt-army-container');

    createUnitSlot(armyContainer);
    content.appendChild(armyContainer);
    prepopulateSelectedArmy("klsnt-army");

    addChangeArmyButton(content);
    content.appendChild(document.createElement('hr'));
}

function createUnitSlot(armyContainer) {
    for (let i = 0; i < 8; i++) {
        let armySlot = document.createElement('div');
        armySlot.classList.add('klsnt-army-slot');
        armySlot.id = 'klsnt-army-slot_' + i;
        armyContainer.appendChild(armySlot)
    }
}

function prepopulateSelectedArmy(elementId) {
    let savedArmy = JSON.parse(localStorage.getItem('gbgArmy'));
    if (savedArmy) {
        populateGBGArmySlot(savedArmy, elementId);
    } else {
        populateGBGArmySlot(['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'], 'klsnt-army')
    }
}

function addChangeArmyButton(content) {
    let changeArmyButton = document.createElement('div');
    changeArmyButton.classList.add('klsnt-button');
    changeArmyButton.innerText = 'Change army';

    changeArmyButton.addEventListener('click', () => {
        createChangeArmyWindow('klsnt-change-army-window', '200px', "400px", "Change army");
    })

    content.appendChild(changeArmyButton);
}

function populateGBGArmySlot(tempArmy, elementId) {
    for (let i = 0; i < tempArmy.length; i++) {
        let span = document.createElement('span');
        span.id = 'klsnt-army-slot-' + tempArmy[i];
        document.getElementById(elementId + '-slot_' + i).appendChild(span);
    }
}
