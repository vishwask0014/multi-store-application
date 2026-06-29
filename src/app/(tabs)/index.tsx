//     "./homepage"

import Header from "@/components/home/Header";
import SearchBar from "@/components/home/SearchBar";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
    return (
        <View style={css.container}>
            <Header />
            <SearchBar />
        </View>
    )
}


const css = StyleSheet.create({
    container: {
        position: 'relative',
    }
})