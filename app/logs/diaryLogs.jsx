import { UserContext } from "@/AppContexts/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";

function DiaryLogs() {
    const { users, setUsers, localUserInfo, localUser } = useContext(UserContext);
    const router = useRouter();
    const { width, height } = useWindowDimensions();
    const [logName, setLogName] = useState("");
    const [editing, setEditing] = useState(false);
    const [itemID, setItemID] = useState(null);
    const today = new Date();

    function addLog() {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            return {
                ...user,
                logs: [...user.logs, {id: user.logs.length, name: `Untitled Note ${user.logs.length}`, type: "Diary", date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`, text: ""}]
            }
        }
        else {
            return user;
        }
        });
        setUsers(usersReVamp);
    }

    function goToLog(id) {
        router.push(`/logs/${id}`);
    }

    const logRendered = ({ item }) => {
        return (
            <View key={item.id} style={[stylesLight.logContainer, {width: width/2 - 20, marginLeft: 5, marginRight: 5 }]}>
                <Pressable onPress={() => goToLog(item.id)} onLongPress={() => triggerEditing(item)}>
                    <Text style={stylesLight.logName}>{item.name}</Text>
                    <Text style={stylesLight.logDate}>{item.date}</Text>
                    <Text numberOfLines={6} ellipsizeMode="tail" style={stylesLight.logText}>{item.text}</Text>
                </Pressable>
            </View>
        )
    }

    const hiddenLogRendered = (data, rowMap) => {
        return (
            <View style={[stylesLight.deleteContainer, {width: width/2 - 20, marginLeft: 5, marginRight: 5 }]}>
                <Pressable onPress={() => deleteLog(data.item)}>
                    <Text style={stylesLight.delete}>Delete</Text>
                </Pressable>            
            </View>
        ) 
    }

    const deleteLog = (item) => {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            const newLogs = user.logs.filter((log) => log.id !== item.id);
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

    const triggerEditing = (item) => {
        setEditing(true);
        setLogName(item.name);
        setItemID(item.id);
    }

    function editLogName() {
        console.log(itemID);
        const usersReVamp = users.map((user) => {
        if (user.idnum === localUser) {
            const newLogs = user.logs;
            newLogs.splice(itemID, 1, {id: itemID, name: logName, type: "Diary", text: user.logs[itemID].text})
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
        setLogName("");
        setEditing(false);
        setItemID(null);
    }

    return (
        <SafeAreaView style={stylesLight.container}>
            <LinearGradient style={stylesLight.contentContainer} colors={["#ffffff", "#aaaaaa"]}>
                <View style={stylesLight.headerContainer}>
                    <Pressable onPress={() => router.navigate("/home")} style={stylesLight.back}>
                        <Text style={stylesLight.backText}>Home</Text>
                    </Pressable>
                    <Text style={stylesLight.header}>DIARY</Text>
                    <Pressable onPress={addLog} style={stylesLight.add}>
                        <Text style={stylesLight.addIcon}>Add</Text>
                    </Pressable>
                </View>  
                <SwipeListView data={localUserInfo[0] && localUserInfo[0].logs.filter((log) => log.type === "Diary")}
                style={stylesLight.logsContainer} 
                renderItem={logRendered} 
                renderHiddenItem={hiddenLogRendered} 
                horizontal={false}
                numColumns={2}
                leftOpenValue={70}
                disableLeftSwipe={true}/>
                {editing ? (
                    <View style={stylesLight.overLay}>
                        <View style={stylesLight.editNameContainer}>
                            <TextInput placeholder="Name..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setLogName(e)} value={logName} maxLength={15} style={stylesLight.input} />
                            <Pressable onPress={editLogName} style={stylesLight.done}>
                                <Text onPress={editLogName} style={stylesLight.doneText}>Done</Text>
                            </Pressable>
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
    logsContainer: {
        marginLeft: "auto",
        marginRight: "auto",
        alignContent: "center"
    },
    logContainer: {
        backgroundColor: "#f0f0f0",
        elevation: 5,
        borderRadius: 10,
        marginBottom: 10,
        height: 150
    },
    logName: {
        fontFamily: "Economica-Bold",
        fontSize: 20,
        paddingLeft: 10,
        paddingTop: 8
    },
    logText: {
        fontFamily: "Sunflower-Light",
        fontSize: 13,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 6
    },
    logDate: {
        fontFamily: "Sunflower-Medium",
        paddingLeft: 10,
        fontSize: 16,
        marginTop: 2
    },
    deleteContainer: {
        marginBottom: 10,
        height: 150,
        backgroundColor: "#940314",
        borderRadius: 10
    },
    delete: {
        fontFamily: "Sunflower-Light",
        fontSize: 20,
        paddingTop: 60,
        paddingLeft: 10,
        color: "#fff"       
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5
    },
    editNameContainer: {
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
})

const stylesDark = StyleSheet.create({
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
        color: "#fff"       
    },
    headerContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    header: {
        fontFamily: "Economica-Bold",
        fontSize: 40,
        marginLeft: "auto",
        marginRight: "auto",
        color: "#fff"
    },
    add: {        
        position: "absolute",
        right: "5%",
        top: "30%"                   
    },
    addIcon: {
        fontFamily: "Economica-Bold",
        fontSize: 20, 
        color: "#fff"       
    },
    logsContainer: {
        marginLeft: "auto",
        marginRight: "auto",
        alignContent: "center"
    },
    logContainer: {
        backgroundColor: "#323232",
        elevation: 5,
        borderRadius: 10,
        marginBottom: 10,
        height: 150
    },
    logName: {
        fontFamily: "Economica-Bold",
        fontSize: 20,
        paddingLeft: 10,
        paddingTop: 8,
        color: "#fff"
    },
    logText: {
        fontFamily: "Sunflower-Light",
        fontSize: 13,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 6,
        color: "#fff"
    },
    logDate: {
        fontFamily: "Sunflower-Medium",
        paddingLeft: 10,
        fontSize: 16,
        marginTop: 2,
        color: "#fff"
    },
    deleteContainer: {
        marginBottom: 10,
        height: 150,
        backgroundColor: "#940314",
        borderRadius: 10
    },
    delete: {
        fontFamily: "Sunflower-Light",
        fontSize: 20,
        paddingTop: 60,
        paddingLeft: 10,
        color: "#fff"       
    },
    input: {
        backgroundColor: "#323232",
        borderWidth: 0.5,
        borderColor: "#000000",
        borderRadius: 10,
        padding: 10,
        elevation: 5
    },
    editNameContainer: {
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
        color: "#fff"
    },
})

export default DiaryLogs;