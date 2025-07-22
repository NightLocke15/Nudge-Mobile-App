import Diary from "@/AppComponents/diary";
import People from "@/AppComponents/people";
import { UserContext } from "@/AppContexts/UserContext";
import { useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function MakeLog() {
    const { id } = useLocalSearchParams();
    const { localUserInfo } = useContext(UserContext); 
    const [index, setIndex] = useState(localUserInfo[0].logs.findIndex((log) => log.id === id));   

    return (
        <SafeAreaView style = {stylesLight.container}>
            {localUserInfo[0].logs[index].type === "Diary" ? 
            <Diary id={index} /> :
            <People id={index} />}
        </SafeAreaView>
    )
}

const stylesLight = StyleSheet.create({
    container: {
        flex: 1
    },
});

export default MakeLog;