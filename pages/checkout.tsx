/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react'
import styles from '../styles/checkout.module.css'
import nookies from "nookies"
import Router from 'next/router'
import { OrderResume } from '../components/OrderResume';
import validateAddress, { addressStatus } from '../helpers/addressDistance';
import { postData } from '../helpers/postData';
import { useCart } from '../context/CartContext';
import { CheckRegex } from '../helpers/formRegex';

interface CustomerInfo {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
}

interface ShippingInfo {
    address: string,
    apartment: string,
    city: string,
    postalCode: string
}

const ErrorStatus = ({ errorStatus }) => {
    switch (errorStatus) {
        case ErrorEnum.TOOFAR:
            return (<div>
                Vous habitez trop loin
            </div>)
        case ErrorEnum.ADDRESSNOTFOUND:
            return (<div>
                Adresse non valide. Vérifiez votre adresse.
            </div>)
        case ErrorEnum.OUTOFSTOCK:
            return (<div>
                Le produit commandé est en rupture de stock.
            </div>)
        case ErrorEnum.WRONGMAIL:
            return (<div>
                Vérifiez votre mail.
            </div>)
        case ErrorEnum.WRONGPHONE:
            return (<div>
                Vérifiez votre numéro de téléphone.
            </div>)
        case ErrorEnum.WRONGPOSTAL:
            return (<div>
                Vérifiez votre code postal.
            </div>)
        case ErrorEnum.EMPTYFIELD:
            return (<div>
                Remplissez tous les champs
            </div>)
        case ErrorEnum.MONGOERROR:
            return (<div>
                Il y a une erreur avec votre commande. Contactez le service client.
            </div>)
        default:
            return (<div></div>)
    }

}

export enum ErrorEnum {
    UNFILLED,
    TOOFAR,
    WRONGMAIL,
    WRONGPHONE,
    WRONGPOSTAL,
    ADDRESSNOTFOUND,
    EMPTYFIELD,
    OUTOFSTOCK,
    MONGOERROR,
    SUCCESS,
}


