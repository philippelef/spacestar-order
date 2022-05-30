/* eslint-disable react/jsx-key */
import styles from "../styles/Succeed.module.css"
import nookies from "nookies"
import Router from "next/router";

export default function Succeed(props: any) {

    return (
        <div className={styles.SucceedLayout}>
            <div className={styles.SucceedInfo}>
                <h1 className={styles.h1}>
                    Commande Validée. Merci!
                </h1>
                <a>
                    Livraison par un Freddies
                </a>
                <a>
                    Dans ta ville le 26-27 Mars
                </a>
                <a>
                    Remise en main propre / Paiement en personne
                </a>
            </div>
            <div onClick={() => {
                Router.push("/")
            }} className={styles.GoBackButton}>
                <a>
                    Retourner à la boutique
                </a>
            </div>

        </div>
    );
}

export async function getServerSideProps(context) {
    let orderSucceed = "";

    try {
        orderSucceed = nookies.get(context).orderSucceed;
    } catch (e) {
        orderSucceed = "false"
    }

    if (orderSucceed != "true") {
        return { redirect: { permanent: false, destination: "/" } }
    }

    return { props: {} }
}