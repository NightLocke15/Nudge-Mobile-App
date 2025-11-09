import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { Octicons } from "@react-native-vector-icons/octicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";


function Setup() {
    //Access to the user context and all the existing users
    const { setUsers, users, localUser, localUserInfo } = useContext(UserContext);
    const {currentTheme, gradientColours, changePrefTheme } = useContext(ThemeContext);

    const [userType, setUserType] = useState("average");
    const [emergencyContact, setEmergencyContact] = useState({name: "", number: ""});
    const [emergencyService, setEmergencyService] = useState({name: "", number: ""});

    const userOptions = [
        {key: "Caretaker", value: "Is a caretaker."},
        {key: "Patient", value: "Makes use of a caretaker that uses this app."},
        {key: "Average", value: "Just needs an organisational tool"},
    ]

    const themeOptions = [
        {key: 1, value: "Light - Gradient"},
        {key: 2, value: "Light - Plain"},
        {key: 3, value: "Dark - Gradient"},
        {key: 4, value: "Dark - Plain"},
    ]

    //Router to navigate the user back to the home page
    const router = useRouter();

    function updateInfo() {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            return {
                ...user,
                userType: userType,
                emergencyContact: emergencyContact,
                emergencyService: emergencyService,
            }
        }
        else {
            return user;
        }
        });
        setUsers(usersReVamp);
        router.navigate('/home');
    }

    function skipInfo() {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            return {
                ...user,
                userType: "average",
                emergencyContact: {name: "", number: ""},
                emergencyService: {name: "", number: ""},
            }
        }
        else {
            return user;
        }
        });
        setUsers(usersReVamp);
        router.navigate('/home');
    }

    return (
        <React.Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor: currentTheme.includes("Light") ? "#e3e3e3" : "#2b2b2b" }} />
        <SafeAreaView style={currentTheme.includes("Light") ? stylesLight.container : stylesDark.container}>
            <StatusBar barStyle={currentTheme.includes("Light") ? "dark-content" : "light-content"} backgroundColor={currentTheme.includes("Light") ? "#e3e3e3" : "#2b2b2b"} />
            <LinearGradient style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer} colors={gradientColours}>
                <ScrollView>
                    <View style={currentTheme.includes("Light") ? stylesLight.headerContainer : stylesDark.headerContainer}>
                        <Pressable onPress={skipInfo} style={currentTheme.includes("Light") ? stylesLight.skip : stylesDark.skip}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.skipText : stylesDark.skipText}>Skip</Text>
                        </Pressable>
                        <Text style={currentTheme.includes("Light") ? stylesLight.header : stylesDark.header}>Setup</Text>
                    </View>
                    <Text style={currentTheme.includes("Light") ? stylesLight.text : stylesDark.text}>User's preffered theme:</Text>
                    <View style={currentTheme.includes("Light") ? stylesLight.dropdown : stylesDark.dropdown}>
                        <SelectList 
                            setSelected={(e) => changePrefTheme(e)}
                            data={themeOptions}
                            save="value"
                            placeholder={currentTheme}
                            dropdownTextStyles={{color: currentTheme.includes("Light") ? "#242424" : "#e3e3e3"}}
                            inputStyles={{color: currentTheme.includes("Light") ? "#242424" : "#e3e3e3"}}
                            arrowicon={<Octicons name="chevron-down" size={18} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>}
                            closeicon={<Octicons name="x" size={18} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>}
                            search={false}
                        />
                    </View>
                    <Text style={currentTheme.includes("Light") ? stylesLight.text : stylesDark.text}>The user of this profile:</Text>
                    <View style={currentTheme.includes("Light") ? stylesLight.dropdown : stylesDark.dropdown}>
                        <SelectList 
                            setSelected={(e) => setUserType(e)}
                            data={userOptions}
                            save="key"
                            placeholder="Choose..."
                            dropdownTextStyles={{color: currentTheme.includes("Light") ? "#242424" : "#e3e3e3"}}
                            inputStyles={{color: currentTheme.includes("Light") ? "#242424" : "#e3e3e3"}}
                            arrowicon={<Octicons name="chevron-down" size={18} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>}
                            closeicon={<Octicons name="x" size={18} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>}
                            search={false}
                        />
                    </View>   
                    <Text style={currentTheme.includes("Light") ? stylesLight.text : stylesDark.text}>Who is your emergency contact?</Text>
                    <TextInput placeholder="Emergency Contact Name..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setEmergencyContact({...emergencyContact, name: e})} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                    <TextInput placeholder="Emergency Contact Number..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setEmergencyContact({...emergencyContact, number: e})} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                    <Text style={currentTheme.includes("Light") ? stylesLight.text : stylesDark.text}>What is your preffered emergency service's number?</Text>
                    <TextInput placeholder="Emergency Service Name..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setEmergencyService({...emergencyService, name: e})} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                    <TextInput placeholder="Emergency Service Number..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setEmergencyService({...emergencyService, number: e})} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                    <Pressable onPress={updateInfo} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.done : stylesDark.done, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.doneText : stylesDark.doneText}>Done</Text>
                    </Pressable>
                </ScrollView>
                
            </LinearGradient>
        </SafeAreaView>
        </React.Fragment>
    )
}

const stylesLight = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e3e3e3"
    },
    contentContainer: {
        flex: 1
    },
    headerContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    header: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 40,
        marginLeft: "auto",
        marginRight: "auto"
    },
    skip: {        
        position: "absolute",
        right: "5%",
        top: "30%"                   
    },
    skipText: {
        color: "#242424",
        fontFamily: "Roboto-Regular",
        fontSize: 18,
    },
    text: {
        color: "#242424",
        fontFamily: "Roboto-Regular",
        fontSize: 18,
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 15,
        marginBottom: 15
    },
    input: {
        backgroundColor: "#e3e3e3",
        color: "#242424",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        marginBottom: 5,
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 15
    },
    dropdown: {
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    done: {
        backgroundColor: "#f2f2f2",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    doneText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 18
    },
    
})

const stylesDark = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2b2b2b"
    },
    contentContainer: {
        flex: 1
    },
    headerContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    header: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 40,
        marginLeft: "auto",
        marginRight: "auto"
    },
    skip: {        
        position: "absolute",
        right: "5%",
        top: "30%"                   
    },
    skipText: {
        color: "#e3e3e3",
        fontFamily: "Roboto-Regular",
        fontSize: 18,
    },
    text: {
        color: "#e3e3e3",
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 15,
        marginBottom: 15
    },
    input: {
        backgroundColor: "#242424",
        color: "#e3e3e3",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        marginBottom: 5,
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 15
    },
    dropdown: {
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    done: {
        backgroundColor: "#3a3a3a",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    doneText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 18
    },
})

export default Setup;