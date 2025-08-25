import { UserContext } from "@/AppContexts/UserContext";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Octicons } from "@react-native-vector-icons/octicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

function People(props) {
    //Id of the object that was reverted to the index in the peopleLogs
    const { id } = props;

    //Accessing user context and all the users that already exist
    const { localUserInfo, localUser, users, setUsers } = useContext(UserContext);

    //Router that is used to navigate the user back to the peopleLogs page
    const router = useRouter();

    //Editing information: setting the item to be edited at what element it is in the array, 
    //eg: the item is the string "Granddaughter" and the element is tre relationship.
    const [toEdit, setToEdit] = useState("")
    const [singleElement, setSingleElement] = useState("");

    //Set booleans to the correct state to edit the piece of information gived
    const [editing, setEditing] = useState(false);

    //Set boolean to add a list to a section like likes or dislikes
    const [adding, setAdding] = useState(false);

    //Set the section that will be added to when completed
    const [sectionAdding, setSectionAdding] = useState("");

    //The list that will be added into the user's information
    const [listToAdd, setListToAdd] = useState();
    const [listItem, setListItem] = useState("");
    const [currentListItem, setCurrentListItem] = useState("");

    //Text that will be saved in the user's list after added to the notes on the person's log
    const [text, setText] = useState(localUserInfo[0] && localUserInfo[0].logs[id].notes);

    //Boolean to indicate when the note is being saved
    const [saving, setSaving] = useState(false);

    //Date formatting information
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    //Use effect that saves the note a second after the user stopped writing
    useEffect(() => {
        if (!text) {
            setSaving(false);
        }

        setSaving(true);

        const timeOut = setTimeout(() => {
            const usersReVamp = users.map((user, index) => {
            if (user.idnum === localUser) {
                const newLogs = user.logs;
                newLogs.splice(id, 1, {...localUserInfo[0] && localUserInfo[0].logs[id], notes: text})
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

    //function to edit a specific element in the log
    function editSingleElement(element, editItem) {
        console.log(singleElement);
        console.log(toEdit);
        console.log(id);
        const usersReVamp = users.map((user, index) => {
            if (user.idnum === localUser) {
                const newLogs = user.logs.map((log) => {
                    if (user.logs.indexOf(log) === id) {
                        console.log("here")
                        if (editItem === "personName") {
                            return {
                                ...log,
                                personName: element
                            }
                        }
                        else if (editItem === "relationship") {
                            return {
                                ...log,
                                relationship: element
                            }
                        }
                        else if (editItem === "number") {
                            return {
                                ...log,
                                number: element
                            }
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
        });
        setUsers(usersReVamp);

        //reset information
        setSingleElement("");
        setToEdit("");
        setEditing(false);
    }

    //triggers the tile that the information is edited in
    function triggerEditing(element, editItem) {
        setEditing(true);
        setSingleElement(element);
        setToEdit(editItem);
    }

    //deletes item from a list when editing one of the section (likes, dislikes, etc) afte being touched in the editing state
    function deleteFromList(itemID) {
        setCurrentListItem(itemID);
        const newListItems = listToAdd.filter((list) => list.id !== itemID);
        setListToAdd(newListItems);    
    }

    //Adds item to independent list before adding it to the user's information
    function addListItems() {
        console.log(listToAdd);
        setListToAdd([...listToAdd, {id: uuidv4(), item: listItem}]);
        setListItem("");
    }

    //Add the list iteme for the facts or likes or dislikes to the relevant section in the user's information
    function addToList(editItem) {
        const usersReVamp = users.map((user, index) => {
            if (user.idnum === localUser) {
                const newLogs = user.logs.map((log) => {
                    if (user.logs.indexOf(log) === id) {
                        if (editItem === "likes") {
                            return {
                                ...log,
                                likes: listToAdd
                            }
                        }
                        else if (editItem === "dislikes") {
                            return {
                                ...log,
                                dislikes: listToAdd
                            }
                        }
                        else {
                            return log;
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
        });
        setUsers(usersReVamp);
        setAdding(false);
    }

    //Triggers the editing tile and also determines which section is being edited
    function triggerAdd(element) {
        setAdding(true);
        setSectionAdding(element);
        if (element === "likes") {
            setListToAdd(localUserInfo[0] && localUserInfo[0].logs[id].likes);
        }
        else if (element === "dislikes") {
            setListToAdd(localUserInfo[0] && localUserInfo[0].logs[id].dislikes);
        }
    }

    //Saves the date change in the user's information
    const onDateChange = (event, selectedDate) => {
        const currDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1 < 10 ? `0${selectedDate.getMonth() + 1}` : 
        `${selectedDate.getMonth() + 1}`}-${selectedDate.getDate() < 10 ? `0${selectedDate.getDate()}` : `${selectedDate.getDate()}`}`;
        
        const usersReVamp = users.map((user, index) => {
            if (user.idnum === localUser) {
                const newLogs = user.logs.map((log) => {
                    if (user.logs.indexOf(log) === id) {
                        return {
                            ...log,
                            birthday: currDate
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
        });
        setUsers(usersReVamp);
    }

    //Shows the calendar where the user changes the date
    const showMode = (mode) => {
        DateTimePickerAndroid.open({
            value: new Date(),
            onChange: onDateChange,
            mode: mode,
            is24Hour: true
        })
    }

    //sets what type of date picker should be shown
    const showDatePicker = () => {
        showMode("date")
    }

    return (
        <LinearGradient style={stylesLight.contentContainer} colors={["#e3e3e3", "#aaaaaa"]}>            
            <View style={stylesLight.headerContainer}>
                <Pressable onPress={() => router.dismissTo("/logs/peopleLogs")} style={stylesLight.back}>
                    <Octicons name="arrow-left" size={25} color={'#585858'}/>
                </Pressable>
                <Text style={stylesLight.header}>{localUserInfo[0] && localUserInfo[0].logs[id].personName}</Text>
            </View>
            <ScrollView>
                <Image source={require('../app/images/photo.png')} style={stylesLight.peoplePhoto}/>
                <View style={stylesLight.infoContainer}>
                    <Text style={stylesLight.heading}>Name: </Text>
                    <View style={stylesLight.miniContainer}>
                        <Text style={stylesLight.text}>{localUserInfo[0] && localUserInfo[0].logs[id].personName}</Text>
                        <Pressable onPress={() => triggerEditing(localUserInfo[0] && localUserInfo[0].logs[id].personName, "personName")} style={stylesLight.clickOther}>
                            <Text>Edit</Text>
                        </Pressable>
                    </View>                
                    <Text style={stylesLight.heading}>Relationship: </Text>
                    <View style={stylesLight.miniContainer}>
                        <Text style={stylesLight.text}>{localUserInfo[0] && localUserInfo[0].logs[id].relationship}</Text>
                        <Pressable onPress={() => triggerEditing(localUserInfo[0] && localUserInfo[0].logs[id].relationship, "relationship")} style={stylesLight.clickOther}>
                            <Text>Edit</Text>
                        </Pressable>
                    </View>                
                    <Text style={stylesLight.heading}>Birthday: </Text> 
                    <View style={stylesLight.miniContainer}>
                        <Text style={stylesLight.text}>{localUserInfo[0] && localUserInfo[0].logs[id].birthday === "" ? "" : `${localUserInfo[0].logs[id].birthday.substring(8)} ${month[localUserInfo[0].logs[id].birthday.substring(6,7) - 1]}`}</Text>
                        <Pressable onPress={showDatePicker} style={stylesLight.clickOther}>
                            <Text>Edit</Text>
                        </Pressable>
                    </View>    
                    <Text style={stylesLight.heading}>Number:</Text>
                    <View style={stylesLight.miniHeaderContainer}>
                        <Text style={stylesLight.text}>{localUserInfo[0] && localUserInfo[0].logs[id].number}</Text>
                        <Pressable onPress={() => triggerEditing(localUserInfo[0] && localUserInfo[0].logs[id].number, "number")} style={stylesLight.clickOther}>
                            <Text>Edit</Text>
                        </Pressable>
                    </View>
                    <View style={stylesLight.miniHeaderContainer}>
                        <Text style={stylesLight.heading}>Likes: </Text>
                        <Pressable onPress={() => triggerAdd("likes")} style={stylesLight.clickOther}>
                            <Text>Edit</Text>
                        </Pressable>
                    </View>    
                    {localUserInfo[0] && localUserInfo[0].logs[id].likes.map((like) => (
                        <View key={like.id}>
                            <Text style={[stylesLight.text, {marginBottom: 10}]}>- {like.item}</Text>
                        </View>
                    ))}   
                    <View style={stylesLight.miniHeaderContainer}>
                        <Text style={stylesLight.heading}>Dislikes: </Text>
                        <Pressable onPress={() => triggerAdd("dislikes")} style={stylesLight.clickOther}>
                            <Text>Edit</Text>
                        </Pressable>
                    </View>                
                    {localUserInfo[0] && localUserInfo[0].logs[id].dislikes.map((like) => (
                        <View key={like.id}>
                            <Text style={[stylesLight.text, {marginBottom: 10}]}>- {like.item}</Text>
                        </View>
                    ))} 
                    <Text style={stylesLight.heading}>Notes: </Text>
                    <TextInput placeholder="Add a Note..." placeholderTextColor="#9e9e9e" multiline value={text} onChangeText={(e) => setText(e)} />
                </View>                  
            </ScrollView>
            {editing ? (
                <View style={stylesLight.overLay}>
                    <View style={stylesLight.editContainer}>
                        <TextInput  placeholder="Type..." placeholderTextColor="#9e9e9e" value={singleElement} onChangeText={(e) => setSingleElement(e)} style={stylesLight.input}/>
                        <Pressable onPress={() => editSingleElement(singleElement, toEdit)} style={stylesLight.click}>
                            <Text style={stylesLight.clickText}>Done</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View></View>
            )}   
            {adding ? (
                <View style={stylesLight.overLay}>
                    <View style={stylesLight.editContainer}>
                        {listToAdd && listToAdd.map((like) => (
                            <View key={like.id}>
                                <View>
                                    <Text style={[stylesLight.text, {marginBottom: 10}]}>- {like.item}</Text>
                                </View>
                                <Pressable onPress={() => deleteFromList(like.id)}>
                                    <Text>Delete</Text>
                                </Pressable>
                            </View>
                        ))} 
                        <View style={stylesLight.addContainer}>
                            <TextInput  placeholder="Type..." placeholderTextColor="#9e9e9e" multiline value={listItem} onChangeText={(e) => setListItem(e)} style={[stylesLight.input, {width: "80%"}]}/>
                            <Pressable onPress={addListItems}>
                                <Text style={[stylesLight.clickText, stylesLight.click]}>Add</Text>
                            </Pressable>
                        </View>                        
                        <Pressable onPress={() => addToList(sectionAdding)} style={stylesLight.click}>
                            <Text style={stylesLight.clickText}>Done</Text>
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
        flex: 1,
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
        marginRight: "auto"
    },
    peoplePhoto: {
        height: 150,
        width: 150,
        borderRadius: 75,
        marginLeft: "auto",
        marginRight: "auto",
    },
    heading: {
        fontFamily: "PTSans-Regular",
        fontSize: 22,
        marginBottom: 5
    },
    infoContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10
    },
    miniContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    text: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
    },
    miniHeaderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    editContainer: {
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
    clickOther: {
        backgroundColor: "#f0f0f0",
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        elevation: 5,
        borderRadius: 15,
        marginBottom: 10
    },
    clickText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        fontSize: 15
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        marginBottom: 10,
    },
    addContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
})

export default People;