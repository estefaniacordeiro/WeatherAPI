'use strict';

loadInitialDom();

let $sendButton = $('#sendBtn').on('click', insertCity);
$("#city").keypress((e) => {
    if(e.which === 13){
        insertCity()
    }
})

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
    $('body').append($sectionLocation);
    $sectionLocation.append($labelCity, $inputCity, $buttonSend, $sectionMessageError);
    $('body').append($sectionDate);
    $('body').append($sectionData);
    $sectionDate.append($dateWeek, $fullDate);
    $sectionSunTime.append($sunriseTime, $sunsetTime);
    $sectionData.append($temperature, $sectionSunTime, $windIcon);
    $body.prepend($icon)
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
        console.log(responseInfoCity);
        printNameCity(responseInfoCity);
        dataUse(responseInfoCity);
        printTemperatureCity(responseInfoCity);
    });
};

function errorNotFound() {
    $('.error-message').text('This city doesn´t exist!').show();
    console.log($('.label-city'));
    $('.label-city')[0].textContent ='';
    $('#city').on('click', function() {
        $('.error-message').hide('slow');
    });
    $('#weekday')[0].textContent = '';
    $('#full-date')[0].textContent = '';
    $('#temperature')[0].textContent = '';
    $('#state-icons')[0].textContent = '';
    $('#sunrise-time')[0].textContent = '';
    $('#sunset-time')[0].textContent = '';
    $('#wind-icons')[0].textContent = '';
}

function printNameCity(res) {
    $('.label-city').text(res.name);
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
    let now = new Date().getTime();
    console.log(now)
    console.log(response.sys.sunset * 1000)
    if(now > response.sys.sunset * 1000){
        console.log("now")
    } else {console.log("sunset")}
    switch(weatherCode){
        case "2":
            iconLocation.html(`
            <img src="assets/svg/thunderstorm.svg" alt="thunderstorm">`);
            break;
        case "3":
                iconLocation.html(`
                <img src="assets/svg/drizzle.svg" alt="drizzle">`);
            break;
        case "5":
            if(now < response.sys.sunset * 1000){
                iconLocation.html(`
                <img src="assets/svg/rainy-day.svg" alt="rainy day">`)
                break
            } else {
                iconLocation.html(`
                <img src="assets/svg/rainy-night.svg" alt="rainy night">`)
                break
            }
        case "6":
            if(now < response.sys.sunset * 1000){
                iconLocation.html(`
                <img src="assets/svg/snowy-day.svg" alt="snow day">`)
                break
            } else {
                iconLocation.html(`
                <img src="assets/svg/snow-night.svg" alt="snow night">`)
                break
            }
        case "7":
            iconLocation.html(`
            <img src="assets/svg/fog.svg" alt="mist">`)
            break;
        case "8":
            if(response.weather[0].id === 800){
                if(now < response.sys.sunset * 1000){
                    iconLocation.html(`
                    <img src="assets/svg/sun.svg" alt="sunny day">`)
                    break
                } else {
                    iconLocation.html(`
                    <img src="assets/svg/moon.svg" alt="clear night">`)
                    break
                }}
            else {
                if(now < response.sys.sunset * 1000){
                    iconLocation.html(`
                    <img src="assets/svg/cloudy.svg" alt="cloudy day">`)
                    break
                } else {
                    iconLocation.html(`
                    <img src="assets/svg/cloudy-night.svg" alt="cloudy night">`)
                    break
                }}
    }
}


