import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { Octicons } from "@react-native-vector-icons/octicons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector, TextInput } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { SafeAreaView } from "react-native-safe-area-context";
import { v4 as uuidv4 } from 'uuid';

function ToDoList() {
    //Accessing user context and all the users that already exist
    const { localUser, localUserInfo, users, setUsers } = useContext(UserContext);
    const {currentTheme, gradientColours } = useContext(ThemeContext);

    //Sets the boolean that activates the tile to create a new list
    const [chooseList, setChooseList] = useState(false);

    //Store the information of the list being created
    const [newListName, setNewListName] = useState("");

    //Sets the warning message for when a user tries to change the type of list when it already contains items
    const [warning, setWarning] = useState("");
    const [action, setAction] = useState(false);
    const [tapPostition, setTapPosition] = useState({x: 0, y: 0})
    const [item, setItem] = useState();

    //Router used to navigate back to the home page
    const router = useRouter();

    const [editing, setEditing] = useState(false);
    const [deleteWarning, setDeleteWarning] = useState(false);

    //Sets the state that triggers the tile to create a new list 
    function newList() {
        addList();
        setChooseList(false);   
        setNewListName("");   
    }

    //Adds the list and all it's relevant information to the user's inforation
    function addList() {
        if (newListName !== "") {
            const usersReVamp = users.map((user, index) => {
            if (user.idnum === localUser) {
                return {
                    ...user,
                    lists: [...user.lists, {id: uuidv4(), name: newListName, type: "Normal", listItems: []}]
                }
            }
            else {
                return user;
            }
            });
            setUsers(usersReVamp);
            console.log(localUserInfo[0] && localUserInfo[0].lists);
        }        
    }

    //Uses the router to dynamically navigate to the chosen list in the [id] page
    function goToList(id) {
        router.push(`/to-do-list/${id}`)
    }

    //Function that changes the chosen list's type from Normal to Timed or back
    function setType(listName) {
        const userChange = users.map((user) => {
            if (user.idnum === localUser) {
                const newUserLists = user.lists.map((list) => {
                    if (listName === list.name) {
                        if (list.listItems.length === 0) {
                            if (list.type === "Normal") {
                                return {
                                    ...list,
                                    type: "Timed"
                                }
                            }
                            else if (list.type === "Timed") {
                                return {
                                    ...list,
                                    type: "Normal"
                                }
                            }
                        }
                        else {
                            setWarning("List Type can only be changed on lists without list items.");
                            return list;
                        }
                        
                    }
                    else {
                        return list;
                    }
                })
                return {
                    ...user,
                    lists: newUserLists
                }
            }
            else {
                return user;
            }
        })

        setUsers(userChange);
    }

    //Delete the item from the user's information
    const deleteItem = (item) => {
        const userChange = users.map((user) => {
            if (user.idnum === localUser) {
                const newUserList = user.lists.filter((list) => list.id !== item.id);
                return {
                    ...user,
                    lists: newUserList
                }
            }
            else {
                return user;
            }
        });

        setUsers(userChange);
        setDeleteWarning(false);
    }

    function activateDeleting() {
        setDeleteWarning(true);
        setAction(false);
    }

    function activateEditing() {
        setEditing(true);
        setNewListName(item.name);
        setChooseList(true);
        setAction(false);
    }

    function editListName() {
         const userChange = users.map((user) => {
            if (user.idnum === localUser) {
                const newUserList = user.lists.map((list) => {
                    if (list.id === item.id) {
                        return {
                            ...list,
                            name: newListName,
                        }
                    }
                    else {
                        return list;
                    }
                })
                return {
                    ...user,
                    lists: newUserList
                }
            }
            else {
                return user;
            }
        });

        setUsers(userChange);
        setChooseList(false);  
    }

    const singleTap = (item) => Gesture.Tap().maxDuration(250).numberOfTaps(1).onStart(() => {
        goToList(item)
    }).runOnJS(true);
    const doubleTap = (item) => Gesture.Tap().maxDuration(250).numberOfTaps(2).onStart((event) => {
        setItem(item);
        setTapPosition({x: event.absoluteX > 260 ? 260 : event.absoluteX, y: event.absoluteY > 530 ? 530 : event.absoluteY})
        setAction(true);
    }).runOnJS(true);
    const longPress = (item) => Gesture.LongPress().onEnd(() => {
        setType(item)
    }).runOnJS(true);
    
    // Title: Mastering the Swipe: Building a Swipeable List App with React Native and LayoutAnimation
    // Author: William Schulte
    // Date: 27 April 2024
    // Date Accessed: 7 July 2025
    // Availability: https://medium.com/@wsvuefanatic/how-to-build-a-list-app-with-react-native-swipelistview-and-layout-animation-a3b6171faa50
    return (
        <SafeAreaView style={currentTheme.includes("Light") ? stylesLight.container : stylesDark.container}>
            <LinearGradient style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer} colors={gradientColours}>
                <View style={currentTheme.includes("Light") ? stylesLight.headerContainer : stylesDark.headerContainer}>
                    <Pressable onPress={() => router.navigate("/home")} style={currentTheme.includes("Light") ? stylesLight.back : stylesDark.back}>
                        <Octicons name="home" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                    </Pressable>
                    <Text style={currentTheme.includes("Light") ? stylesLight.header : stylesDark.header}>To-Do Lists</Text>
                    <Pressable onPress={() => setChooseList(!chooseList)} style={currentTheme.includes("Light") ? stylesLight.add : stylesDark.add}>
                        <Octicons name="plus" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                    </Pressable>
                </View>   
                <View style={currentTheme.includes("Light") ? stylesLight.headings : stylesDark.headings}>
                    <Text style={currentTheme.includes("Light") ? stylesLight.headingsTextName : stylesDark.headingsTextName}>Name</Text>
                    <Text style={currentTheme.includes("Light") ? stylesLight.headingsTextType : stylesDark.headingsTextType}>Type</Text>
                </View>   
                {localUserInfo[0] && localUserInfo[0].lists.map((list) => (
                    <GestureDetector key={list.id} gesture={Gesture.Exclusive(doubleTap(list), singleTap(list.id), longPress(list.name))}>
                        <View style={currentTheme.includes("Light") ? stylesLight.listItemContainer : stylesDark.listItemContainer}>
                            <View style={currentTheme.includes("Light") ? stylesLight.listItem : stylesDark.listItem}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.listItemName : stylesDark.listItemName}>{list.name}</Text>
                                <Text style={currentTheme.includes("Light") ? stylesLight.listItemType : stylesDark.listItemType}>{list.type}</Text>
                            </View>                            
                        </View>
                    </GestureDetector>
                ))}           
                {chooseList ? (
                    <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.addListContainer : stylesDark.addListContainer}>
                        <TextInput placeholder="Name your list..." value={newListName} placeholderTextColor="#9e9e9e" onChangeText={(e) => setNewListName(e)} maxLength={15} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                        <Pressable onPress={editing ? editListName : newList} style={currentTheme.includes("Light") ? stylesLight.done : stylesDark.done}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.doneText : stylesDark.doneText}>Done</Text>
                        </Pressable>
                        </View>
                    </View>                
                ) : (
                    <View></View>
                )}    
                {warning === "" ? (
                    <View></View>
                ) : (
                    <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.warningContainer : stylesDark.warningContainer}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.warningText : stylesDark.warningText}>{warning}</Text>
                        <Pressable onPress={() => setWarning("")} style={currentTheme.includes("Light") ? stylesLight.okay : stylesDark.okay}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.okayText : stylesDark.okayText}>Okay</Text>
                        </Pressable>
                        </View>
                    </View>                    
                )}
                {action ? (
                    <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={[currentTheme.includes("Light") ? stylesLight.actionContainer : stylesDark.actionContainer, {position: "absolute", left: tapPostition.x, top: tapPostition.y}]}> 
                            <Pressable onPress={activateEditing} style={currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                            </Pressable>
                            <Pressable onPress={activateDeleting} style={currentTheme.includes("Light") ? stylesLight.delete : stylesDark.delete}>
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
                {deleteWarning ? (
                    <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.deleteWarningContainer : stylesDark.deleteWarningContainer}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.deleteWarningText : stylesDark.deleteWarningText}>Are you sure you want to delete this list?</Text>
                            <View style={currentTheme.includes("Light") ? stylesLight.buttonContainer : stylesDark.buttonContainer}>
                                <Pressable onPress={() => deleteItem(item)} style={currentTheme.includes("Light") ? stylesLight.delete : stylesDark.delete}>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.deleteText : stylesDark.deleteText}>Delete</Text>
                                </Pressable>
                                <Pressable onPress={() => setDeleteWarning(false)} style={currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel}>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.cancelText : stylesDark.cancelText}>Cancel</Text>
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
        flex: 1,
    },
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
    input: {
        backgroundColor: "#e3e3e3",
        color: "#242424",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5
    },
    addListContainer: {
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
    warningContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "10%",
        padding: 20,
        backgroundColor: "#e3e3e3",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1,
        borderWidth: 1,
        borderColor: "#940314"
    },
    warningText: {
        fontFamily: "Roboto-Regular",
        fontSize: 20,
        color: "#940314",
        marginBottom: 10
    },
    okay: {
        backgroundColor: "#f2f2f2",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    okayText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 18
    },
    listItemContainer: {
        backgroundColor: "#e3e3e3",
        padding: 10,
        paddingTop: 15,
        paddingBottom: 15,
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        borderBottomWidth: 1,
        borderBottomColor: "#9e9e9e",   
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    listItemName: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 20,
        marginLeft: 5
    },
    listItemType: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 20,
        marginRight: 5
    },
    headings: {
        width: "100%",
        marginRight: "auto",
        marginLeft: "auto",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 0.5,
        borderBottomColor: "#9e9e9e",
        padding: 5
    },
    headingsTextName: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 25,
        marginLeft: 10
    },
    headingsTextType: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 25,
        marginRight: 10
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
    buttonContainer: {
        flexDirection: "row"
    },
    deleteWarningContainer: {
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
    deleteWarningText: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 20,
        textAlign: "center"
    },
});

