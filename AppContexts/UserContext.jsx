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
        userType: "Average",
        emergencyContact: {name: "", number: ""},
        emergencyService: {name: "", number: ""},
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

    //Finds the location of the user's phone
    useEffect(() => {
        const fetchLocationAndWeather = async () => {
            try {
                if (!authenticated) return;

                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') return;

                const loc = await Location.getCurrentPositionAsync({});
                const reverseGeo = await Location.reverseGeocodeAsync({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                });

                const userCity = reverseGeo?.[0]?.city;
                if (!userCity) return;

                setCity(userCity);

                const response = await axios.get(
                    `https://api.weatherapi.com/v1/forecast.json?key=e81f6e30dcd9457dbcf185856250911&q=${userCity}&days=3&aqi=no&alerts=no`
                );
                setWeatherData(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchLocationAndWeather();
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