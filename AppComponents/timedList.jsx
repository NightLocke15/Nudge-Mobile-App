import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { Octicons } from "@react-native-vector-icons/octicons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector, TextInput } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

function TimedList(props) {
    //Id of the object that was reverted to the index in the diaryLogs
    const { id } = props;

    //Accessing user context and all the users that already exist
    const { setUsers, users, localUserInfo, localUser } = useContext(UserContext); 
    const {currentTheme, gradientColours } = useContext(ThemeContext);

    //Information that is stored from this component
    const [listItem, setListItem] = useState("");
    const [listItemID, setlistItemID] = useState();
    const [item, setItem] = useState();
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
    
    //Information and states set when interacting with items by tapping or double tapping in order to edit or delete the correct items
    const [action, setAction] = useState(false);
    const [tapPostition, setTapPosition] = useState({x: 0, y: 0})
   
    //Resets the time every second for the clock that is visible on this page to be accurate to local time
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    //Add a list item to the user's list
    function addItem() {
        if (listItem !== "") {
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
        }        
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
        setAction(false);
    }

    //Trigger the editing of the item and set all the relevant information to be edited
    const editItem = (item) => {
        setEditing(true);
        setListItem(item.item);
        setlistItemID(item.id);
        setAction(false);
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

    //Gesture handler constants. Detects a single tap on a certain element as well as a double tap and long press.
    const singleTap = (item) => Gesture.Tap().maxDuration(250).numberOfTaps(1).onStart(() => viewItem(item)).runOnJS(true);
    const doubleTap = (item) => Gesture.Tap().maxDuration(250).numberOfTaps(2).onStart((event) => {
        setItem(item);
        setTapPosition({x: event.absoluteX > 260 ? 260 : event.absoluteX, y: event.absoluteY > 530 ? 530 : event.absoluteY})
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
                <Text style={currentTheme.includes("Light") ? stylesLight.timeText : stylesDark.timeText}>{time.getHours().toString().padStart(2, "0")}:{time.getMinutes().toString().padStart(2, "0")}</Text>
            </View>   
            <View style={currentTheme.includes("Light") ? stylesLight.timeContainer : stylesDark.timeContainer}>
                <View style={currentTheme.includes("Light") ? stylesLight.timeTextContainer : stylesDark.timeTextContainer}>
                    <Text style={currentTheme.includes("Light") ? stylesLight.textsTime : stylesDark.textsTime}>Start Time</Text>
                </View>
                <View style={currentTheme.includes("Light") ? stylesLight.timeInputContainer : stylesDark.timeInputContainer}>
                    <TextInput placeholder="hrs" placeholderTextColor="#9e9e9e" value={startTimes.h === null ? 0 : startTimes.h} onChangeText={(e) => changeStartTimes({...startTimes, h: parseInt(e)})} style={currentTheme.includes("Light") ? stylesLight.timeInput : stylesDark.timeInput} />
                    <Text style={currentTheme.includes("Light") ? stylesLight.colon : stylesDark.colon}>:</Text>
                    <TextInput placeholder="mins" placeholderTextColor="#9e9e9e" value={startTimes.m === null ? 0 : startTimes.m}  onChangeText={(e) => changeStartTimes({...startTimes, m: parseInt(e)})} style={currentTheme.includes("Light") ? stylesLight.timeInput : stylesDark.timeInput} />
                </View>
                <View style={currentTheme.includes("Light") ? stylesLight.timeTextContainer : stylesDark.timeTextContainer}>
                    <Text style={currentTheme.includes("Light") ? stylesLight.textsTime : stylesDark.textsTime}>End Time</Text>
                </View>
                <View style={currentTheme.includes("Light") ? stylesLight.timeInputContainer : stylesDark.timeInputContainer}>
                    <TextInput placeholder="hrs" placeholderTextColor="#9e9e9e" value={endTimes.h === null ? 0 : endTimes.h}  onChangeText={(e) => changeEndTimes({...endTimes, h: parseInt(e)})} style={currentTheme.includes("Light") ? stylesLight.timeInput : stylesDark.timeInput} />
                    <Text style={currentTheme.includes("Light") ? stylesLight.colon : stylesDark.colon}>:</Text>
                    <TextInput placeholder="mins" placeholderTextColor="#9e9e9e" value={endTimes.m === null ? 0 : endTimes.m}  onChangeText={(e) => changeEndTimes({...endTimes, m: parseInt(e)})} style={currentTheme.includes("Light") ? stylesLight.timeInput : stylesDark.timeInput} />
                </View>               
            </View>
            <View style={stylesLight.addContainer}>
                <TextInput placeholder="Add List Item..." placeholderTextColor="#9e9e9e" value={listItem} onChangeText={(e) => setListItem(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input}/>
                <Pressable onPress={editing ? finishEdit : addItem}  style={currentTheme.includes("Light") ? stylesLight.add : stylesDark.add}>
                    {editing ? <Octicons name="check" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/> : <Octicons name="plus" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>}
                </Pressable>
            </View>   
            {changed ? (
                <View style={currentTheme.includes("Light") ? stylesLight.update : stylesDark.update}>
                    <Pressable onPress={update} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.updateClickable : stylesDark.updateClickable, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                        <Text style={currentTheme.includes("Light") ? stylesLight.updateText : stylesDark.updateText}>Update</Text>
                    </Pressable>
                </View>
            ) : (
                <View></View>
            )}
            {localUserInfo[0].lists[id] && localUserInfo[0].lists[id].listItems.map((item) => (
                <View key={item.id} style={[currentTheme.includes("Light") ? stylesLight.listItemContainer : stylesDark.listItemContainer, (item.endTime && item.endTime.h >= endTimes.h && item.endTime.m > endTimes.m) && (currentTheme.includes("Light") ? stylesLight.listItemContainerOutRange : stylesDark.listItemContainerOutRange), (item.endTime && time.getTime() >= new Date().setHours(item.endTime.h, item.endTime.m, 0, 0) && item.completed === false) && (currentTheme.includes("Light") ? stylesLight.listItemContainerOverdue : stylesDark.listItemContainerOverdue)]}>
                    {/* <Pressable onLongPress={() => completeListItem(item.id)} onPress={() => viewItem(item)} style={stylesLight.listItemNameContainer}> */}
                        <GestureDetector gesture={Gesture.Exclusive(doubleTap(item), singleTap(item), longPress(item))}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={item && item.completed ? (currentTheme.includes("Light") ? stylesLight.listItemNameComplete : stylesDark.listItemNameComplete) : (currentTheme.includes("Light") ? stylesLight.listItemNameUncomplete : stylesDark.listItemNameUncomplete)}>{item.item}</Text>
                        </GestureDetector>
                    {/* </Pressable>     */}
                    <View style={currentTheme.includes("Light") ? stylesLight.listItemTimesContainer : stylesDark.listItemTimesContainer}>
                        <Pressable onPress={() => addTimeAmount(item)}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.time : stylesDark.time}>{item.timeLengthMins} Mins</Text>
                        </Pressable>
                        {item.startTime === null || item.endTime === null ? (
                            <View></View>
                        ) : (
                            <View style={currentTheme.includes("Light") ? stylesLight.timeToTime : stylesDark.timeToTime}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.time : stylesDark.time}>{item.startTime !== undefined ? `${item.startTime.h}:${item.startTime.m === 0 ? `${item.startTime.m}0` : `${item.startTime.m}`}` : ``}</Text>
                                <Text style={currentTheme.includes("Light") ? stylesLight.time : stylesDark.time}> to </Text>
                                <Text style={currentTheme.includes("Light") ? stylesLight.time : stylesDark.time}>{item.endTime !== undefined ? `${item.endTime.h}:${item.endTime.m === 0 ? `${item.endTime.m}0` : item.endTime.m < 10 ? `0${item.endTime.m}` : `${item.endTime.m}`}` : ``}</Text>
                            </View> 
                        )}                                       
                    </View>           
                </View>
            ))} 
            {changeTime ? (
                <Pressable onPress={() => setChangeTime(false)} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                    <View style={currentTheme.includes("Light") ? stylesLight.container : stylesDark.container}>
                        <Pressable onPress={() => setChangeTime(false)} style={currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel}>
                            <Octicons name="x" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                        </Pressable>
                        <TextInput keyboardType="numeric" placeholder="Number of Minutes..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setTimeAmount(parseInt(e))} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input}/>
                        <Pressable onPress={finishTimeAmount} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.done : stylesDark.done, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.doneText : stylesDark.doneText}>Done</Text>
                        </Pressable>
                    </View>
                </Pressable>                
            ) : (
                <View></View>
            )}
            {viewItemBox ? (
                <Pressable onPress={() => setViewItemBox(false)} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                    <View style={currentTheme.includes("Light") ? stylesLight.container : stylesDark.container}>
                        <Pressable onPress={() => setViewItemBox(false)} style={currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel}>
                            <Octicons name="x" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                        </Pressable>
                        <Text style={currentTheme.includes("Light") ? stylesLight.listItemText : stylesDark.listItemText}>{viewItemText}</Text>
                    </View>
                </Pressable>                
            ) : (
                <View></View>
            )}     
            {action ? (
                <Pressable onPress={() => setAction(false)} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                    <View style={[currentTheme.includes("Light") ? stylesLight.actionContainer : stylesDark.actionContainer, {position: "absolute", left: tapPostition.x, top: tapPostition.y}]}> 
                        <Pressable onPress={() => editItem(item)} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit, {backgroundColor: pressed ? '#0f470aff' : '#1f9615ff'}]}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                        </Pressable>
                        <Pressable onPress={() => deleteItem(item)} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.delete : stylesDark.delete, {backgroundColor: pressed ? '#7a1503ff' : '#be2206ff'}]}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.deleteText : stylesDark.deleteText}>Delete</Text>
                        </Pressable>
                    </View>
                </Pressable>
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
    backText: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 20,         
    },
    timeText: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
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
        color: "#242424",
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
        color: "#242424",
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
        flex: 10,
    },
    add: {
        flex: 1,
        marginLeft: 10,
        padding: 10,
        borderRadius: 10,
    },
    addText: {
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
        color: "#242424",
        fontSize: 15,
        marginLeft: 5,
        flex: 1
    },
    listItemNameComplete: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
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
        color: "#242424",
        fontSize: 20,
        marginTop: 10,

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
        color: "#242424",
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
        color: "#e3e3e3",
        fontSize: 18,
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
        backgroundColor: "#e3e3e3",
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
        color: "#242424",
        fontSize: 18
    },
    listItemText: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 18,
        lineHeight: 25
    },
    overdue: {
        backgroundColor: "#ff6a6aff"
    },
    outRange: {
        backgroundColor: "#ffd57aff"
    },
    time: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
    },
    actionContainer: {
        backgroundColor: '#e3e3e3',
        padding: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    cancel: {
        alignSelf: "flex-end",
    },
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
    backText: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 20,         
    },
    timeText: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
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
        color: "#e3e3e3",
        fontSize: 15,
        flex: 1
    },
    timeInput: {
        backgroundColor: "#2b2b2b",
        borderWidth: 0.5,
        borderColor: "#000000",
        color: "#e3e3e3",
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
        backgroundColor: "#3a3a3a",
        padding: 10, 
        elevation: 5,
        borderRadius: 10       
    },
    updateText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
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
    addText: {
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
        color: "#e3e3e3",
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
        color: "#e3e3e3",
        fontSize: 20,
        marginTop: 10,

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
        color: "#e3e3e3",
        fontSize: 18,
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
        color: "#e3e3e3",
        fontSize: 18,
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
        backgroundColor: "#2b2b2b",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1
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
    listItemText: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 18,
        lineHeight: 25
    },
    overdue: {
        backgroundColor: "#ff6a6aff"
    },
    outRange: {
        backgroundColor: "#ffd57aff"
    },
    time: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
    },
    actionContainer: {
        backgroundColor: '#2b2b2b',
        padding: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    cancel: {
        alignSelf: "flex-end",
    },
})

export default TimedList;