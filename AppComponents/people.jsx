import { UserContext } from "@/AppContexts/UserContext";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { SwipeListView } from "react-native-swipe-list-view";
import { v4 as uuidv4 } from 'uuid';

function People(props) {
    const { id } = props;
    const { localUserInfo, localUser, users, setUsers } = useContext(UserContext);
    const router = useRouter();
    const [toEdit, setToEdit] = useState("")
    const [singleElement, setSingleElement] = useState("");
    const [editing, setEditing] = useState(false);
    const [adding, setAdding] = useState(false);
    const [sectionAdding, setSectionAdding] = useState("");
    const [listToAdd, setListToAdd] = useState();
    const [listItem, setListItem] = useState("");
    const [currentListItem, setCurrentListItem] = useState("");
    const [text, setText] = useState(localUserInfo[0] && localUserInfo[0].logs[id].notes);
    const [saving, setSaving] = useState(false);

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
        setSingleElement("");
        setToEdit("");
        setEditing(false);
    }

    function triggerEditing(element, editItem) {
        setEditing(true);
        setSingleElement(element);
        setToEdit(editItem);
    }

    function deleteFromList(itemID) {
        if (adding) {
            setCurrentListItem(itemID);
            const newListItems = listToAdd.filter((list) => list.id !== itemID);
            setListToAdd(newListItems);
        }     
    }

    const renderItems = ({item}) => {
        return (
            <View key={item.id} onTouchEnd={() => deleteFromList(item.id)}>
                <Text style={[stylesLight.text, {marginBottom: 10}]}>- {item.item}</Text>
            </View>
        )
    }

    const hiddenItems = (data, rowmap) => {
        return (
            <View></View>
        )
    }

    function addListItems() {
        console.log(listToAdd);
        setListToAdd([...listToAdd, {id: uuidv4(), item: listItem}]);
        setListItem("");
    }

    function addToList(editItem) {
        const usersReVamp = users.map((user, index) => {
            if (user.idnum === localUser) {
                const newLogs = user.logs.map((log) => {
                    if (user.logs.indexOf(log) === id) {
                        if (editItem === "personFacts") {
                            return {
                                ...log,
                                personFacts: listToAdd
                            }
                        }
                        else if (editItem === "likes") {
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

    function triggerAdd(element) {
        setAdding(true);
        setSectionAdding(element);
        
        if (element === "personFacts") {
           setListToAdd(localUserInfo[0] && localUserInfo[0].logs[id].personFacts);
        }
        else if (element === "likes") {
            setListToAdd(localUserInfo[0] && localUserInfo[0].logs[id].likes);
        }
        else if (element === "dislikes") {
            setListToAdd(localUserInfo[0] && localUserInfo[0].logs[id].dislikes);
        }
    }

    const onDateChange = (event, selectedDate) => {
        const currDate = selectedDate;
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

    const showMode = (mode) => {
        DateTimePickerAndroid.open({
            value: new Date(),
            onChange: onDateChange,
            mode: mode,
            is24Hour: true
        })
    }

    const showDatePicker = () => {
        showMode("date")
    }

    return (
        <LinearGradient style={stylesLight.contentContainer} colors={["#ffffff", "#aaaaaa"]}>            
            <View style={stylesLight.headerContainer}>
                <Pressable onPress={() => router.dismissTo("/logs/peopleLogs")} style={stylesLight.back}>
                    <Text style={stylesLight.backText}>People</Text>
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
                        <Text style={stylesLight.text}>{localUserInfo[0] && localUserInfo[0].logs[id].birthday === "" ? "" : localUserInfo[0] && localUserInfo[0].logs[id].birthday.toLocaleDateString()}</Text>
                        <Pressable onPress={showDatePicker} style={stylesLight.clickOther}>
                            <Text>Edit</Text>
                        </Pressable>
                    </View>    
                    <View style={stylesLight.miniHeaderContainer}>
                        <Text style={stylesLight.heading}>Facts:</Text>
                        <Pressable onPress={() => triggerAdd("personFacts")} style={stylesLight.clickOther}>
                            <Text>Edit</Text>
                        </Pressable>
                    </View>                            
                    <SwipeListView data={localUserInfo[0] && localUserInfo[0].logs[id].personFacts} 
                        renderItem={renderItems}
                        scrollEnabled={false}                     
                    />
                    <View style={stylesLight.miniHeaderContainer}>
                        <Text style={stylesLight.heading}>Likes: </Text>
                        <Pressable onPress={() => triggerAdd("likes")} style={stylesLight.clickOther}>
                            <Text>Edit</Text>
                        </Pressable>
                    </View>                
                    <SwipeListView data={localUserInfo[0] && localUserInfo[0].logs[id].likes} 
                        renderItem={renderItems}      
                        scrollEnabled={false}               
                    />
                    <View style={stylesLight.miniHeaderContainer}>
                        <Text style={stylesLight.heading}>Dislikes: </Text>
                        <Pressable onPress={() => triggerAdd("dislikes")} style={stylesLight.clickOther}>
                            <Text>Edit</Text>
                        </Pressable>
                    </View>                
                    <SwipeListView data={localUserInfo[0] && localUserInfo[0].logs[id].dislikes} 
                        renderItem={renderItems}  
                        scrollEnabled={false}                   
                    />
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
                        <SwipeListView data={listToAdd && listToAdd} 
                            renderItem={renderItems} 
                            renderHiddenItem={hiddenItems}
                        />
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
    peoplePhoto: {
        height: 150,
        width: 150,
        borderRadius: 75,
        marginLeft: "auto",
        marginRight: "auto",
    },
    heading: {
        fontFamily: "Economica-Bold",
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
        fontFamily: "Sunflower-Light",
        fontSize: 18,
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
    clickOther: {
        backgroundColor: "#f0f0f0",
        padding: 5,
        elevation: 5,
        borderRadius: 10,
        marginBottom: 10
    },
    clickText: {
        textAlign: "center",
        fontFamily: "Sunflower-Light",
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