let linkDiv = document.getElementById('links');
for(let category in linkList) {
    let newCategory = document.createElement('div');
    newCategory.className = 'category';
    let newTitle = document.createElement('h1');
    newTitle.innerHTML = category;
    newTitle.className = 'category-title';
    let newSep = document.createElement('hr');
    newCategory.appendChild(newTitle);
    newCategory.appendChild(newSep);
    let newRow = document.createElement('div');
    newRow.className = 'link-row';
    for(let link of linkList[category]) {
        let newLink = document.createElement('div');
        newLink.className = 'link';
        let newLinkOverlay = document.createElement('a');
        newLinkOverlay.className = 'overlay';
        newLinkOverlay.href = './' + link.url + '/index.html';
        newLink.appendChild(newLinkOverlay);
        let newLinkText = document.createElement('p');
        newLinkText.className = 'link-txt';
        newLinkText.innerHTML = link.title;
        newLink.appendChild(newLinkText);
        let newLinkImage = document.createElement('img');
        if(link.thumbnail == undefined) {
            newLinkImage.src = 'NA.jpg';
        } else {
            newLinkImage.src = './' + link.thumbnail;
        }
        newLinkImage.className = 'link-img';
        let newLinkImageContainer = document.createElement('div');
        newLinkImageContainer.className = 'link-img-container';
        newLinkImageContainer.appendChild(newLinkImage);
        newLink.appendChild(newLinkImageContainer);
        newRow.appendChild(newLink);
    }
    newCategory.appendChild(newRow);
    linkDiv.appendChild(newCategory);
}