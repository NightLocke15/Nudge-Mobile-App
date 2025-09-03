import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { Octicons } from "@react-native-vector-icons/octicons";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector, TextInput } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { SafeAreaView } from "react-native-safe-area-context";
import { v4 as uuidv4 } from 'uuid';

function PeopleLogs() {
    //Accessing user context and all the users that already exist
    const { users, setUsers, localUserInfo, localUser } = useContext(UserContext);
    const {currentTheme, gradientColours } = useContext(ThemeContext);

    //Router used to navigate back to the home page as well as navigate to the specific log chosen
    const router = useRouter();

    //setting the state of person addition in order to trigger the add people tile
    const [addPerson, setAddPerson] = useState(false);

    //Store the information of the person being added
    const [personName, setPersonName] = useState("");
    const [personRelationship, setPersonRelationship] = useState("");   
    const [image, setImage] = useState(""); 
    const [item, setItem] = useState();
    const [action, setAction] = useState(false);
    const [tapPostition, setTapPosition] = useState({x: 0, y: 0})

    //Warning boolean that activates a warning tile when trying to delete a log (Experimental: Will most likely add this to other logs as well)
    const [warning, setWarning] = useState(false);
    
    //Setting editiding state that activates the editing tile
    const [editing, setEditing] = useState(false);

    //Adds the person's name and relationship aswell as creates space for the rest of the information that can be added within the log
    function addPersonBasicDetails() {
        const usersReVamp = users.map((user, index) => {
            if (user.idnum === localUser) {
                return {
                    ...user,
                    logs: [...user.logs, {id: uuidv4(), personName: personName, relationship: personRelationship, image: image, number: "", birthday: "", likes: [], dislikes: [], type: "People", notes: ""}]
                }
            }
            else {
                return user;
            }
        });
        setUsers(usersReVamp);

        //reset information
        setPersonName("");
        setPersonRelationship("");
        setAddPerson(false);
        setImage("");
    }

    //Uses the router to dynamically navigate to the person chosen's information in the [id] page
    function goToPerson(id) {
        router.push(`/logs/${id}`);
    }

    //Function that changes the state of the warning when trying to delete a log item
    function deleteWarning() {
        setWarning(true);
        setAction(false);
    }

    //Triggers the editing of the log item and sets the relevant information to be edited
    function triggerEditing(item) {
        setPersonName(item.personName);
        setPersonRelationship(item.relationship);
        setImage(item.image);
        setEditing(true);
        setAddPerson(true);
        setAction(false);
    }

    //Delete the item from the user's information
    const deleteItem = (item) => {
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

    //Edits the item and replaces the original that needs to be changed at the correct index
    const editItem = (item) => {
        const usersReVamp = users.map((user, index) => {
            if (user.idnum === localUser) {
                const newLogs = user.logs;
                newLogs.splice(user.logs.findIndex((log) => log.id === item.id), 1, {...user.logs[user.logs.findIndex((log) => log.id === item.id)], personName: personName, relationship: personRelationship, image: image});
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

        //reset information
        setEditing(false);
        setAddPerson(false);
        setPersonName("");
        setPersonRelationship("");
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const singleTap = (item) => Gesture.Tap().maxDuration(250).numberOfTaps(1).onStart(() => {
        goToPerson(item)
    }).runOnJS(true);
    const doubleTap = (item) => Gesture.Tap().maxDuration(250).numberOfTaps(2).onStart((event) => {
        setItem(item);
        setTapPosition({x: event.absoluteX > 260 ? 260 : event.absoluteX, y: event.absoluteY > 530 ? 530 : event.absoluteY})
        setAction(true);
    }).runOnJS(true);

    return (
        <SafeAreaView style={currentTheme.includes("Light") ? stylesLight.container : stylesDark.container}>
            <LinearGradient colors={gradientColours} style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer}>
                <View style={currentTheme.includes("Light") ? stylesLight.headerContainer : stylesDark.headerContainer}>
                    <Pressable onPress={() => router.navigate("/home")} style={currentTheme.includes("Light") ? stylesLight.back : stylesDark.back}>
                        <Octicons name="home" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                    </Pressable>
                    <Text style={currentTheme.includes("Light") ? stylesLight.header : stylesDark.header}>People</Text>
                    <Pressable onPress={() => setAddPerson(true)}  style={currentTheme.includes("Light") ? stylesLight.add : stylesDark.add}>
                        <Octicons name="plus" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                    </Pressable>
                </View>
                {localUserInfo[0] && localUserInfo[0].logs.filter((log) => log.type === "People").map((person) => (
                    <GestureDetector key={person.id} gesture={Gesture.Exclusive(doubleTap(person), singleTap(person.id))}>
                        <View style={currentTheme.includes("Light") ? stylesLight.peopleContainer : stylesDark.peopleContainer}>
                            <Image source={{uri: person.image}} style={currentTheme.includes("Light") ? stylesLight.peoplePhoto : stylesDark.peoplePhoto}/>
                            <View style={currentTheme.includes("Light") ? stylesLight.infoContainer : stylesDark.infoContainer}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.name : stylesDark.name}>{person.personName}</Text>
                                <Text style={currentTheme.includes("Light") ? stylesLight.relationship : stylesDark.relationship}>{person.relationship}</Text>
                            </View>                
                        </View>
                    </GestureDetector>
                ))}
                {addPerson ? (
                    <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.addPersonContainer : stylesDark.addPersonContainer}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.heading : stylesDark.heading}>Person Name:</Text>
                            <TextInput placeholder="Name..." placeholderTextColor="#9e9e9e" value={personName} onChangeText={(e) => setPersonName(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Text style={currentTheme.includes("Light") ? stylesLight.heading : stylesDark.heading}>Relationship:</Text>
                            <TextInput placeholder="Relationship..." placeholderTextColor="#9e9e9e" value={personRelationship} onChangeText={(e) => setPersonRelationship(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <View>
                                {image !== "" ? <Image source={{uri: image}} style={currentTheme.includes("Light") ? stylesLight.peoplePhotoChoose : stylesDark.peoplePhotoChoose}/> : <View></View>}
                                <Pressable onPress={pickImage} style={currentTheme.includes("Light") ? stylesLight.click : stylesDark.click}>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>{image === "" ? "Add Photo" : "Change Photo"}</Text>
                                </Pressable>
                            </View>                            
                            <Pressable onPress={!editing ? addPersonBasicDetails : () => editItem(item)} style={currentTheme.includes("Light") ? stylesLight.click : stylesDark.click}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Done</Text>
                            </Pressable>
                        </View>
                    </View>                    
                ) : (
                    <View></View>
                )}
                {warning ? (
                    <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.warningContainer : stylesDark.warningContainer}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.warningText : stylesDark.warningText}>Are you sure you want to delete this person?</Text>
                            <View style={currentTheme.includes("Light") ? stylesLight.buttonContainer : stylesDark.buttonContainer}>
                                <Pressable onPress={() => deleteItem(item)} style={currentTheme.includes("Light") ? stylesLight.delete : stylesDark.delete}>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.deleteText : stylesDark.deleteText}>Delete</Text>
                                </Pressable>
                                <Pressable onPress={() => setWarning(false)} style={currentTheme.includes("Light") ? stylesLight.click : stylesDark.click}>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Cancel</Text>
                                </Pressable>
                            </View>                            
                        </View>
                    </View>                    
                ) : (
                    <View></View>
                )}
                {action ? (
                    <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={[currentTheme.includes("Light") ? stylesLight.actionContainer : stylesDark.actionContainer, {position: "absolute", left: tapPostition.x, top: tapPostition.y}]}> 
                            <Pressable onPress={() => triggerEditing(item)} style={currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                            </Pressable>
                            <Pressable onPress={() => deleteWarning(item)} style={currentTheme.includes("Light") ? stylesLight.delete : stylesDark.delete}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.deleteText : stylesDark.deleteText}>Delete</Text>
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
        </SafeAreaView>
    )
}

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
    peopleContainer: {
        backgroundColor: "#e3e3e3",
        padding: 20,
        paddingTop: 15,
        paddingBottom: 15,
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        borderBottomWidth: 1,
        borderBottomColor: "#9e9e9e", 
        flexDirection: "row",
        height: 110
    },
    peoplePhoto: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "#323232"
    },
    peoplePhotoChoose: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "#323232",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 5,
        marginBottom: 5
    },
    infoContainer: {
        marginLeft: 10
    },
    name: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 30,
        marginTop: 10
    },
    relationship: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 18,
        marginTop: 5,
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
    input: {
        backgroundColor: "#e3e3e3",
        color: "#242424",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        marginBottom: 5,
    },
    addPersonContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "10%",
        padding: 20,
        backgroundColor: "#e3e3e3",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1,
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
        borderRadius: 10,
    },
    clickText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 15
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
    heading: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 20,
        marginBottom: 5
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
    add: {        
        position: "absolute",
        right: "5%",
        top: "30%"                   
    },
    peopleContainer: {
        backgroundColor: "#2b2b2b",
        padding: 20,
        paddingTop: 15,
        paddingBottom: 15,
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        borderBottomWidth: 1,
        borderBottomColor: "#9e9e9e", 
        flexDirection: "row",
        height: 110
    },
    peoplePhoto: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "#9e9e9e"
    },
    peoplePhotoChoose: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "#9e9e9e",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 5,
        marginBottom: 5
    },
    infoContainer: {
        marginLeft: 10
    },
    name: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 30,
        marginTop: 10
    },
    relationship: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 18,
        marginTop: 5,
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
    input: {
        backgroundColor: "#2b2b2b",
        color: "#e3e3e3",
        borderWidth: 0.5,
        borderColor: "#000000",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        marginBottom: 5,
    },
    addPersonContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "10%",
        padding: 20,
        backgroundColor: "#2b2b2b",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1,
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
        borderRadius: 10,
    },
    clickText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 15
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
    heading: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 20,
        marginBottom: 5
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

export default PeopleLogs;