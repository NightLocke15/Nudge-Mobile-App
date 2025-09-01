import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Octicons } from "@react-native-vector-icons/octicons";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { SafeAreaView } from "react-native-safe-area-context";
import { v4 as uuidv4 } from 'uuid';

function MedicationLogs() {
    //Accessing user context and all the users that already exist
    const { users, setUsers, localUserInfo, localUser } = useContext(UserContext);
    const {currentTheme, gradientColours } = useContext(ThemeContext);

    //Router used to navigate back to the home page
    const router = useRouter();

    //Setting the state of entry creation accessing the creation tile
    const [createEntry, setCreateEntry] = useState(false);

    //Storing all the information relevant to the current entry to be added
    const [times, setTimes] = useState([]);
    const [oneTime, setOneTime] = useState("");
    const [medName, setMedName] = useState("");
    const [dosage, setDosage] = useState("");
    const [fetchDate, setFetchDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [repeat, setRepeat] = useState("");
    const [fetchRepeat, setFetchRepeat] = useState(0);
    const [fetchOption, setFetchOption] = useState("");

    //Accessing the current date to reset the dosage taken when a new day starts
    const [todayDate, setTodayDate] = useState(new Date());

    //List of repeat time spans for when to take medicine or when to go fetch the new perscription
    const repeatlist = [
        {key: "1", value: "Daily"},
        {key: "2", value: "Weekly"},
        {key: "3", value: "Biweekly"},
        {key: "4", value: "Monthly"},
    ]

    const [item, setItem] = useState();
    const [action, setAction] = useState(false);
    const [tapPostition, setTapPosition] = useState({x: 0, y: 0})

    const [viewImg, setViewImg] = useState(false);
    const [image, setImage] = useState("");

    //Use effect that resets the time every minute. This is then used to check whether a new day has started so that the dosages taken can be reset
    useEffect(() => {
        const interval = setInterval(() => {
            setTodayDate(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, [])

    //Use effect that resets the dosage taken and the next dose date depending on what the repeat is set at
    useEffect(() => {
        if (todayDate.getHours() === 0) {
            const usersReVamp = users.map((user, index) => {
                if (user.idnum === localUser) {
                    const newLogs = user.logs.map((log) => {
                        if (log.type === "Medication") {
                            //reset the times
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
                            //set next date
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

    //function that adds times to list while creating the medication log that is then used for the dosages and later added to the log added to the user info
    function addTime() {
        setTimes([...times, {id: times.length, time: oneTime, taken: false}]);
        setOneTime("");
    }

    //add the medication log to the user info
    function addMedLog() {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            const next = startDate;
            const nextFetch = fetchDate;

            //setting the repeats of meds taken
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

            //setting the repeat on when to fetch the medication
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

            //adds all the information stored to a log in the user's info
            return {
                ...user,
                logs: [...user.logs, {id: uuidv4(), image: "", name: medName, type: "Medication", 
                    dosage: dosage, firstPickUp: fetchDate, fetchOption: fetchOption, nextFetchDate: nextFetch, repeats: fetchRepeat, start: startDate, 
                    takeSpan: repeat, takeTimes: times, nextDose: next}]
            }
        }
        else {
            return user;
        }
        });
        //reset all the storage
        setUsers(usersReVamp);
        setCreateEntry(false);
        setTimes([]);
        setMedName("");
        setDosage("");
        setRepeat("");
        setStartDate(new Date());
        setFetchDate(new Date());
    }

    //The following three functions are used to change the date on when the medication was first fetched
    //Sets the date to the one that was chosen
    const onFetchChange = (event, selectedDate) => {
        const currDate = selectedDate;
        setFetchDate(currDate);
    }

    //shows the calendar tile that the user can use to pick a different date (the default is the current date/the date when the log was created)
    const showFetchMode = (mode) => {
        DateTimePickerAndroid.open({
            value: fetchDate,
            onChange: onFetchChange,
            mode: mode,
            is24Hour: true
        })
    }

    //Activate the Calendar by choosing the right mode
    const showFetchDatePicker = () => {
        showFetchMode("date")
    }

    //The following three are the same as the previous but for when the medication is first taken
    //Sets the date to the one that was chosen
    const onStartChange = (event, selectedDate) => {
        const currDate = selectedDate;
        setStartDate(currDate);
    }

    //shows the calendar tile that the user can use to pick a different date (the default is the current date/the date when the log was created)
    const showStartMode = (mode) => {
        DateTimePickerAndroid.open({
            value: fetchDate,
            onChange: onStartChange,
            mode: mode,
            is24Hour: true
        })
    }
    
    //Activate the Calendar by choosing the right mode
    const showStartDatePicker = () => {
        showStartMode("date")
    }

    //Change the state of the time set to take the meds to taken in the user's information
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

    //Trigger the fetched state when the user has fetched their medication. This is only active on the day that the medication should be fetched
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

    //Code that deletes the correct medication entry from the user's information
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
        setAction(false);
    }

    //Takes out a dosage time that the ueser no longer wants (can only do this when creating the medication log or when editing)
    function removeTime(timeID) {
        setTimes(times.filter((time) => time.id !== timeID));
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            addImageToLogs(result.assets[0].uri);            
        }
    };

    function addImageToLogs(image) {
        const userList = users.map((user) => {
            if (user.idnum === localUser) {
                const newLogs = user.logs.map((log) => {
                    if (log.id === item.id) {
                        return {
                            ...log,
                            image: image,
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
        })

        setUsers(userList);
    }

    function viewImage(item) {
        setViewImg(true);
        setItem(item)
    }

    const doubleTap = (item) => Gesture.Tap().maxDuration(250).numberOfTaps(2).onStart((event) => {
        setItem(item);
        setTapPosition({x: event.absoluteX , y: event.absoluteY})
        setAction(true);
    }).runOnJS(true);

    return (
        <SafeAreaView style={stylesLight.container}>
            <LinearGradient colors={gradientColours} style={stylesLight.contentContainer}>
                <View style={stylesLight.headerContainer}>
                    <Pressable onPress={() => router.navigate("/home")} style={stylesLight.back}>
                        <Octicons name="home" size={25} color={'#585858'}/>
                    </Pressable>
                    <Text style={stylesLight.header}>Medication</Text>
                    <Pressable onPress={() => setCreateEntry(true)} style={stylesLight.add}>
                        <Octicons name="plus" size={25} color={'#585858'}/>
                    </Pressable>
                </View>  
                {localUserInfo[0] && localUserInfo[0].logs.filter((log) => log.type === "Medication").map((med) => (
                    <GestureDetector key={med.id} gesture={Gesture.Exclusive(doubleTap(med))}>
                        <View style={stylesLight.medicationContainer}>
                            <View style={stylesLight.nameDose}>
                                <Pressable onPress={() => viewImage(med)}>
                                    {med.image !== "" ? <Image source={{uri: med.image}} style={stylesLight.pillImage}/> : <Image source={""} style={stylesLight.pillImage}/>}
                                </Pressable>                                
                                <View style={stylesLight.nameContainer}>
                                    <Text style={stylesLight.name}>{med.name}</Text>
                                    <Text style={stylesLight.dosage}>{med.dosage}</Text>
                                </View>
                            </View>                                
                            <View style={stylesLight.fetching}>
                                <View>
                                    <Text style={stylesLight.nextFetchText}>Fetch: </Text>
                                    <Text style={stylesLight.nextFetchTime}>{med.nextFetchDate.toLocaleDateString()}</Text>
                                </View>                      
                                {med.nextFetchDate.getDate() === todayDate.getDate() ? 
                                (<Pressable onPress={() => fetchMeds(med.id)}>
                                    <Text style={stylesLight.clickable}>Fetched</Text>
                                </Pressable>) : 
                                (<View></View>)}  
                                <View style={stylesLight.doseContainer}>
                                    <View style={stylesLight.nextDose}>
                                        <Text style={stylesLight.nextDoseText}>{med.takeTimes.find((time) => time.taken === false) !== undefined ? "Next Dose:" : "Finished!"}</Text>
                                        <Text style={stylesLight.nextDoseTime}>{med.takeTimes.find((time) => time.taken === false) !== undefined ? med.takeTimes.find((time) => time.taken === false).time : ""}</Text>
                                    </View>                        
                                    {med.takeTimes.find((time) => time.taken === false) === undefined ? 
                                    (<View></View>) : 
                                    (<Pressable onPress={() => takeMeds(med.id, med.takeTimes.find((time) => time.taken === false).id)}>
                                        <Octicons name="check-circle" size={40} color={'#585858'} style={stylesLight.checkButton}/>
                                    </Pressable>)}
                                </View> 
                            </View>                                    
                        </View>
                    </GestureDetector>
                ))}
                {createEntry ? (
                    <View style={stylesLight.overLay}>
                        <View style={stylesLight.addMedContainer}>
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
                {action ? (
                    <View style={stylesLight.overLay}>
                        <View style={[stylesLight.actionContainer, {position: "absolute", left: tapPostition.x, top: tapPostition.y}]}> 
                            <Pressable style={stylesLight.edit}>
                                <Text style={stylesLight.editText}>Edit</Text>
                            </Pressable>
                            <Pressable onPress={() => deleteItem(item)} style={stylesLight.delete}>
                                <Text style={stylesLight.deleteText}>Delete</Text>
                            </Pressable>
                            <Pressable onPress={() => setAction(false)} style={stylesLight.cancel}>
                                <Text style={stylesLight.cancelText}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                ) : (
                    <View></View>
                )}
                {viewImg ? (
                    <View style={stylesLight.overLay}>
                        <View style={stylesLight.viewImageContainer}> 
                            <Pressable onPress={() => setViewImg(false)} style={stylesLight.close}>
                                <Octicons name="x" size={30} color={'#585858'}/>
                            </Pressable>
                            {image !== "" ? <Image source={{uri: image}} style={stylesLight.viewPill}/> : <Image source={""} style={stylesLight.pillImage}/>}
                            <Pressable onPress={pickImage} style={stylesLight.cancel}>
                                <Text style={stylesLight.cancelText}>{image === "" ? "Add" : "Change"}</Text>
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
    headerContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    header: {
        fontFamily: "PTSans-Regular",
        fontSize: 40,
        marginLeft: "auto",
        marginRight: "auto"
    },
    add: {        
        position: "absolute",
        right: "5%",
        top: "30%"                   
    },
    medicationContainer: {
        backgroundColor: "#e3e3e3",
        padding: 20,
        paddingTop: 15,
        paddingBottom: 15,
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        borderBottomWidth: 1,
        borderBottomColor: "#9e9e9e",  
    },
    nameDose: {
        flexDirection: "row",
    },
    name: {
        fontFamily: "PTSans-Regular",
        fontSize: 20,
        marginBottom: 8
    },
    dosage: {
        fontFamily: "Roboto-Regular",
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
        marginRight: 10
    },
    clickable: {
        backgroundColor: "#f2f2f2",
        padding: 10,
        elevation: 5,
        borderRadius: 10,
        fontFamily: "Roboto-Regular",
        fontSize: 15,
    },
    nextDoseText: {
        fontFamily: "PTSans-Regular",
        fontSize: 20,
    },
    nextDoseTime: {
        fontFamily: "Roboto-Regular",
        fontSize: 15,
        alignSelf: "flex-start"
    },
    nextFetchText: {
        fontFamily: "PTSans-Regular",
        fontSize: 20,
    },
    nextFetchTime: {
        fontFamily: "Roboto-Regular",
        fontSize: 15,
    },
    pillImage: {
        width: 60,
        height: 60,
        borderWidth: 0.5,
        borderColor: "#2b2b2b",
        marginRight: 15,
        borderRadius: 100
    },
    hiddenItems: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 135,
    },
    input: {
        backgroundColor: "#e3e3e3",
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
        top: "5%",
        padding: 20,
        backgroundColor: "#e3e3e3",
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
        backgroundColor: "#f2f2f2",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        borderRadius: 10,
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        fontSize: 15
    },
    formHeaders: {
        fontFamily: "PTSans-Regular",
        fontSize: 20,
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
        fontFamily: "Roboto-Regular",
        fontSize: 15
    },
    dateStyle: {
        fontFamily: "Roboto-Regular",
        fontSize: 15,
        marginTop: 5 
    },
    edit: {
        backgroundColor: "#1f9615ff",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        borderRadius: 10,
    },
    editText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        fontSize: 18,
        color: '#e3e3e3'
    },
    delete: {
        backgroundColor: "#be2206ff",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    deleteText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        fontSize: 18,
        color: '#e3e3e3'
    },
    actionContainer: {
        backgroundColor: '#e3e3e3',
        padding: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    cancelText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        fontSize: 18
    },
    cancel: {
        backgroundColor: "#f2f2f2",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    checkButton: {
        backgroundColor: "#f2f2f2",
        padding: 3,
        borderRadius: 40,
        elevation: 5,
    },
    viewImageContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "5%",
        padding: 20,
        backgroundColor: "#e3e3e3",
        elevation: 5,
        borderRadius: 10,
    },
    viewPill: {
        width: 300,
        height: 300,
        alignSelf: "center",
        borderRadius: 10
    },
    close: {
        alignSelf: "flex-end",
        marginBottom: 10,
    }
})

export default MedicationLogs;