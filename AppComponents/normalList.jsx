import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { Octicons } from "@react-native-vector-icons/octicons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector, TextInput } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

function NormalList(props) {
    //Id of the object that was reverted to the index in the diaryLogs
    const { id } = props;

    //Accessing user context and all the users that already exist
    const { setUsers, users, localUserInfo, localUser } = useContext(UserContext); 
    const {currentTheme, gradientColours } = useContext(ThemeContext);

    //Information that is stored from this component
    const [listItem, setListItem] = useState("");
    const [listItemID, setlistItemID] = useState();

    //Set the state of editing to trigger the editing tile for the list item
    const [editing, setEditing] = useState(false);
    const [item, setItem] = useState();
    const [action, setAction] = useState(false);
    const [tapPostition, setTapPosition] = useState({x: 0, y: 0})

    //Router used to take the user back to the to-do-list page
    const router = useRouter();

    //Add a list item to the user's list
    function addItem() {
        const userListAddision = users.map((user) => {
            if (user.idnum === localUser) {
                const newUserLists = user.lists.map((list) => {
                    if (list.name === localUserInfo[0].lists[id].name) {
                        return {
                            ...list,
                            listItems: [...list.listItems, {id: uuidv4(), item: listItem, completed: false}]
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
        setUsers(userListAddision);
        setListItem("");
    }

    //Delete the item from the user's information
    const deleteItem = (item) => {
        const userChange = users.map((user) => {
            if (user.idnum === localUser) {
                const newUserLists = user.lists.map((list) => {
                    if (list.name === localUserInfo[0].lists[id].name) {
                        const newListItems = list.listItems.filter((listItem) => listItem.id !== item.id);
                        return {
                            ...list,
                            listItems: newListItems
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
        setAction(false)
    }

    //Trigger the editing of the item and set all the relevant information to be edited
    const editItem = (item) => {
        setEditing(true);
        setListItem(item.item);
        setlistItemID(item.id);
        setAction(false)
    }

    //Replace the item in the relevant index in the user's list
    function finishEdit() {
        const userChange = users.map((user) => {
            if (user.idnum === localUser) {
                const newUserLists = user.lists.map((list) => {
                    if (list.name === localUserInfo[0].lists[id].name) {
                        const newListItems = list.listItems;
                        console.log(list.listItems);
                        newListItems.splice(list.listItems.findIndex((item) => item.id === listItemID), 1, {...list.listItems[list.listItems.findIndex((item) => item.id === listItemID)], item: listItem});
                        console.log(newListItems);
                        return {
                            ...list,
                            listItems: newListItems
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
        setListItem("");
        setlistItemID(null);
        setEditing(false);
    }

    //When pressing the item for a longer period the item is striked through, and completed in the list saved for the user
    function completeListItem(itemID) {
        const userChange = users.map((user) => {
            if (user.idnum === localUser) {
                const newUserLists = user.lists.map((list) => {
                    if (list.name === localUserInfo[0].lists[id].name) {
                        const newListItems = list.listItems.map((listItem) => {
                            if (listItem.id === itemID) {
                                return {
                                    ...listItem,
                                    completed: true
                                }
                            }
                            else {
                                return listItem;
                            }
                        })
                        return {
                            ...list,
                            listItems: newListItems
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

    const doubleTap = (item) => Gesture.Tap().maxDuration(250).numberOfTaps(2).onStart((event) => {
        setItem(item);
        setTapPosition({x: event.absoluteX , y: event.absoluteY})
        setAction(true);
    }).runOnJS(true);
    const longPress = (item) => Gesture.LongPress().onEnd(() => completeListItem(item.id)).runOnJS(true);
    
    return (        
        <LinearGradient style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer} colors={gradientColours}>
            <View style={currentTheme.includes("Light") ? stylesLight.headerContainer : stylesDark.headerContainer}>
                <Pressable onPress={() => router.dismissTo("/to-do-list/to-do-list")} style={currentTheme.includes("Light") ? stylesLight.back : stylesDark.back}>
                    <Octicons name="arrow-left" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                </Pressable>
                <Text style={currentTheme.includes("Light") ? stylesLight.header : stylesDark.header}>{localUserInfo[0].lists[id].name}</Text>
            </View>   
            <View style={currentTheme.includes("Light") ? stylesLight.addContainer : stylesDark.addContainer}>
                <TextInput placeholder="Add List Item..." placeholderTextColor="#9e9e9e" value={listItem} onChangeText={(e) => setListItem(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input}/>
                <Pressable onPress={editing ? finishEdit : addItem}  style={currentTheme.includes("Light") ? stylesLight.add : stylesDark.add}>
                    {editing ? <Octicons name="check" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/> : <Octicons name="plus" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>}
                </Pressable>
            </View>   
            {localUserInfo[0].lists[id] && localUserInfo[0].lists[id].listItems.map((item) => (
                <GestureDetector key={item.id} gesture={Gesture.Exclusive(doubleTap(item), longPress(item))}>
                    <View key={item.id} style={currentTheme.includes("Light") ? stylesLight.listItemContainer : stylesDark.listItemContainer}>
                        <Octicons style={currentTheme.includes("Light") ? stylesLight.check : stylesDark.check} name={item.completed ? "check-circle" : "circle"} size={20} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                        <Text style={item.completed ? (currentTheme.includes("Light") ? stylesLight.listItemNameComplete : stylesDark.listItemNameComplete) : (currentTheme.includes("Light") ? stylesLight.listItemNameUncomplete : stylesDark.listItemNameUncomplete)}>{item.item}</Text>                
                    </View>
                </GestureDetector>
            ))}
            {action ? (
                <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                    <View style={[currentTheme.includes("Light") ? stylesLight.actionContainer : stylesDark.actionContainer, {position: "absolute", left: tapPostition.x, top: tapPostition.y}]}> 
                        <Pressable onPress={() => editItem(item)} style={currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                        </Pressable>
                        <Pressable onPress={() => deleteItem(item)} style={currentTheme.includes("Light") ? stylesLight.delete : stylesDark.delete}>
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
    )
}

const stylesLight = StyleSheet.create({
    contentContainer: {
        flex: 1,
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
    back: {
        position: "absolute",
        left: "5%",
        top: "30%"        
    },
    addContainer: {
        width: "95%",
        marginLeft: "auto",
        marginRight: "auto",
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 10
    },
    input: {
        backgroundColor: "#e3e3e3",
        color: "#242424",
        borderWidth: 0.5,
        borderColor: "#2b2b2b",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        flex: 10,
    },
    add: {
        flex: 1,
        marginLeft: 10,
        padding: 10,
        borderRadius: 10,
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
        flexDirection: "row"
    },
    listItemNameUncomplete: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 20,
        marginLeft: 5
    },
    listItemNameComplete: {
        fontFamily: "Roboto-Regular",
        fontSize: 20,
        marginLeft: 5,
        color: "#818181",
        textDecorationLine: "line-through",
    },
    hiddenContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly"
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
    overLay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        flex: 1,
        backgroundColor: "rgba(139, 139, 139, 0.5)"
    },
    actionContainer: {
        backgroundColor: '#e3e3e3',
        padding: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
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
    check: {
        marginTop: "auto",
        marginBottom: "auto"
    }
})

const stylesDark = StyleSheet.create({
    contentContainer: {
        flex: 1,
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
    back: {
        position: "absolute",
        left: "5%",
        top: "30%"        
    },
    addContainer: {
        width: "95%",
        marginLeft: "auto",
        marginRight: "auto",
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 10
    },
    input: {
        backgroundColor: "#2b2b2b",
        borderWidth: 0.5,
        borderColor: "#000000",
        color: "#e3e3e3",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        flex: 10,
    },
    add: {
        flex: 1,
        marginLeft: 10,
        padding: 10,
        borderRadius: 10,
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
        flexDirection: "row"
    },
    listItemNameUncomplete: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 20,
        marginLeft: 5
    },
    listItemNameComplete: {
        fontFamily: "Roboto-Regular",
        fontSize: 20,
        marginLeft: 5,
        color: "#818181",
        textDecorationLine: "line-through",
    },
    hiddenContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly"
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
    overLay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        flex: 1,
        backgroundColor: "rgba(139, 139, 139, 0.5)"
    },
    actionContainer: {
        backgroundColor: '#2b2b2b',
        padding: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
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
    check: {
        marginTop: "auto",
        marginBottom: "auto"
    }
})

export default NormalList;
