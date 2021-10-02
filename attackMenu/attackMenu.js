function createAttackMenu(menuContent) {
    var title = document.createElement('h2');
    title.innerText = 'Attack Menu'
    title.style.userSelect = 'none';
    title.style.textAlign = 'center';
    menuContent.appendChild(title);

    var  attackNeighboursButton = document.createElement('div');
    attackNeighboursButton.classList.add('buttonClass');
    attackNeighboursButton.style.userSelect = 'none';
    attackNeighboursButton.innerText = 'Attack Neighbours';

    attackNeighboursButton.addEventListener('click',async () => {

        createResultWindow();
        await attackNeighbours();

        // let testDiv = document.createElement('div');
        // testDiv.id = 'test-div';
        // testDiv.innerText = 'some text';
        // document.querySelector('body').appendChild(testDiv);


    });
    menuContent.appendChild(attackNeighboursButton);
}