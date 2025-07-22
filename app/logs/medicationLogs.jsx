import { UserContext } from "@/AppContexts/UserContext";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import 'react-native-get-random-values';
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";
import { v4 as uuidv4 } from 'uuid';

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
    const [repeat, setRepeat] = useState("");
    const [fetchRepeat, setFetchRepeat] = useState(0);
    const [fetchOption, setFetchOption] = useState("");
    const [todayDate, setTodayDate] = useState(new Date());

    const repeatlist = [
        {key: "1", value: "Daily"},
        {key: "2", value: "Weekly"},
        {key: "3", value: "Biweekly"},
        {key: "4", value: "Monthly"},
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setTodayDate(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        if (todayDate.getHours() === 10) {
            const usersReVamp = users.map((user, index) => {
                if (user.idnum === localUser) {
                    const newLogs = user.logs.map((log) => {
                        if (log.type === "Medication") {
                            const newTimes = log.takeTimes.map((time) => {
                                if (time.taken === true && todayDate.getMonth() === log.nextDose.getMonth() && todayDate.getDate() === log.nextDose.getDate()) {
                                    return {
                                        ...time,
                                        taken: false
                                    }
                                }
                                else {
                                    return time;
                                }
                            });

                            const newDate = log.nextDose;

                            if (todayDate.getMonth() === log.nextDose.getMonth() && todayDate.getDate() === log.nextDose.getDate()) {
                                if (log.takeSpan === "Daily") {
                                    newDate.setDate(log.nextDose.getDate() + 1);
                                }
                                else if (log.takeSpan === "Weekly") {
                                    newDate.setDate(log.nextDose.getDate() + 7);
                                }
                                else if (log.takeSpan === "Biweekly") {
                                    newDate.setDate(log.nextDose.getDate() + 14);
                                }
                                else if (log.takeSpan === "Monthly") {
                                    newDate.setDate(log.nextDose.getDate() + 28);
                                }
                            }                            

                            return {
                                ...log,
                                takeTimes: newTimes,
                                nextDose: newDate
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
        
    }, [todayDate])

    function addTime() {
        setTimes([...times, {id: times.length, time: oneTime, taken: false}]);
        setOneTime("");
    }

    function addMedLog() {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            const next = startDate;
            const nextFetch = fetchDate;

            if (repeat === "Daily") {
                next.setDate(startDate.getDate() + 1);
            }
            else if (repeat === "Weekly") {
                next.setDate(startDate.getDate() + 7);
            }
            else if (repeat === "Biweekly") {
                next.setDate(startDate.getDate() + 14);
            }
            else if (repeat === "Monthly") {
                next.setDate(startDate.getDate() + 28);
            }

            if (fetchOption === "Daily") {
                nextFetch.setDate(startDate.getDate() + 1);
            }
            else if (fetchOption === "Weekly") {
                nextFetch.setDate(startDate.getDate() + 7);
            }
            else if (fetchOption === "Biweekly") {
                nextFetch.setDate(startDate.getDate() + 14);
            }
            else if (fetchOption === "Monthly") {
                nextFetch.setDate(startDate.getDate() + 28);
            }

            return {
                ...user,
                logs: [...user.logs, {id: uuidv4(), name: medName, type: "Medication", 
                    dosage: dosage, firstPickUp: fetchDate, fetchOption: fetchOption, nextFetchDate: nextFetch, repeats: fetchRepeat, start: startDate, 
                    takeSpan: repeat, takeTimes: times, nextDose: next}]
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
        setStartDate(new Date());
        setFetchDate(new Date());
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

    function takeMeds(itemID, timeID) {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            const newLogs = user.logs.map((log) => {
                if (log.id === itemID) {
                    const newTimes = log.takeTimes.map((time) => {
                        if (time.id === timeID) {
                            return {
                                ...time,
                                taken: true
                            }
                        }
                        else {
                            return time;
                        }
                    })
                    return {
                        ...log,
                        takeTimes: newTimes
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

    function fetchMeds(itemID) {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            const newLogs = user.logs.map((log) => {
                if (log.type === "Medication") {
                    if (log.id === itemID) {
                        if (log.nextFetchDate.getDate() !== null) {
                            const nextFetchNew = log.nextFetchDate;

                            if (log.fetchOption === "Daily") {
                                nextFetchNew.setDate(log.nextFetchDate.getDate() + 1);
                            }
                            else if (log.fetchOption === "Weekly") {
                                nextFetchNew.setDate(log.nextFetchDate.getDate() + 7);
                            }
                            else if (log.fetchOption === "Biweekly") {
                                nextFetchNew.setDate(log.nextFetchDate.getDate() + 14);
                            }
                            else if (log.fetchOption === "Monthly") {
                                nextFetchNew.setDate(log.nextFetchDate.getDate() + 28);
                            }

                            return {
                                ...log,
                                nextFetchDate: nextFetchNew
                            }
                        }
                        else {
                            return log;
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
    }

    const renderMeds = ({item}) => {
        return (
            <View style={stylesLight.medicationContainer}>
                <View style={stylesLight.nameDose}>
                    <View style={stylesLight.nameContainer}>
                        <Text style={stylesLight.name}>{item.name}</Text>
                        <Text style={stylesLight.dosage}>{item.dosage}</Text>
                    </View>
                    <View style={stylesLight.doseContainer}>
                        <View style={stylesLight.nextDose}>
                            <Text style={stylesLight.nextDoseText}>{item.takeTimes.find((time) => time.taken === false) !== undefined ? "Next Dose:" : "Finished!"}</Text>
                            <Text>{item.takeTimes.find((time) => time.taken === false) !== undefined ? item.takeTimes.find((time) => time.taken === false).time : ""}</Text>
                        </View>                        
                        {item.takeTimes.find((time) => time.taken === false) === undefined ? 
                        (<View></View>) : 
                        (<Pressable onPress={() => takeMeds(item.id, item.takeTimes.find((time) => time.taken === false).id)}>
                            <Text style={stylesLight.clickable}>Taken</Text>
                        </Pressable>)}
                    </View>
                </View>                                
                <View style={stylesLight.fetching}>
                    <View>
                        <Text style={stylesLight.nextFetchText}>Next Fetching Date: </Text>
                        <Text style={stylesLight.nextFetchTime}>{item.nextFetchDate.toLocaleDateString()}</Text>
                    </View>                      
                    {item.nextFetchDate.getDate() === todayDate.getDate() ? 
                    (<Pressable onPress={() => fetchMeds(item.id)}>
                        <Text style={stylesLight.clickable}>Fetched</Text>
                    </Pressable>) : 
                    (<View></View>)}   
                </View>                                    
            </View>
        )
    }

    const hiddenRender = (data, rowmap) => {
        return (
            <View style={stylesLight.hiddenItems}>
                <Pressable style={stylesLight.deleteContainer} onPress={() => deleteItem(data.item)}>
                    <Text style={stylesLight.deleteText}>Delete</Text>
                </Pressable>
                <Pressable style={stylesLight.editContainer}>
                    <Text style={stylesLight.editText}>Edit</Text>
                </Pressable>
            </View>
        )
    }

    const deleteItem = (item) => {
        const userChange = users.map((user) => {
            if (user.idnum === localUser) {
                const newLogs = user.logs.filter((log) => log.id !== item.id)
                return {
                    ...user,
                    logs: newLogs
                }
            }
            else {
                return user;
            }
        }) 

        setUsers(userChange);
    }

    function removeTime(timeID) {
        setTimes(times.filter((time) => time.id !== timeID));
    }

    return (
        <SafeAreaView style={stylesLight.container}>
            <LinearGradient colors={["#ffffff", "#aaaaaa"]} style={stylesLight.contentContainer}>
                <View style={stylesLight.headerContainer}>
                    <Pressable onPress={() => router.navigate("/home")} style={stylesLight.back}>
                        <Text style={stylesLight.backText}>Home</Text>
                    </Pressable>
                    <Text style={stylesLight.header}>MEDICATION</Text>
                    <Pressable onPress={() => setCreateEntry(true)} style={stylesLight.add}>
                        <Text style={stylesLight.addIcon}>Add</Text>
                    </Pressable>
                </View>  
                <SwipeListView data={localUserInfo[0] && localUserInfo[0].logs.filter((log) => log.type === "Medication")} 
                renderItem={renderMeds} 
                renderHiddenItem={hiddenRender}
                leftOpenValue={100}
                disableLeftSwipe={true}/>
                {createEntry ? (
                    <View style={stylesLight.overLay}>
                        <View style={stylesLight.addMedContainer}>
                            <View style={stylesLight.formNameDose}>
                                <View>
                                    <Text style={stylesLight.formHeaders}>Medication Name</Text>
                                    <TextInput placeholder="Name..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setMedName(e)} style={stylesLight.input} />
                                </View>
                                <View>
                                    <Text style={stylesLight.formHeaders}>Dosage</Text>
                                    <TextInput placeholder="Dose..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setDosage(e)} style={stylesLight.input} />
                                </View>
                                <View>
                                    <Text style={stylesLight.formHeaders}>Repeats: </Text>
                                    <TextInput placeholder="Num..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setFetchRepeat(e)} style={stylesLight.input}/>
                                </View>
                            </View>    
                            <View style={stylesLight.formFetchDate}>
                                <View>
                                    <Text style={stylesLight.formHeaders}>Date of First Pick-Up: </Text>
                                    <Text style={stylesLight.dateStyle}>{fetchDate.toLocaleDateString()}</Text>
                                </View> 
                                <View>
                                    <Pressable onPress={showFetchDatePicker}>
                                        <Text style={stylesLight.click}>Change Date</Text>
                                    </Pressable>
                                </View>
                            </View> 
                            <Text style={stylesLight.formHeaders}>Fetch: </Text>
                            <View style={stylesLight.dropdown}>
                                <SelectList 
                                    setSelected={(e) => setFetchOption(e)}
                                    data={repeatlist}
                                    save="value"
                                    placeholder="Choose... (eg. daily)"
                                />
                            </View>
                            
                            <View style={stylesLight.formFetchDate}>
                                <View>
                                    <Text style={stylesLight.formHeaders}>Date of First Dose: </Text>
                                    <Text style={stylesLight.dateStyle}>{startDate.toLocaleDateString()}</Text>
                                </View> 
                                <View>
                                    <Pressable onPress={showStartDatePicker}>
                                        <Text style={stylesLight.click}>Change Date</Text>
                                    </Pressable>
                                </View>
                            </View> 
                            <Text style={stylesLight.formHeaders}>Take:</Text>
                            <View style={stylesLight.dropdown}>
                                <SelectList 
                                    setSelected={(e) => setRepeat(e)}
                                    data={repeatlist}
                                    save="value"
                                    placeholder="Choose... (eg. daily)"
                                />
                            </View>                            
                            {times && times.map((time) => (
                                <View key={time.id} style={stylesLight.timeStyleContainer}>
                                    <Text style={stylesLight.timeStyle}>{time.time}</Text>
                                    <Pressable onPress={() => removeTime(time.id)}>
                                        <Text>Remove</Text>
                                    </Pressable>
                                </View>                                
                            ))}
                            <View style={stylesLight.formAddTime}>
                                <TextInput placeholder="Time (eg. 14:00)..." placeholderTextColor="#9e9e9e" value={oneTime} onChangeText={(e) => setOneTime(e)} style={stylesLight.input} />
                                <Pressable onPress={addTime}>
                                    <Text style={stylesLight.click}>Add Time To Take</Text>
                                </Pressable>
                            </View>                            
                            <Pressable onPress={addMedLog}>
                                <Text style={[stylesLight.click, {marginTop: 5}]}>Done</Text>
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
    medicationContainer: {
        backgroundColor: "#f0f0f0",
        padding: 20,
        paddingTop: 15,
        paddingBottom: 15,
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        borderBottomWidth: 1,
        borderBottomColor: "#9e9e9e", 
        height: 135,  
    },
    nameDose: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    name: {
        fontFamily: "Economica-Bold",
        fontSize: 20,
        marginBottom: 8
    },
    dosage: {
        fontFamily: "Sunflower-Light",
        fontSize: 15,
    },
    fetching: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },
    nameContainer: {
        alignSelf: "flex-start"
    },
    doseContainer: {
        flexDirection: "row",
    },
    nextDose: {
        alignItems: "center",
        marginRight: 40
    },
    clickable: {
        backgroundColor: "#f0f0f0",
        padding: 10,
        elevation: 5,
        borderRadius: 10,
        fontFamily: "Sunflower-Light",
        fontSize: 15,
    },
    nextDoseText: {
        fontFamily: "Economica-Bold",
        fontSize: 20,
    },
    nextFetchText: {
        fontFamily: "Economica-Bold",
        fontSize: 20,
    },
    nextFetchTime: {
        fontFamily: "Sunflower-Light",
        fontSize: 15,
        marginTop: 8
    },
    pillImage: {
        width: 50,
        height: 50
    },
    hiddenItems: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 135,
    },
    deleteContainer: {
        backgroundColor: "#940314",
        width: "50%",
    },
    deleteText: {
        fontFamily: "Sunflower-Light",
        color: "#fff",
        fontSize: 20,
        marginLeft: 10,
        marginTop: 50
    },
    editContainer: {
        backgroundColor: "#039464ff",
        width: "50%",
    },
    editText: {
        fontFamily: "Sunflower-Light",
        color: "#fff",
        fontSize: 20,
        textAlign: "right",
        marginRight: 10,
        marginTop: 50
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        marginBottom: 5,
    },
    addMedContainer: {
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
        textAlign: "center",
        fontFamily: "Sunflower-Light",
        fontSize: 15
    },
    formHeaders: {
        fontFamily: "Economica-Bold",
        fontSize: 20,
        textAlign: "center"
    },
    formNameDose: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    formFetchStuff: {
        flexDirection: "row"
    },
    formAddTime: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    formFetchDate: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    dropdown: {
        marginBottom: 10,
        marginTop: 5
    },
    timeStyleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 0.5,
        marginBottom:10
    },
    timeStyle: {
        fontFamily: "Sunflower-Light",
        fontSize: 15
    },
    dateStyle: {
        fontFamily: "Sunflower-Light",
        fontSize: 15,
        marginTop: 5 
    }
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
    medicationContainer: {
        backgroundColor: "#323232",
        padding: 20,
        paddingTop: 15,
        paddingBottom: 15,
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        borderBottomWidth: 1,
        borderBottomColor: "#9e9e9e", 
        height: 135,  
    },
    nameDose: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    name: {
        fontFamily: "Economica-Bold",
        fontSize: 20,
        marginBottom: 8,
        color: "#fff"
    },
    dosage: {
        fontFamily: "Sunflower-Light",
        fontSize: 15,
        color: "#fff"
    },
    fetching: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },
    nameContainer: {
        alignSelf: "flex-start"
    },
    doseContainer: {
        flexDirection: "row",
    },
    nextDose: {
        alignItems: "center",
        marginRight: 40
    },
    clickable: {
        backgroundColor: "#3b3b3b",
        padding: 10,
        elevation: 5,
        borderRadius: 10,
        fontFamily: "Sunflower-Light",
        fontSize: 15,
        color: "#fff"
    },
    nextDoseText: {
        fontFamily: "Economica-Bold",
        fontSize: 20,
        color: "#fff"
    },
    nextFetchText: {
        fontFamily: "Economica-Bold",
        fontSize: 20,
        color: "#fff"
    },
    nextFetchTime: {
        fontFamily: "Sunflower-Light",
        fontSize: 15,
        marginTop: 8,
        color: "#fff"
    },
    pillImage: {
        width: 50,
        height: 50
    },
    hiddenItems: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 135,
    },
    deleteContainer: {
        backgroundColor: "#940314",
        width: "50%",
    },
    deleteText: {
        fontFamily: "Sunflower-Light",
        color: "#fff",
        fontSize: 20,
        marginLeft: 10,
        marginTop: 50
    },
    editContainer: {
        backgroundColor: "#039464ff",
        width: "50%",
    },
    editText: {
        fontFamily: "Sunflower-Light",
        color: "#fff",
        fontSize: 20,
        textAlign: "right",
        marginRight: 10,
        marginTop: 50
    },
    input: {
        backgroundColor: "#323232",
        borderWidth: 0.5,
        borderColor: "#000000",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        marginBottom: 5,
    },
    addMedContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "10%",
        padding: 20,
        backgroundColor: "#323232",
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
        backgroundColor: "#3b3b3b",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        borderRadius: 10,
        textAlign: "center",
        fontFamily: "Sunflower-Light",
        fontSize: 15,
        color: "#fff"
    },
    formHeaders: {
        fontFamily: "Economica-Bold",
        fontSize: 20,
        textAlign: "center",
        color: "#fff"
    },
    formNameDose: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    formFetchStuff: {
        flexDirection: "row"
    },
    formAddTime: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    formFetchDate: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    dropdown: {
        marginBottom: 10,
        marginTop: 5
    },
    timeStyleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 0.5,
        marginBottom:10
    },
    timeStyle: {
        fontFamily: "Sunflower-Light",
        fontSize: 15,
        color: "#fff"
    },
    dateStyle: {
        fontFamily: "Sunflower-Light",
        fontSize: 15,
        marginTop: 5 ,
        color: "#fff"
    }
})

export default MedicationLogs;