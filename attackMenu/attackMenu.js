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

    });
    menuContent.appendChild(attackNeighboursButton);
}