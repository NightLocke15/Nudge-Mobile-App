import { UserContext } from "@/AppContexts/UserContext";
import { Octicons } from "@react-native-vector-icons/octicons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { SwipeListView } from "react-native-swipe-list-view";
import { v4 as uuidv4 } from 'uuid';

function NormalList(props) {
    //Id of the object that was reverted to the index in the diaryLogs
    const { id } = props;

    //Accessing user context and all the users that already exist
    const { setUsers, users, localUserInfo, localUser } = useContext(UserContext); 

    //Information that is stored from this component
    const [listItem, setListItem] = useState("");
    const [listItemID, setlistItemID] = useState();

    //Set the state of editing to trigger the editing tile for the list item
    const [editing, setEditing] = useState(false);

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

    //Renders the list item in the swipe list view ***(Subject to change, looking into options other than swiping)***
    const itemRendered = ({item}) => {
        return (
            <View key={item.id} style={stylesLight.listItemContainer}>
                <Pressable onLongPress={() => completeListItem(item.id)}>
                    <Text style={item.completed ? stylesLight.listItemNameComplete : stylesLight.listItemNameUncomplete}>{item.item}</Text>
                </Pressable>                
            </View>
        )
    }
    
    //Rendering of hidden button behind tile that deletes the log and on the other side it edits it ***(Subject to change, looking into options other than swiping)***
    const hiddenItemRendered = (data, rowMap) => {
        return (
            <View style={stylesLight.hiddenContainer}>
                <Pressable onPress={() => deleteItem(data.item)} style={stylesLight.deleteContainer}>
                    <Text style={stylesLight.delete}>Delete</Text>
                </Pressable>
                <Pressable onPress={() => editItem(data.item)} style={stylesLight.editContainer}>
                    <Text style={stylesLight.edit}>Edit</Text>
                </Pressable>                
            </View>
        )       
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
    }

    //Trigger the editing of the item and set all the relevant information to be edited
    const editItem = (item) => {
        setEditing(true);
        setListItem(item.item);
        setlistItemID(item.id);
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
    
    return (        
        <LinearGradient style={stylesLight.contentContainer} colors={["#e3e3e3", "#aaaaaa"]}>
            <View style={stylesLight.headerContainer}>
                <Pressable onPress={() => router.dismissTo("/to-do-list/to-do-list")} style={stylesLight.back}>
                    <Octicons name="arrow-left" size={25} color={'#585858'}/>
                </Pressable>
                <Text style={stylesLight.header}>{localUserInfo[0].lists[id].name}</Text>
            </View>   
            <View style={stylesLight.addContainer}>
                <TextInput placeholder="Add List Item..." placeholderTextColor="#9e9e9e" value={listItem} onChangeText={(e) => setListItem(e)} style={stylesLight.input}/>
                <Pressable onPress={editing ? finishEdit : addItem}  style={stylesLight.add}>
                    {editing ? <Octicons name="check" size={25} color={'#585858'}/> : <Octicons name="plus" size={25} color={'#585858'}/>}
                </Pressable>
            </View>   
            <SwipeListView data={localUserInfo[0].lists[id] && localUserInfo[0].lists[id].listItems} 
                renderItem={itemRendered} 
                renderHiddenItem={hiddenItemRendered} 
                leftOpenValue={100} 
                rightOpenValue={-100} />  
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
        fontSize: 40,
        marginLeft: "auto",
        marginRight: "auto"
    },
    back: {
        position: "absolute",
        left: "5%",
        top: "30%"        
    },
    backText: {
        fontFamily: "PTSans-Regular",
        fontSize: 20,         
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
        backgroundColor: "#f2f2f2",
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
        backgroundColor: "#f0f0f0",
        padding: 10,
        paddingTop: 15,
        paddingBottom: 15,
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        borderBottomWidth: 1,
        borderBottomColor: "#9e9e9e",   
    },
    listItemNameUncomplete: {
        fontFamily: "Roboto-Regular",
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
    deleteContainer: {
        backgroundColor: "#940314",
        padding: 10,
        paddingTop: 15,
        paddingBottom: 15,
        width: "50%",
        marginRight: "auto",
    },
    delete: {
        fontFamily: "Roboto-Regular",
        color: "#fff",
        fontSize: 20,
    },
    editContainer: {
        backgroundColor: "#039464ff",
        padding: 10,
        paddingTop: 15,
        paddingBottom: 15,
        width: "50%",
        textAlign: "right"
    },
    edit: {
        fontFamily: "Roboto-Regular",
        color: "#fff",
        fontSize: 20,
        marginLeft: "auto"
    }
})

export default NormalList;
