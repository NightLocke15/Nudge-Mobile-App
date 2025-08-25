import { UserContext } from "@/AppContexts/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";
import { v4 as uuidv4 } from 'uuid';

function PeopleLogs() {
    //Accessing user context and all the users that already exist
    const { users, setUsers, localUserInfo, localUser } = useContext(UserContext);
    const [currentItemID, setCurrentItemID] = useState(0);

    //Router used to navigate back to the home page as well as navigate to the specific log chosen
    const router = useRouter();

    //setting the state of person addition in order to trigger the add people tile
    const [addPerson, setAddPerson] = useState(false);

    //Store the information of the person being added
    const [personName, setPersonName] = useState("");
    const [personRelationship, setPersonRelationship] = useState("");    

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
                    logs: [...user.logs, {id: uuidv4(), personName: personName, relationship: personRelationship, number: "", birthday: "", likes: [], dislikes: [], type: "People", notes: ""}]
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
        console.log(localUserInfo[0] && localUserInfo[0].logs.filter((log) => log.type === "People"));
    }

    //Uses the router to dynamically navigate to the person chosen's information in the [id] page
    function goToPerson(id) {
        router.push(`/logs/${id}`);
    }

    //Function that changes the state of the warning when trying to delete a log item
    function deleteWarning(item) {
        setWarning(true);
        setCurrentItemID(item.id);
    }

    //Triggers the editing of the log item and sets the relevant information to be edited
    function triggerEditing(item) {
        setPersonName(item.personName);
        setPersonRelationship(item.relationship);
        setCurrentItemID(item.id);
        console.log(item.id);
        setEditing(true);
        setAddPerson(true);
    }

    //Renders the person log in the swipe list view ***(Subject to change, looking into options other than swiping)***
    const renderPeople = ({item}) => {
        return (
            <Pressable key={item.id} onPress={() => goToPerson(item.id)}>
                <View style={stylesLight.peopleContainer}>
                    <Image source={require('../images/photo.png')} style={stylesLight.peoplePhoto}/>
                    <View style={stylesLight.infoContainer}>
                        <Text style={stylesLight.name}>{item.personName}</Text>
                        <Text style={stylesLight.relationship}>{item.relationship}</Text>
                    </View>                
                </View>
            </Pressable>            
        ) 
    }

    //Rendering of hidden button behind tile that deletes the log and on the other side it edits it ***(Subject to change, looking into options other than swiping)***
    const hiddenRender = (data, rowmap) => {
        return (
            <View style={stylesLight.hiddenItems}>
                <Pressable style={stylesLight.deleteContainer} onPress={() => deleteWarning(data.item)}>
                    <Text style={stylesLight.deleteText}>Delete</Text>
                </Pressable>
                <Pressable style={stylesLight.editContainer} onPress={() => triggerEditing(data.item)}>
                    <Text style={stylesLight.editText}>Edit</Text>
                </Pressable>
            </View>
        )
    }

    //Delete the item from the user's information
    const deleteItem = (itemID) => {
        const usersReVamp = users.map((user, index) => {
            if (user.idnum === localUser) {
                const newLogs = user.logs.filter((log) => log.id !== itemID);
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
    const editItem = (itemID) => {
        const usersReVamp = users.map((user, index) => {
            if (user.idnum === localUser) {
                const newLogs = user.logs;
                newLogs.splice(itemID, 1, {...user.logs[user.logs.findIndex((log) => log.id === itemID)], personName: personName, relationship: personRelationship});
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

    return (
        <SafeAreaView style={stylesLight.container}>
            <LinearGradient colors={["#ffffff", "#aaaaaa"]} style={stylesLight.contentContainer}>
                <View style={stylesLight.headerContainer}>
                    <Pressable onPress={() => router.navigate("/home")} style={stylesLight.back}>
                        <Text style={stylesLight.backText}>Home</Text>
                    </Pressable>
                    <Text style={stylesLight.header}>PEOPLE</Text>
                    <Pressable onPress={() => setAddPerson(true)}  style={stylesLight.add}>
                        <Text style={stylesLight.addIcon}>Add</Text>
                    </Pressable>
                </View>
                <SwipeListView data={localUserInfo[0] && localUserInfo[0].logs.filter((log) => log.type === "People")} 
                    renderItem={renderPeople} 
                    renderHiddenItem={hiddenRender}
                    rightOpenValue={-100}
                    leftOpenValue={100}
                />
                {addPerson ? (
                    <View style={stylesLight.overLay}>
                        <View style={stylesLight.addPersonContainer}>
                            <Text style={stylesLight.heading}>Person Name:</Text>
                            <TextInput placeholder="Name..." placeholderTextColor="#9e9e9e" value={personName} onChangeText={(e) => setPersonName(e)} style={stylesLight.input} />
                            <Text style={stylesLight.heading}>Relationship:</Text>
                            <TextInput placeholder="Relationship..." placeholderTextColor="#9e9e9e" value={personRelationship} onChangeText={(e) => setPersonRelationship(e)} style={stylesLight.input} />
                            <Pressable onPress={!editing ? addPersonBasicDetails : () => editItem(currentItemID)} style={stylesLight.click}>
                                <Text style={stylesLight.clickText}>Done</Text>
                            </Pressable>
                        </View>
                    </View>                    
                ) : (
                    <View></View>
                )}
                {warning ? (
                    <View style={stylesLight.overLay}>
                        <View style={stylesLight.warningContainer}>
                            <Text style={stylesLight.warningText}>Are you sure you want to delete this person?</Text>
                            <View style={stylesLight.buttonContainer}>
                                <Pressable onPress={() => deleteItem(currentItemID)} style={stylesLight.deleteButt}>
                                    <Text style={stylesLight.deleteButtText}>Delete</Text>
                                </Pressable>
                                <Pressable onPress={() => setWarning(false)} style={stylesLight.click}>
                                    <Text style={stylesLight.clickText}>Cancel</Text>
                                </Pressable>
                            </View>                            
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
    backText: {
        fontFamily: "Economica-Bold",
        fontSize: 20,         
    },
    headerContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    header: {
        fontFamily: "Economica-Bold",
        fontSize: 40,
        marginLeft: "auto",
        marginRight: "auto"
    },
    add: {        
        position: "absolute",
        right: "5%",
        top: "30%"                   
    },
    addIcon: {
        fontFamily: "Economica-Bold",
        fontSize: 20,        
    },
    peopleContainer: {
        backgroundColor: "#f0f0f0",
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
    infoContainer: {
        marginLeft: 10
    },
    name: {
        fontFamily: "Economica-Bold",
        fontSize: 30,
        marginTop: 10
    },
    relationship: {
        fontFamily: "Sunflower-Light",
        fontSize: 18,
        marginTop: 5,
    },
    editContainer: {
        backgroundColor: "#039464ff",
        height: 110,
         width: "50%",
    },
    editText: {
        fontFamily: "Sunflower-Light",
        color: "#fff",
        fontSize: 20,
        textAlign: "right",
        marginRight: 10,
        marginTop: 45
    },
    deleteContainer: {
        backgroundColor: "#940314",
        height: 110,
        width: "50%",
    },
    deleteText: {
        fontFamily: "Sunflower-Light",
        color: "#fff",
        fontSize: 20,
        marginLeft: 10,
        marginTop: 45
    },
    hiddenItems: {
        flexDirection: "row"
    },
    input: {
        backgroundColor: "#fff",
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
        backgroundColor: "#fff",
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
        backgroundColor: "#f0f0f0",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        borderRadius: 10,
    },
    clickText: {
        textAlign: "center",
        fontFamily: "Sunflower-Light",
        fontSize: 15
    },
    warningContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "20%",
        padding: 20,
        backgroundColor: "#fff",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1,
    },
    warningText: {
        fontFamily: "Sunflower-Light",
        fontSize: 20,
        textAlign: "center"
    },
    buttonContainer: {
        flexDirection: "row"
    },
    heading: {
        fontFamily: "Economica-Bold",
        fontSize: 20,
        marginBottom: 5
    },
    click: {
        backgroundColor: "#f0f0f0",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    clickText: {
        textAlign: "center",
        fontFamily: "Sunflower-Light",
        fontSize: 18
    },
    deleteButt: {
        backgroundColor: "#940314",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    deleteButtText: {
        textAlign: "center",
        fontFamily: "Sunflower-Light",
        fontSize: 18,
        color: "#fff"
    },
});

export default PeopleLogs;