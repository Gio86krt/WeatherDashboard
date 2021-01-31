let today = moment().format("DD/MM/YY");
let arrInputs = [];

let tomorrow = new Date();
tomorrow.setDate(new Date().getDate() + 1);
let day = tomorrow.getDate();
let month = tomorrow.getMonth();
let year = tomorrow.getFullYear();
// let stringTomorrow = "${day + i}/${month + 1}/${year}";

let days = 5;

function getInputs() {
  let input = document.querySelector("#input").value;
  let country = $(".countrypicker").val();
  if (!input) {
    alert("Please insert a valid city");
    return "return";
  }
  searchCity(input, country);
}

function searchCity(input, country) {
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${input},${country}&units=metric&appid=92cffb5aa4dfffbc9ea400306c454207`;
  // let url = `http://api.openweathermap.org/data/2.5/weather?q=toronto,CA&units=metric&appid=92cffb5aa4dfffbc9ea400306c454207`; /////////////
  let promise = $.getJSON(url, function (data) {
    console.log(data);
    var icon = `<img src='https://openweathermap.org/img/w/${data.weather[0].icon}.png'>`;
    $(".name").html(data.name + " " + today + " " + icon);
    $(".description").html(
      `There is ${data.weather[0].description} in ${data.name}, ${data.sys.country}`
    );
    const { lat } = data.coord;
    const { lon } = data.coord;

    $(".temp").html("Temperature: " + data.main.temp + " °Celsius");
    $(".humidity").html("Humidity: " + data.main.humidity);
    $(".wind").html("Wind-speed: " + data.wind.speed);
    $("#cities").append(
      `<li class="list-group-item" onClick="searchAgain(event)">${data.name}, ${country}</li>`
    );
    forecast(lat, lon);
    $(".display-fields").removeClass("d-none");
    storeInputs([input, country]); /////////////////
    $("#input").val("");
  });

  promise.catch((err) => {
    alert("City-Country combination not found");
    $("#input").val("");
  });

  function forecast(lat, lon) {
    let urlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=hourly,minutely&appid=92cffb5aa4dfffbc9ea400306c454207`;
    $.getJSON(urlForecast, function (data) {
      let bgcolor = checkUv(data.current.uvi); //
      $(".uvIndex").html(
        `UV Index: <span class='uv' ${bgcolor}>${data.current.uvi}</span>`
      );
      console.log(data);
      $("#cardForecast").html("");
      for (let i = 1; i <= days; i++) {
        $("#cardForecast").append(`
                <div class="card text-white bg-primary mb-3 forecast f${i}" style="max-width: 10rem;">
                      <div class="card-header">${day + i - 1}/${
          month + 1
        }/${year}</div>
                            <div class="card-body">
                                
                                <p class="icon"><img src='https://openweathermap.org/img/w/${
                                  data.daily[i - 1].weather[0].icon
                                }.png'</p>
                                <p class="temp">Temperature: ${
                                  data.daily[i - 1].temp.day + " °Celsius"
                                }</p>
                                <p class="humidity">Humidity: ${
                                  data.daily[i - 1].humidity
                                }</p>
                                
                        </div>
                  </div>
        `);
      }
    });
  }
}

function storeInputs(...entries) {
  arrInputs = JSON.parse(localStorage.arrInputs);
  let flatArr = arrInputs.flat();
  if (!flatArr.includes(entries)) {
    arrInputs.push(entries);
    localStorage.arrInputs = JSON.stringify(arrInputs);
  }
}

function searchAgain(event) {
  const [city, country] = event.target.innerHTML.split(",");
  searchCity(city, country);
}

function checkUv(index) {
  if (index >= 8) return 'style="background-color: red;"';
  if (index >= 6) return 'style="background-color: orange;"';
  if (index > 2) return 'style="background-color: yellow;"';
  if (index <= 2) return 'style="background-color: green;"';
}

$(".search").on("click", getInputs);
