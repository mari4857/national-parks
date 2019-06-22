'use strict';

const apiKey = '4bKifxzb71tXYQaZ3ww4A2UKiSbRTHqzZXuXTWqy';
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson) {
    //if there are previous results, remove them
    console.log(responseJson);
    $('#results-list').empty();
    //iterate through the data array
    for (let i = 0; i < responseJson.data.length; i++){
        //for each object in the data array, add a list item to the results
        //list with the park's full name, url, description and directions info
        $('#results-list').append(
            `<li><h3>${responseJson.data[i].fullName}</h3>
      <a href='${responseJson.data[i].url}' target="_blank">${responseJson.data[i].url}</a>
      <p>${responseJson.data[i].description}</p>
      <p>${responseJson.data[i].directionsInfo}</p>
      </li>`
        )};
    //display the results section
    $('#results').removeClass('hidden');
};

function getStateParks(query, limit=10) {
    const params = {
        stateCode: query,
        api_key: apiKey,
        limit
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const limit = $('#js-max-results').val();
        getStateParks(searchTerm, limit);
    });
}

$(watchForm);