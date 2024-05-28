"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

var currentUser = "";
var emojisEnabled = false;

document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("messageContainer");

    let li = document.createElement("li");
    li.classList.add("chatBubble");
    if (user == currentUser) {
        li.classList.add("chatBubbleSelf");
    }
    else {
        playNotificationSound();
        li.classList.add("chatBubbleOther");
    }
    
    rowDiv.appendChild(li);

    let stickerName = "";

    let sentTime = message.split("&")[1];
    let content = message.split("&")[0];

    if (content.includes("*STICKER<")) {
        stickerName = content.split("<")[1].split(">")[0];
    }

    let msgContainer = document.createElement("div");
    msgContainer.style.display = "flex";
    msgContainer.style.flexDirection = "column";

    let msgHeader = document.createElement("b");
    msgHeader.style.fontSize = "12px";
    msgHeader.textContent = user;

    msgContainer.appendChild(msgHeader);

    let msgSeparator = document.createElement("hr");
    msgSeparator.style.color = "black";
    msgSeparator.style.margin = "0px";
    msgSeparator.style.marginBottom = "3px";

    msgContainer.appendChild(msgSeparator);

    let msgContent;
    if (stickerName == "") {
        msgContent = document.createElement("div")
        msgContent.style.textAlign = "left";
        msgContent.textContent = content;
    }
    else {
        msgContent = document.createElement("img");
        msgContent.src = "imgs/" + stickerName + ".png";
        msgContent.classList.add("sticker-img");
    }

    msgContainer.appendChild(msgContent);

    let msgTime = document.createElement("i");
    msgTime.textContent = sentTime;
    msgTime.style.textAlign = "right";
    msgTime.style.fontSize = "8px";

    msgContainer.appendChild(msgTime);

    li.appendChild(msgContainer);

    document.getElementById("messagesList").appendChild(rowDiv);
    document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

function enableEmojis() {
    const elementIDs = ["s_hi", "s_bye", "s_ok", "s_yes", "s_no"];

    elementIDs.forEach((elID) => {
            let el = document.getElementById(elID);
            el.disabled = false;
            el.style.filter = "none";
            el.style.backgroundColor = "#FAF5B8";
        }
    );
}

document.getElementById("sendButton").addEventListener("click", function (event) {
    let user = document.getElementById("userInput").value;
    let message = document.getElementById("messageInput").value;

    if (user == "" || message == "") {
        alert("No fields may be left empty.");
        return;
    }

    if (!emojisEnabled) {
        enableEmojis();
    }

    if (currentUser == "") {
        currentUser = user;
    }
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

// Postavljanje eventHandler-a na dugmice sa dodatnim parametrom

const eventHandler = (event, arg) => {
    let user = document.getElementById("userInput").value;
    let message = "*STICKER<" + arg + ">*";

    if (currentUser == "") {
        currentUser = user;
    }
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
}

document.getElementById("s_hi").addEventListener('click', (event) => eventHandler(event, "s_hi"));
document.getElementById("s_bye").addEventListener('click', (event) => eventHandler(event, "s_bye"));
document.getElementById("s_ok").addEventListener('click', (event) => eventHandler(event, "s_ok"));
document.getElementById("s_yes").addEventListener('click', (event) => eventHandler(event, "s_yes"));
document.getElementById("s_no").addEventListener('click', (event) => eventHandler(event, "s_no"));

// Pustanje zvuka za obavestenje pri stizanju poruke
function playNotificationSound() {
    let audio = document.getElementById("notification");
    audio.play();
}
