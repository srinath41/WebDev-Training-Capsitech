import { useState } from "react";
import Header from "./components/Header";
import DetailCard from "./components/DetailCard";
import SummaryCard from "./components/SummaryCard";

// Weather Forcast App
//  - App Idea: https://dribbble.com/shots/14628486-Foreacast-Weather-Website-Design
//  - Create 7 cards to display summary of weather
//  - Click card to display more information about weather on specific day
//  - API key: ba1c264a68aee00bc2a81210b7f10c26

//  API url: api.openweathermap.org/data/2.5/forecast?q={city name},{state code},{country code}&appid={API key}&units=metric&cnt=7
//  Icon url: https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`
//   - Pass through icon code recieved from main api
//   Momentjs for time formatting

//  Bonus
// - Add "allow location" feature to get users current location and display forcast
// - Animate view of forcast https://www.framer.com/api/motion/

function App() {
  const API_KEY = "649d83207b4ce5fd614302265b4b7642";
  // let REACT_APP_ICON_URL="https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg";
  const [noData, setNoData] = useState("No data yet");
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState("Unknown Location");
  const [weatherIcon, setWeatherIcon] = useState(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/0n@2x.png"
  );

  const handleChange = (input) => {
    const { value } = input.target;
    setSearchTerm(value);
  };

  const handleSubmit = (e) => {
    5;
    e.preventDefault();
    getWeather(searchTerm);
  };

  const getWeather = async (location) => {
    setWeatherData([]);
    let how_to_search =
      typeof location === "string"
        ? `q=${location}`
        : `lat=${location[0]}&lon=${location[1]}`;

    try {
      let res = await fetch(
        `${
          "https://api.openweathermap.org/data/2.5/forecast?" + how_to_search
        }&appid=${API_KEY}&units=metric&cnt=5&exclude=hourly,minutely`
      );
      let data = await res.json();
      if (data.cod != "200") {
        setNoData("Location Not Found");
        return;
      }
      setWeatherData(data);
      setCity(`${data.city.name},${data.city.country}`);
      setWeatherIcon(
        `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.list[0].weather[0].icon}.svg`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const myIP = (location) => {
    const { latitude, longitude } = location.coords;
    getWeather([latitude, longitude]);
  };

  return (
    <>
      <div className="bg-gray-800 flex items-center justify-center lg:h-screen lg:py-10">
        <div className="flex flex-col lg:flex-row w-full h-full max-w-6xl mx-auto rounded-3xl shadow-lg m-auto bg-gray-100">
          {/* form card section  */}
          <div className="form-container">
            <div className="w-full text-white flex items-center justify-center">
              <h3
                className="my-auto mr-auto text-xl text-pink-800 font-bold shadow-md py-1 px-3 
            rounded-md bg-white bg-opacity-30"
              >
                forecast
              </h3>
              <div className="flex p-2 text-gray-100 bg-gray-600 bg-opacity-30 rounded-lg">
                <i className="fa fa-map my-auto" aria-hidden="true"></i>
                <div className="text-right">
                  <p className="font-semibold text-sm ml-2">{city}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center min-h-full">
              <h1 className="lg:pt-0 pt-20 text-white sm:text-2xl text-center">
                The Only Weather Forecast You Need
              </h1>
              <hr className="h-1 bg-white w-1/4 rounded-full my-5" />
              <form
                noValidate
                onSubmit={handleSubmit}
                className="flex justify-center w-full lg:mb-0 mb-16"
              >
                <input
                  type="text"
                  placeholder="Enter location"
                  className="relative rounded-xl py-2 px-3 w-2/3 bg-gray-300 bg-opacity-60 text-white placeholder-gray-200"
                  onChange={handleChange}
                  required
                />
                <button type="submit" className="z-10">
                  <i
                    className="fa fa-search text-white -ml-10 border-l my-auto z-10 cursor-pointer p-3"
                    aria-hidden="true"
                    type="submit"
                  ></i>
                </button>
                <i
                  className="fa fa-map-marker-alt my-auto cursor-pointer p-3 text-white"
                  aria-hidden="true"
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition(myIP);
                  }}
                ></i>
              </form>
            </div>
          </div>
          {/* info card section  */}
          <div className="lg:w-2/4 p-5 max-h-screen overflow-y-auto">
            <Header />
            <div className="flex flex-col my-10">
              {/* card jsx  */}
              {weatherData.length === 0 ? (
                <div className="container p-4 flex items-center justify-center h-1/3 mb-auto">
                  <h1 className="text-gray-300 text-4xl font-bold uppercase">
                    {noData}
                  </h1>
                </div>
              ) : (
                <>
                  <h1 className="text-center sm:text-left text-3xl lg:text-5xl text-gray-800 mt-auto mb-4">
                    Today
                  </h1>
                  <DetailCard weather_icon={weatherIcon} data={weatherData} />
                  <h1 className="text-center sm:text-left text-3xl text-gray-600 mb-4 mt-10">
                    More On {city}
                  </h1>
                  <ul className="grid grid-cols-2  gap-2">
                    {weatherData.list &&
                      weatherData.list.map((days, index) => {
                        if (index > 0) {
                          return <SummaryCard key={index} day={days} />;
                        }
                      })}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;