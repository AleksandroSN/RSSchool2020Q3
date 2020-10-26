// DOM Elements
const main = document.querySelector("#main");
const time = document.querySelector("#time");
const data = document.querySelector("#data");
const greeting = document.querySelector("#greeting");
const name = document.querySelector("#name");
const focus = document.querySelector("#focus");
const changeBG = document.querySelector("#changeBG");
const btn = document.querySelector("#btn");
const quote = document.querySelector("#quote__text-container");
const imgChuck = document.querySelector("#ChuckImg");
//Weather DOM Elements
const weatherIcon = document.querySelector(".weather-icon");
const city = document.querySelector("#city");
const temperature = document.querySelector("#temperature");
const wind = document.querySelector("#wind");
const humidity = document.querySelector("#humidity");
const description = document.querySelector("#description");

//Get current Hour
const currentHour = () => {
  let today = new Date();
  return today.getHours();
};

//Show Time

const showTime = () => {
  let today = new Date();
  //   let today = new Date(2020, 10, 25, 12, 59, 50);

  let date = today.getDate();
  let year = today.getFullYear();
  let hour = today.getHours();
  let minutes = today.getMinutes();
  let seconds = today.getSeconds();

  if (minutes === 0 && seconds === 0) {
    setBgGreet();
  }

  //Days,month

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[today.getDay()];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[today.getMonth()];

  //Output

  time.innerHTML = `${hour}<span>:</span>${addZeros(
    minutes
  )}<span>:</span>${addZeros(seconds)}`;
  data.innerHTML = `${day}, ${month} ${date} ${year}`;

  setTimeout(showTime, 1000);
};

//img Collections

let imgBG = [];
let currentImgBGIndex = currentHour();

const randomImg = () => {
  let imgIndex = Math.floor(Math.random() * 20) + 1;
  return imgIndex >= 10
    ? (imgIndex = `${imgIndex}.jpg`)
    : (imgIndex = `0${imgIndex}.jpg`);
};

const createBgArray = () => {
  const base = "./assets/images/";

  for (let i = 0; i < 24; i++) {
    if (i < 6) {
      imgBG.push(base + "night/" + randomImg());
    } else if (i >= 6 && i < 12) {
      imgBG.push(base + "morning/" + randomImg());
    } else if (i >= 12 && i < 18) {
      imgBG.push(base + "day/" + randomImg());
    } else {
      imgBG.push(base + "evening/" + randomImg());
    }
  }
};

//Set BackGround and Greetings
const setBgGreet = () => {
  let src = imgBG[currentHour()];
  let img = document.createElement("img");
  img.src = src;
  img.onload = () => {
    document.body.style.backgroundImage = `url(${src})`;
  };

  if (currentHour() >= 6 && currentHour() < 12) {
    //morning
    greeting.textContent = "Good Morning ,";
  } else if (currentHour() >= 12 && currentHour() < 18) {
    //day
    greeting.textContent = "Good Day ,";
  } else if (currentHour() >= 18 && currentHour() < 24) {
    //evening
    greeting.textContent = "Good Evening ,";
  }
  //night
  else {
    greeting.textContent = "Good Night ,";
  }
};

//Button for change bg

const nextBG = () => {
  changeBG.classList.add("circleArrowsAnime");
  currentImgBGIndex += 1;
  if (currentImgBGIndex === 24) currentImgBGIndex = 0;
  let src = imgBG[currentImgBGIndex];
  let img = document.createElement("img");
  img.src = src;
  img.onload = () => {
    document.body.style.backgroundImage = `url(${src})`;
  };
};

//Add Zeros
const addZeros = (sec) => {
  return (sec = (sec < 10 ? "0" : 0) + sec);
};

//Function for Get and Set localStorage.value

const getValue = (obj, item) => {
  if (localStorage.getItem(item) === null) {
    obj.textContent = `Enter ${item}`;
    localStorage.setItem(item, `Enter ${item}`);
  } else {
    obj.textContent = localStorage.getItem(item);
  }
};

const setValue = (obj, item, evt) => {
  if (evt.type === "keypress") {
    if (evt.key === "Enter") {
      if (evt.target.textContent.trim() === "") {
        evt.preventDefault();
        obj.textContent = localStorage.getItem(item);
      } else {
        localStorage.setItem(item, evt.target.textContent);
        obj.blur();
      }
    }
  } else {
    if (evt.target.textContent.trim() === "") {
      obj.textContent = localStorage.getItem(item);
    } else {
      localStorage.setItem(item, evt.target.textContent);
      obj.blur();
    }
  }
};

//Get and Set Name
const getName = () => {
  return getValue(name, "name");
};

const setName = (evt) => {
  return setValue(name, "name", evt);
};

//Get and Set Focus
const getFocus = () => {
  return getValue(focus, "focus");
};

const setFocus = (evt) => {
  return setValue(focus, "focus", evt);
};

//Quotes
async function getQuote() {
  const url = `https://api.chucknorris.io/jokes/random`;
  const res = await fetch(url);
  const data = await res.json();
  quote.textContent = `“${data.value}“`;
  imgChuck.setAttribute("src", `${data.icon_url}`);
}

//Weather
async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=de42679b73067c6176b419c4ef6f48a2&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.cod != 200) {
    alert("City incorect");
    city.textContent = "Enter your City";
    weatherIcon.className = "weather-icon owf";
    wind.textContent = `Wind speed: `;
    temperature.textContent = `Temperature: °C`;
    humidity.textContent = `Humidity: %`;
    description.textContent = "";
  } else {
    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    wind.textContent = `Wind speed: ${data.wind.speed}m/s`;
    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    description.textContent = data.weather[0].description;
  }
}

const setCity = (evt) => {
  if (evt.type === "keypress") {
    if (evt.key === "Enter") {
      if (evt.target.textContent.trim() === "") {
        evt.preventDefault();
        city.textContent = localStorage.getItem("city");
        city.blur();
      } else {
        localStorage.setItem("city", evt.target.textContent);
        city.blur();
        getWeather();
      }
    }
  } else {
    if (evt.target.textContent.trim() === "") {
      city.textContent = localStorage.getItem("city");
    } else {
      localStorage.setItem("city", evt.target.textContent);
      city.blur();
      getWeather();
    }
  }
};

const getCity = () => {
  if (
    localStorage.getItem("city") === null ||
    localStorage.getItem("city") === "Enter your city"
  ) {
    city.textContent = "Enter your City";
    weatherIcon.className = "weather-icon owf";
    wind.textContent = `Wind speed: `;
    temperature.textContent = `Temperature: °C`;
    humidity.textContent = `Humidity: %`;
    description.textContent = "";
  } else {
    city.textContent = localStorage.getItem("city");
    getWeather();
  }
};

//Listeners
name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
name.addEventListener("click", (evt) => {
  evt.target.textContent = "";
});
focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);
focus.addEventListener("click", (evt) => {
  evt.target.textContent = "";
});
changeBG.addEventListener("click", () => {
  setTimeout(nextBG, 1000);
  changeBG.classList.remove("circleArrowsAnime");
});
document.addEventListener("DOMContentLoaded", getQuote);
// document.addEventListener("DOMContentLoaded", getWeather);
btn.addEventListener("click", getQuote);
city.addEventListener("keypress", setCity);
city.addEventListener("blur", setCity);
city.addEventListener("click", (evt) => {
  evt.target.textContent = "";
});

//Init
showTime();
createBgArray();
setBgGreet();
getName();
getFocus();
getCity();
