import React, { useRef } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_GAP = 12;
const ITEM_SIZE = CARD_WIDTH + CARD_GAP;

const offers = [
    {
        id: "1",
        tag: "Flash Deal",
        title: "50% Off\nGroceries",
        subtitle: "Fresh veggies, dairy & more",
        cta: "Shop Now",
        bgColors: ["#ff6b35", "#f7931e"],
        emoji: "🛒",
        badge: "2h left",
        badgeUrgent: true,
    },
    {
        id: "2",
        tag: "New Store",
        title: "Free\nDelivery",
        subtitle: "On your first 3 orders from FreshMart",
        cta: "Explore",
        bgColors: ["#11998e", "#38ef7d"],
        emoji: "🚀",
        badge: "New",
        badgeUrgent: false,
    },
    {
        id: "3",
        tag: "Weekend Special",
        title: "Buy 2\nGet 1 Free",
        subtitle: "Snacks, beverages & frozen food",
        cta: "Grab Deal",
        bgColors: ["#7c3aed", "#a78bfa"],
        emoji: "🎉",
        badge: "Ends Sun",
        badgeUrgent: true,
    },
    {
        id: "4",
        tag: "Member Only",
        title: "₹200 Off\nOrders ₹999+",
        subtitle: "Exclusive discount for Prime members",
        cta: "Claim Now",
        bgColors: ["#0f2027", "#203a43"],
        emoji: "👑",
        badge: "Members",
        badgeUrgent: false,
    },
    {
        id: "5",
        tag: "Combo Deal",
        title: "Breakfast\nBundle",
        subtitle: "Eggs, bread, butter & juice — ₹149",
        cta: "Add to Cart",
        bgColors: ["#f953c6", "#b91d73"],
        emoji: "🍳",
        badge: "Hot 🔥",
        badgeUrgent: true,
    },
];

function OfferCard({ item }: { item: (typeof offers)[0] }) {
    return (
        <View style={[css.card, { backgroundColor: item.bgColors[0] }]}>
            <View style={[css.cardOverlay, { backgroundColor: item.bgColors[1] }]} />
            <View style={css.circle1} />
            <View style={css.circle2} />

            <View style={css.topRow}>
                <View style={css.tag}>
                    <Text style={css.tagText}>{item.tag}</Text>
                </View>
                <View
                    style={[
                        css.badge,
                        {
                            backgroundColor: item.badgeUrgent
                                ? "rgba(255,59,48,0.9)"
                                : "rgba(255,255,255,0.2)",
                        },
                    ]}
                >
                    <Text style={css.badgeText}>{item.badge}</Text>
                </View>
            </View>

            <View style={css.cardContent}>
                <Text style={css.emoji}>{item.emoji}</Text>
                <View style={css.textBlock}>
                    <Text style={css.title}>{item.title}</Text>
                    <Text style={css.subtitle}>{item.subtitle}</Text>
                    <TouchableOpacity style={css.cta} activeOpacity={0.8}>
                        <Text style={css.ctaText}>{item.cta} →</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

function AnimatedDot({ index, scrollX }: { index: number; scrollX: Animated.Value }) {
    const inputRange = [
        (index - 1) * ITEM_SIZE,
        index * ITEM_SIZE,
        (index + 1) * ITEM_SIZE,
    ];

    const dotWidth = scrollX.interpolate({
        inputRange,
        outputRange: [6, 20, 6],
        extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
    });

    // interpolate between grey and purple using a 0→1 number
    const colorProgress = scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 0],
        extrapolate: "clamp",
    });

    // Animated.Color isn't available in RN — use two overlapping Views instead
    return (
        <View style={{ width: 20, height: 6, justifyContent: "center", alignItems: "center" }}>
            {/* inactive (grey) base */}
            <Animated.View
                style={[
                    css.dot,
                    { width: dotWidth, opacity, backgroundColor: "#8fa0b9ff", position: "absolute" },
                ]}
            />
            {/* active (purple) layer fades in on top */}
            <Animated.View
                style={[
                    css.dot,
                    { width: dotWidth, opacity: colorProgress, backgroundColor: "#7c3aed", position: "absolute" },
                ]}
            />
        </View>
    );
}

export default function OfferCarousel() {
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<any>(null);

    return (
        <View style={css.wrapper}>
            <View style={css.header}>
                <Text style={css.heading}>Today's Offers</Text>
                <TouchableOpacity>
                    <Text style={css.seeAll}>See all</Text>
                </TouchableOpacity>
            </View>

            <Animated.FlatList
                ref={flatListRef}
                data={offers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <OfferCard item={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_SIZE}
                snapToAlignment="start"
                decelerationRate={0.92}
                disableIntervalMomentum={true}
                contentContainerStyle={css.listContent}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }  // must be false for dot width interpolation
                )}
                scrollEventThrottle={16}
            />

            <View style={css.dots}>
                {offers.map((_, i) => (
                    <AnimatedDot key={i} index={i} scrollX={scrollX} />
                ))}
            </View>
        </View>
    );
}

const css = StyleSheet.create({
    wrapper: {
        marginVertical: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    heading: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
        letterSpacing: -0.3,
    },
    seeAll: {
        fontSize: 13,
        color: "#7c3aed",
        fontWeight: "600",
    },
    listContent: {
        gap: CARD_GAP,
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 20,
        overflow: "hidden",
        padding: 18,
    },
    cardOverlay: {
        position: "absolute",
        top: 0,
        right: 0,
        width: "60%",
        height: "100%",
        opacity: 0.5,
    },
    circle1: {
        position: "absolute",
        width: 160,
        height: 160,
        borderRadius: 80,
        top: -60,
        right: -40,
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    circle2: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 50,
        bottom: -30,
        right: 60,
        backgroundColor: "rgba(255,255,255,0.06)",
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    tag: {
        backgroundColor: "rgba(255,255,255,0.25)",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    tagText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    badge: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    badgeText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "700",
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },
    emoji: {
        fontSize: 48,
    },
    textBlock: {
        flex: 1,
        gap: 4,
    },
    title: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "800",
        lineHeight: 26,
        letterSpacing: -0.5,
    },
    subtitle: {
        color: "rgba(255,255,255,0.75)",
        fontSize: 12,
        lineHeight: 16,
    },
    cta: {
        alignSelf: "flex-start",
        marginTop: 6,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    ctaText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },
    dots: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
        gap: 5,
    },
    dot: {
        height: 6,
        borderRadius: 3,
    },
});