import { UserContext } from "@/AppContexts/UserContext";
import { Octicons } from "@react-native-vector-icons/octicons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

function TimedList(props) {
    //Id of the object that was reverted to the index in the diaryLogs
    const { id } = props;

    //Accessing user context and all the users that already exist
    const { setUsers, users, localUserInfo, localUser } = useContext(UserContext); 

    //Information that is stored from this component
    const [listItem, setListItem] = useState("");
    const [listItemID, setlistItemID] = useState();
    const [time, setTime] = useState(new Date());
    const [changeTime, setChangeTime] = useState(false);
    const [timeAmount, setTimeAmount] = useState("");
    const [endTimes, setEndTimes] = useState({h: 0, m: 0});
    const [changed, setChanged] = useState(false);
    const [startTimes, setStartTimes] = useState({h: 0, m: 0});

    //Set the state of editing to trigger the editing tile for the list item
    const [editing, setEditing] = useState(false);

    //Router used to take the user back to the to-do-list page
    const router = useRouter();
    
    //To view the full item if it is too long, this activates the tile to see it
    const [viewItemBox, setViewItemBox] = useState(false);  
    const [viewItemText, setViewItemText] = useState("");  
    
   
    //Resets the time every second for the clock that is visible on this page to be accurate to local time
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    //Add a list item to the user's list
    function addItem() {
        const userListAddision = users.map((user) => {
            if (user.idnum === localUser) {
                const newUserLists = user.lists.map((list) => {
                    if (list.name === localUserInfo[0].lists[id].name) {
                        return {
                            ...list,
                            listItems: [...list.listItems, {id: uuidv4(), item: listItem, completed: false, overdue: false, inRange: true, timeLengthMins: 0, startTime: null, endTime: null}]
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
        console.log(localUserInfo[0] && localUserInfo[0].lists[id].listItems);
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
        setChanged(true);
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

    //triggers tile to add amount of time that needs to be spent on a certain task
    const addTimeAmount = (item) => {
        setChangeTime(true);
        setlistItemID(item.id);
    } 

    //Adds the amount needed to spend to the item in the user's list
    function finishTimeAmount() {
        const userChange = users.map((user) => {
            if (user.idnum === localUser) {
                const newUserLists = user.lists.map((list) => {
                    if (list.name === localUserInfo[0].lists[id].name) {
                        const newListItems = list.listItems.map((listObject) => {
                            if (listObject.id === listItemID) {
                                return {
                                    ...listObject,
                                    timeLengthMins: parseInt(timeAmount),
                                }
                            }
                            else {
                                
                                return {
                                    ...listObject
                                }
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
        setChangeTime(false);
        setTimeAmount("");
        setChanged(true);
    }

    //Trigger the box to view the item's content
    const viewItem = (item) => {
        setViewItemBox(true);
        setViewItemText(item.item);
    }

    //Closes the box that views the information
    function closeViewBox() {
        setViewItemText("");
        setViewItemBox(false);
    }

    //On long press: strikes through the item and sets it to complet ein user;s list
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

    //Updates times after information has been changed in the list like new items or changed times
    function update() {
        const currentListItems = localUserInfo[0].lists[id].listItems;
        const newListItems = [];
        for (let i = 0; i < currentListItems.length; i++) {
            let starthour;
            let startmin;
            let endhour;
            let endmin;
            let range;

            if (i !== 0) {
                starthour = newListItems[i - 1].endTime.h;
                startmin = newListItems[i - 1].endTime.m + 5;

                if (startmin >= 60) {
                    let extra = Math.floor(startmin/60);
                    startmin -= 60*extra;
                    starthour += extra;

                    endhour = starthour;
                    endmin = startmin + currentListItems[i].timeLengthMins;

                    if (endmin >= 60) {
                        let extraToo = Math.floor(endmin/60);
                        endmin -= 60*extraToo;
                        endhour += extraToo;
                    }
                }
                else {
                    starthour = newListItems[i - 1].endTime.h;
                    startmin = newListItems[i - 1].endTime.m + 5;

                    endhour = starthour;
                    endmin = startmin + currentListItems[i].timeLengthMins;

                    if (endmin >= 60) {
                        let extraToo = Math.floor(endmin/60);
                        endmin -= 60*extraToo;
                        endhour += extraToo;
                    }
                }

                newListItems.push(
                    {
                        ...currentListItems[i],
                        startTime: {h: starthour, m: startmin},
                        endTime: {h: endhour, m: endmin}
                    }
                )
            }
            else {
                starthour = startTimes.h;
                startmin = startTimes.m;

                endhour = starthour;
                endmin = startmin + currentListItems[i].timeLengthMins;

                if (endmin >= 60) {
                    let extraToo = Math.floor(endmin/60);
                    endmin -= 60*extraToo;
                    endhour += extraToo;
                }

                newListItems.push(
                    {
                        ...currentListItems[i],
                        startTime: {h: starthour, m: startmin},
                        endTime: {h: endhour, m: endmin}
                    }
                )
            } 
        }

        const userChange = users.map((user) => {
            if (user.idnum === localUser) {
                const newUserLists = user.lists.map((list) => {
                    if (list.name === localUserInfo[0].lists[id].name) {
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
        setChanged(false);
    }

    //Changes the time that the user starts their session
    function changeStartTimes(object) {
        setChanged(true);
        setStartTimes(object);
    }

    //Changes the time that the user aims to end their session
    function changeEndTimes(object) {
        setChanged(true);
        setEndTimes(object);
    }

    return (
        <LinearGradient style={stylesLight.contentContainer} colors={["#e3e3e3", "#aaaaaa"]}>
            <View style={stylesLight.headerContainer}>
                <Pressable onPress={() => router.dismissTo("/to-do-list/to-do-list")} style={stylesLight.back}>
                    <Octicons name="arrow-left" size={25} color={'#242424'}/>
                </Pressable>
                <Text style={stylesLight.header}>{localUserInfo[0].lists[id].name}</Text>
                <Text style={stylesLight.timeText}>{`${time.getHours()}:${time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()}`}</Text>
            </View>   
            <View style={stylesLight.timeContainer}>
                <View style={stylesLight.timeTextContainer}>
                    <Text style={stylesLight.textsTime}>Start Time</Text>
                </View>
                <View style={stylesLight.timeInputContainer}>
                    <TextInput placeholder="hrs" placeholderTextColor="#9e9e9e" value={startTimes.h === null ? 0 : startTimes.h} onChangeText={(e) => changeStartTimes({...startTimes, h: parseInt(e)})} style={stylesLight.timeInput} />
                    <Text style={stylesLight.colon}>:</Text>
                    <TextInput placeholder="mins" placeholderTextColor="#9e9e9e" value={startTimes.m === null ? 0 : startTimes.m}  onChangeText={(e) => changeStartTimes({...startTimes, m: parseInt(e)})} style={stylesLight.timeInput} />
                </View>
                <View style={stylesLight.timeTextContainer}>
                    <Text style={stylesLight.textsTime}>End Time</Text>
                </View>
                <View style={stylesLight.timeInputContainer}>
                    <TextInput placeholder="hrs" placeholderTextColor="#9e9e9e" value={endTimes.h === null ? 0 : endTimes.h}  onChangeText={(e) => changeEndTimes({...endTimes, h: parseInt(e)})} style={stylesLight.timeInput} />
                    <Text style={stylesLight.colon}>:</Text>
                    <TextInput placeholder="mins" placeholderTextColor="#9e9e9e" value={endTimes.m === null ? 0 : endTimes.m}  onChangeText={(e) => changeEndTimes({...endTimes, m: parseInt(e)})} style={stylesLight.timeInput} />
                </View>               
            </View>
            <View style={stylesLight.addContainer}>
                <TextInput placeholder="Add List Item..." placeholderTextColor="#9e9e9e" value={listItem} onChangeText={(e) => setListItem(e)} style={stylesLight.input}/>
                <Pressable onPress={editing ? finishEdit : addItem}  style={stylesLight.add}>
                    <Text style={stylesLight.addText}>{editing ? "Done" : "Add"}</Text>
                </Pressable>
            </View>   
            {changed ? (
                <View style={stylesLight.update}>
                    <Pressable onPress={update} style={stylesLight.updateClickable}>
                        <Text style={stylesLight.updateText}>Update</Text>
                    </Pressable>
                </View>
            ) : (
                <View></View>
            )}
            {localUserInfo[0].lists[id] && localUserInfo[0].lists[id].listItems.map((item) => (
                <View key={item.id} style={[stylesLight.listItemContainer, (item.endTime && item.endTime.h >= endTimes.h && item.endTime.m > endTimes.m) && stylesLight.listItemContainerOutRange, (item.endTime && time.getTime() >= new Date().setHours(item.endTime.h, item.endTime.m, 0, 0) && item.completed === false) && stylesLight.listItemContainerOverdue]}>
                    <Pressable onLongPress={() => completeListItem(item.id)} onPress={() => viewItem(item)} style={stylesLight.listItemNameContainer}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={item && item.completed ? stylesLight.listItemNameComplete : stylesLight.listItemNameUncomplete}>{item.item}</Text>
                    </Pressable>    
                    <View style={stylesLight.listItemTimesContainer}>
                        <Pressable onPress={() => addTimeAmount(item)}>
                            <Text>{item.timeLengthMins} Mins</Text>
                        </Pressable>
                        {item.startTime === null || item.endTime === null ? (
                            <View></View>
                        ) : (
                            <View style={stylesLight.timeToTime}>
                                <Text>{item.startTime !== undefined ? `${item.startTime.h}:${item.startTime.m === 0 ? `${item.startTime.m}0` : `${item.startTime.m}`}` : ``}</Text>
                                <Text> to </Text>
                                <Text>{item.endTime !== undefined ? `${item.endTime.h}:${item.endTime.m === 0 ? `${item.endTime.m}0` : item.endTime.m < 10 ? `0${item.endTime.m}` : `${item.endTime.m}`}` : ``}</Text>
                            </View> 
                        )}                                       
                    </View>           
                </View>
            ))} 
            {changeTime ? (
                <View style={stylesLight.overLay}>
                    <View style={stylesLight.container}>
                        <TextInput keyboardType="numeric" placeholder="Number of Minutes..." onChangeText={(e) => setTimeAmount(parseInt(e))} style={stylesLight.input}/>
                        <Pressable onPress={finishTimeAmount} style={stylesLight.done}>
                            <Text style={stylesLight.doneText}>Done</Text>
                        </Pressable>
                    </View>
                </View>                
            ) : (
                <View></View>
            )}
            {viewItemBox ? (
                <View style={stylesLight.overLay}>
                    <View style={stylesLight.container}>
                        <Text style={stylesLight.listItemText}>{viewItemText}</Text>
                        <Pressable onPress={closeViewBox} style={stylesLight.done}>
                            <Text style={stylesLight.doneText}>Done</Text>
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
    timeText: {
        fontFamily: "PTSans-Regular",
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
        fontFamily: "PTSans-Regular",
        fontSize: 15,
        flex: 1
    },
    timeInput: {
        backgroundColor: "#f2f2f2",
        borderWidth: 0.5,
        borderColor: "#2b2b2b",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        width: 55
    },
    timeTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
    },
    timeInputContainer: {
        flex: 3,
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginRight: 10
    },
    update: {
        margin: 10,
    },
    updateClickable: {
        backgroundColor: "#f2f2f2",
        padding: 10, 
        elevation: 5,
        borderRadius: 10       
    },
    updateText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        fontSize: 18
    },
    addContainer: {
        width: "95%",
        marginLeft: "auto",
        marginRight: "auto",
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 5
    },
    input: {
        backgroundColor: "#f2f2f2",
        borderWidth: 0.5,
        borderColor: "#2b2b2b",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        flex: 2,
    },
    add: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        marginLeft: 10,
        marginRight: 5,
        padding: 10,
        elevation: 5,
        borderRadius: 10,
    },
    addText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
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
        flexDirection: "row",
        justifyContent: "space-between"
    },
    listItemContainerOverdue: {
        backgroundColor: "#ff7a7aff",
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
    listItemContainerOutRange: {
        backgroundColor: "#ffca58ff",
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
        fontFamily: "Roboto-Regular",
        fontSize: 15,
        marginLeft: 5,
        flex: 1
    },
    listItemNameComplete: {
        fontFamily: "Roboto-Regular",
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
    colon: {
        fontFamily: "Roboto-Regular",
        fontSize: 20,
        marginTop: 10,

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
        fontFamily: "Roboto-Regular",
        color: "#fff",
        fontSize: 15,
        marginLeft: "auto"
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
    container: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "10%",
        padding: 20,
        backgroundColor: "#fff",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1
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
        fontSize: 18
    },
    listItemText: {
        fontFamily: "Roboto-Regular",
        fontSize: 18,
        lineHeight: 25
    },
    overdue: {
        backgroundColor: "#ff6a6aff"
    },
    outRange: {
        backgroundColor: "#ffd57aff"
    }
})

export default TimedList;