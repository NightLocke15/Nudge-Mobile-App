import { ThemeContext } from '@/AppContexts/ThemeContext';
import { UserContext } from '@/AppContexts/UserContext';
import Octicons from '@react-native-vector-icons/octicons';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { SafeAreaView } from "react-native-safe-area-context";
import { TimerPicker, TimerPickerModal } from "react-native-timer-picker";
import { v4 as uuidv4 } from 'uuid';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    })
})

function Clock() {
    //Accessing user context and all the users that already exist
    const { localUser, localUserInfo, users, setUsers } = useContext(UserContext);
    const {currentTheme, gradientColours } = useContext(ThemeContext);

    //All thge information and states for the timer to be set, started, paused, resumed and stopped
    const [timerAmounts, setTimerAmounts] = useState({hours: 0, minutes: 0, seconds: 0});
    const [showTimerPickerT, setShowTimerPickerT] = useState(false);
    const [timerReady, setTimerReady] = useState(false);
    const [timerButtons, setTimerButtons] = useState(false);
    const [timerRunning, setTimerRunning] = useState(false);
    const [currentTimer, setCurrentTimer] = useState({hours: 0, minutes: 0, seconds: 0});
    
    //Storing the information for the alarm before adding it to the user's data.
    const [alarmName, setAlarmName] = useState("");
    const [alarmTime, setAlarmTime] = useState({hours: 0, minutes: 0});
    const [addAlarm, setAddAlarm] = useState(false);

    //Router to navigate the user back to the home page
    const router = useRouter();

    //Information and states set when interacting with items by tapping or double tapping in order to edit or delete the correct items
    const [action, setAction] = useState(false);
    const [tapPostition, setTapPosition] = useState({x: 0, y: 0})
    const [item, setItem] = useState();

    //All booleans to do with editing and deleting items
    const [warning, setWarning] = useState(false);
    const [editing, setEditing] = useState(false);

    //Stores the current time
    const [time, setTime] = useState(new Date());

    //Stores an array of weekdays for the list of days that can be chosen for the alarm to go off on
    const [weekDays, setWeekDays] = useState([
        {
            id: 0,
            key: "Su",
            day: "Sunday",
            select: false,
        },
        {
            id: 1,
            key: "Mo",
            day: "Monday",
            select: false,
        },
        {
            id: 2,
            key: "Tu",
            day: "Tuesday",
            select: false,
        },
        {
            id: 3,
            key: "We",
            day: "Wednesday",
            select: false,
        },
        {
            id: 4,
            key: "Th",
            day: "Thursday",
            select: false,
        },
        {
            id: 5,
            key: "Fr",
            day: "Friday",
            select: false,
        },
        {
            id: 6,
            key: "Sa",
            day: "Saturday",
            select: false,
        },
    ])

    const [expoPushToken, setExpoPushToken] = useState('');
    const [channels, setChannels] = useState([]);
    const [notification, setNotification] = useState();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

        if (Platform.OS === 'android') {
            Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
        }
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        }
    }, []);

    //Interval to update the clock as time passes by
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
            localUserInfo[0] && localUserInfo[0].alarms.forEach(alarm => {
                if (alarm.active) {
                    if (alarm.time.hours === new Date().getHours() && alarm.time.minutes === new Date().getMinutes()) {
                        schedulePushNotification(alarm.name, "");
                    }
                    else {

                    }
                }
                else {

                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    //Useeffect to track the timer as it counts down
    useEffect(() => {
        if (!timerRunning) return;

        let totalSeconds = (timerAmounts.hours * 60 * 60) + (timerAmounts.minutes * 60) + timerAmounts.seconds;

        const interval = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                setTimerAmounts({hours: Math.floor(totalSeconds / 3600), minutes: Math.floor((totalSeconds % 3600) / 60), seconds: totalSeconds % 60,})
            }
            else {
                clearInterval(interval);
                schedulePushNotification("Timer", "Your Timer has run out!");
                setTimerRunning(false);
            }
        }, 1000)
        
        return () => clearInterval(interval);  
    }, [timerRunning])

    //Sets the timer amount so it is ready to be started with teh correct numbers
    function confirmTimer(amount) {
        setTimerAmounts(amount);
        setCurrentTimer(amount);
        setShowTimerPickerT(false);
        if (amount.hours !== 0 || amount.minutes !== 0 || amount.seconds !== 0) {
            setTimerReady(true);
        }
        else {
            setTimerReady(false);
        }        
    }

    //Brings correct buttons into view for the user
    function startTimer() {
        setTimerButtons(true);
        setTimerRunning(true);
    }

    //Resets the timer and the buttons
    function resetTimer() {
        setTimerAmounts(currentTimer);
        setTimerButtons(false);
        setTimerRunning(false);
    }

    //Adds the alarm that was created to the user's data
    function addingAlarm() {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            return {
                ...user,
                alarms: [...user.alarms, {id: uuidv4(), name: alarmName, time: alarmTime, days: weekDays, active: true}],
            }
        }
        else {
            return user;
        }
        });
        setUsers(usersReVamp);
        setWeekDays(weekDays.map((day) => {
            return {
                ...day,
                select: false
            }
        }));
        setAlarmName("");
        setAlarmTime({hours: 0, minutes: 0})
        setAddAlarm(false);
    }

    //Selects/Unselects the days that the user wants the alarm to go off on
    function selectDay(day) {
        const newWeekdays = weekDays.map((weekDay) => {
            if (weekDay.key === day.key) {
                return {
                    ...weekDay,
                    select: !weekDay.select,
                }
            }
            else {
                return weekDay;
            }
        });

        setWeekDays(newWeekdays);
    }

    //Sets the alarm active or inactive in the user's data
    function alarmActive(id) {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            const newAlarms = user.alarms.map((alarm) => {
                if (alarm.id === id) {
                    return {
                        ...alarm, 
                        active: !alarm.active,
                    }
                }
                else {
                    return alarm;
                }
            });
            return {
                ...user,
                alarms: newAlarms,
            }
        }
        else {
            return user;
        }
        });
        setUsers(usersReVamp);
    }

    //Triggers delete warning, warning the user before they delete anything.
    function triggerDelete() {
        setAction(false);
        setWarning(true);
    }

    //Deletes the alarm from the user's data
    function deleteAlarm() {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            const newAlarms = user.alarms.filter((alarm) => alarm.id !== item.id);
            return {
                ...user,
                alarms: newAlarms
            }
        }
        else {
            return user;
        }
        });
        setUsers(usersReVamp);
        setWarning(false);
    }

    //Triggers edit of alarms and sets the data so the alarm's details can be edited
    function triggerEdit() {
        setEditing(true);
        setAction(false);
        setAlarmTime(item.time);
        setAlarmName(item.name);
        setWeekDays(item.days);
        setAddAlarm(true);
    }

    //Edits alarm info in the user's data
    function editAlarm() {
        const userChange = users.map((user) => {
            if (user.idnum === localUser) {
                const newUserAlarms = user.alarms.map((alarm) => {
                    if (alarm.id === item.id) {
                        return {
                            ...alarm,
                            name: alarmName,
                            time: alarmTime,
                            days: weekDays,
                        }
                    }
                    else {
                        return alarm;
                    }
                })
                return {
                    ...user,
                    alarms: newUserAlarms
                }
            }
            else {
                return user;
            }
        });

        setUsers(userChange);
        setWeekDays(weekDays.map((day) => {
            return {
                ...day,
                select: false
            }
        }));
        setAlarmName("");
        setAlarmTime({hours: 0, minutes: 0})
        setAddAlarm(false);
        setEditing(false);
    }

    async function schedulePushNotification(title, message) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: message,
            },
            trigger: {
                trigger: { seconds: 1 }, 
            }
        });
    }

    async function registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('myNotificationChannel', {
                name: 'A channel is needed for the permissions prompt to appear',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification.');
                return;
            }

            try {
                const projectID = Constants?.expoConfig?.extra?.eas?.projectID ?? Constants?.easConfig?.projectId;
                if (!projectID) {
                    throw new Error('Project ID not found.');
                }
                token = (
                    await Notifications.getExpoPushTokenAsync({
                        projectID,
                    })
                ).data;
            }
            catch (e) {
                console.error('Error getting Expo push token:', e);
                token = `${e}`;
            }
        }
        else {
            alert('Must use physical device for Push Notifications.');
        }

        return token;
    }

    //Gesture handler constant that handles the double tap on the alarms elements
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
            <LinearGradient style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer} colors={gradientColours}>
                <View style={currentTheme.includes("Light") ? stylesLight.headerContainer : stylesDark.headerContainer}>
                    <Pressable onPress={() => router.navigate("/home")} style={currentTheme.includes("Light") ? stylesLight.back : stylesDark.back}>
                        <Octicons name="home" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                    </Pressable>
                    <Text style={currentTheme.includes("Light") ? stylesLight.header : stylesDark.header}>Clock</Text>
                    <Text style={currentTheme.includes("Light") ? stylesLight.timeText : stylesDark.timeText}>{time.getHours().toString().padStart(2, "0")}:{time.getMinutes().toString().padStart(2, "0")}</Text>
                </View>
                <Text style={currentTheme.includes("Light") ? stylesLight.heading : stylesDark.heading}>Timer</Text>
                <Text style={currentTheme.includes("Light") ? stylesLight.timerNums : stylesDark.timerNums}>{timerAmounts.hours.toString().padStart(2, "0")}:{timerAmounts.minutes.toString().padStart(2, "0")}:{timerAmounts.seconds.toString().padStart(2, "0")}</Text>
                {timerButtons ? (
                    <View style={currentTheme.includes("Light") ? stylesLight.buttonContainer : stylesDark.buttonContainer}>
                        <Pressable onPress={resetTimer} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.button : stylesDark.button, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.buttonText : stylesDark.buttonText}>Delete</Text>
                        </Pressable>
                        <Pressable onPress={() => setTimerRunning(!timerRunning)} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.button : stylesDark.button, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.buttonText : stylesDark.buttonText}>{timerRunning ? "Pause" : "Resume"}</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View style={currentTheme.includes("Light") ? stylesLight.buttonContainer : stylesDark.buttonContainer}>
                        <Pressable onPress={() => setShowTimerPickerT(true)} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.button : stylesDark.button, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.buttonText : stylesDark.buttonText}>Set Timer</Text>
                        </Pressable>
                        {timerReady ? (
                            <Pressable onPress={startTimer} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.button : stylesDark.button, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.buttonText : stylesDark.buttonText}>Start Timer</Text>
                            </Pressable>
                        ) : (
                            <View></View>
                        )}
                    </View>
                )}                
                <View>
                    <Text style={currentTheme.includes("Light") ? stylesLight.heading : stylesDark.heading}>Alarms</Text>
                    <Pressable onPress={() => setAddAlarm(true)} style={currentTheme.includes("Light") ? stylesLight.add : stylesDark.add}>
                        <Octicons name="plus" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                    </Pressable>
                </View>
                <ScrollView>
                    {localUserInfo[0] && localUserInfo[0].alarms.map((alarm) => (
                        <GestureDetector key={alarm.id} gesture={Gesture.Exclusive(doubleTap(alarm))}>
                            <View style={currentTheme.includes("Light") ? stylesLight.alarmContainer : stylesDark.alarmContainer}>
                                <View>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.alarmTime : stylesDark.alarmTime}>{alarm.time.hours.toString().padStart(2, "0")}:{alarm.time.minutes.toString().padStart(2, "0")}</Text>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.alarmName : stylesDark.alarmName}>{alarm.name}</Text>
                                </View>  
                                <View style={currentTheme.includes("Light") ? stylesLight.alarmDaysContainer : stylesDark.alarmDaysContainer}>
                                        {alarm.days.map((day) => (
                                            day.select ? 
                                            <View key={day.id} style={currentTheme.includes("Light") ? stylesLight.alarmDay : stylesDark.alarmDay}>
                                                <Text style={currentTheme.includes("Light") ? stylesLight.alarmDayText : stylesDark.alarmDayText}>{day.key}</Text>
                                            </View> : <View key={day.id}></View>
                                        ))}
                                    </View>                                                     
                                <Switch
                                value={alarm.active} 
                                onChange={() => alarmActive(alarm.id)}/>
                            </View>                            
                        </GestureDetector>
                    ))}   
                </ScrollView>          
                {addAlarm ? (
                    <Pressable style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.addAlarmContainer : stylesDark.addAlarmContainer}>
                            <Pressable onPress={() => setAddAlarm(false)} style={currentTheme.includes("Light") ? stylesLight.close : stylesDark.close}>
                                <Octicons name="x" size={20} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                            </Pressable>
                            <TimerPicker 
                            hourLabel=":"
                            minuteLabel=""
                            LinearGradient={LinearGradient}
                            padHoursWithZero
                            styles={{
                                theme: currentTheme.includes("Light") ? "light" : "dark",
                                backgroundColor: currentTheme.includes("Light") ? "#e3e3e3" : "#2b2b2b", 
                                pickerContainer: {
                                    justifyContent: "center",
                                },
                                pickerItem: {
                                    fontSize: 30,
                                },
                                pickerLabel: {
                                    fontSize: 30,
                                    marginTop: 0,
                                },
                                pickerItemContainer: {
                                    width: 100
                                },
                                pickerLabelContainer: {
                                    right: -20,
                                    top: 0,
                                    bottom: 6,
                                    width: 40,
                                    alignItems: "center",
                                },
                            }}
                            hideSeconds
                            onDurationChange={(time) => setAlarmTime(time)}
                            initialValue={{days: 0, hours: alarmTime.hours, minutes: alarmTime.minutes, seconds: 0}} />
                            <View style={currentTheme.includes("Light") ? stylesLight.dayContainer : stylesDark.dayContainer}>
                                {weekDays.map((day) => (
                                    <Pressable key={day.key} onPress={() => selectDay(day)} style={[currentTheme.includes("Light") ? stylesLight.dayButton : stylesDark.dayButton, {backgroundColor: currentTheme.includes("Light") ? (day.select ? "#999999ff" : "#f2f2f2") : (day.select ? "#999999ff" : "#3a3a3a")}]}>
                                        <Text style={currentTheme.includes("Light") ? stylesLight.dayText : stylesDark.dayText}>{day.key}</Text>
                                    </Pressable>
                                ))}
                            </View>
                            <Text style={currentTheme.includes("Light") ? stylesLight.headingAlarm : stylesDark.headingAlarm}>Alarm Name:</Text>
                            <TextInput placeholder="Name..." placeholderTextColor="#9e9e9e" value={alarmName} onChangeText={(e) => setAlarmName(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />                          
                            <Pressable style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.click : stylesDark.click, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]} onPress={editing ? editAlarm : addingAlarm}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.clickText : stylesDark.clickText}>Done</Text>
                            </Pressable>
                        </View>
                    </Pressable>                    
                ) : (
                    <View></View>
                )}
                {action ? (
                    <Pressable onPress={() => setAction(false)} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={[currentTheme.includes("Light") ? stylesLight.actionContainer : stylesDark.actionContainer, {position: "absolute", left: tapPostition.x, top: tapPostition.y}]}> 
                            <Pressable onPress={triggerEdit} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit, {backgroundColor: pressed ? '#0f470aff' : '#1f9615ff'}]}>
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
                {warning ? (
                    <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.warningContainer : stylesDark.warningContainer}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.warningText : stylesDark.warningText}>Are you sure you want to delete this alarm?</Text>
                            <View style={currentTheme.includes("Light") ? stylesLight.warningButtonContainer : stylesDark.warningButtonContainer}>
                                <Pressable onPress={deleteAlarm} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.delete : stylesDark.delete, {backgroundColor: pressed ? '#7a1503ff' : '#be2206ff'}]}>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.deleteText : stylesDark.deleteText}>Delete</Text>
                                </Pressable>
                                <Pressable onPress={() => setWarning(false)} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.cancel : stylesDark.cancel, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]}>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.cancelText : stylesDark.cancelText}>Cancel</Text>
                                </Pressable>
                            </View>                            
                        </View>
                    </View>                    
                ) : (
                    <View></View>
                )}
                <TimerPickerModal
                visible={showTimerPickerT}
                setIsVisible={setShowTimerPickerT}
                onConfirm={(amount) => confirmTimer(amount)}
                LinearGradient={LinearGradient} />
            </LinearGradient>
        </SafeAreaView>
        </React.Fragment>
    )
}

