import { UserContext } from "@/AppContexts/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

function Diary(props) {
    const { id } = props;
    const { localUserInfo, localUser, users, setUsers } = useContext(UserContext);
    const [text, setText] = useState(localUserInfo[0].logs[id].text);
    const [name, setName] = useState(localUserInfo[0].logs[id].name);
    const [saving, setSaving] = useState(false);
    const [nameEdit, setNameEdit] = useState(false);
    router = useRouter();

    useEffect(() => {
        if (!text) {
            setSaving(false);
        }
        setSaving(true);

        const timeOut = setTimeout(() => {
            const usersReVamp = users.map((user, index) => {
            if (user.idnum === localUser) {
                const newLogs = user.logs;
                newLogs.splice(id, 1, {...localUserInfo[0] && localUserInfo[0].logs[id], text: text})
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

    function editName() {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            const newLogs = user.logs;
            newLogs.splice(id, 1, {id: localUser[0] && localUser[0].logs[id].id, name: name, type: "Diary", date: user.logs[id].date, text: text})
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
        setNameEdit(false);
    }

    return (
        <LinearGradient style={stylesLight.contentContainer} colors={["#ffffff", "#aaaaaa"]}>
            <View style={stylesLight.headerContainer}>
                <Pressable onPress={() => router.dismissTo('/logs/diaryLogs')} style={stylesLight.back}>
                    <Text style={stylesLight.backText}>Back</Text>
                </Pressable>  
                <View style={stylesLight.headingContainer}>
                    <Pressable onLongPress={() => setNameEdit(true)}>
                        <Text style={stylesLight.header}>{localUserInfo[0].logs[id].name}</Text>
                    </Pressable>                        
                    <Text style={stylesLight.logDate}>{localUserInfo[0].logs[id].date}</Text>
                </View>  
                <View style={stylesLight.save}>
                    <Text style={stylesLight.saveText}>{saving ? "Saving..." : "Saved!"}</Text>
                </View>                    
            </View>                
            <TextInput multiline placeholder="Enter Log..." value={text} onChangeText={(e) => setText(e)} style={stylesLight.noteInput}/>
            {nameEdit ? (
                <View style={stylesLight.overLay}>
                    <View style={stylesLight.editNameContainer}>
                        <TextInput placeholder="Name..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setName(e)} value={name} maxLength={15} style={stylesLight.input}/>
                        <Pressable onPress={editName} style={stylesLight.done}>
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
    headingContainer: {
        marginLeft: "auto",
        marginRight: "auto"
    },
    save: {        
        position: "absolute",
        right: "5%",
        top: "30%"                   
    },
    saveText: {
        fontFamily: "Economica-Bold",
        fontSize: 20,        
    },
    logDate: {
        fontFamily: "Sunflower-Medium",
        fontSize: 16,
        marginTop: 2,
        marginLeft: "auto",
        marginRight: "auto"
    },
    noteInput: {
        width: "95%",
        marginLeft: "auto",
        marginRight: "auto",
        fontFamily: "Sunflower-Light",
        fontSize: 18
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
});

export default Diary;