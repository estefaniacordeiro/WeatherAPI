let $sendButton = $('#sendBtn').on('click', insertCity);

function insertCity() {
    let $city = $('#city').val();

    var requestGetInfoCity = {
        "url": `http://api.openweathermap.org/data/2.5/weather?q=${$city}&appid=1fcca735713a75849d5eb7aeeb64c517&units=metric&lang=en`,
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(requestGetInfoCity).done(function(responseInfoCity){
        dataUse(responseInfoCity)
    });
    
}

/*--------------------------Función para trabajar con los datos de la petición-------------------------------------*/
function dataUse(response){
    let sunriseTime = new Date(response.sys.sunrise * 1000)
    let sunsetTime = new Date(response.sys.sunset * 1000)
    
    let $sunrise = $("#sunrise-time") 
    let $sunset = $("#sunset-time")

    $sunrise.html(
        `<h4>SUNRISE TIME</h4>
        <p>${formatDate(sunriseTime)}</p>`)
    $sunset.html(
        `<h4>SUNSET TIME</h4>
        <p>${formatDate(sunsetTime)}</p>`)
}
function formatDate(date){
    
    let h = date.getHours()
    let min = date.getMinutes()
    let s = date.getSeconds()
    if(min<10){min = '0' + min}
    if(s<10){s = '0' + s}

    let returnTime = `<p>${h}:${min}:${s}</p>`
    return returnTime
}

/*
let y = date.getFullYear()
let m = date.getMonth() + 1
let d = date.getDate()
if (d<9){d = '0'+ d} 
if (m<9){m = '0'+ m} 
*/