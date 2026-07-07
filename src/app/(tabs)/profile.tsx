import Header from "@/components/home/Header";
import UserDetails from "@/components/ProfileSettings/UserDetails";
import { StyleSheet, View } from "react-native";

export default function Profile() {
    return (
        <View style={css.container}>
            <Header />
            <UserDetails />
        </View>
    )
}

const css = StyleSheet.create({
    container: {
        flex: 1,
    },
})