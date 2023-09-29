import React, { useEffect } from 'react'

const Addproduct = () => {
  useEffect(async()=>{
    try {
      const response = await fetch("https://backend-hackathon-project.vercel.app/productslist",{method:"GET"});
  const data = await response.json();
  console.log(data.message)
    } catch (error) {
      console.log("Errorrrrrrr",error)
    }
  },[])
  
  return (
    <div>

    </div>
  )
}

export default Addproduct