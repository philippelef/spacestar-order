/* eslint-disable react/jsx-key */
import React from 'react'
import Cart from "./Cart"
import Head from 'next/head'
import { useNav } from "../context/NavContext"
import styles from "../styles/Layout.module.css"

type LayoutProps = {
    children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    const { navState, setNavState } = useNav();

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className={styles.Layout}>
                <Cart />
                <div style={{ filter: navState ? "blur(5px)" : "blur(0px)", flex: 1 }}>
                    <div>
                        {children}
                    </div >
                </div>
            </div >
        </>
    )
}
