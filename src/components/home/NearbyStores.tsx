import { Clock, Location, Star } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from 'expo-router'; // ← Added
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swiper from 'react-native-swiper';
import sample from '../../../assets/expo.icon/Assets/store.png';

const { width } = Dimensions.get('window');

const stores = [
    { id: 1, name: "Aman Fresh Mart", image: sample, rating: "4.5", distance: "1.2 km", duration: "15 min" },
    { id: 2, name: "Green Valley Grocery", image: sample, rating: "4.2", distance: "0.8 km", duration: "10 min" },
    { id: 3, name: "QuickMart Superstore", image: sample, rating: "4.7", distance: "2.1 km", duration: "20 min" },
];

export default function NearbyStores() {
    const router = useRouter();

    return (
        <View>
            <View style={css.header}>
                <Text style={css.heading}>Nearby Stores</Text>

                <TouchableOpacity onPress={() => router.push('/(tabs)/products')}>
                    <Text style={css.seeAll}>View All</Text>
                </TouchableOpacity>
            </View>

            {/* Carousel */}
            <View style={css.carouselContainer}>
                <Swiper
                    style={css.wrapper}
                    showsButtons={false}
                    autoplay={false}
                    loop={true}
                    dotStyle={css.dot}
                    activeDotStyle={css.activeDot}
                    paginationStyle={css.pagination}
                >
                    {stores.map((store) => (
                        <View key={store.id} style={css.slide}>
                            <View style={css.card}>
                                <Image source={store.image} style={css.storeImg} />

                                <View style={css.cardContent}>
                                    <Text style={css.cardTitle}>{store.name}</Text>

                                    <View style={css.infoRow}>
                                        <View style={css.reviewTag}>
                                            <Text style={css.reviewTitle}>{store.rating}</Text>
                                            <HugeiconsIcon
                                                icon={Star}
                                                size={14}
                                                fill={'#027900'}
                                                strokeWidth={0}
                                            />
                                        </View>


                                        <Text style={css.cardStatsWrapper}>
                                            <Text style={css.distance}>
                                                <HugeiconsIcon size={16} icon={Location} />
                                                {store.distance}
                                            </Text>

                                            <Text style={css.distance}>
                                                <HugeiconsIcon size={16} icon={Clock} />
                                                {store.duration}
                                            </Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </Swiper>
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
        color: "#7c3aed",
        fontWeight: "600",
    },

    carouselContainer: {
        height: 142,
    },

    wrapper: { height: 142 },

    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        width: width * 0.9,
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
        color: '#242424',
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
        width: 'fit-content',
    },

    reviewTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#027900',
    },

    cardStatsWrapper: {
        display: 'flex',
        gap: 20,
        marginTop: 8,
    },

    distance: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
        display: 'flex',
        gap: 4,
        alignItems: "center"
    },

    dot: {
        backgroundColor: '#ddd',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
    },

    activeDot: {
        backgroundColor: '#7c3aed',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    pagination: {
        bottom: -24,
    },
});