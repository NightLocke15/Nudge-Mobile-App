import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { Octicons } from "@react-native-vector-icons/octicons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { Pressable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

function Settings() {
    const { currentTheme, changePrefTheme, gradientColours } = useContext(ThemeContext);
    const { localUserInfo, localUser, users, setUsers, logout } = useContext(UserContext);
    const [editing, setEditing] = useState("");

    const [newUser, setNewUser] = useState("");
    const [oldEmail, setOldEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [warning, setWarning] = useState("");

    const router = useRouter();

    const themeOptions = [
        {key: 1, value: "Light - Gradient"},
        {key: 2, value: "Light - Plain"},
        {key: 3, value: "Dark - Gradient"},
        {key: 4, value: "Dark - Plain"},
    ]

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

    function enableLogOut() {
        router.navigate("/home");
        logout();
    }

    return (
        <SafeAreaView style={currentTheme.includes("Light") ? stylesLight.container : stylesDark.container}>
            <LinearGradient style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer} colors={gradientColours}>
                <View style={currentTheme.includes("Light") ? stylesLight.headerContainer : stylesDark.headerContainer}>
                    <Pressable onPress={() => router.navigate("/home")} style={currentTheme.includes("Light") ? stylesLight.back : stylesDark.back}>
                        <Octicons name="home" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                    </Pressable>
                    <Text style={currentTheme.includes("Light") ? stylesLight.header : stylesDark.header}>Settings</Text>
                </View>
                <View style={currentTheme.includes("Light") ? stylesLight.settingsContainer : stylesDark.settingsContainer}>
                    <Text style={currentTheme.includes("Light") ? stylesLight.headerAccount : stylesDark.headerAccount}>Theme:</Text>
                    <View style={currentTheme.includes("Light") ? stylesLight.dropdown : stylesDark.dropdown}>
                        <SelectList 
                            setSelected={(e) => changePrefTheme(e)}
                            data={themeOptions}
                            save="value"
                            placeholder={currentTheme}
                            dropdownTextStyles={{color: currentTheme.includes("Light") ? "#242424" : "#e3e3e3"}}
                            inputStyles={{color: currentTheme.includes("Light") ? "#242424" : "#e3e3e3"}}
                        />
                    </View>
                    <Text style={currentTheme.includes("Light") ? stylesLight.headerAccount : stylesDark.headerAccount}>Account:</Text>
                    <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>Username:</Text>
                    <View style={currentTheme.includes("Light") ? stylesLight.accountInfoContainer : stylesDark.accountInfoContainer}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.accountInfo : stylesDark.accountInfo}>{localUserInfo[0] && localUserInfo[0].username}</Text>
                        <Pressable onPress={() => setEditing("username")} style={currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit}>
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
                        <Pressable onPress={() => setEditing("email")} style={currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                        </Pressable>
                    </View>
                    <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>Password:</Text>
                    <View style={currentTheme.includes("Light") ? stylesLight.accountInfoContainer : stylesDark.accountInfoContainer}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.accountInfo : stylesDark.accountInfo}>{localUserInfo[0] && localUserInfo[0].password.split('').map((letter) => {
                            return '*'
                        })}</Text>
                        <Pressable onPress={() => setEditing("password")} style={currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                        </Pressable>
                    </View>  
                    <Pressable onPress={enableLogOut} style={currentTheme.includes("Light") ? stylesLight.click : stylesDark.click}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Log Out</Text>
                    </Pressable>                  
                </View> 
                {editing === "username" ? (
                    <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.editContainer : stylesDark.editContainer}>
                            <Pressable onPress={() => setEditing("")} style={currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel}>
                                <Octicons name="x" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                            </Pressable>
                            <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>New Username:</Text>
                            <TextInput placeholder="New Username..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setNewUser(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Pressable onPress={editUsername} style={currentTheme.includes("Light") ? stylesLight.click : stylesDark.click}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Done</Text>
                            </Pressable>
                        </View>
                    </View>
                ) : 
                editing === "email" ? (
                    <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.editContainer : stylesDark.editContainer}>
                            <Pressable onPress={() => setEditing("")} style={currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel}>
                                <Octicons name="x" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                            </Pressable>
                            <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>Old Email:</Text>
                            <TextInput placeholder="Old Email..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setOldEmail(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Text>{warning}</Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>New Email:</Text>
                            <TextInput placeholder="New Email..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setNewEmail(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Pressable onPress={editEmail} style={currentTheme.includes("Light") ? stylesLight.click : stylesDark.click}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Done</Text>
                            </Pressable>
                        </View>
                    </View>
                ) : 
                editing === "password" ? (
                    <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.editContainer : stylesDark.editContainer}>
                            <Pressable onPress={() => setEditing("")} style={currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel}>
                                <Octicons name="x" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                            </Pressable>
                            <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>Old Password:</Text>
                            <TextInput placeholder="Old Password..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setOldPassword(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Text>{warning}</Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.subHeaderAccount : stylesDark.subHeaderAccount}>New Password:</Text>
                            <TextInput placeholder="New Password..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setNewPassword(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Pressable onPress={editPassword} style={currentTheme.includes("Light") ? stylesLight.click : stylesDark.click}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Done</Text>
                            </Pressable>
                        </View>
                    </View>
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
        marginBottom: 10,
        marginTop: 10,
    },
    subHeaderAccount: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
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
        color: "#e3e3e3",
        fontSize: 16,
        marginBottom: 10,
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
});

export default Settings;