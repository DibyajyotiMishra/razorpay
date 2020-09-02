import React, { useState } from "react";

import "./App.css";

function loadScript(src) {
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const __DEV__ = document.domain === "localhost";

function App() {
  const [name, setName] = useState("Dibyajyoti");

  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const data = await fetch("http://localhost:8000/pay", {
      method: "POST",
    }).then(t => t.json());

    console.log(data);

    const options = {
      key: __DEV__ ? "rzp_test_ab44ieJwAQxgEL" : "PRODUCTION_KEY",
      currency: data.currency,
      amount: data.amount.toString(),
      order_id: data.id,
      name: "Donation",
      description: "Yo! Give me some money", //http://e96d2886a51a.ngrok.io
      image:
        "https://images.pexels.com/photos/349758/hummingbird-bird-birds-349758.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      handler: function (response) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },
      prefill: {
        name,
        email: "sdfdsjfh2@ndsfdf.com",
        phone_number: "9899999999",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <h1 className='text-white text-center display-3 mt-n5'>
          Razorpay Payment Gateway integration
        </h1>
        <button
          className='btn btn-outline-warning'
          onClick={displayRazorpay}
          target='_blank'
        >
          Donate $1000
        </button>
      </header>
    </div>
  );
}

export default App;