const stylesLight = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
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
        top: "15%"                   
    },
    heading: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 25,
        marginLeft: 10,
        marginRight: 10,
        paddingBottom: 10,
        borderBottomColor: "#9e9e9e",
        borderBottomWidth: 1,
    },
    timerNums: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 50,
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#f2f2f2",
        padding: 15,
        margin: 10,
        elevation: 5,
        borderRadius: 25,
    },
    buttonText: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 18,
    },
    input: {
        backgroundColor: "#e3e3e3",
        color: "#242424",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        marginBottom: 20,
    },
    addAlarmContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "10%",
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
    },
    clickText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 15
    },
    headingAlarm: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 20,
        marginBottom: 5
    },
    timeText: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 18,

    },
    dayContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 10,
    },
    dayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
    dayText: {
        textAlign: "center",
        alignSelf: "center",
        color: "#242424",
    },
    alarmContainer: {
        backgroundColor: "#e3e3e3",
        borderBottomColor: "#9e9e9e",
        borderBottomWidth: 0.8,
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    alarmTime: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 25,
    },
    alarmName: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 18,
    },
    alarmDaysContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    alarmDay: {
        margin: 3,
    },
    alarmDayText: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 15,
        marginTop: 15
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
    timeText: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 20, 
        position: "absolute",
        right: "5%",
        top: "30%"         
    },
    close: {
        position: "absolute",
        right: 10,
        top: 10,
    },
});

