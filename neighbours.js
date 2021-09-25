async function getNeighborList() {
    var request = [{
        "__class__": "ServerRequest",
        "requestData": [],
        "requestClass": "OtherPlayerService",
        "requestMethod": "getNeighborList"
    }];
    var response = await FoeSendRequestAsync(request, 0);
    var index = findMethodJson(response, "getNeighborList");
    if (index != -1) {
        var neighbors = response[index]["responseData"];
        for (let i = 0; i < neighbors.length; i++) {
            if (neighbors[i]['next_interaction_in'] != null || neighbors[i]['is_friend'] == true || neighbors[i]['is_guild_member'] == true || (neighbors[i]['clan'] != null && (neighbors[i]['clan']['name'] === '.⊱☆ HAIDUCII ☆⊰.' || neighbors[i]['clan']['name'] === "☠SoulReapers☠"))) {

                neighbors.splice(i, 1);
                i--;

            }
        }
        return neighbors;
    } else {
        console.log("Error finding method!");
        return null;
    }
}

function findMethodJson(json, className) {
    for (var i = 0; i < json.length; i++) {
        if (json[i]["requestMethod"] == className) return i;
    }
    return -1;
}

async function getCurrentUserId() {
    var request = [{"__class__":"ServerRequest","requestData":[],"requestClass":"OtherPlayerService","requestMethod":"getFriendsList"}];
    var response = await FoeSendRequestAsync(request,0);
    var index = findMethodJson(response,"getFriendsList");
    if(index!=-1) {
        let players = response[index]["responseData"];
        for (let i = 0; i < players.length; i++) {
            if(players[i]["is_self"] == true) return players[i];
        }

    }
    else consoleLog("Error finding method!");
}

async function attackNeighbours() {
    const currentUser = await getCurrentUserId();

    var attackList = await getNeighborList();

    for (const neighbour of attackList){
        var request = [{
            "__class__": "ServerRequest",
            "requestData": [{
                "__class__": "PvpBattleType",
                "attackerPlayerId": currentUser.player_id,
                "defenderPlayerId": neighbour.player_id,
                "type": "pvp",
                "currentWaveId": 0,
                "totalWaves": 0,
                "isRevenge": false
            }, true],
            "requestClass": "BattlefieldService",
            "requestMethod": "startByBattleType"
        }];
        await NewAttackArmy();
        // console.log("Would attack " + neighbour.name + " from " + neighbour.clan.name);
        // console.log(neighbour);
        var response  = await FoeSendRequestAsync(request,0);
        var index = findMethodJson(response,"startByBattleType");
        // console.log(response[index]);
        var log = 'Attacked ' + neighbour.name + ' and ';
        if(response[index]['responseData']['__class__'] === 'Error'){
            console.log('Error attacking ' + neighbour.name + "!");
        }
        else {
            if(response[index]['responseData']['state']['winnerBit'] == 1)
                console.log(log + 'won!');
            else
                console.log(log + 'lost!');
        }

    }

}


async function getArmyInfo() {
    var request = [{
        "__class__": "ServerRequest",
        "requestData": [{"__class__": "ArmyContext", "content": "main"}],
        "requestClass": "ArmyUnitManagementService",
        "requestMethod": "getArmyInfo"
    }];
    var response = await FoeSendRequestAsync(request, 0);
    var index = findMethodJson(response, "getArmyInfo");
    if (index != -1)
        // return response[index]["responseData"]['units'];
        console.log(response[index]);
    else {
        consoleLog("Error finding method!");
        return null;
    }
}


async function getArmyInfo() {
    var request = [{
        "__class__": "ServerRequest",
        "requestData": [{"__class__": "ArmyContext", "content": "main"}],
        "requestClass": "ArmyUnitManagementService",
        "requestMethod": "getArmyInfo"
    }];
    var response = await FoeSendRequestAsync(request, 0);
    var index = findMethodJson(response, "getArmyInfo");
    if (index != -1) return response[index]["responseData"]['units'];
    else {
        consoleLog("Error finding method!");
        return null;
    }
}

async function NewAttackArmy(e, type = "") {
    var armyVar = ['power_dragon', 'rogue', 'rogue', 'rogue', 'rogue', 'rogue', 'rogue', 'rogue']

    var armyIds = [];
    var armyIds_defending = [];
    var army = await getArmyInfo();
    for (var i = 0; i < army.length; i++) {
        if (armyIds_defending.length == 8) break;
        if (army[i]["is_defending"] == true && !armyIds_defending.includes(army[i]["unitId"])) armyIds_defending.push(army[i]["unitId"]);
    }
    armyVar.forEach((unit, i) => {
        for (var i = 0; i < army.length; i++) {
            if (army[i]["is_defending"] == false && army[i]["unitTypeId"] == unit && army[i]["currentHitpoints"] == 10 && !armyIds.includes(army[i]["unitId"])) {
                armyIds.push(army[i]["unitId"]);
                break;
            }
        }
    });
    var request = [{
        "__class__": "ServerRequest",
        "requestData": [[{"__class__": "ArmyPool", "units": armyIds, "type": "attacking"}, {
            "__class__": "ArmyPool",
            "units": armyIds_defending,
            "type": "defending"
        }, {"__class__": "ArmyPool", "units": [], "type": "arena_defending"}], {
            "__class__": "ArmyContext",
            "content": "main"
        }],
        "requestClass": "ArmyUnitManagementService",
        "requestMethod": "updatePools"
    }];
    await FoeSendRequestAsync(request, 0);
    console.log("New army set");
    return 1;

}