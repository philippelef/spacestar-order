/* eslint-disable react/jsx-key */
import { useState } from 'react'
import styles from '../styles/OrderResume.module.css'
import { CartLogo } from './LogosSVG/Cart'
import Image from 'next/image'

type cartItem = {
    smallImage: string
    name: string,
    price: number,
    qty: number
}

const Chevron = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 407.437 407.437"
            height="100%"
            fill='white'
            xmlSpace="preserve"
        >
            <path d="m386.258 91.567-182.54 181.945L21.179 91.567 0 112.815 203.718 315.87l203.719-203.055z" />
        </svg>
    )
}

const ListItem = ({ item }: any) => {
    return (
        <div className={styles.ListItem}>
            <div className={styles.smallImageWrapper}>
                <div className={styles.amoutWrapper}>
                    {item.qty}
                </div>
                <Image
                    src={item.smallImage}
                    layout="fill"
                    objectFit="contain"
                    alt="article" />
            </div>
            <div className={styles.itemInfo}>
                {item.name}
            </div>
            <div className={styles.itemPrice}>
                {(item.qty * item.price).toFixed(2)}€
            </div>
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



export const OrderResume = ({ cartItems }: any) => {
    const [resOpen, setResOpen] = useState<Boolean>(false)
    return (
        <div className={styles.orderResumeLayout}>
            <div className={styles.orderResumeMenu} onClick={() => setResOpen(!resOpen)}>
                <div className={styles.orderResumeLeft}>
                    <div className={styles.CartLogo}>
                        <CartLogo color={"white"} />
                    </div>
                    <h4>
                        {!resOpen ? 'MONTRER LA COMMANDE' : 'CACHER LA COMMANDE'}
                    </h4>
                    <div className={`${styles.Chevron} ${resOpen ? styles.ChevronClose : ''}`}>
                        <Chevron />
                    </div>
                </div>
                <div className={styles.totalResume} key={getSubtotal(cartItems)}>
                    {getSubtotal(cartItems).toFixed(2)} €
                </div>
            </div>
            <div className={`${styles.orderList} ${resOpen ? styles.orderListActive : ''}`}>
                {
                    cartItems.map((item) => (
                        <ListItem key={item.id} item={item} />
                    ))
                }
                <div className={styles.ShippingPrice}>
                    <div>
                        LIVRAISON :
                    </div>
                    <div>
                        0.00€
                    </div>
                </div>
            </div>

        </div>
    )
}
