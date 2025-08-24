import Footer from './Footer'
import Navbar from './Navbar'
import React from 'react'

export default function Layout({ children }:{ children: React.ReactNode }){
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-6 flex-1">{children}</main>
     <Footer/>
     </div>
  )
}
