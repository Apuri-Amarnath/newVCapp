function startConnection(){
    const dataToSend = { answer:"this is a offer"};
    localStorage.setItem('answer',JSON.stringify(dataToSend));
    const chatDataEvent = new Event('homeDataEvent');
    document.dispatchEvent(chatDataEvent);

    window.addEventListener('storage',(event) =>{
        if(event.key == 'offer'){
            const recievedData = JSON.parse(event.newValue);

            Handle_recieveddata(recievedData);
        }
    });
    function Handle_recieveddata(data) {
        console.log("recieved data from chat.js", data)
    }
}