import { ThemeContext } from "@/AppContexts/ThemeContext";
import { UserContext } from "@/AppContexts/UserContext";
import { Lucide } from "@react-native-vector-icons/lucide";
import { Octicons } from "@react-native-vector-icons/octicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, Image, Linking, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import { SelectList } from "react-native-dropdown-select-list";
import { Gesture, GestureDetector, TextInput } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { SafeAreaView } from "react-native-safe-area-context";
import { v4 as uuidv4 } from 'uuid';
   

function CalendarFunc() {
    //Access to the user context and all the existing users
    const { users, setUsers, localUserInfo, localUser, weatherData } = useContext(UserContext);
    const {currentTheme, gradientColours } = useContext(ThemeContext);

    //Router to navigate the user back to the home page
    const router = useRouter();

    //Calendar information. What is today's date, what is the current month, all stored events etc.
    const [selectedDay, setSelectedDay] = useState('');
    const [dateList, setDateList] = useState({});
    const [dynamicDateList, setDynamicDateList] = useState({});
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [today, setToday] = useState();
    const [todaysEvents, setTodaysEvents] = useState([]);

    //Information stored for the creation of events before it is added to the user's information
    const [event, setEvent] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventDesc, setEventDesc] = useState('')
    const [place, setPlace] = useState('');
    const [time, setTime] = useState('')
    const [durationHrs, setDurationHrs] = useState('');
    const [durationMins, setDurationMins] = useState('');
    const [clockTime, setClockTime] = useState(new Date());
    const [people, setPeople] = useState([]);

    //All booleans to do with creating, editing and deleting items
    const [creating, setCreating] = useState(false);
    const [warning, setWarning] = useState(false);
    const [editing, setEditing] = useState(false);
    const eventTypesList = ['Birthday', 'Meeting', 'Appointment', 'Other'];

    //Information and states set when interacting with items by tapping or double tapping in order to edit or delete the correct items
    const [item, setItem] = useState();
    const [action, setAction] = useState(false);
    const [tapPostition, setTapPosition] = useState({x: 0, y: 0})
    const [viewEvent, setViewEvent] = useState(false);

    //Arrays used to create time slots in the calendar list at the bottom of the page
    const arrayRange = (start, end, step = 1) => Array.from({length: end - start / step + 1}, (_, i) => start + i * step);
    const numberRange = arrayRange(0,23);
    const timeSlotNumbers = numberRange.map((number) => number < 10 ? `0${number}:00` : `${number}:00`) 

    //Determinging the height of the event card in the calendar list based on the amount of time the event will be
    const cardHeight = (hours, mins) => {
        let heightAddition;
        if (mins > 0 && mins <= 15) {
            heightAddition = 20;
        }
        else if (mins > 15 && mins <= 30) {
            heightAddition = 40;
        }
        else if (mins > 30 && mins <= 45) {
            heightAddition = 60;
        }
        else if (mins > 45 && mins <= 60) {
            heightAddition = 80;
        }
        else {
            heightAddition = 0;
        }

        return hours === 0 && mins === 0 ? 50 : (80 * hours) + heightAddition;
    }  
    

    //Interval to update the clock as time passes by
    useEffect(() => {
        const interval = setInterval(() => {
            setClockTime(new Date());
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);

    //Gets the list of events saved under the current user, and gets them again if an event is created to make sure all events have been accounted for
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

    //When a day on the calander is selected, the events for that day is showcased in the calendar list.
    function daySelect(date) {
        setSelectedDay(date);
        setTodaysEvents(localUserInfo[0].events && localUserInfo[0].events.filter((event) => event.date === date));
        // try {
        //     if (!localUserInfo || !Array.isArray(localUserInfo) || !localUserInfo[0]) return;

        //     const eventsUnfilt = localUserInfo[0].events ?? [];

        //     setSelectedDay(date);
        //     setDynamicDateList(prev => {
        //         const prevData = {...dateList };
        //         const selectedDots = prevData[date]?.dots ?? [];

        //         return {
        //             ...prevData,
        //             [date]: {
        //                 ...prevData[date],
        //                 selected: true,
        //                 marked: selectedDots.length > 0,
        //                 dots: selectedDots
        //             }
        //         }
        //     }) 
        //     const eventsFilt = eventsUnfilt.filter((e) => e.date === date);
        //     setTodaysEvents(eventsFilt);
        // }
        // catch (e) {
        //     console.error(e);
        // }           
    }

    //Getting the current month we are in
    const getMonth = (month) => {
        setCurrentMonth(month.month);
    }

    //Add event to the user's information and then resetting the data so a new event can be added
    function addEvent() {
        if (event !== "") {
            const usersReVamp = users.map((user, index) => {
                if (user.idnum === localUser) {
                    return {
                        ...user,
                        events: [...user.events, {id: uuidv4(), eventName: event, type: eventType, date: selectedDay, description: eventDesc, place: place, time: time, hours: durationHrs, mins: durationMins, people: people}]
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
            setPeople([]);
        }
        
    }

    //Triggers the delete warning, asking if the user is sure
    function triggerDelete() {
        setAction(false);
        setWarning(true);
    }

    //Delete event from the user's information
    function deleteEvent(eventItem) {
        const userRevamp = users.map((user, index) => {
            if (user.idnum === localUser) {
                const newEvents = user.events.filter((event) => event.id !== eventItem.id);
                return {
                    ...user,
                    events: newEvents,
                }
            } 
            else {
                return user;
            }
        });
        setUsers(userRevamp);
        setSelectedDay('');
        setWarning(false);
    }

    //Triggers editing, setting all the information up to be edited by the user
    function triggerEdit() {
        setViewEvent(false);
        setCreating(true);
        setEditing(true);
        setEvent(item.eventName);
        setEventType(item.eventType);
        setPlace(item.place);
        setTime(item.time);
        setDurationHrs(item.hours);
        setDurationMins(item.mins);
        setEventDesc(item.description);
        setPeople(item.people);
    }

    //Edits the event's informatiopn in the user's data
    function editEvent() {
        const userRevamp = users.map((user, index) => {
            if (user.idnum === localUser) {
                const newEvents = user.events.map((eventItem) => {
                    if (eventItem.id === item.id) {
                        return {
                            ...eventItem,
                            eventName: event, 
                            type: eventType, 
                            date: selectedDay, 
                            description: eventDesc, 
                            place: place, 
                            time: time, 
                            hours: durationHrs, 
                            mins: durationMins,
                            people: people
                        }
                    }
                    else {
                        return eventItem;
                    }
                });
                return {
                    ...user,
                    events: newEvents,
                }
            } 
            else {
                return user;
            }
        });
        setUsers(userRevamp);
        setEvent('');
        setEventType('');
        setPlace('');
        setTime('');
        setEventDesc('');
        setDurationHrs('');
        setDurationMins('');
        setCreating(false);
        setSelectedDay('');
        setPeople([]);
    }

    //Adds a person to an event
    function addPeople(person) {
        setPeople([...people, person]);
    }

    //Removes a person from the event
    function removePeople(person) {
        setPeople(people.filter((per) => per.id !== person.id));
    }

    //When clicking on the link for the weather API, this enables user to go to that link
    const handlePress = useCallback(async () => {
        const supported = await Linking.canOpenURL("https://www.weatherapi.com/");

        if (supported) {
            await Linking.openURL("https://www.weatherapi.com/");
        } 
        else {
            Alert.alert(`Don't know how to open this URL: ${"https://www.weatherapi.com/"}`);
        }
    });

    //Gesture handler constants. Detects a single tap on a certain element as well as a double tap.
    const singleTap = (item) => Gesture.Tap().maxDuration(250).numberOfTaps(1).onStart(() => {
       setItem(item);
        setViewEvent(true);
        }).runOnJS(true);
    const doubleTap = (item) => Gesture.Tap().maxDuration(250).numberOfTaps(2).onStart((event) => {
        setItem(item);
        setTapPosition({x: event.absoluteX > 260 ? 260 : event.absoluteX, y: event.absoluteY > 530 ? 530 : event.absoluteY})
        setAction(true);
    }).runOnJS(true);

    return (
        <React.Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor: currentTheme.includes("Light") ? "#e3e3e3" : "#2b2b2b" }} />
        <SafeAreaView style={currentTheme.includes("Light") ? stylesLight.container : stylesDark.container}>
            <StatusBar barStyle={currentTheme.includes("Light") ? "dark-content" : "light-content"} backgroundColor={currentTheme.includes("Light") ? "#e3e3e3" : "#2b2b2b"} />
            <LinearGradient style={currentTheme.includes("Light") ? stylesLight.contentContainer : stylesDark.contentContainer} colors={gradientColours}>
                <View style={currentTheme.includes("Light") ? stylesLight.headerContainer : stylesDark.headerContainer}>
                    <Pressable onPress={() => router.dismissTo("/home")} style={currentTheme.includes("Light") ? stylesLight.back : stylesDark.back}>
                        <Octicons name="home" size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                    </Pressable>
                    <Text style={currentTheme.includes("Light") ? stylesLight.header : stylesDark.header}>Calendar</Text>
                    <Text style={currentTheme.includes("Light") ? stylesLight.timeText : stylesDark.timeText}>{clockTime.getHours().toString().padStart(2, "0")}:{clockTime.getMinutes().toString().padStart(2, "0")}</Text>
                </View>
                <Calendar 
                    onDayPress={(day) => daySelect(day.dateString)}
                    onMonthChange={getMonth}
                    markingType={'multi-dot'}
                    markedDates={dynamicDateList}
                    theme={{
                        calendarBackground: 'transparent',
                        selectedDayBackgroundColor: currentTheme.includes("Light") ? '#e3e3e3' : '#2b2b2b',
                        selectedDayTextColor: currentTheme.includes("Light") ? '#242424' : '#e3e3e3',
                        todayTextColor: '#eb0b0bff',
                        textDisabledColor: currentTheme.includes("Light") ? '#9e9e9e' : '#666666ff',
                        textSectionTitleColor: currentTheme.includes("Light") ? '#242424' : '#e3e3e3',
                        textDayFontFamily: "Roboto-Regular",
                        textMonthFontFamily: "PTSans-Regular",
                        textDayHeaderFontFamily: "PTSans-Regular",
                        textMonthFontSize: 20,
                        dayTextColor: currentTheme.includes("Light") ? '#242424' : '#e3e3e3',
                        monthTextColor: currentTheme.includes("Light") ? '#242424' : '#e3e3e3',
                    }}
                    renderArrow={(dir) => (
                        <Octicons name={dir === 'left' ? "chevron-left" : "chevron-right"} size={25} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                    )} 
                />
                {selectedDay ? (
                    <View style={currentTheme.includes("Light") ? stylesLight.eventsContainer : stylesDark.eventsContainer}>
                        <View style={currentTheme.includes("Light") ? stylesLight.eventsHeader : stylesDark.eventsHeader}>
                            <View style={currentTheme.includes("Light") ? stylesLight.dateContainer : stylesDark.dateContainer}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.dateContainerText : stylesDark.dateContainerText}>{selectedDay && selectedDay === today ? 'Today' : `${selectedDay}`}</Text>
                                <Pressable style={currentTheme.includes("Light") ? stylesLight.add : stylesDark.add} onPress={() => setCreating(true)}>
                                    <Octicons name="plus" size={20} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                                </Pressable>
                            </View>
                            <View style={currentTheme.includes("Light") ? stylesLight.weatherContainer : stylesDark.weatherContainer}>
                                <View>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.weatherHeader : stylesDark.weatherHeader}>Weather</Text>
                                    {weatherData.forecast.forecastday.some((day) => day.date === selectedDay) ? (
                                        weatherData.forecast.forecastday.map((day) => {
                                        if (day.date === selectedDay) {
                                            return (
                                                <View key={day.date}>
                                                    <Text style={currentTheme.includes("Light") ? stylesLight.weatherDesc : stylesDark.weatherDesc}>{day.day.condition.text}</Text>
                                                    <View style={currentTheme.includes("Light") ? stylesLight.weatherRef : stylesDark.weatherRef}>
                                                        <Text style={currentTheme.includes("Light") ? stylesLight.refText : stylesDark.refText}>Powered by </Text>
                                                        <Pressable onPress={handlePress}>
                                                            <Text style={currentTheme.includes("Light") ? stylesLight.refLink : stylesDark.refLink}>WeatherAPI.com</Text>
                                                        </Pressable>
                                                    </View>                                                    
                                                </View>                                                
                                            );
                                        }                                            
                                    })
                                    ) : (
                                        <View></View>
                                    )}
                                    
                                </View>
                                <View style={currentTheme.includes("Light") ? stylesLight.weatherContainer : stylesDark.weatherContainer}>
                                    {weatherData.forecast.forecastday.some((day) => day.date === selectedDay) ? (
                                        weatherData.forecast.forecastday.map((day) => {
                                        if (day.date === selectedDay) {
                                            return <Image key={day.date_epoch} source={{uri: `https://${day.day.condition.icon}`}} style={{width: 40}} />;
                                        }                                            
                                    })
                                    ) : (
                                        <View></View>
                                    )}
                                    <View>
                                        <Text style={currentTheme.includes("Light") ? stylesLight.temp : stylesDark.temp}>High / Low</Text>
                                        {weatherData.forecast.forecastday.some((day) => day.date === selectedDay) ? (
                                            weatherData.forecast.forecastday.map((day) => {
                                            if (day.date === selectedDay) {
                                               return <Text key={day.date_epoch} style={currentTheme.includes("Light") ? stylesLight.temp : stylesDark.temp}>{day.day.maxtemp_c} / {day.day.mintemp_c}</Text>;
                                            }                                            
                                        })
                                        ) : (
                                            <Text style={currentTheme.includes("Light") ? stylesLight.temp : stylesDark.temp}>N/A</Text>
                                        )}
                                        
                                    </View>                                    
                                </View>                                
                            </View>
                        </View>
                        {todaysEvents.some((event) => event.type === "Birthday") ? (
                            todaysEvents.map((event) => {
                                if (event.type === "Birthday") {
                                    return (
                                        <View key={event.id} style={currentTheme.includes("Light") ? stylesLight.birthdayCard : stylesDark.birthdayCard}>
                                            <Lucide name="sparkles" size={25} color={'#eed237ff'}/>
                                            <Text style={currentTheme.includes("Light") ? stylesLight.birthdayText : stylesDark.birthdayText}>{event.eventName}</Text>
                                            <Lucide name="sparkles" size={25} color={'#eed237ff'}/>
                                        </View>
                                    )                                    
                                }
                            })
                        ) : (
                            <View></View>
                        )}
                        <ScrollView>
                            {timeSlotNumbers.map((num) => (
                                <View key={num} style={currentTheme.includes("Light") ? stylesLight.timeSlotContainer : stylesDark.timeSlotContainer}>
                                    <Text style={currentTheme.includes("Light") ? stylesLight.timeSlot : stylesDark.timeSlot}>{num}</Text>
                                    {todaysEvents.map((event) => {
                                        if (event.type !== "Birthday" && event.time.slice(0,2) === num.slice(0,2)) {
                                            return (
                                                <GestureDetector  key={event.id} gesture={Gesture.Exclusive(doubleTap(event), singleTap(event))}>
                                                    <View style={[currentTheme.includes("Light") ? stylesLight.eventCard : stylesDark.eventCard, {
                                                        position: "absolute", 
                                                        zIndex: 2, 
                                                        left: 50, 
                                                        top: Number(event.time.slice(-2)) === 0 ? 30 : Number(event.time.slice(-2)) === 15 ? 50 : Number(event.time.slice(-2)) === 30 ? 70 : 90, 
                                                        height: cardHeight(Number(event.hours), Number(event.mins)),
                                                        borderColor: event.type === 'Meeting' ? '#06c406ff' : event.type === 'Appointment' ? '#c4065fff' : '#c4a106ff',
                                                    }]}>
                                                        <Text style={currentTheme.includes("Light") ? stylesLight.eventCardText : stylesDark.eventCardText}>{event.eventName}</Text>
                                                        <Text style={currentTheme.includes("Light") ? stylesLight.eventCardTime : stylesDark.eventCardTime}>
                                                            {event.hours === "" ? `${event.time}` : 
                                                            `${event.time} - ${Number(event.time.slice(0, 2)) + Number(event.hours) < 10 ? `0${Number(event.time.slice(0, 2)) + Number(event.hours)}:${event.mins === "" ? "00" : 
                                                                `${Number(event.time.slice(-2)) + Number(event.mins) < 10 ? `0${Number(event.time.slice(-2)) + Number(event.mins)}` : `${Number(event.time.slice(-2)) + Number(event.mins)}`}`}` : 
                                                            `${Number(event.time.slice(0, 2)) + Number(event.hours)}:${event.mins === "" ? "00" : 
                                                                `${Number(event.time.slice(-2)) + Number(event.mins) < 10 ? `0${Number(event.time.slice(-2)) + Number(event.mins)}` : `${Number(event.time.slice(-2)) + Number(event.mins)}`}`}`}`}
                                                        </Text>
                                                    </View>
                                                </GestureDetector>                                                
                                            )
                                        }                                          
                                    })}
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                ) : (
                    <View></View>
                )}
                
                {creating ? (
                    <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.addEventContainer : stylesDark.addEventContainer}>
                            <Pressable onPress={() => setCreating(false)} style={currentTheme.includes("Light") ? stylesLight.close : stylesDark.close}>
                                <Octicons name="x" size={20} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>
                            </Pressable>
                            <Text style={currentTheme.includes("Light") ? stylesLight.createHeading : stylesDark.createHeading}>Event</Text>
                            <TextInput placeholder="Event Name..." placeholderTextColor="#9e9e9e" value={event} onChangeText={(e) => setEvent(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Text style={currentTheme.includes("Light") ? stylesLight.createHeading : stylesDark.createHeading}>Event Type</Text>
                            <View style={currentTheme.includes("Light") ? stylesLight.dropdown : stylesDark.dropdown}>
                                <SelectList 
                                    setSelected={(e) => setEventType(e)}
                                    data={eventTypesList}
                                    save="value"
                                    placeholder="Choose..."
                                    dropdownTextStyles={{color: currentTheme.includes("Light") ? "#242424" : "#e3e3e3"}}
                                    inputStyles={{color: currentTheme.includes("Light") ? "#242424" : "#e3e3e3"}}
                                    arrowicon={<Octicons name="chevron-down" size={18} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>}
                                    closeicon={<Octicons name="x" size={18} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'}/>}
                                    search={false}
                                    defaultOption={eventType}
                                />
                            </View>
                            <Text style={currentTheme.includes("Light") ? stylesLight.createHeading : stylesDark.createHeading}>Place</Text>
                            <TextInput placeholder="Place..." value={place} placeholderTextColor="#9e9e9e" onChangeText={(e) => setPlace(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Text style={currentTheme.includes("Light") ? stylesLight.createHeading : stylesDark.createHeading}>Time</Text>
                            <TextInput placeholder="Time... (eg. 14:00)" value={time} placeholderTextColor="#9e9e9e" onChangeText={(e) => setTime(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Text style={currentTheme.includes("Light") ? stylesLight.createHeading : stylesDark.createHeading}>Duration</Text>
                            <TextInput placeholder="Hours..." value={durationHrs} placeholderTextColor="#9e9e9e" onChangeText={(e) => setDurationHrs(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <TextInput placeholder="Minutes..." value={durationMins} placeholderTextColor="#9e9e9e" onChangeText={(e) => setDurationMins(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Text style={currentTheme.includes("Light") ? stylesLight.createHeading : stylesDark.createHeading}>Description</Text>
                            <TextInput placeholder="Description..." value={eventDesc} placeholderTextColor="#9e9e9e" onChangeText={(e) => setEventDesc(e)} style={currentTheme.includes("Light") ? stylesLight.input : stylesDark.input} />
                            <Text style={currentTheme.includes("Light") ? stylesLight.createHeading : stylesDark.createHeading}>People at Event:</Text>  
                            <ScrollView>
                                <View style={currentTheme.includes("Light") ? stylesLight.peopleHolder : stylesDark.peopleHolder}>
                                    {localUserInfo[0] && localUserInfo[0].logs.filter((log) => log.type === "People").map((person) => (
                                        <Pressable key={person.id} onPress={() => people.some((personItem) => personItem.id === person.id) ? removePeople(person) : addPeople(person)} style={currentTheme.includes("Light") ? stylesLight.peopleButton : stylesDark.peopleButton}>
                                            <Image source={{uri: person.image}} style={[currentTheme.includes("Light") ? stylesLight.peoplePhoto : stylesDark.peoplePhoto, {borderColor: "#9e9e9e", borderWidth: people.some((personItem) => personItem.id === person.id) ? 5 : 1}]}/>
                                            <Text style={currentTheme.includes("Light") ? stylesLight.peopleName : stylesDark.peopleName}>{person.personName}</Text>
                                        </Pressable>
                                    ))}
                                </View>                                                               
                            </ScrollView>                                                   
                            <Pressable style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.done : stylesDark.done, currentTheme.includes("Light") ? {backgroundColor: pressed ? '#c0c0c0ff' : '#f2f2f2'} : {backgroundColor: pressed ? '#1f1f1fff': '#3a3a3a'}]} onPress={editing ? editEvent : addEvent}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.doneText : stylesDark.doneText}>Done</Text>
                            </Pressable>
                        </View>
                    </View>                    
                ) : (
                    <View></View>
                )}
                
                {action ? (
                    <Pressable onPress={() => setAction(false)} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={[currentTheme.includes("Light") ? stylesLight.actionContainer : stylesDark.actionContainer, {position: "absolute", left: tapPostition.x, top: tapPostition.y}]}> 
                            <Pressable onPress={triggerDelete} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.delete : stylesDark.delete, {backgroundColor: pressed ? '#7a1503ff' : '#be2206ff'}]}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.deleteText : stylesDark.deleteText}>Delete</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                ) : (
                    <View></View>
                )}
                {viewEvent ? (
                    <View style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.viewEvent : stylesDark.viewEvent}>
                            <Pressable onPress={() => setViewEvent(false)} style={currentTheme.includes("Light") ? stylesLight.close : stylesDark.close}>
                                <Octicons name="x" size={20} color={currentTheme.includes("Light") ? '#585858' : '#e3e3e3'} style={currentTheme.includes("Light") ? stylesLight.checkButton : stylesDark.checkButton}/>
                            </Pressable>
                            <Text style={currentTheme.includes("Light") ? stylesLight.eventHeading : stylesDark.eventHeading}>{item.eventName}</Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.eventText : stylesDark.eventText}>{item.date}</Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.eventHeading : stylesDark.eventHeading}>Event Type:</Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.eventText : stylesDark.eventText}>{item.type}</Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.eventHeading : stylesDark.eventHeading}>Place: </Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.eventText : stylesDark.eventText}>{item.place}</Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.eventHeading : stylesDark.eventHeading}>Time: </Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.eventText : stylesDark.eventText}>
                                {item.hours === "" ? `${item.time}` : 
                                `${item.time} - ${Number(item.time.slice(0, 2)) + Number(item.hours) < 10 ? `0${Number(item.time.slice(0, 2)) + Number(item.hours)}:${item.mins === "" ? "00" : 
                                    `${Number(item.time.slice(-2)) + Number(item.mins) < 10 ? `0${Number(item.time.slice(-2)) + Number(item.mins)}` : `${Number(item.time.slice(-2)) + Number(item.mins)}`}`}` : 
                                `${Number(item.time.slice(0, 2)) + Number(item.hours)}:${item.mins === "" ? "00" : 
                                    `${Number(item.time.slice(-2)) + Number(item.mins) < 10 ? `0${Number(item.time.slice(-2)) + Number(item.mins)}` : `${Number(item.time.slice(-2)) + Number(item.mins)}`}`}`}`}
                            </Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.eventHeading : stylesDark.eventHeading}>Description: </Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.eventText : stylesDark.eventText}>{item.description}</Text>
                            <Text style={currentTheme.includes("Light") ? stylesLight.eventHeading : stylesDark.eventHeading}>People: </Text>
                            <ScrollView>
                                <View style={currentTheme.includes("Light") ? stylesLight.peopleHolder : stylesDark.peopleHolder}>
                                    {item.people && item.people.map((person) => (
                                        <Pressable key={person.id} style={currentTheme.includes("Light") ? stylesLight.peopleButton : stylesDark.peopleButton}>
                                            <Image source={{uri: person.image}} style={[currentTheme.includes("Light") ? stylesLight.peoplePhoto : stylesDark.peoplePhoto, {borderColor: "#9e9e9e", borderWidth: people.some((personItem) => personItem.id === person.id) ? 5 : 1}]}/>
                                            <Text style={currentTheme.includes("Light") ? stylesLight.peopleName : stylesDark.peopleName}>{person.personName}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </ScrollView>
                            <Pressable onPress={triggerEdit} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.edit : stylesDark.edit, {backgroundColor: pressed ? '#104d0aff' : '#1f9615ff'}]}>
                                <Text style={currentTheme.includes("Light") ? stylesLight.editText : stylesDark.editText}>Edit</Text>
                            </Pressable>
                        </View>
                    </View>
                ) : (
                    <View></View>
                )}
                {warning ? (
                    <Pressable onPress={() => setWarning(false)} style={currentTheme.includes("Light") ? stylesLight.overLay : stylesDark.overLay}>
                        <View style={currentTheme.includes("Light") ? stylesLight.warningContainer : stylesDark.warningContainer}>
                            <Text style={currentTheme.includes("Light") ? stylesLight.warningText : stylesDark.warningText}>Are you sure you want to delete this event?</Text>
                            <View style={currentTheme.includes("Light") ? stylesLight.warningButtonContainer : stylesDark.warningButtonContainer}>
                                <Pressable onPress={() => deleteEvent(item)} style={({ pressed }) => [currentTheme.includes("Light") ? stylesLight.delete : stylesDark.delete, {backgroundColor: pressed ? '#7a1503ff' : '#be2206ff'}]}>
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
        flex: 1,
        backgroundColor: "#e3e3e3"
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
        color: "#242424",
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
        top: "2%",
        padding: 20,
        backgroundColor: "#e3e3e3",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1,
        height: "97%"
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
        color: "#242424",
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
        color: "#242424",
        fontSize: 18,
        marginBottom: 2
    },
    weatherDesc: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 16,
    },
    temp: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 16,
        marginLeft: 10
    }, 
    birthdayCard: {
        backgroundColor: "#e3e3e3",
        margin: 5, 
        padding: 12,
        borderWidth: 1,
        borderColor: "#06a1c4",
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-around"
    },
    birthdayText: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 16,
    },
    timeSlotContainer: {
        padding: 10,
        height: 80
    },
    timeSlot: {
        fontFamily: "Roboto-Regular",
        fontSize: 15,
        color: "#7c7c7cff",
        borderBottomColor: "#7c7c7cff",
        borderBottomWidth: 0.5
    },
    eventCard: {
        backgroundColor: "#e3e3e3",
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "85%",
        alignItems: "center"
    },
    eventCardText: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 16,
    },
    eventCardTime: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 16,
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
        paddingTop: 10,
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
    viewEvent: {
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
    close: {
        position: "absolute",
        right: 10,
        top: 10,
    },
    eventHeading: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 20,
        marginBottom: 5,
    },
    eventText: {
        fontFamily: "Roboto-Regular",
        color: "#242424",
        fontSize: 16,
        marginBottom: 10,
        borderBottomColor: "#9e9e9e",
        borderBottomWidth: 0.5,
        paddingBottom: 10
    },
    createHeading: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 18,
        marginBottom: 5,
        marginTop: 5,
    },
    timeText: {
        fontFamily: "PTSans-Regular",
        color: "#242424",
        fontSize: 20, 
        position: "absolute",
        right: "5%",
        top: "30%"         
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
    peopleList: {
        position: "absolute",
        top: "0%"
    },
    peoplePhoto: {
        width: 50,
        height: 50,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "#323232",
        alignSelf: "center",
    },
    peopleHolder: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-between",
        marginTop: 5
    },
    peopleButton: {
        width: 70,
    },
    peopleName: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 15,
        textAlign: "center"
    }
})

