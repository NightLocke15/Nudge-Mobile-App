import { UserContext } from "@/AppContexts/UserContext";
import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

function ToDoList() {
    const { localUser, localUserInfo, users, setUsers } = useContext(UserContext);
    const [chooseList, setChooseList] = useState(false);
    const [newListSetup, setNewListSetup] = useState(false);
    const [newListName, setNewListName] = useState("");

    function newList() {
        addList();
        setNewListSetup(false);
        setChooseList(false);      
    }

    function addList() {
        const usersReVamp = users.map((user, index) => {
            if (user.idnum === localUser) {
                return {
                    ...user,
                    lists: [...user.lists, {name: newListName, type: "normalList"}]
                }
            }
            else {
                return user;
            }
        });
        setUsers(usersReVamp);
        console.log(localUserInfo[0] && localUserInfo[0].lists);
    }

    function goToList(id) {

    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text>To Do Lists</Text>
                <Pressable onPress={() => setChooseList(!chooseList)}>
                    <Text>+</Text>
                </Pressable>
                {chooseList ? (
                    <View>
                    <Pressable onPress={() => setNewListSetup(true)}>
                        <Text>List</Text>
                    </Pressable>
                    <Pressable>
                        <Text>Timed List</Text>
                    </Pressable>
                </View>
                ) : (
                    <View></View>
                )}  
                {newListSetup ? (
                    <View>
                        <TextInput placeholder="Name your list..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setNewListName(e)}/>
                        <Pressable onPress={newList}>
                            <Text>Done</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View></View>
                )}   
                {localUserInfo[0] && localUserInfo[0].lists.map((list, key) => (
                    <View key={key}>
                        <Pressable onPress={() => goToList(key)}>
                            <Text>{list.name}</Text>
                        </Pressable>
                    </View>
                ))}  
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
});

export default ToDoList;