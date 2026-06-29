import { StyleSheet, Text, View } from "react-native";

export default function Products() {
    return (
        <View style={css.container}>
            <Text>Product Screen</Text>
        </View>
    )
}


const css = StyleSheet.create({
    container: {
        display: "flex",
        alignContent: "center",
        justifyContent: "center"
    }
})