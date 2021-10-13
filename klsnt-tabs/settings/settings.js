function createSaveButton(content) {
    const saveButton = document.createElement('div');
    saveButton.classList.add('klsnt-button')
    saveButton.innerText = "Save"

    saveButton.addEventListener('click', ()=>{
        const inputText = document.getElementById('klsnt-rqn-input');
        localStorage.setItem(inputText.id, inputText.value )
    })

    content.appendChild(saveButton);
    content.appendChild(document.createElement('hr'));
}

function createInputText(content) {
    const inputBox = document.createElement('input');
    inputBox.id = 'klsnt-rqn-input';
    const rqNumber = localStorage.getItem(inputBox.id);
    if (rqNumber) {
        inputBox.value = rqNumber
    } else {
        inputBox.value = "0";
    }
    content.appendChild(inputBox);
}

function createRecurringQuestsDivision(content) {
    createLabel(content, "FP Recurring Quests Number");
    createInputText(content);
    createSaveButton(content)
}

async function populateSettingsContent() {
    while (!document.getElementById('klsnt-settings-content')) {
        await wait(200);
    }
    const content = document.getElementById('klsnt-settings-content');

    createChangeArmyDivision(content);
    createRecurringQuestsDivision(content);
}

function createLabel(content, labelText ) {
    const label = document.createElement('label');
    label.innerText = labelText;
    content.appendChild(label);
}

function createChangeArmyDivision(content) {
    createLabel(content, "Gbg Army");

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
        populateGBGArmySlot(['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'], elementId)
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
