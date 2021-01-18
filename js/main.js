let $sendButton = $('#sendBtn').on('click', insertCity);

function insertCity() {
    let $city = $('#city').val();
    console.log($city);

    var requestGetInfoCity = {
        "url": `http://api.openweathermap.org/data/2.5/weather?q=${$city}&appid=1fcca735713a75849d5eb7aeeb64c517&units=metric&lang=en`,
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(requestGetInfoCity).done(function (responseInfoCity) {
        console.log(responseInfoCity);
    });
    
}

