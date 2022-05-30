/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import styles from '../styles/Article.module.css'
import { useCart } from "../context/CartContext";
import { useCartOpen } from "../context/CartOpenContext";
import Footer from "../components/Footer"
import { useEffect, useRef, useState } from 'react';

enum ButtonStatus {
    AddToCart,
    AddedToCart,
    OutOfStock,
}


function isInCart(productId: number, cartItems: any[]) {
    return cartItems.find(x => x.id === productId) ? ButtonStatus.AddedToCart : ButtonStatus.AddToCart;
}



const AddToCartButton = (props: any) => {
    const { openCart } = useCartOpen();

    if (props.status === ButtonStatus.OutOfStock) {
        return (
            <div className={`${styles.AddToCart} ${styles.Added}`}>
                Rupture de Stock
            </div>
        )
    }
    else if (props.status === ButtonStatus.AddToCart) {
        return (
            <div className={`${styles.AddToCart} ${styles.Add}`} onClick={() => { props.onAdd(props.data); openCart() }}>
                AJOUTER AU PANIER
            </div>
        )
    }
    if (props.status === ButtonStatus.AddedToCart) {
        return (
            <div className={`${styles.AddToCart} ${styles.Added}`} onClick={() => { openCart() }}>
                AJOUTÉ !
            </div>
        )
    }

}

function Article(props: any) {
    const { cartItems, onAdd } = useCart()

    const videoRef = useRef<any>()

    let isAvailable: ButtonStatus = isInCart(props.data.id, cartItems);
    if (props.isAvailable == false) {
        isAvailable = ButtonStatus.OutOfStock
    }


    return (
        <div className={styles.article} onClick={() => videoRef.current.play()}>
            <video className={`${styles.video_wrapper}`} ref={videoRef}
                autoPlay={true} loop={true} muted={true} playsInline={true}
                poster={"cdMockup.png"}
                controls={false}
            >
                <source src={props.data.image} type="video/webm" />
                <source src={props.data.image_hevc} />
            </video >
            <div className={styles.articleInfo}>
                <div className={styles.Title}>
                    {props.data.name}
                </div>
                <div className={styles.Price}>
                    {props.data.price}€
                </div>
                <div className={styles.AddToCartWrapper}>
                    <AddToCartButton onAdd={onAdd} status={isAvailable} data={props.data} />
                </div>
                <p>
                    LIVRAISON 26-27 MARS
                </p>
                <p>
                    MONTPELLIER
                </p>
                <p>
                    LILLE
                </p>
                <p>
                    PARIS
                </p>
                <p>
                    BREST
                </p>
                <p>
                    ET LEURS ALENTOURS
                </p>
                <p>
                    REMISE EN MAIN PROPRE
                </p>
                <Footer />
            </div>
        </div >
    )
}


export default Article;