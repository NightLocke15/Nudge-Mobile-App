import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
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
        logs: [],
        events: [{name: "event"}],
        alarms: [],
        preferredTheme: "Light - Gradient"
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
    
    const [weatherData, setWeatherData] = useState({});
    const [city, setCity] = useState("Miami");

    useEffect(() => {
       const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            
            let reverseGeoCodeAddress = await Location.reverseGeocodeAsync({
                longitude: loc.coords.longitude,
                latitude: loc.coords.latitude
            });
            setCity(reverseGeoCodeAddress[0].city);
            console.log(city);
        };

        getLocation();
        console.log(city);
        
    }, [authenticated])

    

    useEffect(() => {
        axios.get(`http://api.weatherapi.com/v1/forecast.json?key=5e5fb9402f2b41dd967110133251709&q=${city}&days=3&aqi=no&alerts=no`)
            .then(response => {
                setWeatherData(response.data);
                console.log("weatherData");
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
            });       
    }, [authenticated]);

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
    }, [users, authenticated]);

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
        }
        else {

        }
    }

    //Logs user out of app
    function logout() {
        setAuthenticated(JSON.stringify(false));
    }
    return (
        <UserContext.Provider value={{setUsers, users, localUser, localUserInfo, authenticated, weatherData, setLocalUser, createUserProfile, login, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;