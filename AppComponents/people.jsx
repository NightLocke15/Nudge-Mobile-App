import { UserContext } from "@/AppContexts/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

function People(props) {
    const { id } = props;
    const { localUserInfo, localUser, users, setUsers } = useContext(UserContext);
    const router = useRouter();

    return (
        <LinearGradient style={stylesLight.contentContainer} colors={["#ffffff", "#aaaaaa"]}>
            <View style={stylesLight.headerContainer}>
                <Pressable onPress={() => router.dismissTo("/logs/peopleLogs")} style={stylesLight.back}>
                    <Text style={stylesLight.backText}>Home</Text>
                </Pressable>
                <Text style={stylesLight.header}>{localUserInfo[0] && localUserInfo[0].logs[id].personName}</Text>
            </View>
            <Image source={require('../app/images/photo.png')} style={stylesLight.peoplePhoto}/>
            <Text>Name: </Text>
            <Text>{localUserInfo[0] && localUserInfo[0].logs[id].personName}</Text>
            <Pressable>
                <Text>Edit</Text>
            </Pressable>
            <Text>Relationship: </Text>
            <Text>{localUserInfo[0] && localUserInfo[0].logs[id].relationship}</Text>
            <Pressable>
                <Text>Edit</Text>
            </Pressable>
            <Text>Birthday: </Text> 
            <Text>{localUserInfo[0] && localUserInfo[0].logs[id].birthday}</Text>
            <Text>Details:</Text>
            {localUserInfo[0] && localUserInfo[0].logs[id].personFacts.map((fact, key) => {
                <Text key={key}>- {fact}</Text>
            })}
            <Text>Likes: </Text>
            {localUserInfo[0] && localUserInfo[0].logs[id].likes.map((like, key) => {
                <Text key={key}>- {like}</Text>
            })}
            <Text>Dislikes: </Text>
            {localUserInfo[0] && localUserInfo[0].logs[id].dislikes.map((dislike, key) => {
                <Text key={key}>- {dislike}</Text>
            })}
        </LinearGradient>
    )
}

const stylesLight = StyleSheet.create({
    contentContainer: {
        flex: 1,
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
    peoplePhoto: {
        height: 150,
        width: 150,
        borderRadius: 75,
        marginLeft: "auto",
        marginRight: "auto",
    }
})

export default People;