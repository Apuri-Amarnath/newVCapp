function sendMessage(msgToSend) {
    textOnlyChannel.send(msgToSend);
    addMsgDiv(msgToSend, "out-msg");
}

function onMessage(receivedMsg) {
    addMsgDiv(receivedMsg);
}

function addMsgDiv(textContent, msgTypeClass = "in-msg") {
    const msgsContainer = document.getElementById("messages-container");
    const msgDiv = document.createElement('div');
    msgDiv.classList.add(msgTypeClass);
    msgDiv.textContent = textContent;
    msgsContainer.append(msgDiv);
    const sectionBreak = document.createElement('div');
    sectionBreak.classList.add("msg-section-brk");
    msgsContainer.append(sectionBreak);
}

function showMessagesContainer(meetingId, meetingTitle) {
    const msgsParent = document.getElementById("messages-parent");
    msgsParent.style.display = "block";
    const startMeeting = document.getElementById("start-meeting");
    startMeeting.style.display = "none";
    const meetingTitleEle= document.getElementById("meetingTitle");
    meetingTitleEle.textContent = meetingTitle;
    const meetingIdEle = document.getElementById("meetingId");
    meetingIdEle.textContent = meetingId;
}

