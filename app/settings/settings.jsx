import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { Octicons } from "@react-native-vector-icons/octicons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { Alert, Linking, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { Pressable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

function Settings() {
    //Access to the user context and all the existing users
    const { currentTheme, changePrefTheme, gradientColours } = useContext(ThemeContext);
    const { localUserInfo, localUser, users, setUsers, logout } = useContext(UserContext);
    
    //Sets the state to enable the user to edit any of the information displayed
    const [editing, setEditing] = useState("");

    //Stores the data that is being edited before it is stored in the user's data
    const [newUser, setNewUser] = useState("");
    const [oldEmail, setOldEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [warning, setWarning] = useState("");

    //Router to navigate the user back to the home page
    const router = useRouter();

    //Stores the four theme options for the app
    const themeOptions = [
        {key: 1, value: "Light - Gradient"},
        {key: 2, value: "Light - Plain"},
        {key: 3, value: "Dark - Gradient"},
        {key: 4, value: "Dark - Plain"},
    ]

    const [userType, setUserType] = useState("average");
    const [emergencyContact, setEmergencyContact] = useState({name: "", number: ""});
    const [emergencyService, setEmergencyService] = useState({name: "", number: ""});

    const userOptions = [
        {key: "Caretaker", value: "Is a caretaker."},
        {key: "Patient", value: "Makes use of a caretaker that uses this app."},
        {key: "Average", value: "Just needs an organisational tool"},
    ]

    //Edits the Username in the user's data
    function editUsername() {
        const newUsers = users.map((user) => {
            if (user.idnum === localUser) {
                return {
                    ...user,
                    username: newUser,
                }
            }
            else {
                return user;
            };
        });
        setUsers(newUsers);
        setEditing("");
    }

    //Edits the Email in the user's data
    function editEmail() {
        if (oldEmail === localUserInfo[0].email) {
            const newUsers = users.map((user) => {
                if (user.idnum === localUser) {
                    return {
                        ...user,
                        email: newEmail,
                    }
                }
                else {
                    return user;
                };
            });
            setUsers(newUsers);
            setEditing("");
            setWarning("")
        }  
        else {
            setWarning("Your current email is incorrect.")
        }     
    }

    //Edits the Password in the user's data
    function editPassword() {
        if (oldPassword === localUserInfo[0].password) {
            const newUsers = users.map((user) => {
                if (user.idnum === localUser) {
                    return {
                        ...user,
                        password: newPassword,
                    }
                }
                else {
                    return user;
                };
            });
            setUsers(newUsers);
            setEditing("");
            setWarning("")
        }  
        else {
            setWarning("Your current password is incorrect.")
        }
    }

    function editUsertype() {
        const newUsers = users.map((user) => {
            if (user.idnum === localUser) {
                return {
                    ...user,
                    userType: userType,
                }
            }
            else {
                return user;
            };
        });
        setUsers(newUsers);
        setEditing("");
    }

    function editEmergencyContact() {
        const newUsers = users.map((user) => {
            if (user.idnum === localUser) {
                return {
                    ...user,
                    emergencyContact: emergencyContact,
                }
            }
            else {
                return user;
            };
        });
        setUsers(newUsers);
        setEditing("");
    }

    function editEmergencyService() {
        const newUsers = users.map((user) => {
            if (user.idnum === localUser) {
                return {
                    ...user,
                    emergencyService: emergencyService,
                }
            }
            else {
                return user;
            };
        });
        setUsers(newUsers);
        setEditing("");
    }

    //Logs the user out of their account
    function enableLogOut() {
        router.navigate("/home");
        logout();
    }

    //Allows the user to access the external link provided for the Lucide icons page
    const handlePress = useCallback(async () => {
        const supported = await Linking.canOpenURL("https://lucide.dev");

        if (supported) {
            await Linking.openURL("https://lucide.dev");
        } 
        else {
            Alert.alert(`Don't know how to open this URL: ${"https://lucide.dev"}`);
        }
    });

    return (
        <SafeAreaView style={currentTheme.includes("Light") ? stylesLight.container : stylesDark.container}>
            <StatusBar barStyle={currentTheme.includes("Light") ? "light-content" : "dark-content"} backgroundColor={currentTheme.includes("Light") ? "#e3e3e3" : "#2b2b2b"} />
            <LinearGradient style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer} colors={gradientColours}>
                <View style={currentTheme.includes("Light") ? stylesLight.headerContainer : stylesDark.headerContainer}>
                    <Pressable onPress={() => router.navigate("/home")} style={currentTheme.includes("Light") ? stylesLight.back : stylesDark.back}>
                        <Octicons name="home" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                    </Pressable>
                    <Text style={currentTheme.includes("Light") ? stylesLight.header : stylesDark.header}>Settings</Text>
                </View>
                <ScrollView style={currentTheme.includes("Light") ? stylesLight.settingsContainer : stylesDark.settingsContainer}>
                    <Text style={currentTheme.includes("Light") ? stylesLight.headerAccount : stylesDark.headerAccount}>Theme:</Text>
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
                    <Text style={currentTheme.includes("Light") ? stylesLight.headerAccount : stylesDark.headerAccount}>Account:</Text>
                    <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>User ID:</Text>
                    <Text style={currentTheme.includes("Light") ? stylesLight.accountInfo : stylesDark.accountInfo}>{localUserInfo[0] && localUserInfo[0].idnum}</Text>
                    <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>Username:</Text>
                    <View style={currentTheme.includes("Light") ? stylesLight.accountInfoContainer : stylesDark.accountInfoContainer}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.accountInfo : stylesDark.accountInfo}>{localUserInfo[0] && localUserInfo[0].username}</Text>
                        <Pressable onPress={() => setEditing("username")} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                        </Pressable>
                    </View>                    
                    <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>Email:</Text>
                    <View style={currentTheme.includes("Light") ? stylesLight.accountInfoContainer : stylesDark.accountInfoContainer}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.accountInfo : stylesDark.accountInfo}>{localUserInfo[0] && localUserInfo[0].email.split('').map((letter, index) => {
                            if (index < 4) {
                                return letter;
                            }
                            else if (index >= 4 && index < localUserInfo[0].email.length - 4) {
                                return '*'
                            }
                            else {
                                return letter;
                            }
                        })}</Text>
                        <Pressable onPress={() => setEditing("email")} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                        </Pressable>
                    </View>
                    <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>Password:</Text>
                    <View style={currentTheme.includes("Light") ? stylesLight.accountInfoContainer : stylesDark.accountInfoContainer}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.accountInfo : stylesDark.accountInfo}>{localUserInfo[0] && localUserInfo[0].password.split('').map((letter) => {
                            return '*'
                        })}</Text>
                        <Pressable onPress={() => setEditing("password")} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                        </Pressable>
                    </View> 
                    <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>User Type:</Text>
                    <View style={currentTheme.includes("Light") ? stylesLight.accountInfoContainer : stylesDark.accountInfoContainer}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.accountInfo : stylesDark.accountInfo}>{localUserInfo[0] && localUserInfo[0].userType}</Text>
                        <Pressable onPress={() => setEditing("usertype")} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                        </Pressable>
                    </View>  
                    <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>Emergency Contact:</Text>
                    <View style={currentTheme.includes("Light") ? stylesLight.accountInfoContainer : stylesDark.accountInfoContainer}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.accountInfo : stylesDark.accountInfo}>{localUserInfo[0] && localUserInfo[0].emergencyContact.name}: {localUserInfo[0] && localUserInfo[0].emergencyContact.number}</Text>
                        <Pressable onPress={() => setEditing("emergencycontact")} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                        </Pressable>
                    </View> 
                    <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>Emergency Service:</Text>
                    <View style={currentTheme.includes("Light") ? stylesLight.accountInfoContainer : stylesDark.accountInfoContainer}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.accountInfo : stylesDark.accountInfo}>{localUserInfo[0] && localUserInfo[0].emergencyService.name}: {localUserInfo[0] && localUserInfo[0].emergencyService.number}</Text>
                        <Pressable onPress={() => setEditing("emergencyservice")} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                        </Pressable>
                    </View> 
                    <Pressable onPress={enableLogOut} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.click : stylesDark.click, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Log Out</Text>
                    </Pressable>  
                    <View style={currentTheme.includes("Light") ? stylesLight.legalContainer : stylesDark.legalContainer}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.legalText : stylesDark.legalText}>Some icons by Lucide, licensed under ISC and MIT.</Text>
                        <Pressable onPress={handlePress}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.link : stylesDark.link}>(https://lucide.dev)</Text>
                        </Pressable>
                    </View>
                </ScrollView> 
                {editing === "username" ? (
                    <Pressable onPress={() => setEditing("")} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.editContainer : stylesDark.editContainer}>
                            <Pressable onPress={() => setEditing("")} style={currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel}>
                                <Octicons name="x" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                            </Pressable>
                            <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>New Username:</Text>
                            <TextInput placeholder="New Username..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setNewUser(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Pressable onPress={editUsername} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.click : stylesDark.click, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Done</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                ) : 
                editing === "email" ? (
                    <Pressable onPress={() => setEditing("")} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.editContainer : stylesDark.editContainer}>
                            <Pressable onPress={() => setEditing("")} style={currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel}>
                                <Octicons name="x" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                            </Pressable>
                            <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>Old Email:</Text>
                            <TextInput placeholder="Old Email..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setOldEmail(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Text>{warning}</Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>New Email:</Text>
                            <TextInput placeholder="New Email..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setNewEmail(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Pressable onPress={editEmail} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.click : stylesDark.click, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Done</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                ) : 
                editing === "password" ? (
                    <Pressable onPress={() => setEditing("")} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.editContainer : stylesDark.editContainer}>
                            <Pressable onPress={() => setEditing("")} style={currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel}>
                                <Octicons name="x" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                            </Pressable>
                            <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>Old Password:</Text>
                            <TextInput placeholder="Old Password..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setOldPassword(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Text>{warning}</Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>New Password:</Text>
                            <TextInput placeholder="New Password..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setNewPassword(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Pressable onPress={editPassword} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.click : stylesDark.click, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Done</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                ) : 
                editing === "usertype" ? (
                    <Pressable onPress={() => setEditing("")} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.editContainer : stylesDark.editContainer}>
                            <Pressable onPress={() => setEditing("")} style={currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel}>
                                <Octicons name="x" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                            </Pressable>
                            <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>User Type:</Text>
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
                            <Pressable onPress={editUsertype} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.click : stylesDark.click, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Done</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                ) : 
                editing === "emergencycontact" ? (
                    <Pressable onPress={() => setEditing("")} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.editContainer : stylesDark.editContainer}>
                            <Pressable onPress={() => setEditing("")} style={currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel}>
                                <Octicons name="x" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                            </Pressable>
                            <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>Contact Name:</Text>
                            <TextInput placeholder="Name..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setEmergencyContact({...emergencyContact, name: e})} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Text>{warning}</Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>Contact Number:</Text>
                            <TextInput placeholder="Number..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setEmergencyContact({...emergencyContact, number: e})} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Pressable onPress={editEmergencyContact} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.click : stylesDark.click, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Done</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                ) : 
                editing === "emergencyservice" ? (
                    <Pressable onPress={() => setEditing("")} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.editContainer : stylesDark.editContainer}>
                            <Pressable onPress={() => setEditing("")} style={currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel}>
                                <Octicons name="x" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                            </Pressable>
                            <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>Service Name:</Text>
                            <TextInput placeholder="Name..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setEmergencyService({...emergencyService, name: e})} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Text>{warning}</Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>Service Number:</Text>
                            <TextInput placeholder="Number..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setEmergencyService({...emergencyService, number: e})} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Pressable onPress={editEmergencyService} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.click : stylesDark.click, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Done</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                ) : (
                    <View></View>
                )}
            </LinearGradient>
        </SafeAreaView>
    )
}

