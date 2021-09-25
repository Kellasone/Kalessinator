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
            if (neighbors[i]['next_interaction_in'] != null ||
                neighbors[i]['is_friend'] == true ||
                neighbors[i]['is_guild_member'] == true ||
                (neighbors[i]['clan'] != null &&
                    (neighbors[i]['clan']['name'] === '.⊱☆ HAIDUCII ☆⊰.' ||
                        neighbors[i]['clan']['name'] === "☠SoulReapers☠"))) {
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

async function attackNeighbours() {
    const currentUser = await getCurrentUserId();
    var attackList = await getNeighborList();

    for (const neighbour of attackList) {
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

        var response  = await FoeSendRequestAsync(request,0);

        var index = findMethodJson(response,"startByBattleType");
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