const stylesDark = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    back: {
        position: "absolute",
        left: "5%",
        top: "15%"        
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
    heading: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 25,
        marginLeft: 10,
        marginRight: 10,
        paddingBottom: 10,
        borderBottomColor: "#9e9e9e",
        borderBottomWidth: 1,
    },
    timerNums: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 50,
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#3a3a3a",
        padding: 15,
        margin: 10,
        elevation: 5,
        borderRadius: 25,
    },
    buttonText: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 18,
    },
    input: {
        backgroundColor: "#2b2b2b",
        color: "#e3e3e3",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        marginBottom: 20,
    },
    addAlarmContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "10%",
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
    },
    clickText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 15
    },
    headingAlarm: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 20,
        marginBottom: 5
    },
    timeText: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 18,

    },
    dayContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 10,
    },
    dayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
    dayText: {
        textAlign: "center",
        alignSelf: "center",
        color: "#e3e3e3",
    },
    alarmContainer: {
        backgroundColor: "#2b2b2b",
        borderBottomColor: "#9e9e9e",
        borderBottomWidth: 0.8,
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    alarmTime: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 25,
    },
    alarmName: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 18,
    },
    alarmDaysContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    alarmDay: {
        margin: 3,
    },
    alarmDayText: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 15,
        marginTop: 15
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
    timeText: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 20, 
        position: "absolute",
        right: "5%",
        top: "30%"         
    },
    close: {
        position: "absolute",
        right: 10,
        top: 10,
    },
});

export default Clock;