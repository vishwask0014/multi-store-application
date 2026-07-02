import { Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StyleSheet, TextInput, View } from "react-native";
import { BORDER_COLOR } from "../theme";

export default function SearchBar() {
    return (
        <View style={css.inputContainer}>
            <View style={css.icon}>
                <HugeiconsIcon icon={Search} size={20} />
            </View>

            <TextInput
                placeholder="What are you looking for..."
                style={css.input}
            />
        </View>
    );
}

const css = StyleSheet.create({
    inputContainer: {
        position: 'relative',
        justifyContent: 'center',
    },
    icon: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 1,
    },
    input: {
        paddingLeft: 40,
        paddingVertical: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
        borderRadius: 8,
        height: 44,
        width: '100%',
        fontSize: 12,
        lineHeight: 1,
        minWidth: 230
    },
});