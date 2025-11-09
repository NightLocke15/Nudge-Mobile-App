import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Octicons } from "@react-native-vector-icons/octicons";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
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

    //Information and states set when interacting with items by tapping or double tapping in order to edit or delete the correct items
    const [item, setItem] = useState();
    const [action, setAction] = useState(false);
    const [tapPostition, setTapPosition] = useState({x: 0, y: 0})

    //All booleans to do with editing and deleting items, and to view or edit the image
    const [viewImg, setViewImg] = useState(false);
    const [image, setImage] = useState("");
    const [warning, setWarning] = useState(false);
    const [editing, setEditing] = useState(false);

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
        if (medName !== "") {
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

    //Triggers the warning that warns user they are about to delete a medication
    function triggerDelete() {
        setWarning(true);
        setAction(false);
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
        setWarning(false);
    }

    //Takes out a dosage time that the ueser no longer wants (can only do this when creating the medication log or when editing)
    function removeTime(timeID) {
        setTimes(times.filter((time) => time.id !== timeID));
    }

    //Allows the user to add an image from their library
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

    //Adds image of the medicine to the user's data
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

    //Triggers the editing of the medicine and sets the data up to be edited
    function triggerEditing() {
        setEditing(true);
        setAction(false);
        setCreateEntry(true);
        setMedName(item.name);
        setTimes(item.takeTimes);
        setDosage(item.dosage);
        setRepeat(item.takeSpan);
        setStartDate(item.start);
        setFetchDate(item.firstPickUp);
        setFetchOption(item.fetchOption);
        setFetchRepeat(item.repeats);
    }

    //Edits the info about the medication in the user's data
    function editMed() {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            const newLogs = user.logs.map((log) => {
                if (log.id === item.id) {
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
                        ...log,
                        name: medName,
                            dosage: dosage, firstPickUp: fetchDate, fetchOption: fetchOption, nextFetchDate: nextFetch, repeats: fetchRepeat, start: startDate, 
                            takeSpan: repeat, takeTimes: times, nextDose: next
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

    //View the image of the medication
    function viewImage(medItem) {
        setViewImg(true);
        setItem(medItem);
        setImage(medItem.image);
    }

    //Close the image
    function closeImage() {
        setViewImg(false);
        setImage("");
    }

    //Gesture handler constants. Detects a double tap on some elements.
    const doubleTap = (item) => Gesture.Tap().maxDuration(250).numberOfTaps(2).onStart((event) => {
        setItem(item);
        setTapPosition({x: event.absoluteX > 260 ? 260 : event.absoluteX, y: event.absoluteY > 530 ? 530 : event.absoluteY})
        setAction(true);
    }).runOnJS(true);

    return (
        <React.Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor: currentTheme.includes("Light") ? "#e3e3e3" : "#2b2b2b" }} />
        <SafeAreaView style={[currentTheme.includes("Light") ? stylesLight.container : stylesDark.container, {backgroundColor: currentTheme.includes("Light") ? "#e3e3e3" : "#2b2b2b"}]}>
            <StatusBar barStyle={currentTheme.includes("Light") ? "dark-content" : "light-content"} backgroundColor={currentTheme.includes("Light") ? "#e3e3e3" : "#2b2b2b"} />
            <LinearGradient colors={gradientColours} style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer}>
                <View style={currentTheme.includes("Light") ? stylesLight.headerContainer : stylesDark.headerContainer}>
                    <Pressable onPress={() => router.navigate("/home")} style={currentTheme.includes("Light") ? stylesLight.back : stylesDark.back}>
                        <Octicons name="home" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                    </Pressable>
                    <Text style={currentTheme.includes("Light") ? stylesLight.header : stylesDark.header}>Medication</Text>
                    <Pressable onPress={() => setCreateEntry(true)} style={currentTheme.includes("Light") ? stylesLight.add : stylesDark.add}>
                        <Octicons name="plus" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                    </Pressable>
                </View>  
                {localUserInfo[0] && localUserInfo[0].logs.filter((log) => log.type === "Medication").map((med) => (
                    <GestureDetector key={med.id} gesture={Gesture.Exclusive(doubleTap(med))}>
                        <View style={currentTheme.includes("Light") ? stylesLight.medicationContainer : stylesDark.medicationContainer}>
                            <View style={currentTheme.includes("Light") ? stylesLight.nameDose : stylesDark.nameDose}>
                                <Pressable onPress={() => viewImage(med)}>
                                    {med.image !== "" ? <Image source={{uri: med.image}} style={currentTheme.includes("Light") ? stylesLight.pillImage : stylesDark.pillImage}/> : <Image source={""} style={currentTheme.includes("Light") ? stylesLight.pillImage : stylesDark.pillImage}/>}
                                </Pressable>                                
                                <View style={currentTheme.includes("Light") ? stylesLight.nameContainer : stylesDark.nameContainer}>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.name : stylesDark.name}>{med.name}</Text>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.dosage : stylesDark.dosage}>{med.dosage}</Text>
                                </View>
                            </View>                                
                            <View style={currentTheme.includes("Light") ? stylesLight.fetching : stylesDark.fetching}>
                                <View>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.nextFetchText : stylesDark.nextFetchText}>Fetch: </Text>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.nextFetchTime : stylesDark.nextFetchTime}>{med.nextFetchDate.toLocaleDateString()}</Text>
                                </View>                      
                                {med.nextFetchDate.getDate() === todayDate.getDate() ? 
                                (<Pressable onPress={() => fetchMeds(med.id)}>
                                    <Octicons name="check-circle" size={40} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'} style={currentTheme.includes("Light") ? stylesLight.checkButton : stylesDark.checkButton}/>
                                </Pressable>) : 
                                (<View></View>)}  
                                <View style={currentTheme.includes("Light") ? stylesLight.doseContainer : stylesDark.doseContainer}>
                                    <View style={currentTheme.includes("Light") ? stylesLight.nextDose : stylesDark.nextDose}>
                                        <Text style={currentTheme.includes("Light") ? stylesLight.nextDoseText : stylesDark.nextDoseText}>{med.takeTimes.find((time) => time.taken === false) !== undefined ? "Next Dose:" : "Finished!"}</Text>
                                        <Text style={currentTheme.includes("Light") ? stylesLight.nextDoseTime : stylesDark.nextDoseTime}>{med.takeTimes.find((time) => time.taken === false) !== undefined ? med.takeTimes.find((time) => time.taken === false).time : ""}</Text>
                                    </View>                        
                                    {med.takeTimes.find((time) => time.taken === false) === undefined ? 
                                    (<View></View>) : 
                                    (<Pressable onPress={() => takeMeds(med.id, med.takeTimes.find((time) => time.taken === false).id)}>
                                        <Octicons name="check-circle" size={40} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'} style={currentTheme.includes("Light") ? stylesLight.checkButton : stylesDark.checkButton}/>
                                    </Pressable>)}
                                </View> 
                            </View>                                    
                        </View>
                    </GestureDetector>
                ))}
                {createEntry ? (
                    <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.addMedContainer : stylesDark.addMedContainer}>
                            <Pressable onPress={() => setCreateEntry(false)} style={currentTheme.includes("Light") ? stylesLight.close : stylesDark.close}>
                                <Octicons name="x" size={20} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                            </Pressable>
                            <View>
                                <Text style={currentTheme.includes("Light") ? stylesLight.formHeaders : stylesDark.formHeaders}>Medication Name</Text>
                                <TextInput placeholder="Name..." placeholderTextColor="#9e9e9e" value={medName} onChangeText={(e) => setMedName(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            </View>
                            <View>
                                <Text style={currentTheme.includes("Light") ? stylesLight.formHeaders : stylesDark.formHeaders}>Dosage</Text>
                                <TextInput placeholder="Dose..." placeholderTextColor="#9e9e9e" value={dosage} onChangeText={(e) => setDosage(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            </View>
                            <View>
                                <Text style={currentTheme.includes("Light") ? stylesLight.formHeaders : stylesDark.formHeaders}>Repeats: </Text>
                                <TextInput placeholder="Num..." placeholderTextColor="#9e9e9e" value={fetchRepeat} onChangeText={(e) => setFetchRepeat(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input}/>
                            </View> 
                            <View style={currentTheme.includes("Light") ? stylesLight.formFetchDate : stylesDark.formFetchDate}>
                                <View>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.formHeaders : stylesDark.formHeaders}>Date of First Pick-Up: </Text>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.dateStyle : stylesDark.dateStyle}>{fetchDate.toLocaleDateString()}</Text>
                                </View> 
                                <View>
                                    <Pressable onPress={showFetchDatePicker}>
                                        <Text style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.click : stylesDark.click, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>Change Date</Text>
                                    </Pressable>
                                </View>
                            </View> 
                            <Text style={currentTheme.includes("Light") ? stylesLight.formHeaders : stylesDark.formHeaders}>Fetch: </Text>
                            <View style={currentTheme.includes("Light") ? stylesLight.dropdown : stylesDark.dropdown}>
                                <SelectList 
                                    setSelected={(e) => setFetchOption(e)}
                                    data={repeatlist}
                                    save="value"
                                    placeholder="Choose... (eg. daily)"
                                    dropdownTextStyles={{color: currentTheme.includes("Light") ? "#242424" : "#e3e3e3"}}
                                    inputStyles={{color: currentTheme.includes("Light") ? "#242424" : "#e3e3e3"}}
                                    arrowicon={<Octicons name="chevron-down" size={18} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>}
                                    closeicon={<Octicons name="x" size={18} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>}
                                    search={false}
                                />
                            </View>
                            
                            <View style={currentTheme.includes("Light") ? stylesLight.formFetchDate : stylesDark.formFetchDate}>
                                <View>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.formHeaders : stylesDark.formHeaders}>Date of First Dose: </Text>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.dateStyle : stylesDark.dateStyle}>{startDate.toLocaleDateString()}</Text>
                                </View> 
                                <View>
                                    <Pressable onPress={showStartDatePicker}>
                                        <Text style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.click : stylesDark.click, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>Change Date</Text>
                                    </Pressable>
                                </View>
                            </View> 
                            <Text style={currentTheme.includes("Light") ? stylesLight.formHeaders : stylesDark.formHeaders}>Take:</Text>
                            <View style={currentTheme.includes("Light") ? stylesLight.dropdown : stylesDark.dropdown}>
                                <SelectList 
                                    setSelected={(e) => setRepeat(e)}
                                    data={repeatlist}
                                    save="value"
                                    placeholder="Choose... (eg. daily)"
                                    dropdownTextStyles={{color: currentTheme.includes("Light") ? "#242424" : "#e3e3e3"}}
                                    inputStyles={{color: currentTheme.includes("Light") ? "#242424" : "#e3e3e3"}}
                                    arrowicon={<Octicons name="chevron-down" size={18} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>}
                                    closeicon={<Octicons name="x" size={18} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>}
                                    search={false}
                                />
                            </View>                            
                            {times && times.map((time) => (
                                <View key={time.id} style={currentTheme.includes("Light") ? stylesLight.timeStyleContainer : stylesDark.timeStyleContainer}>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.timeStyle : stylesDark.timeStyle}>{time.time}</Text>
                                    <Pressable onPress={() => removeTime(time.id)}>
                                        <Text style={currentTheme.includes("Light") ? stylesLight.timeStyle : stylesDark.timeStyle}>Remove</Text>
                                    </Pressable>
                                </View>                                
                            ))}
                            <View style={currentTheme.includes("Light") ? stylesLight.formAddTime : stylesDark.formAddTime}>
                                <TextInput placeholder="Time (eg. 14:00)..." placeholderTextColor="#9e9e9e" value={oneTime} onChangeText={(e) => setOneTime(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                                <Pressable onPress={addTime}>
                                    <Text style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.click : stylesDark.click, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>Add Time To Take</Text>
                                </Pressable>
                            </View>                            
                            <Pressable onPress={editing ? editMed : addMedLog}>
                                <Text style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.click : stylesDark.click, {marginTop: 5}, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>Done</Text>
                            </Pressable>
                        </View>
                    </View>                    
                ) : (
                    <View></View>
                )}
                {action ? (
                    <Pressable onPress={() => setAction(false)} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={[currentTheme.includes("Light") ? stylesLight.actionContainer : stylesDark.actionContainer, {position: "absolute", left: tapPostition.x, top: tapPostition.y}]}> 
                            <Pressable onPress={triggerEditing} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit, {backgroundColor: pressed ? '#0f470aff' : '#1f9615ff'}]}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                            </Pressable>
                            <Pressable onPress={triggerDelete} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.delete : stylesDark.delete, {backgroundColor: pressed ? '#7a1503ff' : '#be2206ff'}]}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.deleteText : stylesDark.deleteText}>Delete</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                ) : (
                    <View></View>
                )}
                {viewImg ? (
                    <Pressable onPress={() => setViewImg(false)} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.viewImageContainer : stylesDark.viewImageContainer}> 
                            <Pressable onPress={closeImage} style={currentTheme.includes("Light") ? stylesLight.close : stylesDark.close}>
                                <Octicons name="x" size={30} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                            </Pressable>
                            {image !== "" ? <Image source={{uri: image}} style={currentTheme.includes("Light") ? stylesLight.viewPill : stylesDark.viewPill}/> : <Image source={""} style={currentTheme.includes("Light") ? stylesLight.viewPill : stylesDark.viewPill}/>}
                            <Pressable onPress={pickImage} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.cancelText : stylesDark.cancelText}>{image === "" ? "Add" : "Change"}</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                    ) : (
                    <View></View>
                )}
                {warning ? (
                    <Pressable onPress={() => setWarning(false)} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.warningContainer : stylesDark.warningContainer}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.warningText : stylesDark.warningText}>Are you sure you want to delete this medication log?</Text>
                            <View style={currentTheme.includes("Light") ? stylesLight.warningButtonContainer : stylesDark.warningButtonContainer}>
                                <Pressable onPress={() => deleteItem(item)} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.delete : stylesDark.delete, {backgroundColor: pressed ? '#7a1503ff' : '#be2206ff'}]}>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.deleteText : stylesDark.deleteText}>Delete</Text>
                                </Pressable>
                                <Pressable onPress={() => setWarning(false)} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.cancelText : stylesDark.cancelText}>Cancel</Text>
                                </Pressable>
                            </View>                            
                        </View>
                    </Pressable>                    
                ) : (
                    <View></View>
                )}
            </LinearGradient>
        </SafeAreaView>
        </React.Fragment>
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
        color: "#242424",
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
        color: "#242424",
        fontSize: 20,
        marginBottom: 8
    },
    dosage: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
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
        color: "#242424",
        fontSize: 15,
    },
    nextDoseText: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 20,
    },
    nextDoseTime: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 15,
        alignSelf: "flex-start"
    },
    nextFetchText: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 20,
    },
    nextFetchTime: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
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
        color: "#242424",
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
        color: "#242424",
        fontSize: 15
    },
    formHeaders: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
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
        color: "#242424",
        fontSize: 15
    },
    dateStyle: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
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
        color: "#242424",
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
    },
    warningContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "20%",
        padding: 20,
        backgroundColor: "#e3e3e3",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1,
    },
    warningText: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 20,
        textAlign: "center"
    },
    warningButtonContainer: {
        flexDirection: "row"
    },
    close: {
        position: "absolute",
        right: 10,
        top: 10,
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
    headerContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    header: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
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
        backgroundColor: "#2b2b2b",
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
        color: "#e3e3e3",
        fontSize: 20,
        marginBottom: 8
    },
    dosage: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
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
        backgroundColor: "#3a3a3a",
        padding: 10,
        elevation: 5,
        borderRadius: 10,
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 15,
    },
    nextDoseText: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 20,
    },
    nextDoseTime: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 15,
        alignSelf: "flex-start"
    },
    nextFetchText: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 20,
    },
    nextFetchTime: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 15,
    },
    pillImage: {
        width: 60,
        height: 60,
        borderWidth: 0.5,
        borderColor: "#9e9e9e",
        marginRight: 15,
        borderRadius: 100
    },
    hiddenItems: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 135,
    },
    input: {
        backgroundColor: "#2b2b2b",
        color: "#e3e3e3",
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
        top: "5%",
        padding: 20,
        backgroundColor: "#2b2b2b",
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
        backgroundColor: "#3a3a3a",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        borderRadius: 10,
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 15
    },
    formHeaders: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
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
        color: "#e3e3e3",
        fontSize: 15
    },
    dateStyle: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
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
        backgroundColor: '#2b2b2b',
        padding: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    cancelText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 18
    },
    cancel: {
        backgroundColor: "#3a3a3a",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    checkButton: {
        backgroundColor: "#3a3a3a",
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
        backgroundColor: "#2b2b2b",
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
    },
    warningContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "20%",
        padding: 20,
        backgroundColor: "#2b2b2b",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1,
    },
    warningText: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 20,
        textAlign: "center"
    },
    warningButtonContainer: {
        flexDirection: "row"
    },
    close: {
        position: "absolute",
        right: 10,
        top: 10,
    },
})

export default MedicationLogs;