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


        //------------------------
        const negotiationButton = document.createElement('div');
        negotiationButton.classList.add('klsnt-button');
        negotiationButton.id = 'gbg-negotiate';
        negotiationButton.innerText = 'Negotiate'
        menuContent.appendChild(negotiationButton);

        negotiationButton.addEventListener('click', async () => {
            document.getElementById('negoLabel').innerText = "";
            let sectorId = document.getElementById('dropdown-gbg-sectors-kale').selectedIndex;
            let fightsNumber = document.getElementById('fights-number-gbg-kale').value;
            let fightsDelay = document.getElementById('fights-wait-gbg-kale').value;

            let button = document.getElementById('gbg-negotiate');

            button.style.color = "red";
            for (let i = 0; i < fightsNumber; i++) {
                button.innerText = fightsNumber-i;
                // await NewAttackArmy();
                // attackSector(sectorId);
                await negotiationClg(sectorId);
                await wait(fightsDelay);
            }
            button.innerText = 'Negotiate'
            button.style.color = "white";


        })
        //------------------------

        let negoLabel = document.createElement('label');
        negoLabel.id = 'negoLabel';
        menuContent.appendChild(negoLabel);



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


async function getResources() {
        var request = [{
            "__class__": "ServerRequest",
            "requestData": [],
            "requestClass": "ResourceService",
            "requestMethod": "getPlayerResources"
        }];
        var response = await FoeSendRequestAsync(request);

        var index = findMethodJson(response, "getPlayerResources");
        if (index != -1) return response[index]['responseData']['resources'];
        else {
            consoleLog("Error finding method!");
            return null;
        }
}

