'use strict';

loadInitialDom();

let $sendButton = $('#sendBtn').on('click', insertCity);

function loadInitialDom() {
    let $sectionLocation = $('<section id="location-searchbar" class="searchbar"></section>');
    let $labelCity = $(`<label for="location" class="label-city"></label>`);
    let $inputCity = $(`<input type="text" id="city" class="input-city" onfocus="this.value=''" value="Insert a city">`);
    const $buttonSend = $('<button id="sendBtn" class="sendBtn">Search</button>');
    const $sectionMessageError = $('<section class="error-message"></section>');
    $('body').append($sectionLocation);
    $sectionLocation.append($labelCity, $inputCity, $buttonSend, $sectionMessageError);
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
        console.log(responseInfoCity)
        printNameCity(responseInfoCity);
        loadTotalDom();
        dataUse(responseInfoCity)
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
}

function printNameCity(res) {
    $('.label-city').text(res.name);
}

function loadTotalDom() {
    let $sectionDate = $('<section class="date--container"></section>');
    let $dateWeek = $(`<time id="weekday" class="date"></time>`);
    let $fullDate = $(`<time id="full-date" class="date"></time>`);
    let $sectionData = $('<section class="api-data--container"></section>');
    let $temperature = $(`<section class="temperature" id="temperature"></section>`);
    let $icons = $(`<section id="icon-location"></section>`);
    let $sunriseTime = $(`<section id="sunrise-time"></section>`);
    let $sunsetTime = $(`<section id="sunset-time"></section>`);
    let $windIcon = $(`<section id="wind-icons"></section>`);
    $('body').append($sectionDate);
    $('body').append($sectionData);
    $sectionDate.append($dateWeek, $fullDate);
    $sectionData.append($temperature, $sunriseTime, $sunsetTime, $windIcon);
    $(".label-city").prepend($icons)
}

function printTemperatureCity(responseInfoCity) {
    $('#temperature').html(Math.round(responseInfoCity.main.temp) + ' °C');
}

/*--------------------------Función para trabajar con los datos de la petición-------------------------------------*/
let $icon = $("#icon-location")
function dataUse(response){
    renderTimes(response)
    renderDayAndDate()
    setIcons(response, $icon)
}

function formatTimes(date){
    let h = date.getHours()
    let min = date.getMinutes()
    let s = date.getSeconds()
    if(min<10){min = '0' + min}
    if(s<10){s = '0' + s}

    let returnTime = `<p>${h}:${min}:${s}</p>`;
    return returnTime;
}

function renderTimes(response){
    let $sunrise = $("#sunrise-time") 
    let $sunset = $("#sunset-time")

    let sunriseTime = new Date(response.sys.sunrise * 1000)
    let sunsetTime = new Date(response.sys.sunset * 1000)

    $sunrise.html(
        `<h4>SUNRISE TIME</h4>
        <p>${formatTimes(sunriseTime)}</p>`)
    $sunset.html(
        `<h4>SUNSET TIME</h4>
        <p>${formatTimes(sunsetTime)}</p>`)
}

function renderDayAndDate(){
    let today = new Date()

    let y = today.getFullYear()
    let m = today.getMonth() + 1
    let d = today.getDate()
    if (d<9){d = '0'+ d} 
    if (m<9){m = '0'+ m}

    let daysArray = ["Monday", "Tuesday", "Wednesay", "Thursday", "Friday", "Saturday", "Sunday"]
    let weekday = daysArray[today.getDay() - 1]
    let fullDate = `${d}/${m}/${y}`
    
    $("#weekday").html(weekday)
    $("#full-date").html(fullDate)
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
            <img src="assets/svg/cloudy.svg" alt="cloudy day"></img>`)
            }
            
            break;
        
    }
}