const stylesDark = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2b2b2b"
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
    addEventContainer: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "2%",
        padding: 20,
        backgroundColor: "#2b2b2b",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1,
        height: "97%"
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
        backgroundColor: "#3a3a3a",
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
        color: "#e3e3e3",
        fontSize: 18
    },
    dateContainer: {
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#9e9e9e"
    },
    dateContainerText: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 22,
        marginBottom: 10
    },
    eventsContainer: {
        backgroundColor: "#2b2b2b",
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
        backgroundColor: "#2b2b2b",
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
        color: "#e3e3e3",
        fontSize: 18,
        marginBottom: 2,
    },
    weatherDesc: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 16,
    },
    temp: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 16,
        marginLeft: 10
    }, 
    birthdayCard: {
        backgroundColor: "#2b2b2b",
        margin: 5, 
        padding: 12,
        borderWidth: 1,
        borderColor: "#06a1c4",
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-around"
    },
    birthdayText: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 16,
    },
    timeSlotContainer: {
        padding: 10,
        height: 80
    },
    timeSlot: {
        fontFamily: "Roboto-Regular",
        fontSize: 15,
        color: "#7c7c7cff",
        borderBottomColor: "#7c7c7cff",
        borderBottomWidth: 0.5
    },
    eventCard: {
        backgroundColor: "#2b2b2b",
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "85%",
        alignItems: "center"
    },
    eventCardText: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 16,
    },
    eventCardTime: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 16,
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
        paddingTop: 10,
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
    viewEvent: {
        position: "absolute",
        right: "5%",
        left: "5%",
        top: "10%",
        padding: 20,
        backgroundColor: "#2b2b2b",
        elevation: 5,
        borderRadius: 10,
        zIndex: 1
    },
    close: {
        position: "absolute",
        right: 10,
        top: 10,
    },
    eventHeading: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 20,
        marginBottom: 5,
    },
    eventText: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 16,
        marginBottom: 10,
        borderBottomColor: "#9e9e9e",
        borderBottomWidth: 0.5,
        paddingBottom: 10
    },
    createHeading: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 18,
        marginBottom: 5,
        marginTop: 5,
    },
    timeText: {
        fontFamily: "PTSans-Regular",
        color: "#e3e3e3",
        fontSize: 20, 
        position: "absolute",
        right: "5%",
        top: "30%"         
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
    peopleList: {
        position: "absolute",
    },
    peoplePhoto: {
        width: 50,
        height: 50,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "#323232",
        alignSelf: "center"
    },
    peopleHolder: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-between",
        marginTop: 5
    },
    peopleButton: {
        width: 70,
    },
    peopleName: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 15,
        textAlign: "center"
    },
    weatherRef: {
        flexDirection: "row",
        marginTop: 5
    },
    refText: {
        fontFamily: "Roboto-Regular",
        color: "#e3e3e3",
        fontSize: 12,
    },
    refLink: {
        fontFamily: "Roboto-Regular",
        color: "#1966ff",
        textDecorationLine: "underline",
        fontSize: 12,
    }
})

export default CalendarFunc;