// copied code !!!!
async function negotiate(type, sectorId, maxDiamondBuys = 0) {
    if (type != 'exp' && type != 'clg') {
        console.log("Cannot find negotiation type");
        return null;
    }
    var finishedAllItems = false;
    var currentDiamondBuy = 1;
    var totalPosibleCost = await getNegotiationCost(type, sectorId);
    var playerResources = await getResources();
    var negotiation_game_turn = playerResources['negotiation_game_turn'];
    var placeblePosibleCost = JSON.parse(JSON.stringify(totalPosibleCost));
    var allNegotiation = [];
    var wrongPersonList = [];
    var slotList = [
        {"slotId": 0, "resourceId": null, "__class__": "NegotiationGameSlot"},
        {"slotId": 1, "resourceId": null, "__class__": "NegotiationGameSlot"},
        {"slotId": 2, "resourceId": null, "__class__": "NegotiationGameSlot"},
        {"slotId": 3, "resourceId": null, "__class__": "NegotiationGameSlot"},
        {"slotId": 4, "resourceId": null, "__class__": "NegotiationGameSlot"}
    ];

    async function submitNegotiation(combination, turn) {
        var returnedResponse = {};

        var rq = [{
            "__class__": "ServerRequest",
            "requestData": [],
            "requestClass": "NegotiationGameService",
            "requestMethod": "submitTurn"
        }];
        rq[0]['requestData'].push(combination);
        rq[0]['requestData'].push(turn);

        var response = await FoeSendRequestAsync(rq, 0);

        var index = findMethodJson(response, "submitTurn");
        if (index == -1) {
            console.log("Error finding method!");
            return null;
        }
        returnedResponse['negotiationState'] = response[index]["responseData"]['state'];
        if (!response[index]["responseData"]['turnResult']['slots'][0]['slotId']) response[index]["responseData"]['turnResult']['slots'][0]['slotId'] = 0;
        returnedResponse['turnResult'] = response[index]["responseData"]['turnResult']['slots'];
        index = findMethodJson(response, "getPlayerResources");
        if (index == -1) {
            console.log("Error finding method!");
            return null;
        }
        returnedResponse['playerResources'] = response[index]["responseData"]['resources'];
        return returnedResponse;
    }

    async function getNegotiationCost(type, sectorId) {
        var rq;
        if (type == 'exp') rq = [{
            "__class__": "ServerRequest",
            "requestData": [sectorId],
            "requestClass": "GuildExpeditionService",
            "requestMethod": "startNegotiation"
        }];
        else if (type == 'clg') rq = [{
            "__class__": "ServerRequest",
            "requestData": [sectorId],
            "requestClass": "GuildBattlegroundService",
            "requestMethod": "startNegotiation"
        }];
        else {
            console.log("Cannot find negotiation type");
            return null;
        }
        var response = await FoeSendRequestAsync(rq, 0);

        var index = findMethodJson(response, "startNegotiation");
        if (index == -1) {
            console.log("Error finding method!");
            return null;
        }
        var resources = response[index]["responseData"]['possibleCosts']['resources'];
        var parsedlist = [];
        for (var key in resources) parsedlist.push({'resourceId': key, 'ammount': resources[key]});
        return parsedlist;
    }

    async function buyNegotiationTry(type) {
        var rq = [{
            "__class__": "ServerRequest",
            "requestData": [type + ":turnAfterGameLost"],
            "requestClass": "ResourceShopService",
            "requestMethod": "buyOffer"
        }];
        await FoeSendRequestAsync(rq, 0);
    }

    async function giveUp() {
        var rq = [{
            "__class__": "ServerRequest",
            "requestData": [],
            "requestClass": "NegotiationGameService",
            "requestMethod": "giveUp"
        }];
        await FoeSendRequestAsync(rq, 0);
        if(document.getElementById('negoLabel').innerText.length>0){
            document.getElementById('negoLabel').innerText = document.getElementById('negoLabel').innerText + " - lost";
        } else {
            document.getElementById('negoLabel').innerText = "lost";
        }
    }

    function removeSlot(slotId) {
        for (let i = 0; i < slotList.length; i++) {
            if (slotList[i]['slotId'] == slotId) {
                slotList.splice(i, 1);
                break;
            }
        }
    }

    function removeCost(array, resourceId) {
        for (let i = 0; i < array.length; i++) {
            if (array[i]['resourceId'] == resourceId) {
                array.splice(i, 1);
                return;
            }
        }
    }

    function organizeList(initList) {
        var ornanizedList = [];
        initList.sort((a, b) => {
            return a.remainingItems.length - b.remainingItems.length;
        });
        var list2 = {};
        for (let i = 0; i < initList.length; i++) {
            var key = 'len' + String(initList[i]['remainingItems'].length);
            if (list2[key] == null) list2[key] = [];
            list2[key].push(initList[i]);
        }
        for (var key in list2) {
            list2[key].sort((a, b) => {
                if (a.remainingItems < b.remainingItems) return -1;
                if (a.remainingItems > b.remainingItems) return 1;
                return 0;
            });
            for (let i = 0; i < list2[key].length; i++) ornanizedList.push(JSON.parse(JSON.stringify(list2[key][i])));
        }
        return JSON.parse(JSON.stringify(ornanizedList));
    }

    function getPlacedItemsinSlot(slotId) {
        var returnedItems = [];
        for (let x = 0; x < allNegotiation.length; x++) {
            for (let y = 0; y < allNegotiation[x].length; y++) {
                if (allNegotiation[x][y]['slotId'] == slotId) {
                    returnedItems.push(allNegotiation[x][y]['resourceId']);
                }
            }
        }
        return returnedItems;
    }

    function findIndexInSlot(arr, placeid) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]['slotId'] == placeid) return i;
        }
        return -1;
    }

    function getWrongItemList() {
        var updatedWrongList = [];
        console.log('get wrong', wrongPersonList);
        wrongPersonList.forEach(itemToFind => {
            var obj = {'resourceId': itemToFind, 'remainingItems': [0, 1, 2, 3, 4]}
            for (let i = 0; i < allNegotiation.length; i++) {
                for (let j = 0; j < allNegotiation[i].length; j++) {
                    if (allNegotiation[i][j]['state'] == "correct") {
                        var remindex = obj['remainingItems'].indexOf(allNegotiation[i][j]['slotId']);
                        if (remindex != -1) obj['remainingItems'].splice(remindex, 1);
                    }
                    if (allNegotiation[i][j]['resourceId'] == itemToFind) obj['remainingItems'].splice(obj['remainingItems'].indexOf(allNegotiation[i][j]['slotId']), 1);
                }
            }
            updatedWrongList.push(obj);
        })
        // sort
        updatedWrongList = JSON.parse(JSON.stringify(organizeList(updatedWrongList)));
        return updatedWrongList;
    }

    function getAllFittingItems(combination, currentWrongList) {
        var currentWrongListCopy = [];
        currentWrongList.forEach(item => {
            for (let i = 0; i < combination.length; i++) {
                if (combination[i]['resourceId'] != null) continue;
                if (item['remainingItems'].indexOf(combination[i]['slotId']) != -1) {
                    currentWrongListCopy.push(item);
                    break;
                }
            }
        });
        currentWrongListCopy = organizeList(currentWrongListCopy);
        return JSON.parse(JSON.stringify(currentWrongListCopy));
    }

    function setItemInPlace(combination, slotId, resourceId) {
        var slot = findIndexInSlot(combination, slotId);
        if (combination[slot]['resourceId'] != null) return -1;
        var placedItems = getPlacedItemsinSlot(slotId);
        if (placedItems.length > 0) if (placedItems.indexOf(resourceId) != -1) return 0;
        combination[slot]['resourceId'] = resourceId;
        console.log('placing ', resourceId, 'slot ', slotId)
        return 1;
    }

    function shuffleItems(combination, currentWrongList) {
        if (currentWrongList.length == 0 || currentWrongList == null) {
            console.log('you done tho');
            return;
        }
        console.log('shuffle');
        currentWrongList = getAllFittingItems(combination, currentWrongList);

        console.log(JSON.stringify(currentWrongList));
        // if currentWrongListCopy has a item with a len of 1 then place it and pop it
        for (let x = 0; x < currentWrongList.length; x++) {
            if (currentWrongList[x]['remainingItems'].length != 1) continue;
            var place = currentWrongList[x]['remainingItems'][0];
            var itemResp = setItemInPlace(combination, place, currentWrongList[x]['resourceId']);
            // if succesfull remove self from all
            if (itemResp == 1) {
                console.log(currentWrongList[x]['resourceId'], 'placed in first loop');
                for (let y = 0; y < currentWrongList.length; y++) {
                    var findIndex = currentWrongList[y]['remainingItems'].indexOf(place);
                    if (findIndex != -1) currentWrongList[y]['remainingItems'].splice(findIndex, 1);
                }
                // remove self
                currentWrongList.splice(x, 1);
                console.log(JSON.stringify(currentWrongList));
                shuffleItems(combination, currentWrongList);
                return;
            }
        }

        currentWrongList = organizeList(currentWrongList);
        for (let i = 0; i < currentWrongList.length; i++) {
            for (let x = 0; x < currentWrongList[i]['remainingItems'].length; x++) {
                var place = currentWrongList[i]['remainingItems'][x];
                var itemResp = setItemInPlace(combination, place, currentWrongList[i]['resourceId']);
                // if succesfull remove self from all
                if (itemResp == 1) {
                    console.log(currentWrongList[i]['resourceId'], 'placed in seccond loop');
                    for (let y = 0; y < currentWrongList.length; y++) {
                        var findIndex = currentWrongList[y]['remainingItems'].indexOf(place);
                        if (findIndex != -1) currentWrongList[y]['remainingItems'].splice(findIndex, 1);

                        if (currentWrongList[y]['remainingItems'].length == 0) currentWrongList.splice(y, 1);
                    }

                    // remove self
                    currentWrongList.splice(i, 1);

                    console.log(JSON.stringify(currentWrongList));

                    shuffleItems(combination, currentWrongList);
                    break;
                }
            }
        }

    }

    // check if player has the needed resources
    for (let i = 0; i < totalPosibleCost.length; i++) {
        if (playerResources [totalPosibleCost[i]['resourceId']] == null) {
            console.log('Player has 0 ', totalPosibleCost[i]['resourceId']);
            return -1;
        }
        var minimumNeeded = totalPosibleCost[i]['ammount'] * 5;
        if (minimumNeeded > playerResources [totalPosibleCost[i]['resourceId']]) {
            console.log('Not enough ', totalPosibleCost[i]['resourceId'], ' ', playerResources [totalPosibleCost[i]['resourceId']], '/', minimumNeeded);
            return -1;
        }
    }

    console.log('Max turns: ', negotiation_game_turn);
    for (let negotiationTurn = 1; negotiationTurn <= negotiation_game_turn; negotiationTurn++) {
        console.log('Turn ', negotiationTurn);
        console.log('placeble cost', JSON.stringify(placeblePosibleCost));
        var newcombination = JSON.parse(JSON.stringify(slotList));
        // fill places
        // if finished to place all items shuffle
        var currentWrong = getWrongItemList();
        console.log('currentWrong', JSON.stringify(currentWrong));
        if (finishedAllItems == true || currentWrong.length == newcombination.length) {
            console.log('finisheditems', JSON.stringify(currentWrong));
            shuffleItems(newcombination, currentWrong);
        }
        if (currentWrong.length != newcombination.length) {

            for (let i = 0; i < newcombination.length; i++) {
                if (newcombination[i]['resourceId'] != null) continue;
                if (placeblePosibleCost.length == 0) {
                    placeblePosibleCost = JSON.parse(JSON.stringify(totalPosibleCost));
                    finishedAllItems = true;
                    if (i <= newcombination.length) {
                        console.log(JSON.stringify(newcombination));
                        console.log('finished slots', JSON.stringify(currentWrong));
                        shuffleItems(newcombination, currentWrong);
                    }
                }
                // place random shit

                while (true) {
                    var place = setItemInPlace(newcombination, newcombination[i]['slotId'], placeblePosibleCost[0]['resourceId']);
                    placeblePosibleCost.splice(0, 1);
                    if (place == 1 || place == -1) {
                        break;
                    }
                    if (placeblePosibleCost.length == 0) placeblePosibleCost = JSON.parse(JSON.stringify(totalPosibleCost));
                }
            }

        }


        console.log(JSON.stringify(newcombination));
        // send and parse negotiation
        var lastNegotiation = await submitNegotiation(newcombination, negotiationTurn);
        allNegotiation.push(lastNegotiation['turnResult']);
        for (let i = 0; i < lastNegotiation['turnResult'].length; i++) {
            if (lastNegotiation['turnResult'][i]['state'] == "correct") {
                removeSlot(lastNegotiation['turnResult'][i]['slotId']);
                var res = wrongPersonList.indexOf(lastNegotiation['turnResult'][i]['resourceId']);
                if (res != -1) wrongPersonList.splice(res, 1);
            } else if (lastNegotiation['turnResult'][i]['state'] == "not_needed") {
                removeCost(totalPosibleCost, lastNegotiation['turnResult'][i]['resourceId']);
                removeCost(placeblePosibleCost, lastNegotiation['turnResult'][i]['resourceId']);

                var res = wrongPersonList.indexOf(lastNegotiation['turnResult'][i]['resourceId']);
                if (res != -1) wrongPersonList.splice(res, 1);
            } else if (lastNegotiation['turnResult'][i]['state'] == "wrong_person") {
                var res = lastNegotiation['turnResult'][i]['resourceId'];
                if (wrongPersonList.indexOf(res) == -1) wrongPersonList.push(res);
            }
        }

        console.log(JSON.stringify(currentWrong));
        console.log('negotiation ongoing result', JSON.stringify(lastNegotiation['turnResult']))
        // check state for lastNegotiation
        {
            if (lastNegotiation['negotiationState'] == "won") {
                if(document.getElementById('negoLabel').innerText.length>0){
                    document.getElementById('negoLabel').innerText = document.getElementById('negoLabel').innerText + " - won";
                } else {
                    document.getElementById('negoLabel').innerText = "won";
                }
                console.log('Won negotiation');
                return {'state': lastNegotiation['negotiationState']};
            } else if (lastNegotiation['negotiationState'] == "ongoing") {

            } else if (lastNegotiation['negotiationState'] == "out_of_turns") {
                console.log('out of turns');
                if (maxDiamondBuys == 0) {
                    await giveUp();
                    return {'state': 'lost'};
                }
                if (currentDiamondBuy > maxDiamondBuys) {
                    console.log('Lost negotiation');
                    await giveUp();
                    return {'state': 'lost'};
                }
                console.log('Buying negotiation try: ', currentDiamondBuy, '/', maxDiamondBuys);
                if (type == "exp") await buyNegotiationTry("guildExpedition");
                else if (type == "clg") await buyNegotiationTry("guildBattleground");
                currentDiamondBuy++;
                negotiation_game_turn++;
            }
        }
    }
}

async function negotiationClg(sectorId) {
    try {
        console.log(await negotiate('clg', sectorId, 0));
    } catch (error) {
        console.log(error);
    }
}