import { UserContext } from "@/AppContexts/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function MedicationLogs() {
    const { users, setUsers, localUserInfo, localUser } = useContext(UserContext);
    const router = useRouter();
    const [createEntry, setCreateEntry] = useState(false);
    const [times, setTimes] = useState([]);
    const [oneTime, setOneTime] = useState("");
    const [medName, setMedName] = useState("");
    const [dosage, setDosage] = useState("");



    return (
        <SafeAreaView>
            <LinearGradient colors={["#ffffff", "#aaaaaa"]}>
                <View>
                    <Pressable onPress={() => router.navigate("/home")}>
                        <Text>Home</Text>
                    </Pressable>
                    <Text>MEDICATION</Text>
                    <Pressable onPress={() => setCreateEntry(true)}>
                        <Text>Add</Text>
                    </Pressable>
                </View>  
                {/* <SwipeListView data={localUserInfo[0] && localUserInfo[0].logs.filter((log) => log.type === "Medication")} 
                renderItem={} 
                renderHiddenItem={} 
                leftOpenValue={100}
                disableLeftSwipe={true}/> */}
                {createEntry ? (
                    <View>
                        <View>
                            <Text>Medication Name</Text>
                            <TextInput placeholder="Medication Name..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setMedName(e)} />
                            <Text>Dosage</Text>
                            <TextInput placeholder="Dosage..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setDosage(e)} />
                            {times && times.map((time) => (
                                <Text>{time}</Text>
                            ))}
                            <TextInput placeholder="Time (eg. 14:00)..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setLogName(e)} />
                            <Pressable>
                                <Text>Add Time To Take</Text>
                            </Pressable>
                            <Text>(Can do this several times)</Text>
                            <Pressable>
                                <Text>Done</Text>
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

export default MedicationLogs;