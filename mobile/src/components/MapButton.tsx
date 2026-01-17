import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../config/constants';

interface MapButtonProps {
    latitude: number;
    longitude: number;
    label: string;
    language: 'ar' | 'fr';
}

/**
 * MapButton Component
 * Opens the location in native maps app (Google Maps on Android, Apple Maps on iOS)
 * Works perfectly with Expo Go - no development build needed
 */
export default function MapButton({ latitude, longitude, label, language }: MapButtonProps) {
    const openInMaps = () => {
        // Construct URL for native maps
        const scheme = Platform.select({
            ios: 'maps:0,0?q=',
            android: 'geo:0,0?q='
        });
        const latLng = `${latitude},${longitude}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        if (url) {
            Linking.openURL(url);
        }
    };

    return (
        <TouchableOpacity
            onPress={openInMaps}
            style={styles.container}
            activeOpacity={0.7}
        >
            <LinearGradient
                colors={[COLORS.accent, COLORS.accentLight]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text style={styles.icon}>🗺️</Text>
                <Text style={styles.text}>
                    {language === 'ar' ? 'فتح في الخرائط' : 'Ouvrir dans Maps'}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    icon: {
        fontSize: 18,
        marginRight: 8,
    },
    text: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
    },
});
