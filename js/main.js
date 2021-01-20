'use strict';

loadInitialDom();


let $sendButton = $('#sendBtn').on('click', insertCity);

function loadInitialDom() {
    let $body = $("body");
    let $sectionLocation = $('<section id="location-searchbar" class="searchbar"></section>');
    let $labelCity = $(`<label for="location" class="label-city"></label>`);
    let $inputCity = $(`<input type="text" id="city" class="input-city" onfocus="this.value=''" value="Insert a city">`);
    const $buttonSend = $('<button id="sendBtn" class="sendBtn">Search</button>');
    const $sectionMessageError = $('<section class="error-message"></section>');
    let $sectionDate = $('<section class="date--container"></section>');
    let $dateWeek = $(`<time id="weekday" class="date"></time>`);
    let $fullDate = $(`<time id="full-date" class="date"></time>`);
    let $sectionData = $('<section class="api-data--container"></section>');
    let $temperature = $(`<section class="temperature" id="temperature"></section>`);
    let $icon = $(`<section id="icon-location"></section>`);
    let $sectionSunTime = $('<section id="section-sunTime" class="section-sunTime"></section>');
    let $sunriseTime = $(`<section id="sunrise-time"></section>`);
    let $sunsetTime = $(`<section id="sunset-time"></section>`);
    let $windIcon = $(`<section id="wind-icons"></section>`);
    $body.append($icon);
    $('body').append($sectionLocation);
    $sectionLocation.append($labelCity, $inputCity, $buttonSend, $sectionMessageError);
    $('body').append($sectionDate);
    $('body').append($sectionData);
    $sectionDate.append($dateWeek, $fullDate);
    $sectionSunTime.append($sunriseTime, $sunsetTime);
    $sectionData.append($temperature, $sectionSunTime, $windIcon);
    /* $body.prepend($icon) */
}

function insertCity() {
    let $city = $('#city').val();
    $('#city')[0].value = '';

    var requestGetInfoCity = {
        "url": `http://api.openweathermap.org/data/2.5/weather?q=${$city}&appid=1fcca735713a75849d5eb7aeeb64c517&units=metric&lang=en`,
        "method": "GET",
        "timeout": 0,
        statusCode: {
            404: errorNotFound,
        }
    };

    $.ajax(requestGetInfoCity).done(function (responseInfoCity) {
        /* console.log(responseInfoCity); */
        printNameCity(responseInfoCity);
        dataUse(responseInfoCity);
        printTemperatureCity(responseInfoCity);
        changeRangeColorsTemperature(responseInfoCity);
    });
};

function errorNotFound() {
    $('.error-message').text('This city doesn´t exist!').show();
    $('.label-city')[0].textContent ='';
    $('#city').on('click', function() {
        $('.error-message').hide('slow');
    });
    $('#icon-location')[0].innerHTML = '';
    $('#weekday')[0].textContent = '';
    $('#full-date')[0].textContent = '';
    $('#temperature')[0].textContent = '';
    $('#section-sunTime')[0].textContent = '';
    $('#wind-icons')[0].textContent = '';
}

function printNameCity(responseInfoCity) {
    $('.label-city').text(responseInfoCity.name);
}

function printTemperatureCity(responseInfoCity) {
    $('#temperature').html(Math.round(responseInfoCity.main.temp) + ' °C');
}

/*--------------------------Función para trabajar con los datos de la petición-------------------------------------*/
function dataUse(response){
    renderTimes(response)
    renderDayAndDate()
    setIcons(response)
}

function formatTimes(date){
    let h = date.getHours();
    let min = date.getMinutes();
    let s = date.getSeconds();
    if(min<10){min = '0' + min};
    if(s<10){s = '0' + s};

    let returnTime = `${h}:${min}:${s}`;
    return returnTime;
}

function renderTimes(response){
    let $sunrise = $("#sunrise-time");
    let $sunset = $("#sunset-time");

    let sunriseTime = new Date(response.sys.sunrise * 1000);
    let sunsetTime = new Date(response.sys.sunset * 1000);

    $sunrise.html(
        `<h4>SUNRISE TIME</h4>
        <p>${formatTimes(sunriseTime)}</p>`);
    $sunset.html(
        `<h4>SUNSET TIME</h4>
        <p>${formatTimes(sunsetTime)}</p>`);
}

function renderDayAndDate(){
    let today = new Date();

    let y = today.getFullYear();
    let m = today.getMonth() + 1;
    let d = today.getDate();
    if (d<9){d = '0'+ d};
    if (m<9){m = '0'+ m};

    let daysArray = ["Monday", "Tuesday", "Wednesay", "Thursday", "Friday", "Saturday", "Sunday"];
    let weekday = daysArray[today.getDay() - 1];
    let fullDate = `${d}/${m}/${y}`;

    $("#weekday").html(weekday);
    $("#full-date").html(fullDate);
}

function setIcons(response){
    let weatherCode = response.weather[0].id.toString()[0]
    let iconLocation = $("#icon-location")

    switch(weatherCode){
        case "2":
            iconLocation.html(`
            <img src="assets/svg/heavy-rain.svg"`);
            break;
        case "3":
            iconLocation.html(`
            <img src="assets/svg/rain.svg"`);
            break;
        case "5":
            iconLocation.html(`
            <img src="assets/svg/weather.svg"`);
            break;
        case "6":
            iconLocation.html(`
            <img src="assets/svg/snow.svg"`);
            break;
        case "7":
            break;
        case "8":
            if(response.weather[0].id === 800){
                iconLocation.html(`
                <img src="assets/svg/sun.svg" alt="sunny day">`);
            }
            else {
                iconLocation.html(`
                <img src="assets/svg/cloudy.svg" alt="cloudy">`)
            }
            break;
    }
}

function changeRangeColorsTemperature(responseInfoCity) {
    let $temperatureOfColor = responseInfoCity.main.temp;
    if($temperatureOfColor >= 30) {
        $('body').css("background-image", "linear-gradient(rgb(173, 106, 106), rgb(197, 2, 2))");
    } else if(20 <= $temperatureOfColor && $temperatureOfColor < 30 ) {
        $('body').css("background-image", "linear-gradient(rgb(207, 155, 113), rgb(226, 110, 2))");
    } else if(10 <= $temperatureOfColor && $temperatureOfColor < 20 ) {
        $('body').css("background-image", "linear-gradient(rgb(143, 226, 143), rgb(38, 160, 2)");
    } else if(0 <= $temperatureOfColor && $temperatureOfColor < 10 ) {
        $('body').css("background-image", "linear-gradient(rgb(134, 179, 216), rgb(2, 97, 160))");
    } else {
        $('body').css("background-image", "linear-gradient(rgb(197, 197, 197), rgb(255, 255, 255))");
    }
}
