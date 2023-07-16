
let city=""; 
let url="";
let APIkey="";
let queryurl ="";
let currenturl = "";
let citiesDiv = document.getElementById("searched-cities");
var cityNameEl = document.getElementById("city-name");
var todayDateEl = document.getElementById("today-date");
var todayMainDiv = document.getElementById("today-main-weather");
var fiveDaysMainDiv = document.getElementById("5-days-main-weather");


//start with empty array
let cities = []; 
init(); 
listClicker(); 
searchClicker(); 

//run function to pull saved cities from local storage and fill array with it
function init(){
    let saved_cities = JSON.parse(localStorage.getItem("cities"));

    if (saved_cities !== null){
        cities = saved_cities
    }   
    
    renderButtons(); 
}

//sets localstorage item to cities array 
function storeCities(){
    localStorage.setItem("cities", JSON.stringify(cities)); 
}


//render buttons for each element in cities array as a search history for user
function renderButtons(){
    citiesDiv.innerHTML = "";
    citiesDiv.setAttribute("class", "p-2 me-1") 
    if(cities == null){
        return;
    }
    let unique_cities = [...new Set(cities)];
    for(let i=0; i < unique_cities.length; i++){
        let cityName = unique_cities[i]; 

        let buttonEl = document.createElement("button");
        buttonEl.textContent = cityName; 
        buttonEl.setAttribute("type", "button"); 
        buttonEl.setAttribute("class", "city-btn col-12 block"); 

        citiesDiv.appendChild(buttonEl);
        listClicker();
      }
    }
//on click function for search history buttons
function listClicker(){
$(".city-btn").on("click", function(event){
    event.preventDefault();
    city = $(this).text().trim();
    APIcalls(); 
})
}



//on click function for main search bar
function searchClicker() {
$("#searchbtn").on("click", function(event){
    event.preventDefault();
    city = $(this).prev().val().trim()
    
    //push the city user entered into cities array 
    cities.push(city);
    //make sure cities array.length is never more than 8 
    if(cities.length > 8){
        cities.shift()
    }
    //return from function early if form is blank
    if (city == ""){
        return; 
    }
    APIcalls();
    storeCities(); 
    renderButtons();
})
}

//runs 2 API calls, one for current weather data and one for five-day forecast, then populates text areas
function APIcalls(){

    queryurl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=5ce8439fd4264478d1da0b24a7cd547d";
    current_weather_url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=5ce8439fd4264478d1da0b24a7cd547d"; 

    
    todayMainDiv.classList.remove("hide");
    fiveDaysMainDiv.classList.remove("hide");
    cityNameEl.innerHTML =(city+ " Weather");
    todayDateEl.innerHTML = city + ", " + dayjs().format('dddd, MMMM D');
    $.ajax({
        url: queryurl,
        method: "GET",
        
    }).then(function(response){
        let day_number = 0; 
        //iterate through the 40 weather data sets
        for(let i=0; i< response.list.length; i++){
            
            //split function to isolate the time from the time/data aspect of weather data, and only select weather reports for 3pm
            if(response.list[i].dt_txt.split(" ")[1] == "12:00:00")
            {
                
                //if time of report is 3pm, populate text areas accordingly
                let day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
                let month = response.list[i].dt_txt.split("-")[1];
                let year = response.list[i].dt_txt.split("-")[0];
                $("#" + day_number + "date").text(day + "/" + month + "/" + year); 
                let tempMax = Math.round((response.list[i].main.temp_max - 273.15));
                $("#" + day_number + "five-day-temp-max").text("Temp: " + tempMax + String.fromCharCode(176)+"C");
                $("#" + day_number + "five-day-wind-speed").text("Wind Speed: " + response.list[i].wind.speed);
                $("#" + day_number + "five-day-humidity").text("Humidity: " + response.list[i].main.humidity+"%");
                $("#" + day_number + "five-day-icon").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                day_number++; 
            }   
        }
    });


    //function to display data in main div 
     $.ajax({
         url:current_weather_url,
         method: "GET", 
     }).then(function(current_data){
         let temp = Math.round((current_data.main.temp - 273.15))
         $("#today-temp").text("Temperature: " + temp + String.fromCharCode(176)+"C");
         $("#today-humidity").text("Humidity: " + current_data.main.humidity+"%");
         $("#today-wind-speed").text("Wind Speed: " + current_data.wind.speed);
         $("#today-icon-div").attr({"src": "http://openweathermap.org/img/w/" + current_data.weather[0].icon + ".png",
          "height": "100px", "width":"100px"});
     })
    

}




