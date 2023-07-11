const userTab = document.querySelector("[data-yourWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const searchForm = document.querySelector(".searchForm");
const grantLocation = document.querySelector(".grant-location");
const userInfoContainer = document.querySelector(".user-info-container");
const loadingScreen = document.querySelector(".loading");
const API_KEY = '228fab5f5a4df4d2bc3808e6c075f047';
const errorScreen = document.querySelector(".error-screen");
let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();
function switchTabs(clickedTab){
    if(clickedTab!=currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active"))
        {
            // making all others screen invisible except the searchForm screen
            grantLocation.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else
        {
            errorScreen.classList.remove("active");
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("userCoordinates");
    if(!localCoordinates){
        grantLocation.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const{lat,long} = coordinates;
    console.log(lat);
    console.log(long);
    // make grant location screen invisible
    grantLocation.classList.remove("active");
    // making loading screen visible
    loadingScreen.classList.add("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data,273.15);
    }
    catch(e){

    } 
}

function renderWeatherInfo(weatherInfo,ident){
    const currentLoc = document.querySelector("[data-currentLocation]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const weatherType = document.querySelector("[data-weatherType]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-weatherTemp]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");

    console.log(weatherInfo);
    currentLoc.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`
    weatherType.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText  = `${(weatherInfo?.main?.temp-ident).toFixed(2)} °C`;
    // if(temperature>200){
    //     temperature = temperature - 273.15
    //     temp.innerText =   `${temperature.toFixed(2)}°C`
    // }
    // else{
    //     temp.innerText = `${temperature.toFixed(2)} °C`;
    // }
    windspeed.innerText = `${weatherInfo?.wind?.speed} M/S`;
    humidity.innerText =   `${ weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

userTab.addEventListener('click',()=>{
    switchTabs(userTab)}
    );
searchTab.addEventListener('click',()=>{
    switchTabs(searchTab)
});

const grantButton = document.querySelector("[grant-Button]");

grantButton.addEventListener("click",()=>{getLocation()});

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else
    {
        throw new Error("Location Access is not supported");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        long : position.coords.longitude,
    }
    console.log(userCoordinates.lat);
    console.log(userCoordinates.long);
    sessionStorage.setItem("userCoordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    console.log(cityName);
    if(cityName==''){
        return;
    }
    else
    {
        fetchSearchWeatherInfo(cityName);
    }
});
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantLocation.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        console.log(data);
        if(data.cod=='404'){
            throw Exception();
        }
       
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data,0);
    }
    catch(e){
       
        userInfoContainer.classList.remove("active");
        loadingScreen.classList.remove('active');
        // searchForm.classList.remove('active');
        errorScreen.classList.add("active");
    }
}

