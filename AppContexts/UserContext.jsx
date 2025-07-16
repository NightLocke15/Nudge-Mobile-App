import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

function UserProvider({children}) {
    //High level data
    const [users, setUsers] = useState([{
        username: "user",
        idnum: "0001",
        email: "user@mail.com",
        password: "password",
        lists: [],
        logs: []
    }]);
    const [authenticated, setAuthenticated] = useState(() => {
        const Auth = AsyncStorage.getItem("isAuthenticated");
        return Auth === JSON.stringify(true);
    });
    const [localUser, setLocalUser] = useState(() => {
        const User = AsyncStorage.getItem("LocalUser");
        return User;
    });
    const [localUserInfo, setLocalUserInfo] = useState();

    //Determine whether user has been logged in when the re-enter the app
    useEffect(() => {
        AsyncStorage.setItem("isAuthenticated", authenticated);
    }, [authenticated]);

    //Saves local user's username 
    useEffect(() => {
        AsyncStorage.setItem("LocalUser", localUser);
    }, [localUser]);

    useEffect(() => {
        const oneUser = users.map((user) => {
            if (user.idnum === localUser) {
                return user;
            }
        })
        setLocalUserInfo(oneUser);
    }, [users]);

    //Create new account and add it to the list of already existing accounts
    function createUserProfile(username, id, password, email) {
        setUsers([...users, {username: username, idnum: id, password: password, email: email, lists: [], logs: []}]);
        setAuthenticated(true);
        setLocalUser(id);
    }

    //Logs user in with already existing account information
    function login(loggedIn) {
        if (loggedIn) {
            setAuthenticated(JSON.stringify(true));
            console.log(localUser);
        }
        else {

        }
    }

    //Logs user out of app
    function logout() {
        setAuthenticated(JSON.stringify(false));
        console.log("logout");
    }
    return (
        <UserContext.Provider value={{setUsers, users, localUser, localUserInfo, authenticated, setLocalUser, createUserProfile, login, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;