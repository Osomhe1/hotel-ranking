// src/App.tsx
import React, { Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify' // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css' // Import toastify CSS
import Loader from './components/Loader'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Lazy-loaded components
const Hotel = React.lazy(() => import('./components/Hotel'))
const HotelDetail = React.lazy(() => import('./components/HotelDetail'))

const App: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      easing: 'ease-in-out', // Easing function for animations
      once: true, // Whether animation should happen only once
    })
  }, [])
  return (
    <>
      <ToastContainer position='top-right' />
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path='/' element={<Hotel />} />
            <Route path='/hotel/:id' element={<HotelDetail />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  )
}

export default App
