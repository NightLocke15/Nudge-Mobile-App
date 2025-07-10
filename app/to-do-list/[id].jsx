import { UserContext } from "@/AppContexts/UserContext";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

function MakeList() {
    const { id } = useLocalSearchParams();
    const { setUsers, users, localUserInfo, localUser } = useContext(UserContext); 
    const [listItem, setListItem] = useState("");
    const router = useRouter();

    function addItem() {
        const userListAddision = users.map((user) => {
            if (user.idnum === localUser) {
                const newUserLists = user.lists.map((list) => {
                    if (list.name === localUserInfo[0].lists[id].name) {
                        return {
                            ...list,
                            listItems: [...list.listItems, listItem]
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

    return (
        <SafeAreaView style={stylesLight.container}>
            <LinearGradient style={stylesLight.contentContainer} colors={["#ffffff", "#aaaaaa"]}>
                <Pressable onPress={() => router.navigate("/to-do-list/to-do-list")}>
                    <Text>Back</Text>
                </Pressable>
                <Text>{localUserInfo[0].lists[id].name}</Text>
                <TextInput placeholder="Add List Item..." placeholderTextColor="#9e9e9e" value={listItem} onChangeText={(e) => setListItem(e)}/>
                <Pressable onPress={addItem}>
                    <Text>Add</Text>
                </Pressable>
                {localUserInfo[0] && localUserInfo[0].lists[id].listItems.map((list, key) => (
                    <View key={key}>
                        <Text>{list}</Text>
                    </View>
                ))} 
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
})

export default MakeList;