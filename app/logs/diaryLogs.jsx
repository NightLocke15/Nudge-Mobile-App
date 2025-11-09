import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { Octicons } from "@react-native-vector-icons/octicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector, TextInput } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { SafeAreaView } from "react-native-safe-area-context";
import { v4 as uuidv4 } from 'uuid';

function DiaryLogs() {
    //Accessing user context and all the users that already exist
    const { users, setUsers, localUserInfo, localUser } = useContext(UserContext);
    const {currentTheme, gradientColours } = useContext(ThemeContext);

    //Router used to navigate back to the home page as well as navigate to the specific log chosen
    const router = useRouter();

    //Accessing the window height amd width in order to determine diary tile sizes
    const { width, height } = useWindowDimensions();

    //Storing the information about the new diary log created
    const [logName, setLogName] = useState("");
    const [itemID, setItemID] = useState(null);

    //Setting editing state, activating editing tile
    const [editing, setEditing] = useState(false);    

    //Finding the current date
    const today = new Date();

    //Information and states set when interacting with items by tapping or double tapping in order to edit or delete the correct items
    const [item, setItem] = useState();
    const [action, setAction] = useState(false);
    const [tapPostition, setTapPosition] = useState({x: 0, y: 0})

    //Warning that is set active before item is deleted
    const [warning, setWarning] = useState(false);

    //Add a new diary entry to the user's list of entries
    function addLog() {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            return {
                ...user,
                logs: [...user.logs, {id: uuidv4(), name: `Untitled Note ${user.logs.length}`, type: "Diary", date: `${today.getFullYear()}-${today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : 
                `${today.getMonth() + 1}`}-${today.getDate() < 10 ? `0${today.getDate()}` : `${today.getDate()}`}`, text: "", images: [], voiceNotes: []}]
            }
        }
        else {
            return user;
        }
        });
        setUsers(usersReVamp);
    }

    //Dynamically navigate to the [id] page and injecting the information relevant to the chosen log
    function goToLog(id) {
        router.push(`/logs/${id}`);

    }

    //Triggers the delete warning
    function triggerDelete() {
        setAction(false);
        setWarning(true);
    }

    //Code that deletes the correct diary entry from the user's information
    const deleteLog = (item) => {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            const newLogs = user.logs.filter((log) => log.id !== item.id);
            return {
                ...user,
                logs: newLogs
            }
        }
        else {
            return user;
        }
        });
        setUsers(usersReVamp);
        setWarning(false);
    }

    //Triggers editing tile and sets the correct information to be edited ***(On long press, which is defferent from others. Subject to change, this is stille experimental)***
    const triggerEditing = (item) => {
        setEditing(true);
        setLogName(item.name);
        setItemID(item.id);
        setAction(false);
    }

    //Accesses the correct diary entry to edit and edits the name of the diary entry by replacing the item at its index
    function editLogName() {
        console.log(itemID);
        const usersReVamp = users.map((user) => {
        if (user.idnum === localUser) {
            const newLogs = user.logs;
            newLogs.splice(user.logs.findIndex((item) => item.id === itemID), 1, {...user.logs[user.logs.findIndex((item) => item.id === itemID)], name: logName})
            return {
                ...user,
                logs: newLogs
            }
        }
        else {
            return user;
        }
        });
        // reset all the storage
        setUsers(usersReVamp);
        setLogName("");
        setEditing(false);
        setItemID(null);
    }

    //Gesture handler constants. Detects a single tap on a certain element as well as a double tap.
    const singleTap = (item) => Gesture.Tap().maxDuration(250).numberOfTaps(1).onStart(() => {
            goToLog(item)
    }).runOnJS(true);
    const doubleTap = (item) => Gesture.Tap().maxDuration(250).numberOfTaps(2).onStart((event) => {
        setItem(item);
        setTapPosition({x: event.absoluteX > 260 ? 260 : event.absoluteX, y: event.absoluteY > 530 ? 530 : event.absoluteY});
        setAction(true);
    }).runOnJS(true);

    return (
        <React.Fragment>
        <SafeAreaView style={currentTheme.includes("Light") ? stylesLight.container : stylesDark.container}>
            <StatusBar barStyle={currentTheme.includes("Light") ? "dark-content" : "light-content"} backgroundColor={currentTheme.includes("Light") ? "#e3e3e3" : "#2b2b2b"} />
            <LinearGradient style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer} colors={gradientColours}>
                <View style={currentTheme.includes("Light") ? stylesLight.headerContainer : stylesDark.headerContainer}>
                    <Pressable onPress={() => router.navigate("/home")} style={currentTheme.includes("Light") ? stylesLight.back : stylesDark.back}>
                        <Octicons name="home" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                    </Pressable>
                    <Text style={currentTheme.includes("Light") ? stylesLight.header : stylesDark.header}>Diary</Text>
                    <Pressable onPress={addLog} style={currentTheme.includes("Light") ? stylesLight.add : stylesDark.add}>
                        <Octicons name="plus" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                    </Pressable>
                </View>  
                <View style={currentTheme.includes("Light") ? stylesLight.diaryLogContainer : stylesDark.diaryLogContainer}>
                    {localUserInfo[0] && localUserInfo[0].logs.filter((log) => log.type === "Diary").map((log) => (
                        <GestureDetector key={log.id} gesture={Gesture.Exclusive(doubleTap(log), singleTap(log.id))}>
                            <View style={currentTheme.includes("Light") ? stylesLight.logContainer : stylesDark.logContainer}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.logName : stylesDark.logName}>{log.name}</Text>
                                <Text style={currentTheme.includes("Light") ? stylesLight.logDate : stylesDark.logDate}>{log.date}</Text>
                                <Text numberOfLines={5} ellipsizeMode="tail" style={currentTheme.includes("Light") ? stylesLight.logText : stylesDark.logText}>{log.text}</Text>
                            </View>
                        </GestureDetector>
                    ))}
                </View>
                {editing ? (
                    <Pressable onPress={() => setEditing(false)} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.editNameContainer : stylesDark.editNameContainer}>
                            <Pressable onPress={() => setEditing(false)} style={currentTheme.includes("Light") ? stylesLight.close : stylesDark.close}>
                                <Octicons name="x" size={20} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                            </Pressable>
                            <TextInput placeholder="Name..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setLogName(e)} value={logName} maxLength={15} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Pressable onPress={editLogName} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.done : stylesDark.done, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.doneText : stylesDark.doneText}>Done</Text>
                            </Pressable>
                        </View>
                    </Pressable>                    
                ) : (
                    <View></View>
                )}
                {action ? (
                    <Pressable onPress={() => setAction(false)} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={[currentTheme.includes("Light") ? stylesLight.actionContainer : stylesDark.actionContainer, {position: "absolute", left: tapPostition.x, top: tapPostition.y}]}> 
                            <Pressable onPress={() => triggerEditing(item)} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit, {backgroundColor: pressed ? '#0f470aff' : '#1f9615ff'}]}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                            </Pressable>
                            <Pressable onPress={triggerDelete} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.delete : stylesDark.delete, {backgroundColor: pressed ? '#7a1503ff' : '#be2206ff'}]}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.deleteText : stylesDark.deleteText}>Delete</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                ) : (
                    <View></View>
                )}
                {warning ? (
                    <Pressable onPress={() => setWarning(false)} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.warningContainer : stylesDark.warningContainer}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.warningText : stylesDark.warningText}>Are you sure you want to delete this person?</Text>
                            <View style={currentTheme.includes("Light") ? stylesLight.buttonContainer : stylesDark.buttonContainer}>
                                <Pressable onPress={() => deleteLog(item)} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.delete : stylesDark.delete, {backgroundColor: pressed ? '#7a1503ff' : '#be2206ff'}]}>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.deleteText : stylesDark.deleteText}>Delete</Text>
                                </Pressable>
                                <Pressable onPress={() => setWarning(false)} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.cancelText : stylesDark.cancelText}>Cancel</Text>
                                </Pressable>
                            </View>                            
                        </View>
                    </Pressable>                    
                ) : (
                    <View></View>
                )}
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
        color: "#242424",
        fontSize: 40,
        marginLeft: "auto",
        marginRight: "auto"
    },
    add: {        
        position: "absolute",
        right: "5%",
        top: "30%"                   
    },
    diaryLogContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-between",
        width: "90%",
        alignSelf: "center"
    },
    logContainer: {
        backgroundColor: "#e3e3e3",
        elevation: 5,
        borderRadius: 10,
        marginBottom: 10,
        height: 150,
        width: "45%",
    },
    logName: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 21,
        paddingLeft: 10,
        paddingTop: 8
    },
    logText: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 13,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 6
    },
    logDate: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        paddingLeft: 10,
        fontSize: 16,
        marginTop: 2
    },
    input: {
        backgroundColor: "#e3e3e3",
        color: "#242424",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5
    },
    editNameContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "10%",
        padding: 20,
        paddingTop: 40,
        backgroundColor: "#e3e3e3",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1
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
    edit: {
        backgroundColor: "#1f9615ff",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        borderRadius: 10,
    },
    editText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        fontSize: 18,
        color: '#e3e3e3'
    },
    delete: {
        backgroundColor: "#be2206ff",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    deleteText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        fontSize: 18,
        color: '#e3e3e3'
    },
    actionContainer: {
        backgroundColor: '#e3e3e3',
        padding: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    cancelText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 18
    },
    cancel: {
        backgroundColor: "#f2f2f2",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    warningContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "20%",
        padding: 20,
        backgroundColor: "#e3e3e3",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1,
    },
    warningText: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 20,
        textAlign: "center"
    },
    buttonContainer: {
        flexDirection: "row"
    },
    close: {
        position: "absolute",
        right: 10,
        top: 10,
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
    add: {        
        position: "absolute",
        right: "5%",
        top: "30%"                   
    },
    diaryLogContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-between",
        width: "90%",
        alignSelf: "center"
    },
    logContainer: {
        backgroundColor: "#2b2b2b",
        elevation: 5,
        borderRadius: 10,
        marginBottom: 10,
        height: 150,
        width: "45%",
    },
    logName: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 21,
        paddingLeft: 10,
        paddingTop: 8
    },
    logText: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 13,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 6
    },
    logDate: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        paddingLeft: 10,
        fontSize: 16,
        marginTop: 2
    },
    input: {
        backgroundColor: "#2b2b2b",
        color: "#e3e3e3",
        borderWidth: 0.5,
        borderColor: "#000000",
        borderRadius: 10,
        padding: 10,
        elevation: 5
    },
    editNameContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "10%",
        padding: 20,
        paddingTop: 40,
        backgroundColor: "#2b2b2b",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1
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
    edit: {
        backgroundColor: "#1f9615ff",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        borderRadius: 10,
    },
    editText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        fontSize: 18,
        color: '#e3e3e3'
    },
    delete: {
        backgroundColor: "#be2206ff",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    deleteText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        fontSize: 18,
        color: '#e3e3e3'
    },
    actionContainer: {
        backgroundColor: '#2b2b2b',
        padding: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    cancelText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 18
    },
    cancel: {
        backgroundColor: "#3a3a3a",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    warningContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "20%",
        padding: 20,
        backgroundColor: "#2b2b2b",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1,
    },
    warningText: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 20,
        textAlign: "center"
    },
    buttonContainer: {
        flexDirection: "row"
    },
    close: {
        position: "absolute",
        right: 10,
        top: 10,
    },
})

export default DiaryLogs;