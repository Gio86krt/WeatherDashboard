let today = moment().format("DD/MM/YY");
// console.log(today);

async function searchCity(input) {
  input = document.querySelector("#input").value;
  let country = $(".countrypicker").val();
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${input},%20${country}&units=metric&appid=92cffb5aa4dfffbc9ea400306c454207`;
  console.log(input, country);

  //   let response = await fetch(url).then((res) => res.json());

  // let response = await $.ajax({
  //     // method: "GET",
  //     url: url
  // });

  $.getJSON(url, function (data) {
    console.log(data);
    var icon = `<img src='https://openweathermap.org/img/w/${data.weather[0].icon}.png'>`;
    $(".name").html(data.name + " " + today + " " + icon);
    $(".description").html(
      `There is ${data.weather[0].description} in ${data.name}, ${data.sys.country}`
    );
    const { lat } = data.coord;
    const { lon } = data.coord;
    // console.log(lat, lon);
    // $(".coord").html(lat + " lat " + lon + " lng");
    // $('.coord').html();
    $(".temp").html("Temperature: " + data.main.temp + " °Celsius");
    $(".humidity").html("Humidity: " + data.main.humidity);
    $(".wind").html("Wind-speed: " + data.wind.speed);
    // $(".uvIndex").html("UV Index: " + data.);
    $("#cities").append(
      `<li class="list-group-item">${data.name}, ${country}</li>`
    );
  });

  //   console.log(response);

  //   $(".name").html(response.name);
  //   const { lat } = response.coord;
  //   const { lon } = response.coord;
  //   console.log(lat, lon);
  //   $(".coord").html(lat + " lat " + lon + " lng");
  //   // $('.coord').html();
  //   $(".temp").html(response.main.temp + "C temp");
}

$(".search").on("click", searchCity);
