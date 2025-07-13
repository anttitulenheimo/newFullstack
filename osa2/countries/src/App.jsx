import {useEffect, useState} from 'react'
import Finder from "./components/Finder.jsx";
import countryService from "./services/countryService.js";
import ShowCountries from "./components/ShowCountries.jsx";

function App() {
  const [query, setQuery] = useState('') // For queries
  const [countryData, setCountryData] = useState(null) // For showing data
  const [allCountries, setAllCountries] = useState([]) // For all countries
  const [filteredCountries, setFilteredCountries] = useState([])
  const [weatherData, setWeatherData] = useState(null)


    // Gets all countries
    useEffect(() => {
        countryService.getAll()
            .then(response => {
                setAllCountries(response)
            })
    }, []);


    // For one country
    useEffect(() => {
        if (query === '') { // If the query is empty, then the country data will be set to null and no filtered countries are shown
            setFilteredCountries([])
            setCountryData(null)
            setWeatherData(null)
            return
        }

        // If the query is not empty
        const filteredCountries = allCountries.filter(country =>
            country.name.common.toLowerCase().includes(query.toLowerCase())
        )

        setFilteredCountries(filteredCountries)

        // If only one country matches, set the data
        if (filteredCountries.length === 1) {
            countryService.findCountry(filteredCountries[0].name.common)
                .then(response => {
                    setCountryData(response)
                    handleWeatherData(filteredCountries[0].name.common)
                })
        } else {
            setCountryData(null)
            setWeatherData(null)
        }

    }, [query, allCountries]);



  const handleFilterChange = (event) => {
    setQuery(event.target.value)
  }


 const handleShowData = (countryName) => {
      countryService.findCountry(countryName)
          .then(response => {
              setCountryData(response)
              handleWeatherData(countryName)
          })
 }

 const handleWeatherData = (countryName) => {
      countryService.findWeather(countryName)
          .then(response => {
              setWeatherData(response)
          })
 }

  return (
      <div>
          <Finder filter={query} handleFilterChange={handleFilterChange}></Finder>
          <ShowCountries
              countriesToShow={filteredCountries}
              countryData={countryData}
              handleShowData={handleShowData}
              weatherData={weatherData}
          ></ShowCountries>
      </div>
  )
}

export default App
