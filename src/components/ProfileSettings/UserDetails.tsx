import {
    Calendar01FreeIcons,
    Call01FreeIcons,
    Mail01FreeIcons
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import userImg from '../../../assets/expo.icon/Assets/user.png';
import { BLACK_COLOR } from "../theme";

export default function Profile() {
    return (
        <ScrollView style={css.container} showsVerticalScrollIndicator={false}>
            {/* User Profile Header */}
            <View style={css.header}>
                <Image source={userImg} style={css.profileImg} />
                <View style={css.userInfo}>
                    <Text style={css.name}>Aman Singh</Text>
                    <Text style={css.locationText}>
                        Model Town, Ludhiana, India
                    </Text>
                </View>
            </View>

            {/* Account Details */}
            <View style={css.section}>
                <Text style={css.sectionTitle}>Account Details</Text>

                <View style={css.detailRow}>
                    <HugeiconsIcon icon={Call01FreeIcons} size={20} color="#666" />
                    <Text style={css.detailText}>+91 12345 57790</Text>
                </View>

                <View style={css.detailRow}>
                    <HugeiconsIcon icon={Mail01FreeIcons} size={20} color="#666" />
                    <Text style={css.detailText}>amansingh@gmail.com</Text>
                </View>

                <View style={css.detailRow}>
                    <HugeiconsIcon icon={Calendar01FreeIcons} size={20} color="#666" />
                    <Text style={css.detailText}>Joined 28 Aug 2023</Text>
                </View>
            </View>

            {/* Saved Addresses */}
            <View style={css.section}>
                <View style={css.sectionHeader}>
                    <Text style={css.sectionTitle}>Saved Addresses</Text>
                    <TouchableOpacity>
                        <Text style={css.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                <View style={css.addressCard}>
                    <Text style={css.addressTitle}>Primary Ludhiana</Text>
                    <Text style={css.addressText}>
                        Model Town, Ludhiana, Punjab 141001
                    </Text>
                </View>
            </View>

            {/* Payment Methods */}
            <View style={css.section}>
                <View style={css.sectionHeader}>
                    <Text style={css.sectionTitle}>Payment Methods</Text>
                    <TouchableOpacity>
                        <Text style={css.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <View style={css.paymentCard}>
                    <View style={css.walletInfo}>
                        <Text style={css.walletLabel}>Wallet Balance</Text>
                        <Text style={css.walletAmount}>₹72.50</Text>
                    </View>
                </View>
            </View>

            {/* Order Status Overview */}
            <View style={css.section}>
                <Text style={css.sectionTitle}>Order Status Overview</Text>
                <View style={css.ordersRow}>
                    <View style={[css.orderCard, { backgroundColor: '#d4edda' }]}>
                        <Text style={css.orderNumber}>#12345</Text>
                        <Text style={[css.orderStatus, { color: '#027900' }]}>Completed</Text>
                    </View>

                    <View style={[css.orderCard, { backgroundColor: '#fff3cd' }]}>
                        <Text style={css.orderNumber}>#67890</Text>
                        <Text style={[css.orderStatus, { color: '#856404' }]}>In-transit</Text>
                    </View>

                    <View style={[css.orderCard, { backgroundColor: '#cce5ff' }]}>
                        <Text style={css.orderNumber}>#54321</Text>
                        <Text style={[css.orderStatus, { color: '#004085' }]}>Processing</Text>
                    </View>
                </View>
            </View>

            {/* Support */}
            <View style={css.section}>
                <TouchableOpacity style={css.supportButton}>
                    <Text style={css.supportText}>Give Feedback / Support</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const css = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },

    header: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profileImg: {
        width: 88,
        height: 88,
        borderRadius: 50,
        marginBottom: 12,
    },
    userInfo: {
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: BLACK_COLOR,
    },
    locationText: {
        fontSize: 15,
        color: '#666',
        marginTop: 4,
    },

    section: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111',
    },
    seeAll: {
        color: '#7c3aed',
        fontWeight: '600',
        fontSize: 14,
    },

    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    detailText: {
        fontSize: 15,
        color: '#333',
    },

    addressCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
    },
    addressTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },

    paymentCard: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 12,
    },
    walletInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    walletLabel: {
        fontSize: 15,
        color: '#555',
    },
    walletAmount: {
        fontSize: 22,
        fontWeight: '700',
        color: '#027900',
    },

    ordersRow: {
        flexDirection: 'row',
        gap: 10,
    },
    orderCard: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    orderNumber: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    orderStatus: {
        fontSize: 13,
        fontWeight: '600',
    },

    supportButton: {
        backgroundColor: '#7c3aed',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 30,
    },
    supportText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});