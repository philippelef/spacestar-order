/* eslint-disable react/jsx-key */
import '../styles/globals.css'
import '../public/fonts/fonts.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import React from 'react';
import { CartOpenProvider } from "../context/CartOpenContext"
import { CartProvier } from '../context/CartContext';

// import Axios from "axios"

// Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>FREDDIES</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <CartProvier>
        <CartOpenProvider>
          <Component {...pageProps} />
        </CartOpenProvider>
      </CartProvier>
    </div>
  )
}

export default MyApp
