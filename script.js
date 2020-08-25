let locations = localStorage.getItem("locations");
if (!locations) {
    locations = [];
}
else
{
    locations = locations.split(",")
};

// recent searches
$("#search").on("click", function() {
    event.preventDefault();
    event.stopPropagation();
    let city = $("#city-input").val().trim();
    if (city != '') {
        $("#city-input").html("")
        searchCity(city);
        forecast(city);
        addHistory(city);
        returnHistory()
    }
    else {
        $("#city-input").html("Input cannot be empty");
    }
});
// Recent locations searched
function addHistory(city){ 
    locations.push(city);
    localStorage.setItem("locations", locations); 
};


// Return city weather data
function searchCity(city){
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=3d16044a2eba4d271046d70fd1f2c155";
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    // Return current search values on main div
    $("#cityName").attr("class", "nowrap").text(city);
    let tempT = $("#temperature").attr("class", "nowrap");
    $("#humidity").attr("class", "nowrap").text("Humidity: "+ response.main.humidity + "%.");
    $("#windSpeed").attr("class", "nowrap").text("WindSpeed: " + response.wind.speed + " m/s,");
    
    // Display current date and time
    let today = new Date();
    let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;

    // Display date with selected city
    $("#currentDate").text(dateTime);
    
    // F to C
    let cTemp = fToC(response.main.temp);
    
    // Render Temperature
    tempT.text("Temperature: "+ cTemp);

    // Request for ajax call for UV response
    let cityLat = response.coord.lat;
    let cityLon = response.coord.lon;
    let uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + "3d16044a2eba4d271046d70fd1f2c155" + "&lat=" + cityLat + "&lon=" + cityLon + "&units=imperial";
    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function (response) {
        
        // Render UV
        let uv = response.value;
        $("#uvIndex").empty();
        $("#uvIndex").append($("<div id=\"uvColor\">").text("UV Index: " + uv)).attr("class", "nowrap");
        // Color code UV conditions
        if(uv <= 3){
            $("#uvColor").attr("style", "background-color:green ; width:65%");
        }
        else if( uv <= 7){
            $("#uvColor").attr("style", "background-color:orange ; width:65%");
        }
        else{
            $("#uvColor").attr("style", "background-color:red ; width:65%");
        };
        
    })
})
};
// F to C
function fToC(fahrenheit) {
    const fTemp = Math.round(fahrenheit);
    const fToCel = Math.round((fTemp - 32) * 5 / 9);
    const temp = `${fTemp}\xB0F : ${fToCel}\xB0C.`;
    return temp;   
};

// Searched City Weather and 5 day forcast
function forecast(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=3d16044a2eba4d271046d70fd1f2c155";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(forecastResponse){
        let filteredDays = forecastResponse.list.filter(
            function (currentElement){
            return currentElement.dt_txt.includes("12:00:00")
            }	
        );
        $("#forecast").empty();
        for(let i = 0; i < filteredDays.length; i++ ){
             
            // Data from filteredDays
            let date = filteredDays[i].dt_txt.split(" ")[0];
            let icon = filteredDays[i].weather[0].icon;
            let humidity = filteredDays[i].main.humidity;
            
            // Creating and adding classes and attributes to html elements.
            let square = $("<div>").attr("class","square");
            let section = $("<section>").attr("class","content").attr("class", "col-sm-3");
            let list = $("<ul>");
            let listElDates = $("<li>").attr("class","dates").attr("class", "nowrap").text(date);
            let listIcon = $("<ul>").append($("<img>").addClass("weatherImg").attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png"));
            
            // Declaring the function F to C
            let cTemp = fToC(filteredDays[i].main.temp);
            let tempT = cTemp;
            
            // Structuring the html elements
            let listElTempF = $("<li>").attr("class", "tempForecast").attr("class", "nowrap").text("Temp: " + tempT);
            let listElHumidityF = $("<li>").attr("class", "hunidityForecast").attr("class", "nowrap").text("Humidity: " + humidity);
           
            // F to C
            function fToC(fahrenheit) {
                const fTemp = Math.round(fahrenheit);
                const fToCel = Math.round((fTemp - 32) * 5 / 9);
                const temp = `${fTemp}\xB0F : ${fToCel}\xB0C.`;
                return temp;    
            }
            // Append all the data together
            square.append(section.append(list.append(listElDates,listIcon,listElTempF,listElHumidityF)))
             $("#forecast").append(square)
        }    
    })
};

// Calling the function
searchCity(localStorage.getItem("locations").split(",")[localStorage.getItem("locations").split(",").length-1]);
returnHistory();
forecast(localStorage.getItem("locations").split(",")[localStorage.getItem("locations").split(",").length-1]);