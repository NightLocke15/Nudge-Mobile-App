import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { UserContext } from "./UserContext";

export const ThemeContext = createContext();

function ThemeProvider({children}) {
    //Access to the user context and all the existing users
    const { authenticated, localUserInfo, localUser, users, setUsers } = useContext(UserContext);

    //Find the default style of the phone
    const phoneTheme = useColorScheme();

    //Stores the current theme of the app
    const [currentTheme, setCurrentTheme] = useState("Light - Gradient")

    //Sets the app theme to the default theme of the phone
    useEffect(() => {
        setCurrentTheme(phoneTheme === "light" ? "Light - Gradient" : "Dark - Gradient");
    }, [])

    //Changes the theme when theme is changed in settings
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

    //Options of themes provided to the user
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