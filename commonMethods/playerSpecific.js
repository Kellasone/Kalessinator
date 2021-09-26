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

async function NewAttackArmy(e, type = "") {
    var armyVar = ['legionnaire', 'rogue', 'rogue', 'rogue', 'rogue', 'rogue', 'rogue', 'rogue']

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