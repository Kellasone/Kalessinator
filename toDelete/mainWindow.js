// // const windowDiv = document.createElement('div');
// // windowDiv.classList.add('toDelete');
// // // windowDiv.style.setProperty('visibility', 'hidden');
// // windowDiv.style.setProperty('visibility', 'visible');
// //
// // const topBar = document.createElement('div');
// // const body = document.createElement('div');
// // const bottom = document.createElement('div');
// //
// // const name = document.createElement('span');
// // name.innerText = 'Kalessinator';
// // name.id = 'name';
// // topBar.appendChild(name);
// //
// // const bodyContent = document.createElement("div")
// // bodyContent.id = 'bodyContent';
// //
// // topBar.id = 'windowTopBar';
// // body.id = 'windowBody';
// // bottom.id = 'windowBottom';
// //
// // const tabsHeader = document.createElement('div');
// // tabsHeader.id = 'tabsHeader'
// //
// // const tabs = ['attack', 'settings'];
// //
// // function createMenuContent(tabName) {
// //     var bodyContent = document.getElementById('bodyContent');
// //     var menuContent = document.createElement('div');
// //     menuContent.id=tabName+ '-content';
// //     if(bodyContent.children.length > 1)
// //         bodyContent.children[1].remove();
// //
// //     switch (tabName){
// //         case 'attack' :
// //             var title = document.createElement('h2');
// //             title.innerText = 'Attack Menu'
// //             title.style.textAlign = 'center';
// //             menuContent.appendChild(title);
// //             break;
// //         case 'settings' :
// //             var title = document.createElement('h2');
// //             title.innerText = 'Settings menu';
// //             title.style.textAlign = 'center';
// //             menuContent.appendChild(title);
// //             break;
// //     }
// //     bodyContent.appendChild(menuContent);
// // }
// //
// // tabs.forEach((tabName) => {
// //     const tab = document.createElement('div');
// //     tab.classList.add('tab');
// //
// //     var image = document.createElement('div');
// //     image.id = tabName;
// //
// //     tab.appendChild(image);
// //     tab.addEventListener('click', () => {
// //         const tabs = document.getElementById('tabsHeader').children;
// //         for(const tabElement of tabs) {
// //             tabElement.id ='';
// //         }
// //         tab.id = 'tabSelected';
// //         createMenuContent(tabName);
// //     })
// //     tabsHeader.appendChild(tab);
// // })
// //
// // bodyContent.appendChild(tabsHeader);
// //
// // body.appendChild(bodyContent);
// //
// // windowDiv.appendChild(topBar);
// // windowDiv.appendChild(body);
// // windowDiv.appendChild(bottom);
// //
// // document.querySelector('body').appendChild(windowDiv);
// //
// // createMenuContent('attack');
// //
// // dragElement(windowDiv);
// //
// // function dragElement(window) {
// //     var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
// //     if (topBar) {
// //         topBar.onmousedown = dragMouseDown;
// //     } else {
// //         window.onmousedown = dragMouseDown;
// //     }
// //
// //     function dragMouseDown(e) {
// //         e = e || window.event;
// //         e.preventDefault();
// //         pos3 = e.clientX;
// //         pos4 = e.clientY;
// //         document.onmouseup = closeDragElement;
// //         document.onmousemove = elementDrag;
// //     }
// //
// //     function elementDrag(e) {
// //         e = e || window.event;
// //         e.preventDefault();
// //         pos1 = pos3 - e.clientX;
// //         pos2 = pos4 - e.clientY;
// //         pos3 = e.clientX;
// //         pos4 = e.clientY;
// //         window.style.top = (window.offsetTop - pos2) + "px";
// //         window.style.left = (window.offsetLeft - pos1) + "px";
// //     }
// //
// //     function closeDragElement() {
// //         // stop moving when mouse button is released:
// //         document.onmouseup = null;
// //         document.onmousemove = null;
// //     }
// // }
//
//
// const toDelete = document.createElement('div');
// toDelete.classList.add('window-box');
// toDelete.id = 'kalessinator-window'
// toDelete.style.width='400px';
// toDelete.style.height='700px';
//
// const windowTitle = document.createElement('div');
// windowTitle.classList.add('window-head');
// windowTitle.innerText = 'Kalessinator';
// windowTitle.style.fontWeight = 'bold';
//
// const closeButton = document.createElement('span');
// closeButton.classList.add('window-close');
// closeButton.style.width = '22px';
// closeButton.style.height = '22px';
//
// closeButton.addEventListener('click', () => {
//     toDelete.style.visibility = 'hidden';
// })
// windowTitle.appendChild(closeButton);
//
// toDelete.appendChild(windowTitle);
// document.querySelector('body').appendChild(toDelete);
//
// dragElement(document.getElementById("kalessinator-window"));
//
// function dragElement(elmnt) {
//     var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//
//     document.getElementsByClassName("window-head")[0].onmousedown = dragMouseDown;
//
//
//     function dragMouseDown(e) {
//         e = e || window.event;
//         e.preventDefault();
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         document.onmouseup = closeDragElement;
//         document.onmousemove = elementDrag;
//     }
//
//     function elementDrag(e) {
//         e = e || window.event;
//         e.preventDefault();
//         pos1 = pos3 - e.clientX;
//         pos2 = pos4 - e.clientY;
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//         elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//     }
//
//     function closeDragElement() {
//         document.onmouseup = null;
//         document.onmousemove = null;
//     }
// }