function Form({ customerCookies, shippingCookies, cartItems }) {
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(customerCookies);
    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(shippingCookies)
    const [errorStatus, setErrorStatus] = useState<ErrorEnum>(ErrorEnum.UNFILLED)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        nookies.set(null, "customerInfo", JSON.stringify(customerInfo), {
            path: "/",
            maxAge: 60 * 20
        })
        setErrorStatus(ErrorEnum.UNFILLED)
    }, [customerInfo])

    useEffect(() => {
        nookies.set(null, "shippingInfo", JSON.stringify(shippingInfo), {
            path: "/",
            maxAge: 60 * 20
        })
        setErrorStatus(ErrorEnum.UNFILLED)
    }, [shippingInfo])

    const loadingWrapper = async event => {
        event.preventDefault();

        setLoading(true)
        await registerUser()
        setLoading(false)
    }

    const registerUser = async () => {
        const orderInfo = {
            ...customerInfo,
            ...shippingInfo,
            qty: cartItems[0].qty
        };

        // CHECK FOR EVERY MISTAKES IN THE FORM
        if (!CheckRegex(customerInfo, shippingInfo, setErrorStatus)) {
            return
        }

        // CHECK THE DISTANCE FROM THE 4 CITIES
        const addressResponse = await postData("/api/addressDistanceAPI", { shippingInfo });
        const addressValidated = await addressResponse.json()

        if (addressValidated?.success == addressStatus.FAIL) {
            setErrorStatus(ErrorEnum.ADDRESSNOTFOUND)
            return
        }
        if (addressValidated?.success == addressStatus.FAR) {
            setErrorStatus(ErrorEnum.TOOFAR)
            return
        }

        // SENDING ORDER
        let res = await postData('api/sendOrder', { orderInfo });
        let orderStatus = await res.json()

        if (orderStatus?.success == -1) {
            setErrorStatus(ErrorEnum.MONGOERROR)
            console.log("MongoDB unable to process Order")
        }
        else if (orderStatus?.success == 0) {
            setErrorStatus(ErrorEnum.OUTOFSTOCK)
            console.log("Order Failed Because of Stock")
        }
        else {
            setErrorStatus(ErrorEnum.SUCCESS)
            nookies.set(null, "shippingInfo", JSON.stringify([]))
            nookies.set(null, "customerInfo", JSON.stringify([]))
            nookies.set(null, "cartItems", JSON.stringify([]))

            // This Cookie only lasts 3 Minutes meaning you can only access success 3 minutes
            nookies.set(null, "orderSucceed", "true", {
                path: '/',
                maxAge: 180
            })

            Router.push('/succeed')
        }
    }

    return (
        <div>
            <form onSubmit={loadingWrapper} className={styles.formWrapper}>
                <div className={styles.FormTitle}>
                    ADRESSE DE LIVRAISON :
                </div>
                <div className={styles.focusTest} >
                    <input id="firstName"
                        value={customerInfo.firstName}
                        type="text" autoComplete="firstName" required className={styles.inputText}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })} />
                    <label
                        htmlFor="firstName"
                        className={`${styles.floatingLabel} ${customerInfo.firstName ?
                            styles.unfilled : ''}`}>
                        PRÉNOM
                    </label>
                </div>
                <div className={styles.focusTest} >
                    <input id="lastName"
                        value={customerInfo.lastName}
                        type="text" autoComplete="lastName" required className={styles.inputText}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })} />
                    <label
                        htmlFor="lastName"
                        className={`${styles.floatingLabel} ${customerInfo.lastName ?
                            styles.unfilled : ''}`}>
                        NOM
                    </label>
                </div>
                <div className={styles.focusTest} >
                    <input id="email"
                        value={customerInfo.email}
                        type="text" autoComplete="email" required className={styles.inputText}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} />
                    <label
                        htmlFor="email"
                        className={`${styles.floatingLabel} ${customerInfo.email ?
                            styles.unfilled : ''}`}>
                        EMAIL
                    </label>
                </div>
                <div className={styles.focusTest} >
                    <input id="address"
                        value={shippingInfo.address}
                        type="text" autoComplete="address" required className={styles.inputText}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} />
                    <label
                        htmlFor="address"
                        className={`${styles.floatingLabel} ${shippingInfo.address ?
                            styles.unfilled : ''}`}>
                        ADRESSE
                    </label>
                </div>
                <div className={styles.focusTest} >
                    <input id="apartment"
                        value={shippingInfo.apartment}
                        type="text" autoComplete="apartment" className={styles.inputText}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, apartment: e.target.value })} />
                    <label
                        htmlFor="apartment"
                        className={`${styles.floatingLabel} ${shippingInfo.apartment ?
                            styles.unfilled : ''}`}>
                        APT ÉTAGE UNITÉ (FACULTATIF)
                    </label>
                </div>
                <div className={styles.focusTest} >
                    <input id="postalCode"
                        value={shippingInfo.postalCode}
                        type="text" autoComplete="postalCode" required className={styles.inputText}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })} />
                    <label
                        htmlFor="postalCode"
                        className={`${styles.floatingLabel} ${shippingInfo.postalCode ?
                            styles.unfilled : ''}`}>
                        CODE POSTAL
                    </label>
                </div>
                <div className={styles.focusTest} >
                    <input id="city"
                        value={shippingInfo.city}
                        type="text" autoComplete="city" required className={styles.inputText}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} />
                    <label
                        htmlFor="city"
                        className={`${styles.floatingLabel} ${shippingInfo.city ?
                            styles.unfilled : ''}`}>
                        VILLE
                    </label>
                </div>
                <div className={styles.focusTest} >
                    <input id="phone"
                        value={customerInfo.phone}
                        type="text" autoComplete="phone" required className={styles.inputText}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} />
                    <label
                        htmlFor="phone"
                        className={`${styles.floatingLabel} ${customerInfo.phone ?
                            styles.unfilled : ''}`}>
                        TÉLÉPHONE
                    </label>
                </div>
                <div className={styles.errorWrapper}>
                    <ErrorStatus errorStatus={errorStatus} />
                </div>
                {!loading &&
                    <button type="submit" className={styles.checkoutButton}>
                        <a>Envoyer</a>
                    </button>
                }
                {loading &&
                    <div className={styles.loadingButton}>
                        <div className={styles.ldsRing}><div></div><div></div><div></div><div></div></div>
                    </div>
                }
            </form>
        </div >
    )
}

const Checkout = (props: any) => {
    return (
        <div className={styles.checkoutLayout}>
            <OrderResume cartItems={props.cartItems} />
            <Form cartItems={props.cartItems} customerCookies={props.customerCookies} shippingCookies={props.shippingCookies} />
        </div>
    )
}

export async function getServerSideProps(context) {
    let cartItems = [];
    let shippingInfo;
    let customerInfo;
    try {
        cartItems = JSON.parse(nookies.get(context).cartItems);
    } catch (e) {
        cartItems = []
    }
    if (cartItems.length == 0 || context.query?.authorizeCheckout != "true")
        return { redirect: { permanent: false, destination: "/" } }
    try {
        customerInfo = JSON.parse(nookies.get(context).customerInfo);
    } catch (e) {
        customerInfo = { firstName: "", lastName: "", email: "", phone: "" }
    }
    try {
        shippingInfo = JSON.parse(nookies.get(context).shippingInfo);
    } catch (e) {
        shippingInfo = { address: "", apartment: "", city: "", postalCode: "" }
    }
    return { props: { cartItems: cartItems, customerCookies: customerInfo, shippingCookies: shippingInfo } }
}

export default Checkout
