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
    /* $('#sendBtn').off('click', insertCity); */ /* No funciona */
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
    });
}

function errorNotFound() {
    /* alert('This city doesn`t exist!'); */ /* Option 1 */
    $('.error-message').text('This city doesn´t exist!').show(); /* Option 2 */
    console.log($('.label-city'));
    $('.label-city')[0].textContent ='';
    $('#city').on('click', function() {
        $('.error-message').hide('slow');
    });
}

function printNameCity(responseInfoCity) {
    $('.label-city').text(responseInfoCity.name);
}

