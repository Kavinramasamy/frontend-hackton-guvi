import {  createContext, useEffect, useState } from 'react';
import './App.css';
import Buyproduct from './Components/Buyproduct';
import Products from './Components/Products';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route,Routes } from 'react-router-dom';

export const AppContext=createContext(null);

function App() {
   const[products,setProducts]=useState([]);

    useEffect(()=>{
      try {
        async function prodlist() {
          const response = await fetch("https://backend-hackathon-project.vercel.app/productslist", { method: "GET" })
          const data = await response.json();
          const allProduct = data.products;
          setProducts(allProduct)
          console.log(allProduct)
        }
        prodlist()
      }
      catch (error) {

      }
    },[]) 
    
  return (
    <div className="App">
      <AppContext.Provider value={{products,setProducts}}>
      <Routes exact path='/'>
        <Route path='/' element={<Products/>}/>
        <Route path='/buylists/:id' element={<Buyproduct/>}/>

      </Routes>
      </AppContext.Provider>
    </div>
  );

  }
export default App;
