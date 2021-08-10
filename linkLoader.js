let linkDiv = document.getElementById('links');

let i = 0;
for(; i + 5 < linkList.length; i += 6) {
    let newRow = document.createElement('div');
    newRow.className = 'link-row';
    for(let j = i; j < i + 6; j ++) {
        let newLink = document.createElement('div');
        newLink.className = 'link';
        let newLinkOverlay = document.createElement('a');
        newLinkOverlay.className = 'overlay';
        newLinkOverlay.href = 'https://alontanay.github.io/' + linkList[j].linkUrl;
        newLink.appendChild(newLinkOverlay);
        let newLinkText = document.createElement('p');
        newLinkText.className = 'link-txt';
        newLinkText.innerHTML = linkList[j].title;
        newLink.appendChild(newLinkText);
        let newLinkImage = document.createElement('img');
        if(linkList[j].thumbnail == undefined) {
            newLinkImage.src = 'NA.jpg';
        } else {
            newLinkImage.src = './' + linkList[j].thumbnail;
        }
        newLinkImage.className = 'link-img';
        newLink.appendChild(newLinkImage);
        newRow.appendChild(newLink);
    }
    linkDiv.appendChild(newRow);
}
let newRow;
if(linkList.length % 6) {
    newRow = document.createElement('div');
    newRow.className = 'link-row';
}

for(; i < linkList.length; i ++) {
    let newLink = document.createElement('div');
    newLink.className = 'link';
    let newLinkOverlay = document.createElement('a');
    newLinkOverlay.className = 'overlay';
    newLinkOverlay.href = 'https://alontanay.github.io/' + linkList[i].linkUrl;
    newLink.appendChild(newLinkOverlay);
    let newLinkText = document.createElement('p');
    newLinkText.className = 'link-txt';
    newLinkText.innerHTML = linkList[i].title;
    newLink.appendChild(newLinkText);
    let newLinkImage = document.createElement('img');
    if(linkList[i].thumbnail == undefined) {
        newLinkImage.src = 'NA.jpg';
    } else {
        newLinkImage.src = './' + linkList[i].thumbnail;
    }
    newLinkImage.className = 'link-img';
    newLink.appendChild(newLinkImage);
    newRow.appendChild(newLink);
}
linkDiv.appendChild(newRow);