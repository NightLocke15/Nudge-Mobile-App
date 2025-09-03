import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { Octicons } from "@react-native-vector-icons/octicons";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector, TextInput } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


function Diary(props) {
    //Id of the object that was reverted to the index in the diaryLogs
    const { id } = props;

    //Accessing user context and all the users that already exist
    const { localUserInfo, localUser, users, setUsers } = useContext(UserContext);
    const {currentTheme, gradientColours } = useContext(ThemeContext);

    //Information that is stored from this component
    const [text, setText] = useState(localUserInfo[0].logs[id].text);
    const [name, setName] = useState(localUserInfo[0].logs[id].name);

    //Boolean indicating when the log is being saved and when the name tile to edit name is being activated
    const [saving, setSaving] = useState(false);
    const [nameEdit, setNameEdit] = useState(false);

    //Router that is used to navigate the user back to the diaryLogs page
    const router = useRouter();

    const [addOptions, setAddOptions] = useState(false);
    const [action, setAction] = useState(false);
    const [tapPostition, setTapPosition] = useState({x: 0, y: 0})

    //Use effect that saves the text being written in the log 1 second after the user has stopped writing
    useEffect(() => {
        if (!text) {
            setSaving(false);
        }
        setSaving(true);

        const timeOut = setTimeout(() => {
            const usersReVamp = users.map((user, index) => {
            if (user.idnum === localUser) {
                const newLogs = user.logs;
                newLogs.splice(id, 1, {...localUserInfo[0] && localUserInfo[0].logs[id], text: text})
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
            setSaving(false);
        }, 1000)

        return () => {
            clearTimeout(timeOut);
        }

    }, [text]);

    function activateEditing() {
        setNameEdit(true);
        setAction(false);
    }

    //Edit the name of the diary entry and change it in the user's information
    function editName() {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            const newLogs = user.logs;
            newLogs.splice(id, 1, {...localUserInfo[0] && localUserInfo[0].logs[id], name: name})
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
        setNameEdit(false);
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            addImagesToLogs(result.assets[0].uri);
            setAddOptions(false);
        }
    };

    function addImagesToLogs(imageURI) {
        const userList = users.map((user) => {
            if (user.idnum === localUser) {
                const newLogs = user.logs.map((log) => {
                    if (user.logs.indexOf(log) === id) {
                        return {
                            ...log,
                            images: [...log.images, {id: uuidv4(), uri: imageURI}]
                        }
                    }
                    else {
                        return log;
                    }
                })

                return {
                    ...user,
                    logs: newLogs
                }
            }
            else {
                return user;
            }
        })

        setUsers(userList);
    }

    const doubleTap = () => Gesture.Tap().maxDuration(250).numberOfTaps(2).onStart((event) => {
            setTapPosition({x: event.absoluteX > 260 ? 260 : event.absoluteX, y: event.absoluteY > 530 ? 530 : event.absoluteY})
            setAction(true);
        }).runOnJS(true);

    return (
        <LinearGradient style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer} colors={gradientColours}>
            <View style={currentTheme.includes("Light") ? stylesLight.headerContainer : stylesDark.headerContainer}>
                <Pressable onPress={() => router.dismissTo('/logs/diaryLogs')} style={currentTheme.includes("Light") ? stylesLight.back : stylesDark.back}>
                    <Octicons name="arrow-left" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                </Pressable>  
                <View style={currentTheme.includes("Light") ? stylesLight.headingContainer : stylesDark.headingContainer}>
                    <GestureDetector gesture={Gesture.Exclusive(doubleTap())}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.header : stylesDark.header}>{localUserInfo[0].logs[id].name}</Text>
                    </GestureDetector>                        
                    <Text style={currentTheme.includes("Light") ? stylesLight.logDate : stylesDark.logDate}>{localUserInfo[0].logs[id].date}</Text>
                    <View style={currentTheme.includes("Light") ? stylesLight.save : stylesDark.save}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.saveText : stylesDark.saveText}>{saving ? "Saving..." : "Saved!"}</Text>
                    </View> 
                </View> 
                <Pressable onPress={() => setAddOptions(true)} style={currentTheme.includes("Light") ? stylesLight.add : stylesDark.add}>
                    <Octicons name="plus" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                </Pressable>            
            </View>    
            {localUserInfo[0] && localUserInfo[0].logs[id].images !== undefined ? (
                <View style={currentTheme.includes("Light") ? stylesLight.imagesContainer : stylesDark.imagesContainer}>  
                    {localUserInfo[0] && localUserInfo[0].logs[id].images.map((image) => (<Image key={image.id} source={{ uri: image.uri }} style={currentTheme.includes("Light") ? stylesLight.image : stylesDark.image} />))}
                </View>
            ) : (
                <View></View>
            )}
            
                                
            <TextInput multiline placeholder="Enter Log..." placeholderTextColor={"#9e9e9e"} value={text} onChangeText={(e) => setText(e)} style={currentTheme.includes("Light") ? stylesLight.noteInput : stylesDark.noteInput}/>
            {nameEdit ? (
                <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                    <View style={currentTheme.includes("Light") ? stylesLight.editNameContainer : stylesDark.editNameContainer}>
                        <TextInput placeholder="Name..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setName(e)} value={name} maxLength={15} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input}/>
                        <Pressable onPress={editName} style={currentTheme.includes("Light") ? stylesLight.click : stylesDark.click}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Done</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View></View>
            )}
            {addOptions ? (
                <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                    <View style={currentTheme.includes("Light") ? stylesLight.optionsContainer : stylesDark.optionsContainer}>
                        <Pressable onPress={pickImage} style={currentTheme.includes("Light") ? stylesLight.click : stylesDark.click}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Image</Text>
                        </Pressable>
                        <Pressable style={currentTheme.includes("Light") ? stylesLight.click : stylesDark.click}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Voice Note</Text>
                        </Pressable>
                        <Pressable onPress={() => setAddOptions(false)} style={currentTheme.includes("Light") ? stylesLight.click : stylesDark.click}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View></View>
            )}
            {action ? (
                <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                    <View style={[currentTheme.includes("Light") ? stylesLight.actionContainer : stylesDark.actionContainer, {position: "absolute", left: tapPostition.x, top: tapPostition.y}]}> 
                        <Pressable onPress={activateEditing} style={currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                        </Pressable>
                        <Pressable onPress={() => setAction(false)} style={currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.cancelText : stylesDark.cancelText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View></View>
            )}
        </LinearGradient>
    )
}

const stylesLight = StyleSheet.create({
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
    headingContainer: {
        marginLeft: "auto",
        marginRight: "auto"
    },
    saveText: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 20,      
        marginLeft: "auto",
        marginRight: "auto"  
    },
    logDate: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 16,
        marginTop: 2,
        marginLeft: "auto",
        marginRight: "auto"
    },
    noteInput: {
        width: "95%",
        marginLeft: "auto",
        marginRight: "auto",
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 18
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
    imagesContainer: {
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: "space-between",
        padding: 10,
    },
    image: {
        width: 175,
        height: 175,
        marginBottom: 10,
        borderRadius: 10,
    },
    add: {
        position: "absolute",
        right: "5%",
        top: "30%"
    },
    optionsContainer: {
        backgroundColor: "#e3e3e3",
        position: "absolute",
        padding: 20,
        borderRadius: 10,
        bottom: 0,
        width: "100%"
    },
    actionContainer: {
        backgroundColor: '#e3e3e3',
        padding: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
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
    cancel: {
        backgroundColor: "#f2f2f2",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    cancelText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 18
    },
});

const stylesDark = StyleSheet.create({
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
    headingContainer: {
        marginLeft: "auto",
        marginRight: "auto"
    },
    saveText: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 20,      
        marginLeft: "auto",
        marginRight: "auto"  
    },
    logDate: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 16,
        marginTop: 2,
        marginLeft: "auto",
        marginRight: "auto"
    },
    noteInput: {
        width: "95%",
        marginLeft: "auto",
        marginRight: "auto",
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 18
    },
    input: {
        backgroundColor: "#2b2b2b",
        color: "#e3e3e3",
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
    imagesContainer: {
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: "space-between",
        padding: 10,
    },
    image: {
        width: 175,
        height: 175,
        marginBottom: 10,
        borderRadius: 10,
    },
    add: {
        position: "absolute",
        right: "5%",
        top: "30%"
    },
    optionsContainer: {
        backgroundColor: "#2b2b2b",
        position: "absolute",
        padding: 20,
        borderRadius: 10,
        bottom: 0,
        width: "100%"
    },
    actionContainer: {
        backgroundColor: '#2b2b2b',
        padding: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
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
    cancel: {
        backgroundColor: "#3a3a3a",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    cancelText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 18
    },
});

export default Diary;