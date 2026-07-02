import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BORDER_COLOR, PRIMARY_COLOR, WHITE_COLOR } from "../theme";

function Stars() {
    const stars = [
        { top: 10, left: 20, size: 2, opacity: 0.9 },
        { top: 25, left: 80, size: 1.5, opacity: 0.6 },
        { top: 15, left: 140, size: 2.5, opacity: 0.8 },
        { top: 40, left: 55, size: 1, opacity: 0.5 },
        { top: 8, left: 200, size: 2, opacity: 0.7 },
        { top: 55, left: 170, size: 1.5, opacity: 0.9 },
        { top: 30, left: 260, size: 2, opacity: 0.6 },
        { top: 70, left: 100, size: 1, opacity: 0.4 },
        { top: 12, left: 310, size: 1.5, opacity: 0.8 },
        { top: 50, left: 330, size: 2.5, opacity: 0.5 },
        { top: 80, left: 240, size: 1, opacity: 0.7 },
        { top: 90, left: 30, size: 2, opacity: 0.4 },
        { top: 100, left: 150, size: 1.5, opacity: 0.6 },
        { top: 65, left: 10, size: 1, opacity: 0.8 },
        { top: 110, left: 300, size: 2, opacity: 0.5 },
    ];

    return (
        <>
            {stars.map((s, i) => (
                <View
                    key={i}
                    style={{
                        position: "absolute",
                        top: s.top,
                        left: s.left,
                        width: s.size,
                        height: s.size,
                        borderRadius: s.size / 2,
                        backgroundColor: "#fff",
                        opacity: s.opacity,
                    }}
                />
            ))}
        </>
    );
}

export default function AiBanner() {
    return (
        <LinearGradient
            colors={["#0f0c29", "#302b63", "#24243e"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={css.bannerWrapper}
        >
            <Stars />

            {/* Glowing orb */}
            <View style={css.orb} />

            <View style={css.content}>
                <View style={css.badgeRow}>
                    <View style={css.badge}>
                        <Text style={css.badgeText}>✦ AI Powered</Text>
                    </View>
                </View>

                <Text style={css.heading}>End Your{"\n"}Cravings Instantly</Text>
                <Text style={css.subtext}>
                    Tell me what you're in the mood for — I'll find it.
                </Text>

                {/* TODO: on click of this button open a modal which chat with user and on telling user requirement add item into his/her cart */}
                <TouchableOpacity style={css.button} activeOpacity={0.85}>
                    <LinearGradient
                        colors={["#a78bfa", "#7c3aed"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={css.buttonGradient}
                    >
                        <Text style={css.buttonText}>✦ Ask AI</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const css = StyleSheet.create({
    bannerWrapper: {
        marginTop: 16,
        marginBottom: 24,
        borderRadius: 20,
        minHeight: 180,
        overflow: "hidden",
    },
    orb: {
        position: "absolute",
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: PRIMARY_COLOR,
        opacity: 0.25,
        top: -60,
        right: -40,
    },
    content: {
        padding: 20,
        gap: 10,
    },
    badgeRow: {
        flexDirection: "row",
    },
    badge: {
        borderWidth: 1,
        borderColor: BORDER_COLOR,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: "rgba(124,58,237,0.15)",
    },
    badgeText: {
        color: PRIMARY_COLOR,
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
    heading: {
        color: "#ffffff",
        fontSize: 22,
        fontWeight: "700",
        lineHeight: 30,
        letterSpacing: -0.3,
    },
    subtext: {
        color: "rgba(255,255,255,0.55)",
        fontSize: 13,
        lineHeight: 18,
    },
    button: {
        alignSelf: "flex-start",
        marginTop: 6,
        borderRadius: 12,
        overflow: "hidden",
    },
    buttonGradient: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    buttonText: {
        color: WHITE_COLOR,
        fontWeight: "700",
        fontSize: 14,
        letterSpacing: 0.3,
    },
});