const ShowCountries = ({ countriesToShow, countryData, handleShowData, weatherData }) => {

    if (countriesToShow.length > 10) {
        return (
            <div>Too many matches, specify another filter</div>
        )
    }

    if (countryData) {


        return (
            <div>
                <h1>{countryData.name.common}</h1>
                <p>Capital {countryData.capital}</p>
                <p>Area {countryData.area}</p>
                <h2>Languages</h2>
                <ul>
                    {Object.values(countryData.languages).map(language => (
                        <li key={language}>
                            {language}
                        </li>
                    ))}
                </ul>
                <img src={countryData.flags.png}/>
                <h2>Weather in {countryData.name.common}</h2>
                {weatherData ? (
                    <>
                        <p>Temperature {weatherData.list[0].main.temp} Celsius</p>
                        <img
                            src={`https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`}
                            alt="weather icon"
                        />
                        <p>Wind {weatherData.list[0].wind.speed} m/s</p>
                    </>
                ) : (
                    <p>Loading weather data...</p>
                )}

            </div>
        )
    }


    return (
        <ul>
          {countriesToShow.map(country =>
              <li key={country.cca3}>
                  {country.name.common}
                  <button style={{marginLeft: '0.5rem' }} onClick={() => handleShowData(country.name.common)}>Show</button>
              </li>)}
        </ul>
      )
}

export default ShowCountries