//Styles for this page
const stylesLight = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        flex: 1
    },
    back: {
        position: "absolute",
        left: "5%",
        top: "30%"        
    },
    headerContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    header: {
        fontFamily: "PTSans-Regular",
        fontSize: 40,
        marginLeft: "auto",
        marginRight: "auto",
        color: "#242424"
    },
    headerAccount: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 22,
        marginBottom: 10,
        marginTop: 10,
    },
    subHeaderAccount: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 18,
        marginBottom: 10,
        marginTop: 10,
    },
    settingsContainer: {
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto"
    },
    accountInfo: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 16,
        marginBottom: 10,
    },
    accountInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    edit: {
        backgroundColor: "#f2f2f2",
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        elevation: 5,
        borderRadius: 15,
        marginBottom: 10
    },
    editText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 15
    },
    input: {
        backgroundColor: "#e3e3e3",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        marginBottom: 5,
    },
    overLay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        flex: 1,
        backgroundColor: "rgba(139, 139, 139, 0.5)"
    },
    editContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "5%",
        padding: 20,
        backgroundColor: "#e3e3e3",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1,
    },
    cancel: {
        position: "absolute",
        alignSelf: "flex-end",
        top: 10,
        right: 10,
    },
    click: {
        backgroundColor: "#f2f2f2",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    clickText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 18
    },
    legalContainer: {
        padding: 10,
    },
    legalText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#242424",
    },
    link: {
        color: "#1966ff",
        textAlign: "center",
        textDecorationLine: "underline",
    }
});

