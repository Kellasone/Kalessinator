async function checkQuests() {
    var request = [{
        "__class__": "ServerRequest",
        "requestData": [],
        "requestClass": "QuestService",
        "requestMethod": "getUpdates"
    }];

    var response = await FoeSendRequestAsync(request, 0);
    var index = findMethodJson(response,"getUpdates");

    let advanceableQuestsIds = getAdvanceableQuestIds(response, index);
    if(advanceableQuestsIds.length > 0 ) {
        for (const id of advanceableQuestsIds) {
            response = await advanceQuest(id);
        }
    }
    index = findMethodJson(response,"getUpdates");
    let numberOfRecurringQuests = getRecurringQuestNumber(response,index);
    let numberOfFPRecurringQuests = document.getElementById('klsnt-rqn-input').value;
    let keepCoinsQuest = numberOfRecurringQuests - numberOfFPRecurringQuests > 0 ? true : false;

    let abortQuests;
    let currentFPRecurringQuestsNumber;
    let currentCoinsRecurringQuestsNumber;

    do {
        abortQuests = false;
        let searchResponse = getCurentNeededRQAvailable(response, index);
        currentFPRecurringQuestsNumber = searchResponse.currentFPRecurringQuestsNumber;
        currentCoinsRecurringQuestsNumber = searchResponse.currentCoinsRecurringQuestsNumber;

        if((currentFPRecurringQuestsNumber == numberOfFPRecurringQuests)
            && ((currentCoinsRecurringQuestsNumber == 1) && keepCoinsQuest)){
            break;
        }

        let includeCoinsRQ;
        if(keepCoinsQuest) {
            includeCoinsRQ = currentCoinsRecurringQuestsNumber == 0;
        }

        let abortableQuestId = getAbortableQuestIds(response,index,keepCoinsQuest);

        if(abortableQuestId.length > 0) {
            for(let i =0;i< abortableQuestId.length;i++){
                response = await abandonQuest(abortableQuestId[i]);
            }
            index = findMethodJson(response,"getUpdates");
            abortQuests = true;
        }

    } while (abortQuests)

    document.getElementById('RQ-reset').style.color = 'white';
    // if (getAdvanceableQuestIds(response, index)){
    //     advanceQuest(getAdvanceableQuestIds(response, index));
    // } else if (getAbortableQuestIds(response,index)){
    //     resetQuests(getAbortableQuestIds(response,index),getAbortableQuestIds(response,index))
    // }






}
async function parseAttackResponse(request, response) {
    var index = findMethodJson(response, "startByBattleType");
    if (index == -1) {
        return null;
    }
    if (response[index]["responseData"]["state"]["winnerBit"] == 1) {
        if (response[index]["responseData"]["battleType"]["totalWaves"] == 2) {
            response = await FoeSendRequestAsync(request, 0);
        }
    } else {
        return 1;
    }
    return 0;
}

async function attackSector(sectorId) {
    let request = [{
        "__class__": "ServerRequest",
        "requestData": [{
            "__class__": "BattlegroundBattleType",
            "attackerPlayerId": 0,
            "defenderPlayerId": 0,
            "type": "battleground",
            "currentWaveId": 0,
            "totalWaves": 0,
            "provinceId": sectorId,
            "battlesWon": 0
        }, true],
        "requestClass": "BattlefieldService",
        "requestMethod": "startByBattleType"
    }]

    let response = await FoeSendRequestAsync(request, 0);
    await parseAttackResponse(request, response);
}

function populateGbgContent() {
    if(document.getElementById('klsnt-gbg-content')){
        document.getElementById('klsnt-gbg-content').innerText = 'misto';

        let  attackNeighboursButton = document.createElement('div');
        attackNeighboursButton.classList.add('klsnt-button');
        attackNeighboursButton.style.userSelect = 'none';
        attackNeighboursButton.innerText = 'Attack Neighbours';

        attackNeighboursButton.addEventListener('click',async () => {

            attackNeighboursButton.style.color = "red";
            await attackNeighbours();
            attackNeighboursButton.style.color = "rgb(246,212,164)";
        });
        document.getElementById('klsnt-gbg-content').appendChild(attackNeighboursButton);


        let questsButton = document.createElement('div');
        questsButton.classList.add('klsnt-button');
        questsButton.style.userSelect = 'none';
        questsButton.innerText = 'Reset Quests';
        questsButton.id = 'RQ-reset';

        questsButton.addEventListener('click', async () => {
            questsButton.style.color = 'red';
            await checkQuests();

        });
        document.getElementById('klsnt-gbg-content').appendChild(questsButton);



        let menuContent = document.getElementById('klsnt-gbg-content');
        const dropdownGBGSectors = document.createElement('select');
        dropdownGBGSectors.id = 'dropdown-gbg-sectors-kale'
        dropdownGBGSectors.classList.add("temp-float");

        for (let i = 0; i < 60; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.innerText = BattlegroundSectorNames[i];
            dropdownGBGSectors.appendChild(option);
        }

        menuContent.appendChild(document.createElement('br'));
        menuContent.appendChild(document.createElement('br'));
        menuContent.appendChild(dropdownGBGSectors);

        menuContent.appendChild(document.createElement('br'));

        const fightsNumberLabel = document.createElement('label');
        fightsNumberLabel.innerText = "Fights number: ";
        fightsNumberLabel.classList.add("temp-float");
        menuContent.appendChild(fightsNumberLabel)
        const fightsNumber = document.createElement('input');
        fightsNumber.type = "number";
        fightsNumber.id = 'fights-number-gbg-kale';
        menuContent.appendChild(fightsNumber);

        menuContent.appendChild(document.createElement('br'));

        const fightsWaitLabel = document.createElement('label');
        fightsWaitLabel.innerText = "Wait (in milliseconds): "
        fightsWaitLabel.classList.add("temp-float");
        menuContent.appendChild(fightsWaitLabel)
        const fightsWait = document.createElement('input');
        fightsWait.type = "number";
        fightsWait.id = 'fights-wait-gbg-kale';
        menuContent.appendChild(fightsWait);

        const fightButton = document.createElement('div');
        fightButton.classList.add('klsnt-button');
        fightButton.id = 'gbg-fight';
        fightButton.innerText = 'Fight'
        menuContent.appendChild(fightButton);

        fightButton.addEventListener('click', async () => {
            let sectorId = document.getElementById('dropdown-gbg-sectors-kale').selectedIndex;
            let fightsNumber = document.getElementById('fights-number-gbg-kale').value;
            let fightsDelay = document.getElementById('fights-wait-gbg-kale').value;

            let button = document.getElementById('gbg-fight');

            button.style.color = "red";
            for (let i = 0; i < fightsNumber; i++) {
                button.innerText = fightsNumber-i;
                await NewAttackArmy();
                attackSector(sectorId);
                await wait(fightsDelay);
            }
            button.innerText = 'Fight'
            button.style.color = "white";


        })



    } else {
        wait(200).then(r => populateGbgContent());
    }



}


