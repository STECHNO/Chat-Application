var getMsg = document.getElementById('msg');
var sendBtn = document.getElementById('send_btn');

const login = () => {
    document.getElementById('closeBtn').parentNode.remove()
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;
        let userData = {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            uid: user.uid
        }
        
        firebase.database().ref('all_users/' + userData.uid).set(userData);

    }).catch(function (error) {
        console.log(error.message)
    });
}


var userDb = [];
var otherId = ''
var frndid = '';
var frndLastMsg = '';
// console.log(frndLastMsg)

firebase.auth().onAuthStateChanged(function (user) {
    if (user != null) {
        var prevent_duplicate_db = false;
        firebase.database().ref('all_users').on('child_added', (data) => {

            // var allUsers = data.val();

            // console.log(data.val());
            userDb.push(data.val());
            if (data.val().uid !== firebase.auth().currentUser.uid) {
                // console.log(allUsers)
                prevent_duplicate_db = true;

                let frndList = document.getElementById('friendList');
                let createFrndList = document.createElement('div');
                createFrndList.setAttribute('id', data.val().uid);
                createFrndList.setAttribute('onClick', 'start_Chat(this.id, this.firstChild.src, this.children[1].innerHTML)');
                createFrndList.setAttribute('class', 'other_chat_div');
                frndList.appendChild(createFrndList)

                let createFrndImage = document.createElement('img');
                createFrndImage.setAttribute('src', data.val().photo);
                createFrndImage.setAttribute('class', 'other_chat_img');
                createFrndList.appendChild(createFrndImage)

                let createFrndName = document.createElement('p');
                createFrndName.setAttribute('class', 'friendName');
                createFrndName.style.display = 'inline-block';
                createFrndName.innerHTML = data.val().name;
                createFrndList.appendChild(createFrndName)

                let createFrndMsgSnap = document.createElement('p');
                createFrndMsgSnap.setAttribute('id', 'friendMsgSnap');
                createFrndMsgSnap.setAttribute('class', 'friendMsgSnap');

                firebase.database().ref('all_messages/' + firebase.auth().currentUser.uid + '/' +  data.val().uid).on('child_added', (data) => {
                    createFrndMsgSnap.innerHTML = data.val().currentUserMsg
                    createFrndList.appendChild(createFrndMsgSnap)

                })
                // createFrndMsgSnap.style.display = 'inline';

            }

            if (prevent_duplicate_db === false) {
            }
            else {
                document.getElementById('user_profile_image').src = firebase.auth().currentUser.photoURL;
            }
        })
    }
    else {
        document.getElementById('user_profile_image').src = "images/user_profile_image.png";
        document.getElementById('friendList').innerHTML = ''
    }

});













let getChat = (otherId) => {


}






// console.log(frndid)
let start_Chat = (frndUid, img, name) => {
    document.getElementById('msg-output').innerHTML = '';
    document.getElementById('user_name').innerHTML = name
    
    
    firebase.database().ref('all_messages/' + frndUid).push({
        name
    });
    frndid = frndUid
    // console.log(frndid)
    document.getElementById('chat_field').style.display = 'block';
    var myid = firebase.auth().currentUser.uid
    var frindidString = frndid.toString();
    // console.log(frindidString)
    var myidString = myid.toString();
    // console.log(myidString)

    // console.log('all_messages/KjSLWIDVdnTpmWyqfmi0ki6FPlP2' + '/' +myidString)

    firebase.database().ref('all_messages/' + frindidString + '/' + myidString).on('child_added', (data) => {
        // console.log('all_messages/KjSLWIDVdnTpmWyqfmi0ki6FPlP2/' +frindidString)
        // console.log(data.val().currentUserMsg)
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
        createMsgPara.innerHTML = data.val().currentUserMsg;
        frndLastMsg = createMsgPara.innerHTML;

        getMsgAreaDiv.appendChild(createMsgEle);
        createMsgEle.appendChild(createMsgUserImage);
        createMsgEle.appendChild(createMsgPara);
    })

    firebase.database().ref('all_messages/' + myidString + '/' +  frindidString).on('child_added', (data) => {
        // console.log(data.val())
        let getMsgAreaDiv = document.getElementById('msg-output');
        let createMsgEle = document.createElement('div');
        createMsgEle.style.marginTop = '4px'
        createMsgEle.style.cssFloat = 'right'
        createMsgEle.style.width = '100%'

        let createMsgUserImage = document.createElement('img');
        createMsgUserImage.setAttribute('src', img);
        createMsgUserImage.style.borderRadius = '50px';
        createMsgUserImage.style.width = '45px';
        createMsgUserImage.style.height = '45px';
        createMsgUserImage.style.cssFloat = 'right'

        let createMsgPara = document.createElement('p');
        createMsgPara.setAttribute('class', 'msg-output-design-other');
        createMsgPara.style.display = 'inline-block';
        createMsgPara.innerHTML += data.val().currentUserMsg;
        createMsgPara.style.cssFloat = 'left';
        
        getMsgAreaDiv.appendChild(createMsgEle);
        createMsgEle.appendChild(createMsgUserImage);
        createMsgEle.appendChild(createMsgPara);
    })

    

}

// console.log(frndid)

let enableSendBtn = () => {
    if(getMsg.value != ''){
        document.getElementById('send_btn').classList.remove("fa-disabled");
    }
    else if(getMsg.value === ''){
        document.getElementById('send_btn').classList.add("fa-disabled");
    }
}


let sendMsg = () => {
    
    let key = frndid;
    let msgRecords = {
        currentUserMsg: document.getElementById('msg').value,
        currentUserId: firebase.auth().currentUser.uid,
        key: key
    }
    firebase.database().ref('all_messages/' + frndid).child(firebase.auth().currentUser.uid).push(msgRecords);
    
    getMsg.value = '';
    document.getElementById('send_btn').classList.add("fa-disabled")
}




















function key(e) {
    if (e.keyCode === 13 && getMsg.value.length >= 1) {
        sendMsg();
    }
}
getMsg.addEventListener("keydown", key, false)


let = openMenu = () => {
    var menu = document.getElementById('open-menu');
    var menuOpen = document.createElement('div');
    menuOpen.setAttribute('class', 'menu-decoration')
    var closeBtn = document.createElement("i")
    closeBtn.classList.add('fas');
    closeBtn.classList.add('fa-times');
    closeBtn.setAttribute('onClick', 'closeBtn(this)')
    closeBtn.setAttribute('id', 'closeBtn')
    menuOpen.appendChild(closeBtn)

    var login = document.createElement('p')
    loginLink = document.createElement('a')
    loginLink.setAttribute('href', '#')
    loginLink.setAttribute('onClick', 'login()')
    loginLink.innerHTML = "Login"
    login.appendChild(loginLink)
    menuOpen.appendChild(login)

    var logout = document.createElement('p')
    logoutLink = document.createElement('a')
    logoutLink.setAttribute('href', '#')
    logoutLink.setAttribute('onClick', 'logout()')
    logoutLink.innerHTML = "Logout"
    logout.appendChild(logoutLink)
    menuOpen.appendChild(logout)

    document.body.appendChild(menuOpen)
}

let closeBtn = (c) => {
    c.parentNode.remove()
}

let = logout = () => {
    firebase.auth().signOut().then(function () {
        document.getElementById('closeBtn').parentNode.remove()
        console.log('Sign-out successful.')
    }).catch(function (error) {
        console.log('An error happened.')
    });
}