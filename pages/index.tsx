/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Article from '../components/Article'
import data from "../database/products"
import nookies from "nookies"
import { useCart } from "../context/CartContext"
import { useEffect } from 'react'
import Cart from "../components/Cart"
import checkStock from '../helpers/checkStock'

const Home = ({ itemStocks, cartItems }: any) => {
    const products = data.products;
    const { initCartItems } = useCart();

    useEffect(() => {
        initCartItems(cartItems)
    }, [])

    return (
        <div className={styles.general}>
            <Cart />
            <div>
                <Article data={products[0]} isAvailable={itemStocks} />
            </div>
        </div >
    );
}

export async function getServerSideProps(context) {
    let cartItems = [];
    try {
        cartItems = JSON.parse(nookies.get(context).cartItems);
    } catch (e) {
        cartItems = []
    }


    // remove cookies in case there is no stock
    let stock = await checkStock() > 0;

    // Make sur once you get here you cannot get back to Succeed page.
    nookies.set(context, 'orderSucceed', 'false', {
        path: '/',
    })

    return {
        props: { itemStocks: stock, cartItems: stock ? cartItems : [] },
    }
}

export default Home
