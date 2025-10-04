"use client";

import React, { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentPage = () => {
  const AMOUNT = 10;         //: Amount in INR 
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
 
    //create Order
    try {
      const response = await fetch("/api/create-order", { method: "POST" });
      const data = await response.json();

    //initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: AMOUNT * 10,
        currency: "INR",
        name: "The Maqsad Institute",
        description: "Joining Transaction",
        order_id: data.orderId,
        handler: function (response: any) {
          console.log("Payment successful", response);
        },
        prefill: {
          name: "Abdul",
          email: "abdulB0mbMaker@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzpl = new window.Razorpay(options);
      rzpl.open();
    } catch (error) {
      console.error("Payment Failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Payment Gateway</h1>
        <p className="mb-4">Amount to pay {AMOUNT} INR</p>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
