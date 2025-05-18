import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Navbar } from 'react-bootstrap'
import { Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import NavBar from './components/Navbar'
import ListBooks from './pages/ListBooks'
import Home from './pages/Home'
import BookDetails from './components/BookDetails'
import CartPage from './components/CartPage'

function App() {


  return (
    <>
      <div >
        <NavBar/>
        <Routes>
          <Route path ="/" element={<Home/>}/>
          <Route path ="/login" element={<Login/>}/>
          <Route path ="/register" element={<Register/>}/>
          <Route path ="/list" element={<ListBooks/>}/>
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/cart" element={<CartPage />} />
          {/* <Route path ="/register" element={<Register/>}/> */}
        </Routes>
      {/* <Button variant='success'>Click ME!</Button> */}
      </div>
    </>
  )
}

export default App
