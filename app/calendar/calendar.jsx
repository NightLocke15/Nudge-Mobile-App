import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from "react-native-safe-area-context";

function CalendarFunc() {
    const router = useRouter();
    const [selectedDay, setSelectedDay] = useState();

    return (
        <SafeAreaView style={stylesLight.container}>
            <LinearGradient style={stylesLight.contentContainer} colors={["#ffffff", "#aaaaaa"]}>
                <View style={stylesLight.headerContainer}>
                    <Pressable onPress={() => router.navigate("/home")} style={stylesLight.back}>
                        <Text style={stylesLight.backText}>Home</Text>
                    </Pressable>
                    <Text style={stylesLight.header}>Calendar</Text>
                </View>
                <Calendar 
                    onDayPress={(day) => setSelectedDay(day.dateString)}
                    markedDates={{
                        [selectedDay]: {selected: true, disableTouchEvent: true},
                    }}
                    theme={{
                        calendarBackground: 'transparent',
                        selectedDayBackgroundColor: '#ffffff',
                        selectedDayTextColor: '#000000',
                        todayTextColor: '#f58300ff',
                        textDisabledColor: '#5e5e5eff',
                    }}
                />
                
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