const stylesDark = StyleSheet.create({
    container: {
        flex: 1,
    },
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
    input: {
        backgroundColor: "#2b2b2b",
        color: "#e3e3e3",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5
    },
    addListContainer: {
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
    warningContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "10%",
        padding: 20,
        backgroundColor: "#2b2b2b",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1,
        borderWidth: 1,
        borderColor: "#940314"
    },
    warningText: {
        fontFamily: "Roboto-Regular",
        fontSize: 20,
        color: "#940314",
        marginBottom: 10
    },
    okay: {
        backgroundColor: "#3a3a3a",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    okayText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 18
    },
    listItemContainer: {
        backgroundColor: "#2b2b2b",
        padding: 10,
        paddingTop: 15,
        paddingBottom: 15,
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        borderBottomWidth: 1,
        borderBottomColor: "#9e9e9e",   
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    listItemName: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 20,
        marginLeft: 5
    },
    listItemType: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 20,
        marginRight: 5
    },
    headings: {
        width: "100%",
        marginRight: "auto",
        marginLeft: "auto",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 0.5,
        borderBottomColor: "#9e9e9e",
        padding: 5
    },
    headingsTextName: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 25,
        marginLeft: 10
    },
    headingsTextType: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 25,
        marginRight: 10
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
    buttonContainer: {
        flexDirection: "row"
    },
    deleteWarningContainer: {
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
    deleteWarningText: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 20,
        textAlign: "center"
    },
});

export default ToDoList;