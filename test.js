if (data.val().currentUserId === firebase.auth().currentUser.uid) {


    let getMsgAreaDiv = document.getElementById('msg-output');
    let createMsgEle = document.createElement('div');
    createMsgEle.style.marginTop = '5px'

    let createMsgUserImage = document.createElement('img');
    createMsgUserImage.setAttribute('src', firebase.auth().currentUser.photoURL);
    createMsgUserImage.style.borderRadius = '50px';
    createMsgUserImage.style.width = '45px';
    createMsgUserImage.style.height = '45px';

    let createMsgPara = document.createElement('p');
    createMsgPara.setAttribute('class', 'msg-output-design');
    createMsgPara.style.display = 'inline-block';
    createMsgPara.innerHTML = data.val().key.currentUserMsg;

    getMsgAreaDiv.appendChild(createMsgEle);
    createMsgEle.appendChild(createMsgUserImage);
    createMsgEle.appendChild(createMsgPara);





}
else {
    let getMsgAreaDiv = document.getElementById('msg-output');
    let createMsgEle = document.createElement('div');
    createMsgEle.style.marginTop = '4px'
    createMsgEle.style.cssFloat = 'right'
    createMsgEle.style.width = '100%'

    let createMsgUserImage = document.createElement('img');
    createMsgUserImage.setAttribute('src', firebase.auth().currentUser.photoURL);
    createMsgUserImage.style.borderRadius = '50px';
    createMsgUserImage.style.width = '45px';
    createMsgUserImage.style.height = '45px';
    createMsgUserImage.style.cssFloat = 'right'

    let createMsgPara = document.createElement('p');
    createMsgPara.setAttribute('class', 'msg-output-design-other');
    // createMsgPara.style.display = 'inline-block';
    createMsgPara.innerHTML = data.val().currentUserMsg;
    createMsgPara.style.cssFloat = 'left';

    getMsgAreaDiv.appendChild(createMsgEle);
    createMsgEle.appendChild(createMsgUserImage);
    createMsgEle.appendChild(createMsgPara);

}








