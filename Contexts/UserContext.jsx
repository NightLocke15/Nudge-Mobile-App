import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

function UserProvider({children}) {
    //High level data
    const [users, setUsers] = useState([]);
    const [authenticated, setAuthenticated] = useState(() => {
        const Auth = localStorage.getItem("isAuthenticated");
        return Auth === true;
    });
    const [currentUser, setCurrentUser] = useState("");

    //Local level data
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        localStorage.setItem("isAuthenticated", authenticated);
    }, [authenticated]);

    const usernameBool = (name) => {
        if (users.some((user) => name === user.username)) {
            return false;
        }
        else {
            setUsername(name);
            return true;
        }
    }

    const passwordBool = (password) => {
        if (users.some((user) => password === user.password)) {
            return false;
        }
        else {
            setPassword(password)
            return true;
        }
    }

    const emailBool = (email) => {
        if (users.some((user) => email === user.email)) {
            return false;
        }
        else {
            setEmail(email);
            return true;
        }
    }

    function createUserProfile() {
        setUsers([...users, {username: username, password: password, email: email}]);
        setCurrentUser(username);
        setAuthenticated(true);
    }

    function login(username, password) {
        if (users.some((user) => username === user.usename) && users.some((user) => password === user.password)) {
            setAuthenticated(true);
            setCurrentUser(username);
        }
        else {

        }
    }

    function logout() {
        setAuthenticated(false);
    }

    return (
        <UserContext.Provider value={{authenticated, currentUser, usernameBool, passwordBool, emailBool, createUserProfile, login, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;