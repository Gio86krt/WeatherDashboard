let today = moment().format("DD/MM/YY");
let followingDays = Number(moment().format("DD"));
let arrInputs = [];

let days = 5;

async function searchCity(input) {
  input = document.querySelector("#input").value;
  let country = $(".countrypicker").val();
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${input},${country}&units=metric&appid=92cffb5aa4dfffbc9ea400306c454207`;
  // let url = `http://api.openweathermap.org/data/2.5/weather?q=toronto,CA&units=metric&appid=92cffb5aa4dfffbc9ea400306c454207`; /////////////
  if (!input && !country) alert("please insert a valid input");
  $.getJSON(url, function (data) {
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
      `<li class="list-group-item">${data.name}, ${country}</li>`
    );
    forecast(lat, lon);
    $(".display-fields").removeClass("d-none");
    if (!localStorage.arrInputs.includes(input)) storeInputs([input, country]);
  });

  function forecast(lat, lon) {
    let urlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=hourly,minutely&appid=92cffb5aa4dfffbc9ea400306c454207`;
    $.getJSON(urlForecast, function (data) {
      $(".uvIndex").html(`UV Index: ${data.current.uvi}`);
      console.log(data);
      for (let i = 1; i <= days; i++) {
        $("#cardForecast").append(`
                <div class="card text-white bg-primary mb-3 forecast f${i}" style="max-width: 10rem;">
                      <div class="card-header">${followingDays + i}</div>
                            <div class="card-body">
                                
                                <p class="icon"><img src='https://openweathermap.org/img/w/${
                                  data.daily[i - 1].weather[0].icon
                                }.png'</p>
                                <p class="temp">Temperature: ${
                                  data.daily[i - 1].temp.day + " °Celsius"
                                }</p>
                                <p class="umidity">Umidity: ${
                                  data.daily[i - 1].humidity
                                }</p>
                                
                        </div>
                  </div>
        `);
      }
    });
  }

  function storeInputs(entries) {
    arrInputs.push(entries);
    localStorage.arrInputs = arrInputs;
  }
}

$(".search").on("click", searchCity);
