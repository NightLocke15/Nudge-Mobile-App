import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export const ThemeContext = createContext();

function ThemeProvider({children}) {
    const { authenticated, localUserInfo, localUser, users, setUsers } = useContext(UserContext);

    const [currentTheme, setCurrentTheme] = useState("Light - Gradient")

    useEffect(() => {
        if (authenticated) {
            setCurrentTheme(localUserInfo[0].preferredTheme);
        }
    }, [])

    function changePrefTheme(theme) {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            return {
                ...user,
                preferredTheme: theme,
            }
        }
        else {
            return user;
        }
        });
        setUsers(usersReVamp);
        setCurrentTheme(theme);
    }

    const gradientColours = currentTheme === "Light - Gradient" ? ["#e3e3e3", "#aaaaaa"] :
                            currentTheme === "Light - Plain" ? ["#e3e3e3", "#e3e3e3"] : 
                            currentTheme === "Dark - Gradient" ? ["#2b2b2b", "#000000"] :
                            ["#2b2b2b", "#2b2b2b"];

    return (
        <ThemeContext.Provider value={{currentTheme, changePrefTheme, gradientColours}}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider;