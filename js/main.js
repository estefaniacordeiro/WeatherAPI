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
    let $infoContainer = $('<section class="info--container"></section>');
    let $sectionDate = $('<section class="date--container"></section>');
    let $dateWeek = $(`<time id="weekday" class="date"></time>`);
    let $fullDate = $(`<time id="full-date" class="date"></time>`);
    let $sectionData = $('<section class="api-data--container"></section>');
    let $temperature = $(`<section class="temperature" id="temperature"></section>`);
    let $icon = $(`<section id="icon-location"></section>
    <section id="current-time" class="time"></section>`);
    let $sectionSunTime = $('<section id="section-sunTime" class="section-sunTime"></section>');
    let $sunriseTime = $(`<section id="sunrise-time"></section>`);
    let $sunsetTime = $(`<section id="sunset-time"></section>`);
    let $windIcon = $(`<section id="wind-icons"></section>`);
    $('body').append($sectionLocation);
    $sectionLocation.append($labelCity, $inputCity, $buttonSend, $sectionMessageError);
    $('body').append($infoContainer);
    $infoContainer.append($sectionDate, $temperature)
    $('body').append($sectionData);
    $sectionDate.append($dateWeek, $fullDate);
    $sectionSunTime.append($sunriseTime, $sunsetTime);
    $sectionData.append($sectionSunTime, $windIcon);
    $body.prepend($icon)
    let $currentTime = $()
    $icon.append($currentTime)
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
        printNameCity(responseInfoCity)
        dataUse(responseInfoCity)
        printTemperatureCity(responseInfoCity)
        printWeatherDescription(responseInfoCity)
        changeRangeColorsTemperature(responseInfoCity)
        showTime(responseInfoCity)
        printWind(responseInfoCity)
    });
};

function errorNotFound() {
    $('.error-message').text('This city doesn´t exist!').show();
    $('.label-city')[0].textContent ='';
    $('#city').on('click', function() {
        $('.error-message').hide('slow');
    });
    $('#weekday').text("")
    $('#full-date').text("")
    $('#temperature').text("")
    $('#state-icons').text("")
    $('#sunrise-time').text("")
    $('#sunset-time').text("")
    $('#wind-icons').text("")
    $('#icon-location').html(`<img src="assets/svg/not-found.svg" alt="not found">`)
    $('#current-time').text('')
}

function printNameCity(res) {
    $('.label-city').text(res.name);
}

function printTemperatureCity(responseInfoCity) {
    $('#temperature').html(Math.round(responseInfoCity.main.temp) + ' °C');
}

function printWeatherDescription(res){
    $('#weather-type').text(res.weather[0].description)
}
/*--------------------------Función para trabajar con los datos de la petición-------------------------------------*/
function dataUse(response){
    renderTimes(response)
    renderDayAndDate(response)
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

function formatHour(date){
    let h = date.getHours();
    let min = date.getMinutes();
    if(h<10){h = '0' + h}
    if(min<10){min = '0' + min};

    let returnTime = `${h}:${min}`;
    return returnTime;
}

function showTime(response){
    let today = new Date()
    let todayInMs = today.getTime() + (response.timezone - 3600) * 1000
    let time = new Date(todayInMs)
    let timeFormatted = formatHour(time)
    $("#current-time").html(timeFormatted)
}

function renderTimes(response){
    let $sunrise = $("#sunrise-time");
    let $sunset = $("#sunset-time");
    let timeDifference = (response.timezone - 3600)
    let sunriseTime = new Date((response.sys.sunrise + timeDifference) * 1000);
    let sunsetTime = new Date((response.sys.sunset + timeDifference) * 1000);

    $sunrise.html(
        `<h4>SUNRISE TIME</h4>
        <p>${formatTimes(sunriseTime)}</p>`);
    $sunset.html(
        `<h4>SUNSET TIME</h4>
        <p>${formatTimes(sunsetTime)}</p>`);
}

function renderDayAndDate(response){
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
                <img src="assets/svg/snowy.svg" alt="snow night">`)
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
        $('body').css("background-image", "linear-gradient(rgb(255, 255, 255), rgb(197, 197, 197))");
    }
}

function printWind(responseInfoCity) {
    let $directionWind = responseInfoCity.wind.deg;
    let $speedWind = Math.round(responseInfoCity.wind.speed);
    $('#wind-icons').html(`
    <section class="title-wind">
        <h4>WIND</h4>
    </section>
    <section id="section-param-wind" class="section-param-wind">
        <img class="direction-wind" src="assets/svg/arrow.svg" alt="Wind direction">
        <p class="speed-wind">${$speedWind} m/s</p>
    </section>`);
    $('.direction-wind').css('transform', `rotate(${$directionWind}deg)`);
}
