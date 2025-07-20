import { UserContext } from "@/AppContexts/UserContext";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";

function MedicationLogs() {
    const { users, setUsers, localUserInfo, localUser } = useContext(UserContext);
    const router = useRouter();
    const [createEntry, setCreateEntry] = useState(false);
    const [times, setTimes] = useState([]);
    const [oneTime, setOneTime] = useState("");
    const [medName, setMedName] = useState("");
    const [dosage, setDosage] = useState("");
    const [fetchDate, setFetchDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [repeat, setRepeat] = useState("")

    const repeatlist = [
        {key: "1", value: "Daily"},
        {key: "2", value: "Weekly"},
        {key: "3", value: "Biweekly"},
        {key: "3", value: "Monthly"},
    ]

    function addTime() {
        setTimes([...times, oneTime]);
        setOneTime("");
    }

    function addMedLog() {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            return {
                ...user,
                logs: [...user.logs, {id: user.logs.length, name: medName, type: "Medication", dosage: dosage, firstPickUp: fetchDate, start: startDate, takeSpan: repeat, takeTimes: times }]
            }
        }
        else {
            return user;
        }
        });
        setUsers(usersReVamp);
        setCreateEntry(false);
        setTimes([]);
        setMedName("");
        setDosage("");
        setRepeat("");
    }

    const onFetchChange = (event, selectedDate) => {
        const currDate = selectedDate;
        setFetchDate(currDate);
    }

    const showFetchMode = (mode) => {
        DateTimePickerAndroid.open({
            value: fetchDate,
            onChange: onFetchChange,
            mode: mode,
            is24Hour: true
        })
    }

    const showFetchDatePicker = () => {
        showFetchMode("date")
    }

    const onStartChange = (event, selectedDate) => {
        const currDate = selectedDate;
        setStartDate(currDate);
    }

    const showStartMode = (mode) => {
        DateTimePickerAndroid.open({
            value: fetchDate,
            onChange: onStartChange,
            mode: mode,
            is24Hour: true
        })
    }

    const showStartDatePicker = () => {
        showStartMode("date")
    }

    const renderMeds = ({item}) => {
        return (
            <View>
                <Text>{item.name}</Text>
            </View>
        )
    }

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
                <SwipeListView data={localUserInfo[0] && localUserInfo[0].logs.filter((log) => log.type === "Medication")} 
                renderItem={renderMeds} 
                leftOpenValue={100}
                disableLeftSwipe={true}/>
                {createEntry ? (
                    <View>
                        <View>
                            <Text>Medication Name</Text>
                            <TextInput placeholder="Medication Name..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setMedName(e)} />
                            <Text>Dosage</Text>
                            <TextInput placeholder="Dosage..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setDosage(e)} />
                            <Text>Date of First Pick-Up: {fetchDate.toLocaleDateString()}</Text>
                            <Pressable onPress={showFetchDatePicker}>
                                <Text>Change Date</Text>
                            </Pressable>
                            <Text>Date of First Dose: {startDate.toLocaleDateString()}</Text>
                            <Pressable onPress={showStartDatePicker}>
                                <Text>Change Date</Text>
                            </Pressable>
                            <Text>Take:</Text>
                            <SelectList 
                                setSelected={(e) => setRepeat(e)}
                                data={repeatlist}
                                save="value"
                                placeholder="Choose... (eg. daily)"
                            />
                            {times && times.map((time, key) => (
                                <Text key={key}>{time}</Text>
                            ))}
                            <TextInput placeholder="Time (eg. 14:00)..." placeholderTextColor="#9e9e9e" value={oneTime} onChangeText={(e) => setOneTime(e)} />
                            <Pressable onPress={addTime}>
                                <Text>Add Time To Take</Text>
                            </Pressable>
                            <Text>(Can do this several times)</Text>
                            <Pressable onPress={addMedLog}>
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