import { useState } from "react"; 
import axios from "axios"; 
import DetailCard from "./components/DetailCard";
import cloudIcon from "./assets/cloud.png";

function App() {
  const API_KEY = "581c345246e8a7198d00783af3722bf6";
  const [noData, setNoData] = useState("No data yet");
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState("Unknown Location");
  const [weatherIcon, setWeatherIcon] = useState(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/0n@2x.png"
  );

  const handleChange = (input) => {
    setSearchTerm(input.target.value);
  };

  const handleSubmit = (e) => {
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
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?${how_to_search}&appid=${API_KEY}&units=metric&cnt=5&exclude=hourly,minutely`
      );

      if (data.cod !== "200") {
        setNoData("Location Not Found");
        return;
      }

      setWeatherData(data);
      setCity(`${data.city.name}, ${data.city.country}`);
      setWeatherIcon(cloudIcon);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setNoData("Failed to fetch data");
    }
  };

  const myIP = (location) => {
    const { latitude, longitude } = location.coords;
    getWeather([latitude, longitude]);
  };

  return (
    <div className="phoneview flex items-center justify-center w-full min-h-screen bg-gray-900 text-white p-4 lg:p-10">
      {/* Form + Weather Container */}
      <div className="w-full flex items-center justify-center lg:w-3/4">
        <div className="form-container mx-auto flex flex-col items-center justify-center p-6 lg:p-12 rounded-3xl w-full lg:w-3/4 min-h-[600px] bg-gray-800 bg-opacity-50">
          
          {/* City Info */}
          <div className="w-full text-white flex items-center justify-center">
            <div className="flex p-3 text-gray-100 bg-gray-600 bg-opacity-30 rounded-lg">
              <i className="fa fa-map my-auto text-lg" aria-hidden="true"></i>
              <div className="text-right">
                <p className="font-semibold text-lg ml-2">{city}</p>
              </div>
            </div>
          </div>
  
          {/* Search Form */}
          <h1 className="lg:pt-0 pt-10 text-white text-3xl lg:text-4xl text-center">
            Search for a location here
          </h1>
          <hr className="h-1 bg-white w-1/3 rounded-full my-6" />
          <form noValidate onSubmit={handleSubmit} className="flex justify-center w-full lg:mb-0 mb-16">
            <input
              type="text"
              placeholder="Enter location"
              className="relative rounded-xl py-4 px-5 text-lg w-4/5 bg-gray-300 bg-opacity-60 text-white placeholder-gray-200"
              onChange={handleChange}
              required
            />
            <button type="submit" className="z-10">
              <i className="fa fa-search text-white -ml-12 border-l my-auto z-10 cursor-pointer p-4 text-xl" aria-hidden="true"></i>
            </button>
            <i className="fa fa-map-marker-alt my-auto cursor-pointer p-4 text-white text-xl"
              aria-hidden="true"
              onClick={() => {
                navigator.geolocation.getCurrentPosition(myIP);
              }}>
            </i>
          </form>
  
          {/* Weather Info */}
          <div className="flex flex-col items-center w-full p-6">
            {weatherData.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <h1 className="text-gray-400 text-3xl font-bold">{noData}</h1>
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-4">Today</h1>
                <DetailCard weather_icon={weatherIcon} data={weatherData} />
              </>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;
