import React from 'react'
import Hero from '../components/Hero'
import NextSection from '../components/NextSection'
import Goal from '../components/Goal'
import TrendingSection from '../components/TrendingSection'
import About from '../components/About'
import OrderHistory from './OrderHistory'

const Home = () => {
  return (
    <>
    <Hero/>
    <NextSection/>
    <TrendingSection />
    <Goal/>
    {/* <OrderHistory/> */}
    <About />
  
    
    </>
  )
}

export default Home