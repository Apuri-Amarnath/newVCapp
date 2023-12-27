async function postJsonData(url, requestData) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

function synchronousPostJsonObject(url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, false);  // The third parameter specifies synchronous request

    // Set the appropriate headers
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Convert the data to a JSON string
    var jsonData = JSON.stringify(data);

    // Send the request
    xhr.send(jsonData);

    // Check the status of the request
    if (xhr.status === 200) {
        // Parse the JSON response
        var jsonResponse = JSON.parse(xhr.responseText);
        return jsonResponse;
    } else {
        // Handle the error
        console.error('Error:', xhr.status, xhr.statusText);
        return null;
    }
}

function synchronousGetRequest(url) {
    const xhr = new XMLHttpRequest();

// Configure it as a synchronous request
    xhr.open('GET', url, false);  // The third parameter 'false' makes it synchronous

    try {
        // Send the request
        xhr.send();

        // Check if the request was successful (status code 200)
        if (xhr.status === 200) {
            // Parse the response as JSON
            const data = JSON.parse(xhr.responseText);
            console.log('Synchronous JSON data:', data);
            return data;
        } else {
            console.error(`HTTP error! Status: ${xhr.status}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}