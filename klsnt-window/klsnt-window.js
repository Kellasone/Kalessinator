let klsntWindowContainer = document.createElement('div');
klsntWindowContainer.classList.add('klsnt-window-container','klsnt-default-cursor');
klsntWindowContainer.style.visibility = 'hidden';

let klsntWindowHeader = document.createElement('div');
klsntWindowHeader.classList.add('klsnt-window-header');
klsntWindowHeader.innerText = 'Kalessinator';

klsntCloseButton = document.createElement('div');
klsntCloseButton.classList.add('klsnt-close-button');
klsntWindowHeader.appendChild(klsntCloseButton);

klsntCloseButton.addEventListener('click', () => {
    klsntWindowContainer.style.visibility = 'hidden';
})


dragElement(klsntWindowContainer, klsntWindowHeader)
klsntWindowContainer.appendChild(klsntWindowHeader);
let klsntWindowBody = document.createElement('div');
klsntWindowBody.classList.add('klsnt-window-body');

let klsntWindowBodyTabs = document.createElement('div');
klsntWindowBodyTabs.classList.add('klsnt-tabs');



for(let i = 0; i< 5 ; i++){
    let klsntTab = document.createElement('div');
    klsntTab.classList.add('klsnt-tab');
    klsntWindowBodyTabs.appendChild(klsntTab);

    if(i == 0){
        klsntTab.classList.remove('klsnt-tab');
        klsntTab.classList.add('klsnt-tab-selected');
    }

    klsntTab.addEventListener('click', (e) => {
        let curentlySelectedTab = document.getElementsByClassName('klsnt-tab-selected')[0];
        curentlySelectedTab.classList.remove('klsnt-tab-selected');
        curentlySelectedTab.classList.add('klsnt-tab');

        e.srcElement.classList.remove('klsnt-tab');
        e.srcElement.classList.add('klsnt-tab-selected');
    })
}


klsntWindowBody.appendChild(klsntWindowBodyTabs);
klsntWindowContainer.appendChild(klsntWindowBody);
document.querySelector('body').appendChild(klsntWindowContainer);


function dragElement(windowContainer, header) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        windowContainer.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

    }

    function elementDrag(e) {
        header.classList.add('klsnt-drag-cursor');
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        windowContainer.style.top = (windowContainer.offsetTop - pos2) + "px";
        windowContainer.style.left = (windowContainer.offsetLeft - pos1) + "px";
    }

    function closeDragElement(e) {
        document.onmouseup = null;
        document.onmousemove = null;
        console.log()
        header.classList.remove('klsnt-drag-cursor');
    }
}