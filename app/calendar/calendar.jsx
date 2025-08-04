import { UserContext } from "@/AppContexts/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar, CalendarProvider } from 'react-native-calendars';
import { SafeAreaView } from "react-native-safe-area-context";

function CalendarFunc() {
    const { users, setUsers, localUserInfo, localUser } = useContext(UserContext);
    const router = useRouter();
    const [selectedDay, setSelectedDay] = useState();
    const [dateList, setDateList] = useState({});
    const [dynamicDateList, setDynamicDateList] = useState({});
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

    useEffect(() => {
        const relevantLogs = localUserInfo[0] && localUserInfo[0].logs.filter((log) => log.type === "People");
        const birthdays = {};
        relevantLogs && relevantLogs.forEach((log) => {
            const year = `${log.birthday.getFullYear()}`;
            const month = log.birthday.getMonth() < 10 ? `0${log.birthday.getMonth() + 1}` : `${log.birthday.getMonth() + 1}`;
            const day = log.birthday.getDate() < 10 ? `0${log.birthday.getDate()}` : `${log.birthday.getDate()}`;

            birthdays[`${year}-${month}-${day}`] = {
                marked: true,
                dotColor: 'red',
            }
        });

        setDateList(birthdays);
        setDynamicDateList(birthdays);
        console.log(birthdays)
    }, []);

    function daySelect(date) {
        setSelectedDay(date);
        setDynamicDateList(dateList);
        if (dynamicDateList[date]) {
            setDynamicDateList(prevData => ({
                ...prevData, // Spreads existing properties of prevData
                [date]: {selected: true, marked: true, dotColor: 'red'}, // Adds a new property 'city'
            }));
        }
        else {
            setDynamicDateList(prevData => ({
                ...prevData, // Spreads existing properties of prevData
                [date]: {selected: true}, // Adds a new property 'city'
            }));
        }        
    }

    const getMonth = (month) => {
        setCurrentMonth(month.month);
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
                    markedDates={dynamicDateList}
                    theme={{
                        calendarBackground: 'transparent',
                        selectedDayBackgroundColor: '#ffffff',
                        selectedDayTextColor: '#000000',
                        todayTextColor: '#f58300ff',
                        textDisabledColor: '#5e5e5eff',
                    }}
                />
                <CalendarProvider>
                    {/* <AgendaList 
                        renderItem={agendaItem}
                    /> */}
                </CalendarProvider>
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
})

export default CalendarFunc;