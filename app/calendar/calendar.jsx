import { UserContext } from "@/AppContexts/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import { SelectList } from "react-native-dropdown-select-list";
import { TextInput } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { SafeAreaView } from "react-native-safe-area-context";
import { v4 as uuidv4 } from 'uuid';

function CalendarFunc() {
    const { users, setUsers, localUserInfo, localUser } = useContext(UserContext);
    const router = useRouter();
    const [selectedDay, setSelectedDay] = useState('');
    const [dateList, setDateList] = useState({});
    const [dynamicDateList, setDynamicDateList] = useState({});
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [today, setToday] = useState();
    const [todaysEvents, setTodaysEvents] = useState([]);
    const [creating, setCreating] = useState(false);

    const [event, setEvent] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventDesc, setEventDesc] = useState('')
    const [place, setPlace] = useState('');
    const [time, setTime] = useState('')
    const [durationHrs, setDurationHrs] = useState('');
    const [durationMins, setDurationMins] = useState('');

    const eventTypesList = ['Birthday', 'Meeting', 'Appointment', 'Other'];

    useEffect(() => {
        const todayDate = new Date();
        setToday(`${todayDate.getFullYear()}-${todayDate.getMonth() + 1 < 10 ? `0${todayDate.getMonth() + 1}` : `${todayDate.getMonth() + 1}`}-${todayDate.getDate() < 10 ? `0${todayDate.getDate()}` : `${todayDate.getDate()}`}`)

        const relevantLogs = localUserInfo[0] && localUserInfo[0].logs.filter((log) => log.type === "People");
        const dates = {};
        relevantLogs && relevantLogs.forEach((log) => {
            const year = `${todayDate.getFullYear()}`;
            const month = log.birthday.substring(5,7);
            const day = log.birthday.substring(8);

            dates[`${year}-${month}-${day}`] = {
                marked: true,
                dots: [{key: 'Birthday', color: '#06a1c4'}],
            }
        });

        const otherEvents = localUserInfo[0] && localUserInfo[0].events;

        otherEvents && otherEvents.forEach((event) => {
            const dotColor = event.type === 'Birthday' ? '#06a1c4' : event.type === 'Meeting' ? '#06c406ff' : event.type === 'Appointment' ? '#c4065fff' : '#c4a106ff';
            const currentDate = dates[event.date];
            const currentDots = currentDate && currentDate.dots || [];
            const exists = currentDots.some(dot => dot.key === event.type);
            if (!exists) {
                dates[event.date] = {
                    marked: true,
                    dots: [...currentDots, {color: dotColor}],
                }
            }
            else {
                
            }
            
        })

        setDateList(dates);
        setDynamicDateList(dates);
    }, [localUserInfo]);

    function daySelect(date) {
        setSelectedDay(date);
        setDynamicDateList(dateList);
        if (dynamicDateList[date]) {
            setDynamicDateList(prevData => ({
                ...prevData, 
                [date]: {selected: true, marked: true, dots: dynamicDateList[date].dots}
            }));
        }
        else {
            setDynamicDateList(prevData => ({
                ...prevData, 
                [date]: {selected: true}, 
            }));
        }        
    }

    function findTodaysEvents() {
    }

    const getMonth = (month) => {
        setCurrentMonth(month.month);
    }

    function addEvent() {
        const usersReVamp = users.map((user, index) => {
        if (user.idnum === localUser) {
            return {
                ...user,
                events: [...user.events, {id: uuidv4(), eventName: event, type: eventType, date: selectedDay, description: eventDesc, place: place, time: time, hours: durationHrs, mins: durationMins}]
            }
        }
        else {
            return user;
        }
        });
        setUsers(usersReVamp);
        setEvent('');
        setEventType('');
        setPlace('');
        setTime('');
        setEventDesc('');
        setDurationHrs('');
        setDurationMins('');
        setCreating(false);
    }

    return (
        <SafeAreaView style={stylesLight.container}>
            <LinearGradient style={stylesLight.contentContainer} colors={["#ffffff", "#aaaaaa"]}>
                <View style={stylesLight.headerContainer}>
                    <Pressable onPress={() => router.dismissTo("/home")} style={stylesLight.back}>
                        <Text style={stylesLight.backText}>Home</Text>
                    </Pressable>
                    <Text style={stylesLight.header}>Calendar</Text>
                </View>
                <Calendar 
                    onDayPress={(day) => daySelect(day.dateString)}
                    onMonthChange={getMonth}
                    markingType={'multi-dot'}
                    markedDates={dynamicDateList}
                    theme={{
                        calendarBackground: 'transparent',
                        selectedDayBackgroundColor: '#ffffff',
                        selectedDayTextColor: '#000000',
                        todayTextColor: '#f58300ff',
                        textDisabledColor: '#5e5e5eff',
                    }}
                />
                <View>
                    <Text>{selectedDay && selectedDay === today ? 'Today' : `${selectedDay}`}</Text>
                    <Pressable onPress={() => setCreating(true)}>
                        <Text>Add</Text>
                    </Pressable>
                    <View>
                        <View>
                            <Text>Weather</Text>
                            <Text>Ideal for short sleeves</Text>
                        </View>
                        <Text>21C</Text>
                    </View>
                    <View>

                    </View>
                </View>
                {creating ? (
                    <View style={stylesLight.overLay}>
                        <View style={stylesLight.addEventContainer}>
                            <Text>Event</Text>
                            <TextInput placeholder="Event Name..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setEvent(e)} style={stylesLight.input} />
                            <Text>Event Type</Text>
                            <View style={stylesLight.dropdown}>
                                <SelectList 
                                    setSelected={(e) => setEventType(e)}
                                    data={eventTypesList}
                                    save="value"
                                    placeholder="Choose..."
                                />
                            </View>
                            <Text>Place</Text>
                            <TextInput placeholder="Place..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setPlace(e)} style={stylesLight.input} />
                            <Text>Time</Text>
                            <TextInput placeholder="Time... (eg. 14:00)" placeholderTextColor="#9e9e9e" onChangeText={(e) => setTime(e)} style={stylesLight.input} />
                            <Text>Duration</Text>
                            <TextInput placeholder="Hours..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setDurationHrs(e)} style={stylesLight.input} />
                            <TextInput placeholder="Minutes..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setDurationMins(e)} style={stylesLight.input} />
                            <Text>Description</Text>
                            <TextInput placeholder="Description..." placeholderTextColor="#9e9e9e" onChangeText={(e) => setEventDesc(e)} style={stylesLight.input} />
                            <Pressable style={stylesLight.done} onPress={addEvent}>
                                <Text style={stylesLight.doneText}>Done</Text>
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
    //Home before login
    container: {
        flex: 1,
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
    input: {
        backgroundColor: "#fff",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5
    },
    addEventContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "10%",
        padding: 20,
        backgroundColor: "#fff",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1
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
    done: {
        backgroundColor: "#f0f0f0",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    doneText: {
        textAlign: "center",
        fontFamily: "Sunflower-Light",
        fontSize: 18
    },
})

export default CalendarFunc;