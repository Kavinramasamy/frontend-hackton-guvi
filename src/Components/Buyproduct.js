import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../App";
import useRazorpay from "react-razorpay";



export default function BuyProduct() {
  const { products, setProducts } = useContext(AppContext);
  const { id } = useParams();
  const navTo = useNavigate();

  const currentProduct = products.filter((ele) => ele._id == id);
  const productName = currentProduct[0].productname;
  const productImage = currentProduct[0].imageurl;
  const limit = +currentProduct[0].quantity;

  const [price, setPrice] = useState(currentProduct[0].price);

  const proPrice = currentProduct[0].price;

  function notifyWarning(msg) {
    toast.warning(msg);
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const fieldvalidationschema = yup.object({
    productname: yup.string().required(""),
    price: yup.string().required(""),
    quantity: yup.number().required(""),
    imageurl: yup.string().required(""),
    username: yup.string().required("please provide your name"),
    address: yup.string().required("please provide your address"),
    fromDate: yup.string().required("please provide..."),
    fromTime: yup.string().required("please provide..."),
    toDate: yup.string().required("please provide..."),
    toTime: yup.string().required("please provide..."),
    mobilenumber: yup.string().required("please provide mobile number...").min(10),
  });

  const { handleSubmit, values, handleChange, handleBlur, touched, errors } =
    useFormik({
      initialValues: {
        id:id,
        productname: productName,
        price: price,
        quantity: 1,
        imageurl: productImage,
        username: "",
        address: "",
        fromDate: "",
        fromTime: "",
        toDate: "",
        toTime: "",
        mobilenumber:""
      },      
      
      validationSchema: fieldvalidationschema,
      onSubmit: async (productInfo) => {
        
        var options = {
          key: "rzp_test_Ij2JRBeIm8n2CG",
          key_secret: "3so8CbgD8TLG8PK6fdM8vz95",
          amount: (+values.price * 100),
          currency: "INR",
          name: "Rental.in",
          description: "For testing purpose",
          handler: async function (response) {
            const res = await (response.razorpay_payment_id);
            toast.success("payment_id:", res)
            try {
              const response = await fetch(
                "https://backend-hackathon-project.vercel.app/buyproduct",
                {
                  method: "POST",
                  body: JSON.stringify(productInfo),
                  heders: {
                    "Content-Type": "application/json",
                  },
                }
              );
              const data = await response.json();

              if (data.message === "Added new product") {
                toast.success("Added new product");
                return setTimeout(() => { navTo('/') }, 2000)
              }
            }
            catch (error) {
              notifyWarning("Retry after sometimes...");
            }
          },
          prefill: {
            name: values.username,
            email: "rental@rental.com",
            contact: values.mobilenumber
          },
          notes: {
            address: "Razorpay Corporate office"
          },
          theme: {
            color: "#3399cc"
          }
        };
      console.log(options);
       var pay= new window.Razorpay(options);
        pay.open();
      },
    });

    function manageQuantity(arg, qty) {
      if (arg === "sub" && +qty > 1) {
        values.quantity = +values.quantity - 1;
        values.price = +proPrice * values.quantity;
      } else if (arg === "add" && qty<limit) {
        values.quantity = +values.quantity + 1;
        values.price = +proPrice * values.quantity;
      }
    }
    function findDays(date1, date2) {
      let d1 = "Invalid Date";
      let d2 = "Invalid Date";
      if (date1 != "") {
        values.fromDate = date1;
        d1 = new Date(date1);
      }
      if (date2 != "") {
        values.toDate = date2;
        d2 = new Date(date2);
      }
      if (d1 != "Invalid Date" && d2 != "Invalid Date") {
        let days = (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24);
        values.price = +price * +values.quantity * (days + 1);
      }
    }
    return (
      <div className="d-flex flex-column mt-3">
        <ToastContainer />
        <h1 className="page-title mt-5 mb-3 text-white bg-dark p-3 ">
          Buy for Rent
        </h1>
        <div className="w-100 justify-content-center">
          <img
            className=" mb-5 mx-5"
            style={{ width: "350px" }}
            src={productImage}
            alt=""
          />
        </div>
        <form className="mb-5 mx-5" onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              id="product"
              className={`form-control shadow ${
                touched.productname && errors.productname ? " border-danger " : ""
              }`}
              placeholder="Product name"
              type="productname"
              value={productName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled
            />
            <label for="productname" className="text-muted ">
              {touched.quantity && errors.quantity
                ? errors.quantity
                : "Product name"}
            </label>
          </div>
          <div className="form-floating mb-3 ">
            <input
              id="price"
              className={`form-control shadow ${
                touched.price && errors.price ? " border-danger " : ""
              }`}
              placeholder="Price for total no. of days"
              type="price"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled
            />
            <label for="price" className="text-muted">
              {touched.price && errors.price
                ? errors.price
                : "Price for total no. of days"}
            </label>
          </div>
          <div className=" d-flex justify-content-evenly">
            <div className="form-floating mb-3 ">
              <input
                id="quantity"
                className={`form-control shadow ${
                  touched.quantity && errors.quantity ? " border-danger " : ""
                }`}
                placeholder="Quantity"
                type="quantity"
                value={values.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled
              />
              <label for="quantity" className="text-muted">
                {touched.quantity && errors.quantity
                  ? errors.quantity
                  : "Quantity"}
              </label>
            </div>
  
            <button
              className="btn btn-warning h-25 w-25 mx-2 mt-3"
              type="button"
              onClick={() => manageQuantity("sub", values.quantity)}
            >
              ➖
            </button>
            <button
              className="btn btn-warning h-25 w-25 mx-2 mt-3"
              type="button"
              onClick={() => manageQuantity("add", values.quantity)}
            >
              ➕
            </button>
          </div>
          <div className="form-floating mb-3 ">
            <input
              id="username"
              className={`form-control shadow ${
                touched.username && errors.username ? " border-danger " : ""
              }`}
              placeholder="Name"
              type="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label for="buyerName" className="text-muted">
              {touched.username && errors.username ? errors.username : "Name"}
            </label>
          </div>
          <div className="form-floating mb-3 ">
            <input
              id="mobilenumber"
              className={`form-control shadow ${
                touched.mobilenumber && errors.mobilenumber ? " border-danger " : ""
              }`}
              placeholder="Mobile"
              type="mobilenumber"
              value={values.mobilenumber}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label for="mobile" className="text-muted">
              {touched.mobilenumber && errors.mobilenumber ? errors.mobilenumber : "Mobilenumber"}
            </label>
          </div>
          <div className="form-floating mb-3 ">
            <textarea
              id="address"
              className={`form-control shadow ${
                touched.address && errors.address ? " border-danger " : ""
              }`}
              placeholder="Address"
              type=""
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label for="address" className="text-muted">
              {touched.address && errors.address ? errors.address : "Address"}
            </label>
          </div>
          <div className="form-floating mb-3 ">
            <input
              id="fromDate"
              className={`form-control shadow ${
                touched.fromDate && errors.fromDate ? " border-danger " : ""
              }`}
              placeholder="From date"
              type="date"
              value={values.fromDate}
              onChange={(e) => findDays(e.target.value, values.toDate)}
              onBlur={handleBlur}
            />
            <label for="username" className="text-muted">
              {touched.fromDate && errors.fromDate
                ? errors.fromDate
                : "From Date"}
            </label>
          </div>
          <div className="form-floating mb-3 ">
            <input
              id="fromTime"
              className={`form-control shadow ${
                touched.fromTime && errors.fromTime ? " border-danger " : ""
              }`}
              placeholder="From time"
              type="time"
              value={values.fromTime}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label for="username" className="text-muted">
              {touched.fromTime && errors.fromTime
                ? errors.fromTime
                : "From time"}
            </label>
          </div>
          <div className="form-floating mb-3 ">
            <input
              id="toDate"
              className={`form-control shadow ${
                touched.toDate && errors.toDate ? " border-danger " : ""
              }`}
              placeholder="To date"
              type="date"
              value={values.toDate}
              onBlur={handleBlur}
              onChange={(e) => findDays(values.fromDate, e.target.value)}
            />
            <label for="username" className="text-muted">
              {touched.toDate && errors.toDate ? errors.toDate : "To Date"}
            </label>
          </div>
          <div className="form-floating mb-5 ">
            <input
              id="toTime"
              className={`form-control shadow ${
                touched.toTime && errors.toTime ? " border-danger " : ""
              }`}
              placeholder="To time"
              type="time"
              value={values.toTime}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label for="username" className="text-muted">
              {touched.toTime && errors.toTime ? errors.toTime : "To time"}
            </label>
          </div>
          <button className="btn btn-success shadow w-100" type="submit">
            Buy for rent
          </button>
        </form>
        </div>
    );
  }