/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
import React from 'react'
import styles from "../styles/Cart.module.css"
import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { CartLogo } from './LogosSVG/Cart'
import { useCart } from '../context/CartContext'
import { useCartOpen } from '../context/CartOpenContext'
import Add from './LogosSVG/Add'
import Router from 'next/router'

type CartProps = {
    item: any
    cartItems: Array<any>,
    onAdd: (product: any) => void
    onRemove: (product: any) => void
    authCO: any
    setAuthCO: any
}

const BackButtonIcon = ({ cartOpen, changeCartOpenState }: any) => {
    return (
        <svg className={styles.BackButtonHover} onClick={() => { changeCartOpenState() }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="380 0 60.775 460.775"
            height="100%"
            xmlSpace="preserve"
            fill='white'
        >
            <path d="M285.08 230.397 456.218 59.27c6.076-6.077 6.076-15.911 0-21.986L423.511 4.565a15.55 15.55 0 0 0-21.985 0l-171.138 171.14L59.25 4.565a15.551 15.551 0 0 0-21.985 0L4.558 37.284c-6.077 6.075-6.077 15.909 0 21.986l171.138 171.128L4.575 401.505c-6.074 6.077-6.074 15.911 0 21.986l32.709 32.719a15.555 15.555 0 0 0 21.986 0l171.117-171.12 171.118 171.12a15.551 15.551 0 0 0 21.985 0l32.709-32.719c6.074-6.075 6.074-15.909 0-21.986L285.08 230.397z" />
        </svg>
    )
}

const CartItem = ({ item, onAdd, onRemove, authCO, setAuthCO, anim, setAnim }: any) => {
    return (
        <div key={item.id} className={styles.cartRow}>
            <div className={styles.smallImageWrapper}>
                <Image
                    src={item.smallImage}
                    layout="fill"
                    objectFit="contain"
                    alt="article" />
            </div>
            <div className={styles.infoWrapper}>
                <div className={styles.itemName}>
                    {item.name}
                </div>
                <div className={`${styles.changeAmout} ${anim ? styles.warnAmout : ''}`}
                    onAnimationEnd={() => setAnim(false)}>
                    <button onClick={() => { onRemove(item); setAuthCO(true) }} className={styles.remove}>                       <a>
                        -
                    </a></button>
                    <div className={styles.amountIndicator}>
                        {item.qty}
                    </div>
                    <button onClick={() => onAdd(item)} className={styles.add}>
                        <a>
                            +
                        </a>
                    </button>
                </div>
            </div>

            <div className={styles.priceWrapper}>
                {item.qty * item.price}€
            </div>
        </div >
    )
}

const CartPreview = ({ cartItems, onAdd, onRemove, authCO, setAuthCO, anim, setAnim }: any) => {
    return (<div className={styles.CartPreviewWrapper}>
        {cartItems.length === 0 && <div className={styles.emptyCart}>Panier Vide</div>}
        {cartItems.map((item) => (
            <CartItem key={item.id} item={item} onAdd={onAdd} onRemove={onRemove} authCO={authCO} setAuthCO={setAuthCO} anim={anim} setAnim={setAnim} />
        ))}
    </div>
    )
}

function getSubtotal(cartItems) {
    let total = 0;
    cartItems.map((item) => {
        total += item.qty * item.price
    })
    return total
}


const OrderButton = ({ cartItems, authCO, setAuthCO, anim, setAnim }) => {
    const [loading, setLoading] = useState<boolean>(false)

    return (<div className={styles.checkoutButton} onClick={async () => {
        if (authCO == false) {
            setAnim(true)
            return
        }

        // Start the api loading animation
        setLoading(true)

        // check for the amount available
        const res = await fetch('api/checkStock').then(res => res.json());
        const stock = await res?.success

        // Stop loading
        setLoading(false)

        if (stock >= cartItems[0].qty) {
            Router.push({ pathname: "/checkout", query: { authorizeCheckout: true } })
        }
        else {
            setLoading(false)
            setAuthCO(false)
        }
    }}>
        {authCO &&
            <a>
                {!loading &&
                    <div>
                        COMMANDER
                    </div>
                }
                {loading &&
                    <div className={styles.ldsRing}><div></div><div></div><div></div><div></div></div>
                }
            </a>}
        {!authCO &&
            <>
                <a>
                    PRENEZ MOINS DE CD SVP
                </a>
            </>}
    </div >)
}


const Cart = () => {
    const { cartItems, onAdd, onRemove } = useCart();
    const { cartOpenState, changeCartOpenState } = useCartOpen();
    const [authCO, setAuthCO] = useState<boolean>(true)
    const [anim, setAnim] = useState<boolean>(false)
    const cartDropdown = React.useRef<any>(null);


    useEffect(() => {
        if (!cartOpenState) return;
        function handleClick(event: any) {
            if (cartDropdown.current && !cartDropdown.current.contains(event.target)) {
                changeCartOpenState();
            }
        }
        window.addEventListener("click", handleClick);

        return () => window.removeEventListener("click", handleClick);
    }, [cartOpenState, changeCartOpenState]);

    return (
        <div className={styles.Cart}>
            {/* #TODO ref={cartDropDown} */}
            <div className={`${styles.menu} ${cartOpenState ? styles.active : ''}`}>
                <div className={styles.BackButton}>
                    <p>
                        PANIER
                    </p>
                    <BackButtonIcon cartOpen={cartOpenState} changeCartOpenState={changeCartOpenState} />
                </div>

                <CartPreview cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} authCO={authCO} setAuthCO={setAuthCO} anim={anim} setAnim={setAnim} />

                {cartItems.length >= 1 &&
                    <div className={styles.checkoutWrapper}>
                        <div className={styles.subTotal}>
                            <a>
                                SOUS TOTAL
                            </a>
                            <a key={getSubtotal(cartItems)} className={styles.subTotalPriceWrapper}>
                                {getSubtotal(cartItems)}€
                            </a>
                        </div>
                        <OrderButton cartItems={cartItems} authCO={authCO} setAuthCO={setAuthCO} anim={anim} setAnim={setAnim} />
                    </div>
                }
            </div>
            {
                cartItems.length >= 1 &&
                <div
                    className={styles.TopRight}
                    onClick={() => { changeCartOpenState() }}>
                    <a className={styles.amountWrapper} key={cartItems.length}>
                        {cartItems.length ? cartItems.length : ''}
                    </a>
                    <div className={styles.CartLogo}>
                        <CartLogo />
                    </div>
                </div>
            }
        </div >
    )
}

export default Cart