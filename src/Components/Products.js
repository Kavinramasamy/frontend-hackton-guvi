import React, { useEffect, useContext, useState } from 'react'
import { NavLink,useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Typewriter from 'typewriter-effect';
import { AppContext } from '../App';


const Products = () => {
  const navTo=useNavigate();

  const {products,setProducts}=useContext(AppContext);
  const [state,setState]=useState(false);
  useEffect(()=>{
    setState(true)
  },[products]) 
  

  function clicking(id){
    navTo(`/buylists/${id}`)
  }
  function searchFilter(filterKey) {
    var boxes = document.getElementsByClassName('product-card');
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      if ((box.id).includes(filterKey.toLowerCase())) {
        box.style.display = "block";
      } else {
        box.style.display = "none";
      }
    }
  }
  return (
    <div>
      <div className='header-app bg-success'>
        <h1 className='tittop text-start'>Rental.in</h1>
        <div className='texter text-light mx-5'>
          <Typewriter
            options={{
              autoStart: true,
              loop: true,
              delay: 40,
              strings: [
                "Take it for Rent and feel it as yours.. "
              ],
            }} />
        </div>

      </div>
      <input className=' searchbar form-control mt-5 mx-2 mb-2 text-start' type='text' style={{ marginLeft: "50%" }} onChange={(ele) => searchFilter(ele.target.value)} placeholder='search product....' />

      <div className='container'>
        <div className='row justify-content-evenly' style={{width:"100%"}}>
          {state && products.map((ele, idx) => (
            <div className="card product-card col-md-4 bg-dark mb-3" style={{width:"18rem"}}  id={ele.productname.toLowerCase()}>

              <img className='card-img p-2' src={ele.imageurl} alt="card-cap"></img>
              <h4 class=" text-light">{ele.productname}</h4>
              <p class=" active text-light"> Price per Day : &#8377;{ele.price}</p>
              <p class=" active text-light"> Available Stocks : {ele.quantity}</p>
              <button class="btn btn-success mb-2 mx-2" onClick={()=>clicking(ele._id)} >Buy for Rent</button>

            </div>
          ))}
        </div>
        <hr className='line text-light'></hr>
      </div>
      <div>
        <footer className='tail text-light'><span>&#169; Copywrite 2023-All rights reserved</span></footer>
      </div>
    </div>

  )
}

export default Products