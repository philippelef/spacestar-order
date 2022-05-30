import { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import nookies from 'nookies'


type cartContextType = {
    cartItems: any[];
    initCartItems: (items: any) => void;

    onAdd: (product: any) => void;
    onRemove: (product: any) => void;
};

const cartContextDefaultValues: cartContextType = {
    cartItems: [],
    initCartItems: (items: any) => [],
    onAdd: (product: any) => { },
    onRemove: (product: any) => { },
};

const CartContext = createContext<cartContextType>(cartContextDefaultValues);

export function useCart() {
    return useContext(CartContext);
}

type Props = {
    children: ReactNode;
};


export function CartProvier({ children }: Props) {
    const [cartItems, setCartItems] = useState<any[]>([]);

    const onAdd = (product: any) => {
        const exist = cartItems.find(x => x.id === product.id)
        let updatedCart = []
        if (exist) {
            updatedCart = (
                cartItems.map((x) => (x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x))
            )
        }
        else {
            updatedCart = ([...cartItems, { ...product, qty: 1 }])
        }

        nookies.set(null, "cartItems", JSON.stringify(updatedCart))
        setCartItems(updatedCart)
    }

    const onRemove = (product: any) => {
        const exist = cartItems.find(x => x.id === product.id);
        let updatedCart = []
        if (exist.qty === 1) {
            updatedCart = (cartItems.filter(x => x.id !== product.id))
        }
        else {
            updatedCart = (
                cartItems.map((x) =>
                    x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x)
            )
        }

        nookies.set(null, "cartItems", JSON.stringify(updatedCart))
        setCartItems(updatedCart)
    }

    const initCartItems = (items: any) => {
        setCartItems(items)
    }

    const value = {
        cartItems,
        initCartItems,
        onAdd,
        onRemove,
    }

    return (
        <>
            <CartContext.Provider value={value}>
                {children}
            </CartContext.Provider>
        </>
    );
}