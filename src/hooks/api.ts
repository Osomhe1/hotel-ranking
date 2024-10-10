import axios from 'axios'

const api = axios.create({
  baseURL: 'https://booking-com.p.rapidapi.com/v1',
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
    'X-RapidAPI-Host': import.meta.env.VITE_RAPIDAPI_HOST,
  },
})

export default api
