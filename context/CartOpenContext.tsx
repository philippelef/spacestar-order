import { createContext, useState, useContext, ReactNode } from 'react'

type cartOpenContextType = {
    cartOpenState: boolean;
    openCart: () => void;
    closeCart: () => void;
    changeCartOpenState: () => void;
};

const cartopenContextDefaultValues: cartOpenContextType = {
    cartOpenState: null,
    openCart: () => { },
    closeCart: () => { },
    changeCartOpenState: () => { },
};

const CartOpenContext = createContext<cartOpenContextType>(cartopenContextDefaultValues);

export function useCartOpen() {
    return useContext(CartOpenContext);
}

type Props = {
    children: ReactNode;
};

export function CartOpenProvider({ children }: Props) {
    const [cartOpenState, handleCartOpenState] = useState<boolean>(false);

    const changeCartOpenState = () => {
        handleCartOpenState(!cartOpenState)
    }

    const openCart = () => {
        handleCartOpenState(true)
    }

    const closeCart = () => {
        handleCartOpenState(false)
    }


    const value = {
        cartOpenState,
        changeCartOpenState,
        openCart,
        closeCart,
    }

    return (
        <>
            <CartOpenContext.Provider value={value}>
                {children}
            </CartOpenContext.Provider>
        </>
    );
}