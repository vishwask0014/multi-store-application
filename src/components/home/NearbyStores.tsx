import { Clock, Location, Star } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from 'expo-router';
import { useRef, useState } from "react";
import { Dimensions, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import sample from '../../../assets/expo.icon/Assets/store.png';
import { BLACK_COLOR, PRIMARY_COLOR, WHITE_COLOR } from "../theme";

const { width } = Dimensions.get('window');

const stores = [
    { id: 1, name: "Aman Fresh Mart", image: sample, rating: "4.5", distance: "1.2 km", duration: "15 min" },
    { id: 2, name: "Green Valley Grocery", image: sample, rating: "4.2", distance: "0.8 km", duration: "10 min" },
    { id: 3, name: "QuickMart Superstore", image: sample, rating: "4.7", distance: "2.1 km", duration: "20 min" },
];

const CARD_WIDTH = width * 0.9;

export default function NearbyStores() {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
        setActiveIndex(index);
    };

    return (
        <View>
            <View style={css.header}>
                <Text style={css.heading}>Nearby Stores</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/products')}>
                    <Text style={css.seeAll}>View All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={stores}
                keyExtractor={(item) => String(item.id)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH}
                snapToAlignment="center"
                decelerationRate="fast"
                onScroll={onScroll}
                scrollEventThrottle={16}
                contentContainerStyle={css.flatListContent}
                renderItem={({ item: store }) => (
                    <View style={css.slide}>
                        <View style={css.card}>
                            <Image source={store.image} style={css.storeImg} />
                            <View style={css.cardContent}>
                                <Text style={css.cardTitle}>{store.name}</Text>
                                <View style={css.infoRow}>
                                    <View style={css.reviewTag}>
                                        <Text style={css.reviewTitle}>{store.rating}</Text>
                                        <HugeiconsIcon icon={Star} size={14} fill={'#027900'} strokeWidth={0} />
                                    </View>
                                    <View style={css.cardStatsWrapper}>
                                        <View style={css.statItem}>
                                            <HugeiconsIcon size={14} icon={Location} color="#666" />
                                            <Text style={css.distance}>{store.distance}</Text>
                                        </View>
                                        <View style={css.statItem}>
                                            <HugeiconsIcon size={14} icon={Clock} color="#666" />
                                            <Text style={css.distance}>{store.duration}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            />

            {/* Pagination dots */}
            <View style={css.dotsRow}>
                {stores.map((_, i) => (
                    <View
                        key={i}
                        style={[css.dot, i === activeIndex && css.activeDot]}
                    />
                ))}
            </View>
        </View>
    );
}

const css = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        marginTop: 16,
    },
    heading: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
        letterSpacing: -0.3,
    },
    seeAll: {
        fontSize: 13,
        color: PRIMARY_COLOR,
        fontWeight: "600",
    },
    flatListContent: {
        paddingHorizontal: (width - CARD_WIDTH) / 2,
    },
    slide: {
        width: CARD_WIDTH,
    },
    card: {
        backgroundColor: WHITE_COLOR,
        borderRadius: 16,
        overflow: 'hidden',
        width: CARD_WIDTH,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    storeImg: {
        width: 140,
        height: 140,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    cardContent: {
        padding: 16,
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        lineHeight: 24,
        color: BLACK_COLOR,
        fontWeight: '600',
        marginBottom: 8,
    },
    infoRow: {
        gap: 8,
    },
    reviewTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: '#d2f1d7',
        flexDirection: "row",
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
    },
    reviewTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#027900',
    },
    cardStatsWrapper: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 4,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    distance: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ddd',
    },
    activeDot: {
        backgroundColor: PRIMARY_COLOR,
    },
});
