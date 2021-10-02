const wrapper = document.createElement('div');
wrapper.id = 'wrapper';
wrapper.classList.add('game-cursor');

const innerImage = document.createElement('div');
innerImage.id = 'innerImage';

async function advanceQuestThenReset(advanceableQuestId) {
    var request = [{
        "__class__": "ServerRequest",
        "requestData": [advanceableQuestId],
        "requestClass": "QuestService",
        "requestMethod": "advanceQuest"
    }];

    var response = await FoeSendRequestAsync(request, 0);
    var index = findMethodJson(response, "getUpdates");
    let id = getAdvanceableQuestId(response, index);
    if (id) {
        advanceQuestThenReset(id);
    } else {
        checkQuests();
    }


}

async function checkQuests() {
    var request = [{
        "__class__": "ServerRequest",
        "requestData": [],
        "requestClass": "QuestService",
        "requestMethod": "getUpdates"
    }];

    var response = await FoeSendRequestAsync(request, 0);
    var index = findMethodJson(response,"getUpdates");
    if (getAdvanceableQuestId(response, index)){
        advanceQuestThenReset(getAdvanceableQuestId(response, index));
    } else if (getAbortableQuestId(response,index)){
        resetQuests(getAbortableQuestId(response,index))
    }

}

innerImage.addEventListener('click', function (event) {

    checkQuests();
    let mainWindow = document.getElementsByClassName('mainWindow')[0];
    let currentVisibilityStatus = mainWindow.style.getPropertyValue('visibility');
    if (currentVisibilityStatus === 'hidden')
        mainWindow.style.visibility = 'visible';
    else
        mainWindow.style.visibility = 'hidden';
});

wrapper.appendChild(innerImage);

document.querySelector('body').appendChild(wrapper);

async function resetQuests(questId) {
    var request = [{
        "__class__": "ServerRequest",
        "requestData": [questId],
        "requestClass": "QuestService",
        "requestMethod": "abortQuest"
    }];
    var response = await FoeSendRequestAsync(request, 0);
    var index = findMethodJson(response,"getUpdates");
    let id = getAbortableQuestId(response,index);
    if (id){
        resetQuests(id);
    }
}

function getAbortableQuestId(response,index){
    for (let i = 0;i<response[index]['responseData'].length;i++) {
        if(response[index]['responseData'][i]['abortable'] == true){
            if(!response[index]['responseData'][i]['successConditions'][0]['description'].match("(.*)(\\d)*(>*)(Forge)")){
                return(response[index]['responseData'][i]['id']);
            }
        }
    }
    return null;
}

function getAdvanceableQuestId(response,index){
    for (let i = 0;i<response[index]['responseData'].length;i++) {
        if(response[index]['responseData'][i]['abortable'] == true){
            if(response[index]['responseData'][i]['successConditions'][0]['currentProgress'] == response[index]['responseData'][i]['successConditions'][0]['maxProgress']){
                return(response[index]['responseData'][i]['id']);
            }
        }
    }
}
