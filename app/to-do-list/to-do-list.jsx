import { UserContext } from "@/AppContexts/UserContext";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";
import { v4 as uuidv4 } from 'uuid';

function ToDoList() {
    const { localUser, localUserInfo, users, setUsers } = useContext(UserContext);
    const [chooseList, setChooseList] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [warning, setWarning] = useState("");
    const router = useRouter();

    function newList() {
        addList();
        setChooseList(false);   
        setNewListName("");   
    }

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

    function goToList(id) {
        router.push(`/to-do-list/${id}`)
    }

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

    const itemRendered = ({item}) => {
        return (
            <View key={item.id} style={stylesLight.listItemContainer}>
                <Pressable onPress={() => goToList(item.id)} onLongPress={() => setType(item.name)} style={stylesLight.listItem}>
                    <Text style={stylesLight.listItemName}>{item.name}</Text>
                    <Text style={stylesLight.listItemType}>{item.type}</Text>
                </Pressable>
            </View>
        )
    }

    const hiddenItemRendered = (data, rowMap) => {
        return (
            <View style={stylesLight.deleteContainer}>
                <Pressable onPress={() => deleteItem(data.item)}>
                    <Text style={stylesLight.delete}>Delete</Text>
                </Pressable>                
            </View>
        )       
    }

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
    }

    //https://medium.com/@wsvuefanatic/how-to-build-a-list-app-with-react-native-swipelistview-and-layout-animation-a3b6171faa50
    return (
        <SafeAreaView style={stylesLight.container}>
            <LinearGradient style={stylesLight.contentContainer} colors={["#ffffff", "#aaaaaa"]}>
                <View style={stylesLight.headerContainer}>
                    <Pressable onPress={() => router.navigate("/home")} style={stylesLight.back}>
                        <Text style={stylesLight.backText}>Home</Text>
                    </Pressable>
                    <Text style={stylesLight.header}>TO-DO LISTS</Text>
                    <Pressable onPress={() => setChooseList(!chooseList)} style={stylesLight.add}>
                        <Text style={stylesLight.addIcon}>{chooseList ? "" : "Add"}</Text>
                    </Pressable>
                </View>   
                <View style={stylesLight.headings}>
                    <Text style={stylesLight.headingsTextName}>Name</Text>
                    <Text style={stylesLight.headingsTextType}>Type</Text>
                </View>          
                <SwipeListView data={localUserInfo[0] && localUserInfo[0].lists} 
                renderItem={itemRendered} 
                renderHiddenItem={hiddenItemRendered} 
                leftOpenValue={100} 
                disableLeftSwipe={true} />       
                {chooseList ? (
                    <View style={stylesLight.overLay}>
                        <View style={stylesLight.addListContainer}>
                        <TextInput placeholder="Name your list..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setNewListName(e)} maxLength={15} style={stylesLight.input} />
                        <Pressable onPress={newList} style={stylesLight.done}>
                            <Text style={stylesLight.doneText}>Done</Text>
                        </Pressable>
                        </View>
                    </View>                
                ) : (
                    <View></View>
                )}    
                {warning === "" ? (
                    <View></View>
                ) : (
                    <View style={stylesLight.overLay}>
                        <View style={stylesLight.warningContainer}>
                        <Text style={stylesLight.warningText}>{warning}</Text>
                        <Pressable onPress={() => setWarning("")} style={stylesLight.okay}>
                            <Text style={stylesLight.okayText}>Okay</Text>
                        </Pressable>
                        </View>
                    </View>                    
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
    input: {
        backgroundColor: "#fff",
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
        backgroundColor: "#fff",
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
        backgroundColor: "#f0f0f0",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    doneText: {
        textAlign: "center",
        fontFamily: "Sunflower-Light",
        fontSize: 18
    },
    warningContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "10%",
        padding: 20,
        backgroundColor: "#fff",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1,
        borderWidth: 1,
        borderColor: "#940314"
    },
    warningText: {
        fontFamily: "Sunflower-Light",
        fontSize: 20,
        color: "#940314",
        marginBottom: 10
    },
    okay: {
        backgroundColor: "#f0f0f0",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    okayText: {
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
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    listItemName: {
        fontFamily: "Sunflower-Light",
        fontSize: 20,
        marginLeft: 5
    },
    listItemType: {
        fontFamily: "Sunflower-Light",
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
        fontFamily: "Economica-Bold",
        fontSize: 25,
        marginLeft: 10
    },
    headingsTextType: {
        fontFamily: "Economica-Bold",
        fontSize: 25,
        marginRight: 10
    },
    deleteContainer: {
        backgroundColor: "#940314",
        padding: 10,
        paddingTop: 15,
        paddingBottom: 15,
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    delete: {
        fontFamily: "Sunflower-Light",
        color: "#fff",
        fontSize: 20,
    }
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
        top: "30%",                
    },
    backText: {
        fontFamily: "Economica-Bold",
        fontSize: 20,  
        color: "#fff"       
    },
    headerContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    header: {
        fontFamily: "Economica-Bold",
        fontSize: 40,
        color: "#fff", 
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
        color: "#fff",     
    },
    input: {
        backgroundColor: "#323232",
        borderWidth: 0.5,
        borderColor: "#000000",
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
        backgroundColor: "#323232",
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
        backgroundColor: "#3b3b3b",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    doneText: {
        textAlign: "center",
        fontFamily: "Sunflower-Light",
        fontSize: 18,
        color: "#fff",
    },
    warningContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "10%",
        padding: 20,
        backgroundColor: "#323232",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1,
        borderWidth: 1,
        borderColor: "#940314"
    },
    warningText: {
        fontFamily: "Sunflower-Light",
        fontSize: 20,
        color: "#940314",
        marginBottom: 10
    },
    okay: {
        backgroundColor: "#3b3b3b",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    okayText: {
        textAlign: "center",
        fontFamily: "Sunflower-Light",
        fontSize: 18,
        color: "#fff"
    },
    listItemContainer: {
        backgroundColor: "#323232",
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
        fontFamily: "Sunflower-Light",
        fontSize: 20,
        marginLeft: 5,
        color: "#fff"
    },
    listItemType: {
        fontFamily: "Sunflower-Light",
        fontSize: 20,
        marginRight: 5,
        color: "#fff"
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
        fontFamily: "Economica-Bold",
        fontSize: 25,
        marginLeft: 10,
        color: "#fff"
    },
    headingsTextType: {
        fontFamily: "Economica-Bold",
        fontSize: 25,
        marginRight: 10,
        color: "#fff"
    },
    deleteContainer: {
        backgroundColor: "#940314",
        padding: 10,
        paddingTop: 15,
        paddingBottom: 15,
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    delete: {
        fontFamily: "Sunflower-Light",
        color: "#fff",
        fontSize: 20,
        color: "#fff"
    }
});

export default ToDoList;