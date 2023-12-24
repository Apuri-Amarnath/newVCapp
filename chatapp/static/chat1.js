function startConnection(){
    const dataToSend = { offer:"this is a offer"};
    localStorage.setItem('homeDataEvent',JSON.stringify(dataToSend));
    const chatDataEvent = new Event('chatDataEvent');
    document.dispatchEvent(chatDataEvent);

    window.addEventListener('storage',(event) =>{
        if(event.key == 'homeDataEvent'){
            const recievedData = JSON.parse(event.newValue);

            Handle_recieveddata(recievedData);
        }
    });
    function Handle_recieveddata(data) {
        console.log("recieved data from home.js", data)
    }
}