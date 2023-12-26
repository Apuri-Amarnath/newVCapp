let remoteClientAnswer = null;
const localConnection = new RTCPeerConnection();
const dataChannel = localConnection.createDataChannel("chatChannel");

localConnection.onicecandidate = ev => {
    console.log("New ICE Candidate " + ev.candidate);
    console.log("ICE connection state %s", localConnection.iceConnectionState);
    console.log("offer value %s", JSON.stringify(localConnection.localDescription));
};

dataChannel.onopen = ev => {
    console.log("Connection opened. Event %s", ev);
};

dataChannel.onmessage = ev => {
    console.log("Received message from client %s\n\tmsg: ", ev.origin, ev.data);
};

localConnection.createOffer().then(offerVal => {
    console.log("offer value %s", JSON.stringify(offerVal));
    localConnection.setLocalDescription(offerVal).then(offerResponse => {
        console.log("offer accepted %s", offerResponse);
    });
});

//right now this is an empty object, but we need to get the remote answer Object
remoteClientAnswer = {};
//so copy paste this value from the client console for sending the messages
remoteClientAnswer = {
    "type": "answer",
    "sdp": "v=0\r\no=- 8738333222359012689 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=msid-semantic: WMS\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=candidate:2617823946 1 udp 2113937151 2fb1f9d1-a85e-43d4-bf90-fe083f68ca88.local 54569 typ host generation 0 network-cost 999\r\na=ice-ufrag:l5wm\r\na=ice-pwd:su3WRkaDRELDV6HAi04rrjhw\r\na=ice-options:trickle\r\na=fingerprint:sha-256 95:C1:64:7E:5E:94:47:D7:FC:61:09:10:1E:93:FF:54:0F:5F:61:6E:AC:97:17:D4:59:D4:9C:2E:B6:6B:52:6D\r\na=setup:active\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n"
};
localConnection.setRemoteDescription(remoteClientAnswer).then(value => {
    console.log("Answer accepted")
});