const stylesDark = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        flex: 1
    },
    back: {
        position: "absolute",
        left: "5%",
        top: "30%"        
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
    headerAccount: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 22,
        marginBottom: 5,
        marginTop: 10,
    },
    subHeaderAccount: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 18,
        marginBottom: 5,
        marginTop: 10,
    },
    settingsContainer: {
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto"
    },
    accountInfo: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 16,
    },
    accountInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    edit: {
        backgroundColor: "#3a3a3a",
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        elevation: 5,
        borderRadius: 15,
        marginBottom: 10
    },
    editText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 15
    },
    input: {
        backgroundColor: "#2b2b2b",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        marginBottom: 5,
    },
    overLay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        flex: 1,
        backgroundColor: "rgba(139, 139, 139, 0.5)"
    },
    editContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "5%",
        padding: 20,
        backgroundColor: "#2b2b2b",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1,
    },
    cancel: {
        position: "absolute",
        alignSelf: "flex-end",
        top: 10,
        right: 10,
    },
    click: {
        backgroundColor: "#3a3a3a",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    clickText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 18
    },
    legalContainer: {
        padding: 10,
    },
    legalText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
    },
    button: {
        backgroundColor: "transparent"
    },
    link: {
        color: "#1966ff",
        textAlign: "center",
        textDecorationLine: "underline",
    }
});

export default Settings;