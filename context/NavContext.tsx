import { createContext, useState, useContext, ReactNode } from 'react'

type navContextType = {
    navState: boolean;
    setNavState: () => void;
};

const navContextDefaultValues: navContextType = {
    navState: null,
    setNavState: () => { },
};

const NavContext = createContext<navContextType>(navContextDefaultValues);

export function useNav() {
    return useContext(NavContext);
}

type Props = {
    children: ReactNode;
};

export function NavProvider({ children }: Props) {
    const [navState, handleNavState] = useState<boolean>(false);

    const setNavState = () => {
        handleNavState(!navState)
    }

    const value = {
        navState,
        setNavState,
    }

    return (
        <>
            <NavContext.Provider value={value}>
                {children}
            </NavContext.Provider>
        </>
    );
}