function getCurentNeededRQAvailable(response, index) {
    let returnObject = {
        currentFPRecurringQuestsNumber: 0,
        currentCoinsRecurringQuestsNumber: 0
    }

    for (let i = 0;i<response[index]['responseData'].length;i++) {
        if(response[index]['responseData'][i]['windowTitle'].match("(Misiune repetitivă)(.*)")){
            if(response[index]['responseData'][i]['successConditions'][0]['description'].match("(Cheltu){1}(.*)(\\d){1,3}(.*)(Forge){1}")){
                returnObject.currentFPRecurringQuestsNumber++;
            } else if((response[index]['responseData'][i]['successConditions'][0]['description'].match("((Colectează)|(Strânge))(.*)(monede)") ||
                ((response[index]['responseData'][i]['successConditions'][1]) && (response[index]['responseData'][i]['successConditions'][1]['description'].match("((Colectează)|(Strânge))(.*)(monede)"))))) {
                returnObject.currentCoinsRecurringQuestsNumber++;
            }
        }
    }
    return returnObject;
}

function getRecurringQuestNumber(response, index) {
    let recurringQuestsIds = [];
    for (let i = 0;i<response[index]['responseData'].length;i++) {
        if(response[index]['responseData'][i]['windowTitle'].match("(Misiune repetitivă)(.*)")){
            recurringQuestsIds.push(response[index]['responseData'][i]['id'])
        }
    }
    return recurringQuestsIds.length;
}

async function abandonQuest(questId) {
    var request = [{
        "__class__": "ServerRequest",
        "requestData": [questId],
        "requestClass": "QuestService",
        "requestMethod": "abortQuest"
    }];
    return await FoeSendRequestAsync(request, 0);
}

async function advanceQuest(advanceableQuestId) {
    var request = [{
        "__class__": "ServerRequest",
        "requestData": [advanceableQuestId],
        "requestClass": "QuestService",
        "requestMethod": "advanceQuest"
    }];

    return await FoeSendRequestAsync(request, 0);
}

function getAbortableQuestIds(response,index, includeCoinsRQ){
    abortableQuestsIds = [];
    for (let i = 0;i<response[index]['responseData'].length;i++) {
        if(response[index]['responseData'][i]['windowTitle'].match("(Misiune repetitivă)(.*)")){
            if((response[index]['responseData'][i]['successConditions'][0]['description'].match("((Colectează)|(Strânge))(.*)(monede)"))
                || (response[index]['responseData'][i]['successConditions'][1] && response[index]['responseData'][i]['successConditions'][1]['description'].match("((Colectează)|(Strânge))(.*)(monede)")) ){
                if(!includeCoinsRQ) {
                    abortableQuestsIds.push(response[index]['responseData'][i]['id']);
                }
            }
            else if (!response[index]['responseData'][i]['successConditions'][0]['description'].match("(Cheltu){1}(.*)(\\d){1,3}(.*)(Forge){1}")) {
                abortableQuestsIds.push(response[index]['responseData'][i]['id']);
            }
        }
    }
    return abortableQuestsIds;
}

function getAdvanceableQuestIds(response,index){
    let advanceableQuests = [];
    for (let i = 0;i<response[index]['responseData'].length;i++) {
        if(response[index]['responseData'][i]['abortable'] == true){
            if(response[index]['responseData'][i]['successConditions'][0]['currentProgress'] == response[index]['responseData'][i]['successConditions'][0]['maxProgress']){
                advanceableQuests.push(response[index]['responseData'][i]['id']);
                console.log("Advanceable quest gives: " + response[index]['responseData'][i]['genericRewards'][0]['name']);
            }
        }
    }
    return advanceableQuests;
}
