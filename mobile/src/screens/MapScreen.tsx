import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { apiService, Report } from '../services/api';
import { COLORS, CATEGORIES } from '../config/constants';
import { useLanguage } from '../utils/LanguageContext';

export default function MapScreen() {
    const navigation = useNavigation();
    const { language, t } = useLanguage();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<string | null>(null);

    useEffect(() => {
        loadReports();

        const unsubscribe = (navigation as any).addListener('focus', () => {
            loadReports();
        });

        return unsubscribe;
    }, [navigation]);

    const loadReports = async () => {
        try {
            setLoading(true);
            const data = await apiService.getReports();
            setReports(data);
        } catch (err: any) {
            console.error('Failed to load reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        const cat = CATEGORIES.find(c => c.value === category);
        return cat ? cat.icon : '📍';
    };

    const getCategoryColor = (category: string) => {
        const cat = CATEGORIES.find(c => c.value === category);
        return cat ? cat.color : COLORS.primary;
    };

    const getMarkerColor = (status: string) => {
        switch (status) {
            case 'NEW':
                return '#3B82F6'; // Blue
            case 'ACKNOWLEDGED':
            case 'IN_PROGRESS':
                return '#F59E0B'; // Amber
            case 'RESOLVED':
            case 'CLOSED':
                return '#10B981'; // Green
            case 'REJECTED':
                return '#EF4444'; // Red
            default:
                return COLORS.primary;
        }
    };

    // Calculate map region based on reports
    const getMapRegion = () => {
        if (reports.length === 0) {
            // Default to Sidi Slimane, Morocco
            return {
                latitude: 34.2625,
                longitude: -5.9286,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            };
        }

        const lats = reports.map(r => r.locationLat);
        const lngs = reports.map(r => r.locationLng);

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        return {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: Math.max(maxLat - minLat, 0.05) * 1.5,
            longitudeDelta: Math.max(maxLng - minLng, 0.05) * 1.5,
        };
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient
                    colors={COLORS.gradients.ocean}
                    style={StyleSheet.absoluteFill}
                />
                <ActivityIndicator size="large" color={COLORS.white} />
                <Text style={styles.loadingText}>{t('loading')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={[COLORS.background + 'F0', COLORS.background + '00']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        {language === 'ar' ? 'الخريطة' : 'Carte'}
                    </Text>
                    <View style={styles.placeholder} />
                </View>
            </LinearGradient>

            {/* Map */}
            <MapView
                style={styles.map}
                initialRegion={getMapRegion()}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                showsMyLocationButton
                customMapStyle={darkMapStyle}
            >
                {reports.map((report) => (
                    <Marker
                        key={report.id}
                        coordinate={{
                            latitude: report.locationLat,
                            longitude: report.locationLng,
                        }}
                        pinColor={getMarkerColor(report.status)}
                        onPress={() => setSelectedReport(report.id)}
                    >
                        <View style={[styles.markerContainer, { borderColor: getCategoryColor(report.category) }]}>
                            <Text style={styles.markerIcon}>{getCategoryIcon(report.category)}</Text>
                        </View>

                        <Callout
                            tooltip
                            onPress={() => {
                                (navigation as any).navigate('ReportDetail', { reportId: report.id });
                            }}
                        >
                            <View style={styles.callout}>
                                <View style={styles.calloutHeader}>
                                    <Text style={styles.calloutCategory}>
                                        {getCategoryIcon(report.category)} {report.category}
                                    </Text>
                                    <View style={[styles.calloutStatus, { backgroundColor: getMarkerColor(report.status) }]}>
                                        <Text style={styles.calloutStatusText}>{report.status}</Text>
                                    </View>
                                </View>
                                {report.description && (
                                    <Text style={styles.calloutDescription} numberOfLines={2}>
                                        {report.description}
                                    </Text>
                                )}
                                <Text style={styles.calloutDate}>
                                    {new Date(report.createdAt).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR')}
                                </Text>
                                <Text style={styles.calloutTap}>
                                    {language === 'ar' ? 'اضغط للتفاصيل' : 'Appuyez pour détails'}
                                </Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            {/* Legend */}
            <View style={styles.legend}>
                <LinearGradient
                    colors={[COLORS.backgroundCard, COLORS.backgroundCard + 'E0']}
                    style={styles.legendGradient}
                >
                    <Text style={styles.legendTitle}>
                        {language === 'ar' ? 'الحالة' : 'Statut'}
                    </Text>
                    <View style={styles.legendItems}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
                            <Text style={styles.legendText}>{language === 'ar' ? 'جديد' : 'Nouveau'}</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                            <Text style={styles.legendText}>{language === 'ar' ? 'معالجة' : 'En cours'}</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                            <Text style={styles.legendText}>{language === 'ar' ? 'محلول' : 'Résolu'}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </View>
    );
}

const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#1E293B' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#CBD5E1' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0F172A' }] },
    {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#334155' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#475569' }]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#1E40AF' }]
    }
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.backgroundCard,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 24,
        color: COLORS.text.primary,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text.primary,
    },
    placeholder: {
        width: 40,
    },
    map: {
        flex: 1,
    },
    markerContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
    },
    markerIcon: {
        fontSize: 20,
    },
    callout: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 12,
        width: 200,
    },
    calloutHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    calloutCategory: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.background,
        flex: 1,
    },
    calloutStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    calloutStatusText: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.white,
    },
    calloutDescription: {
        fontSize: 13,
        color: COLORS.gray[700],
        marginBottom: 8,
    },
    calloutDate: {
        fontSize: 12,
        color: COLORS.gray[500],
        marginBottom: 4,
    },
    calloutTap: {
        fontSize: 11,
        color: COLORS.primary,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 4,
    },
    legend: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },
    legendGradient: {
        padding: 16,
    },
    legendTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text.primary,
        marginBottom: 12,
    },
    legendItems: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
        color: COLORS.text.secondary,
        fontWeight: '500',
    },
});
