import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => {
    const request = axios.get(`${baseUrl}/all`)
    return request.then(response => response.data)
  }

const findCountry = name => {
    const request = axios.get(`${baseUrl}/name/${name}`)
    return request.then(response => response.data)
}


const api_key = import.meta.env.VITE_SOME_KEY

const findWeather = place => {
    const request= axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&units=metric&appid=${api_key}`)
    return request.then(response => response.data)
}



export default {getAll, findCountry, findWeather}