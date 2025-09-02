import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { Lucide } from "@react-native-vector-icons/lucide";
import { Octicons } from "@react-native-vector-icons/octicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import { SelectList } from "react-native-dropdown-select-list";
import { TextInput } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { SafeAreaView } from "react-native-safe-area-context";
import { v4 as uuidv4 } from 'uuid';

function CalendarFunc() {
    const { users, setUsers, localUserInfo, localUser } = useContext(UserContext);
    const {currentTheme, gradientColours } = useContext(ThemeContext);
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
        setTodaysEvents(localUserInfo[0] && localUserInfo[0].events.filter((event) => event.date === date));  
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
        setSelectedDay('');
    }

    return (
        <SafeAreaView style={stylesLight.container}>
            <LinearGradient style={stylesLight.contentContainer} colors={gradientColours}>
                <View style={stylesLight.headerContainer}>
                    <Pressable onPress={() => router.dismissTo("/home")} style={stylesLight.back}>
                        <Octicons name="home" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'} style={currentTheme.includes("Light") ? stylesLight.checkButton : stylesDark.checkButton}/>
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
                        selectedDayBackgroundColor: '#e3e3e3',
                        selectedDayTextColor: '#242424',
                        todayTextColor: '#eb0b0bff',
                        textDisabledColor: '#9e9e9e',
                        textSectionTitleColor: '#242424',
                        textDayFontFamily: "Roboto-Regular",
                        textMonthFontFamily: "PTSans-Regular",
                        textDayHeaderFontFamily: "PTSans-Regular",
                        textMonthFontSize: 20,
                    }}
                    renderArrow={(dir) => (
                        <Octicons name={dir === 'left' ? "chevron-left" : "chevron-right"} size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'} style={currentTheme.includes("Light") ? stylesLight.checkButton : stylesDark.checkButton}/>
                    )} 
                />
                {selectedDay ? (
                    <View style={stylesLight.eventsContainer}>
                        <View style={stylesLight.eventsHeader}>
                            <View style={stylesLight.dateContainer}>
                                <Text style={stylesLight.dateContainerText}>{selectedDay && selectedDay === today ? 'Today' : `${selectedDay}`}</Text>
                                <Pressable style={stylesLight.add} onPress={() => setCreating(true)}>
                                    <Octicons name="plus" size={20} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'} style={currentTheme.includes("Light") ? stylesLight.checkButton : stylesDark.checkButton}/>
                                </Pressable>
                            </View>
                            <View style={stylesLight.weatherContainer}>
                                <View>
                                    <Text style={stylesLight.weatherHeader}>Weather</Text>
                                    <Text style={stylesLight.weatherDesc}>Ideal for short sleeves</Text>
                                </View>
                                <View style={stylesLight.weatherContainer}>
                                    <Lucide name="sun" size={25} color={'#f1b022ff'}/>
                                    <Text style={stylesLight.temp}>21C</Text>
                                </View>                                
                            </View>
                        </View>
                        
                        <ScrollView>
                            {todaysEvents.map((event) => {
                                if (event.type === "Birthday") {
                                    return (
                                        <View key={event.id}>
                                            <Text>{event.eventName}</Text>
                                        </View>
                                    )                                    
                                }
                                else {
                                    return (
                                        <View key={event.id}>
                                            <Text>{event.eventName}</Text>
                                            <Text>{event.time}</Text>
                                        </View>
                                    ) 
                                }
                                                                
                            })}
                        </ScrollView>
                    </View>
                ) : (
                    <View></View>
                )}
                
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
    input: {
        backgroundColor: "#e3e3e3",
        borderWidth: 0.5,
        borderColor: "#4d4d4d",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        marginBottom: 5,
    },
    addEventContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "10%",
        padding: 20,
        backgroundColor: "#e3e3e3",
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
        backgroundColor: "#f2f2f2",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 10,
        elevation: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    doneText: {
        textAlign: "center",
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 18
    },
    dateContainer: {
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#9e9e9e"
    },
    dateContainerText: {
        fontFamily: "PTSans-Regular",
        fontSize: 22,
        marginBottom: 10
    },
    eventsContainer: {
        backgroundColor: "#e3e3e3",
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 10,
        height: 340,
        elevation: 5
    },
    add: {
        position: "absolute",
        right: 5,
        top: 5,
    },
    eventsHeader: {
        backgroundColor: "#e3e3e3",
        width: "100%",
        padding: 10,        
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        elevation: 3,
    },
    weatherContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 5,
    },
    weatherHeader: {
        fontFamily: "PTSans-Regular",
        fontSize: 18,
        marginBottom: 5
    },
    weatherDesc: {
        fontFamily: "Roboto-Regular",
        fontSize: 15,
    },
    temp: {
        fontFamily: "Roboto-Regular",
        fontSize: 18,
        marginLeft: 10
    }
})

export default CalendarFunc;