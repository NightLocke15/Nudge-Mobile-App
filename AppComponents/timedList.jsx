import { UserContext } from "@/AppContexts/UserContext";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SwipeListView } from "react-native-swipe-list-view";

function TimedList(props) {
    const { id } = props;
    const { setUsers, users, localUserInfo, localUser } = useContext(UserContext); 
    const [listItem, setListItem] = useState("");
    const [listItemID, setlistItemID] = useState();
    const [editing, setEditing] = useState(false);
    const router = useRouter();
    const [time, setTime] = useState(new Date());
    

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    function addItem() {
        const userListAddision = users.map((user) => {
            if (user.idnum === localUser) {
                const newUserLists = user.lists.map((list) => {
                    if (list.name === localUserInfo[0].lists[id].name) {
                        return {
                            ...list,
                            listItems: [...list.listItems, {id: list.listItems.length, item: listItem, completed: false, timeLengthMins: "", startTime: "", endTime: ""}]
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

    const itemRendered = ({item}) => {
        return (
            <View key={item.id} style={stylesLight.listItemContainer}>
                <Pressable onLongPress={() => completeListItem(item.id)} style={stylesLight.listItemNameContainer}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={item.completed ? stylesLight.listItemNameComplete : stylesLight.listItemNameUncomplete}>{item.item}</Text>
                </Pressable>    
                <View style={stylesLight.listItemTimesContainer}>
                    <Pressable onPress={() => addTimeAmount(item.id)}>
                        <Text>0 Mins</Text>
                    </Pressable>
                    <View style={stylesLight.timeToTime}>
                        <Text></Text>
                        <Text>to</Text>
                        <Text></Text>
                    </View>                    
                </View>           
            </View>
        )
    }
    
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

    const editItem = (item) => {
        setEditing(true);
        setListItem(item.item);
        setlistItemID(item.id);
    }

    function finishEdit() {
        const userChange = users.map((user) => {
            if (user.idnum === localUser) {
                const newUserLists = user.lists.map((list) => {
                    if (list.name === localUserInfo[0].lists[id].name) {
                        const newListItems = list.listItems;
                        console.log(list.listItems);
                        newListItems.splice(listItemID, 1, {id: listItemID, item: listItem});
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

    const addTimeAmount = (itemID) => {
        
    } 

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
        <LinearGradient style={stylesLight.contentContainer} colors={["#ffffff", "#aaaaaa"]}>
            <View style={stylesLight.headerContainer}>
                <Pressable onPress={() => router.navigate("/to-do-list/to-do-list")} style={stylesLight.back}>
                    <Text style={stylesLight.backText}>Lists</Text>
                </Pressable>
                <Text style={stylesLight.header}>{localUserInfo[0].lists[id].name}</Text>
                <Text style={stylesLight.timeText}>{`${time.getHours()}:${time.getMinutes()}`}</Text>
            </View>   
            <View style={stylesLight.timeContainer}>
                <View style={stylesLight.timeTextContainer}>
                    <Text style={stylesLight.textsTime}>Start Time</Text>
                </View>
                <View style={stylesLight.timeInputContainer}>
                    <TextInput placeholder="eg. 14:00" placeholderTextColor="#9e9e9e" style={stylesLight.timeInput} />
                </View>
                <View style={stylesLight.timeTextContainer}>
                    <Text style={stylesLight.textsTime}>End Time</Text>
                </View>
                <View style={stylesLight.timeInputContainer}>
                    <TextInput placeholder="eg. 17:00" placeholderTextColor="#9e9e9e" style={stylesLight.timeInput} />
                </View>               
            </View>
            <View style={stylesLight.addContainer}>
                <TextInput placeholder="Add List Item..." placeholderTextColor="#9e9e9e" value={listItem} onChangeText={(e) => setListItem(e)} style={stylesLight.input}/>
                <Pressable onPress={editing ? finishEdit : addItem}  style={stylesLight.add}>
                    <Text style={stylesLight.addText}>{editing ? "Done" : "Add"}</Text>
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
        fontFamily: "Economica-Bold",
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
        fontFamily: "Economica-Bold",
        fontSize: 20,         
    },
    timeText: {
        fontFamily: "Economica-Bold",
        fontSize: 20, 
        position: "absolute",
        right: "5%",
        top: "30%"         
    },
    timeContainer: {
        flexDirection: "row",
        marginBottom: 5,
        padding: 10
    },
    textsTime: {
        fontFamily: "Economica-Bold",
        fontSize: 18,
        flex: 1
    },
    timeInput: {
        backgroundColor: "#fff",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
    },
    timeTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
    },
    timeInputContainer: {
        flex: 3,
        marginRight: 10
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
        backgroundColor: "#fff",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        flex: 2,
    },
    add: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        marginLeft: 10,
        marginRight: 5,
        padding: 10,
        elevation: 5,
        borderRadius: 10,
    },
    addText: {
        textAlign: "center",
        fontFamily: "Sunflower-Light",
        fontSize: 18
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
        flexDirection: "row",
        justifyContent: "space-between"
    },
    listItemNameContainer: {        
        flexDirection: "row",
        flexGrow: 1,
    },
    listItemNameUncomplete: {
        fontFamily: "Sunflower-Light",
        fontSize: 15,
        marginLeft: 5,
        flex: 1
    },
    listItemNameComplete: {
        fontFamily: "Sunflower-Light",
        fontSize: 15,
        marginLeft: 5,
        color: "#818181",
        textDecorationLine: "line-through",
        flec: 1
    },
    listItemTimesContainer: {
        flexDirection: "row",
        width: "70%",
        justifyContent: "space-evenly"
    },
    timeToTime: {
        flexDirection: "row"
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
        fontFamily: "Sunflower-Light",
        color: "#fff",
        fontSize: 15,
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
        fontFamily: "Sunflower-Light",
        color: "#fff",
        fontSize: 15,
        marginLeft: "auto"
    }
})

export default TimedList;