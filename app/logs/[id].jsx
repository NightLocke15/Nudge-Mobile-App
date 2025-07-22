import Diary from "@/AppComponents/diary";
import People from "@/AppComponents/people";
import { UserContext } from "@/AppContexts/UserContext";
import { useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function MakeLog() {
    const { id } = useLocalSearchParams();
    const { localUserInfo } = useContext(UserContext); 

    return (
        <SafeAreaView style = {stylesLight.container}>
            {localUserInfo[0].logs[id].type === "Diary" ? 
            <Diary id={id} /> :
            <People id={id} />}
        </SafeAreaView>
    )
}

const stylesLight = StyleSheet.create({
    container: {
        flex: 1
    },
});

export default MakeLog;