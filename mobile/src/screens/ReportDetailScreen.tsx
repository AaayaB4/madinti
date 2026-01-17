import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiService, Report } from '../services/api';
import { COLORS, CATEGORIES } from '../config/constants';
import { useLanguage } from '../utils/LanguageContext';
import MapButton from '../components/MapButton';

export default function ReportDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { language, t } = useLanguage();
    const { reportId } = (route.params as any) || {};

    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReport();
    }, [reportId]);

    const loadReport = async () => {
        try {
            setLoading(true);
            const data = await apiService.getReport(reportId);
            setReport(data);
        } catch (err: any) {
            console.error('Failed to load report:', err);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        const cat = CATEGORIES.find(c => c.value === category);
        return cat ? cat.icon : '📍';
    };

    const getCategoryLabel = (category: string) => {
        const cat = CATEGORIES.find(c => c.value === category);
        if (!cat) return category;
        return language === 'ar' ? cat.labelAr : cat.labelFr;
    };

    const getStatusLabel = (status: string) => {
        const labels = {
            ar: {
                NEW: 'جديد', ACKNOWLEDGED: 'تم الاستلام', IN_PROGRESS: 'قيد المعالجة',
                RESOLVED: 'محلول', CLOSED: 'مغلق', REJECTED: 'مرفوض',
            },
            fr: {
                NEW: 'Nouveau', ACKNOWLEDGED: 'Reçu', IN_PROGRESS: 'En cours',
                RESOLVED: 'Résolu', CLOSED: 'Fermé', REJECTED: 'Rejeté',
            }
        };
        return labels[language][status as keyof typeof labels.ar] || status;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW':
                return COLORS.primary;
            case 'ACKNOWLEDGED':
            case 'IN_PROGRESS':
                return COLORS.warning;
            case 'RESOLVED':
            case 'CLOSED':
                return COLORS.success;
            case 'REJECTED':
                return COLORS.danger;
            default:
                return COLORS.primary;
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient
                    colors={COLORS.gradients.ocean}
                    style={StyleSheet.absoluteFill}
                />
                <ActivityIndicator size="large" color={COLORS.white} />
            </View>
        );
    }

    if (!report) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={COLORS.gradients.ocean}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {language === 'ar' ? 'البلاغ غير موجود' : 'Signalement non trouvé'}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>
                            {language === 'ar' ? 'رجوع' : 'Retour'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#FFFFFF', '#F9FAFB', '#F3F4F6'] as any}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <BlurView intensity={80} tint="light" style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.headerButton}
                    >
                        <Text style={styles.headerButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {language === 'ar' ? 'تفاصيل البلاغ' : 'Détails du signalement'}
                    </Text>
                    <View style={styles.placeholder} />
                </View>
            </BlurView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Status & Category Card */}
                <BlurView intensity={60} tint="light" style={styles.card}>
                    <View style={styles.cardContent}>
                        <View style={styles.categoryRow}>
                            <Text style={styles.categoryIcon}>{getCategoryIcon(report.category)}</Text>
                            <View style={styles.categoryInfo}>
                                <Text style={styles.categoryLabel}>{getCategoryLabel(report.category)}</Text>
                                <Text style={styles.categoryType}>{report.category}</Text>
                            </View>
                        </View>

                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '30' }]}>
                            <View style={[styles.statusDot, { backgroundColor: getStatusColor(report.status) }]} />
                            <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                                {getStatusLabel(report.status)}
                            </Text>
                        </View>
                    </View>
                </BlurView>

                {/* Description Card */}
                {report.description && (
                    <BlurView intensity={60} tint="light" style={styles.card}>
                        <View style={styles.cardContent}>
                            <Text style={styles.sectionTitle}>
                                {language === 'ar' ? 'الوصف' : 'Description'}
                            </Text>
                            <Text style={styles.description}>{report.description}</Text>
                        </View>
                    </BlurView>
                )}

                {/* Location Card */}
                <BlurView intensity={60} tint="light" style={styles.card}>
                    <View style={styles.cardContent}>
                        <Text style={styles.sectionTitle}>
                            {language === 'ar' ? 'الموقع' : 'Localisation'}
                        </Text>
                        <View style={styles.locationRow}>
                            <Text style={styles.locationIcon}>📍</Text>
                            <View style={styles.locationInfo}>
                                <Text style={styles.locationCoords}>
                                    {report.locationLat.toFixed(6)}, {report.locationLng.toFixed(6)}
                                </Text>
                            </View>
                        </View>

                        {/* Map Button Component */}
                        <MapButton
                            latitude={report.locationLat}
                            longitude={report.locationLng}
                            label={getCategoryLabel(report.category)}
                            language={language}
                        />
                    </View>
                </BlurView>

                {/* Info Card */}
                <BlurView intensity={60} tint="light" style={styles.card}>
                    <View style={styles.cardContent}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>
                                {language === 'ar' ? 'التاريخ' : 'Date'}
                            </Text>
                            <Text style={styles.infoValue}>
                                {new Date(report.createdAt).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Text>
                        </View>

                        <View style={styles.separator} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>
                                {language === 'ar' ? 'عدد الإعجابات' : 'Votes'}
                            </Text>
                            <View style={styles.upvoteRow}>
                                <Text style={styles.upvoteIcon}>👍</Text>
                                <Text style={styles.infoValue}>{report.upvoteCount || 0}</Text>
                            </View>
                        </View>
                    </View>
                </BlurView>

                {/* Action Button */}
                <TouchableOpacity activeOpacity={0.9}>
                    <LinearGradient
                        colors={[COLORS.accent, COLORS.accentLight] as any}
                        style={styles.actionButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.actionButtonText}>
                            👍 {language === 'ar' ? 'أعجبني' : 'J\'aime'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: COLORS.white,
        marginBottom: 20,
        textAlign: 'center',
    },
    backButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: COLORS.white + '20',
        borderRadius: 12,
    },
    backButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.glass.border,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.backgroundCard,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButtonText: {
        fontSize: 24,
        color: COLORS.text.primary,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text.primary,
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        backgroundColor: COLORS.white,
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    cardContent: {
        padding: 20,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    categoryIcon: {
        fontSize: 40,
        marginRight: 16,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryLabel: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text.primary,
        marginBottom: 4,
    },
    categoryType: {
        fontSize: 13,
        color: COLORS.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text.secondary,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 17,
        color: COLORS.text.primary,
        lineHeight: 26,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    locationIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    locationInfo: {
        flex: 1,
    },
    locationCoords: {
        fontSize: 15,
        color: COLORS.text.primary,
        fontWeight: '600',
        marginBottom: 4,
    },
    locationAddress: {
        fontSize: 14,
        color: COLORS.text.tertiary,
        lineHeight: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.glass.border,
        marginVertical: 8,
    },
    infoLabel: {
        fontSize: 15,
        color: COLORS.text.tertiary,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 15,
        color: COLORS.text.primary,
        fontWeight: '600',
    },
    upvoteRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    upvoteIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    actionButton: {
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginTop: 8,
    },
    actionButtonText: {
        color: COLORS.white,
        fontSize: 17,
        fontWeight: '700',
    },
});
