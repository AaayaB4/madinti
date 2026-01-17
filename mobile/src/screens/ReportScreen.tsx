import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { COLORS, CATEGORIES } from '../config/constants';
import { apiService } from '../services/api';
import { useLanguage } from '../utils/LanguageContext';

export default function ReportScreen() {
    const navigation = useNavigation();
    const { language, t } = useLanguage();
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    t('error'),
                    language === 'ar' ? 'إذن الموقع مطلوب' : 'Permission de localisation requise'
                );
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        } catch (error) {
            console.error(error);
            Alert.alert(
                t('error'),
                language === 'ar' ? 'فشل الحصول على الموقع' : 'Échec d\'obtention de la localisation'
            );
        }
    };

    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    t('error'),
                    language === 'ar' ? 'إذن الكاميرا مطلوب' : 'Permission de caméra requise'
                );
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setPhoto(result.assets[0].uri);
            }
        } catch (error) {
            console.error(error);
            Alert.alert(
                t('error'),
                language === 'ar' ? 'فشل التقاط الصورة' : 'Échec de la prise de photo'
            );
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    t('error'),
                    language === 'ar' ? 'إذن المعرض مطلوب' : 'Permission de galerie requise'
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setPhoto(result.assets[0].uri);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!category) {
            Alert.alert(
                language === 'ar' ? 'حقل مفقود' : 'Champ manquant',
                language === 'ar' ? 'الرجاء اختيار فئة' : 'Veuillez sélectionner une catégorie'
            );
            return;
        }

        if (!location) {
            Alert.alert(
                language === 'ar' ? 'موقع مفقود' : 'Localisation manquante',
                language === 'ar' ? 'الرجاء تفعيل خدمات الموقع' : 'Veuillez activer les services de localisation'
            );
            return;
        }

        if (!photo) {
            Alert.alert(
                language === 'ar' ? 'صورة مفقودة' : 'Photo manquante',
                language === 'ar' ? 'الرجاء التقاط صورة للمشكلة' : 'Veuillez prendre une photo du problème'
            );
            return;
        }

        setLoading(true);
        try {
            // Submit report to API
            await apiService.createReport({
                category,
                description: description || '',
                locationLat: location.coords.latitude,
                locationLng: location.coords.longitude,
                photoUrls: [photo], // TODO: Upload to MinIO first
            });

            Alert.alert(
                language === 'ar' ? 'نجح!' : 'Succès!',
                language === 'ar'
                    ? 'تم إرسال بلاغك. شكراً لجعل سيدي سليمان أفضل!'
                    : 'Votre signalement a été envoyé. Merci de rendre Sidi Slimane meilleur!',
                [
                    {
                        text: language === 'ar' ? 'حسناً' : 'OK',
                        onPress: () => {
                            // Navigate back and refresh home screen
                            (navigation as any).navigate('Home', { refresh: true });
                        },
                    },
                ]
            );
        } catch (error: any) {
            console.error('Report submission error:', error);
            Alert.alert(
                t('error'),
                language === 'ar'
                    ? 'فشل إرسال البلاغ. يرجى المحاولة مرة أخرى.'
                    : 'Échec de l\'envoi du signalement. Veuillez réessayer.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>
                        {language === 'ar' ? 'رجوع ←' : '← Retour'}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.title}>
                    {language === 'ar' ? 'بلّغ عن مشكلة' : 'Signaler un problème'}
                </Text>
                <Text style={styles.subtitle}>
                    {language === 'ar' ? 'مدينتي' : 'Madinti'}
                </Text>
            </View>

            <View style={styles.content}>
                {/* Photo Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>
                        {language === 'ar' ? 'صورة *' : 'Photo *'}
                    </Text>
                    {photo ? (
                        <View>
                            <Image source={{ uri: photo }} style={styles.photoPreview} />
                            <TouchableOpacity style={styles.changePhotoButton} onPress={takePhoto}>
                                <Text style={styles.changePhotoText}>
                                    {language === 'ar' ? 'تغيير الصورة' : 'Changer la photo'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.photoButtons}>
                            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                                <Text style={styles.photoButtonText}>📷</Text>
                                <Text style={styles.photoButtonLabel}>
                                    {language === 'ar' ? 'التقط صورة' : 'Prendre'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                                <Text style={styles.photoButtonText}>🖼️</Text>
                                <Text style={styles.photoButtonLabel}>
                                    {language === 'ar' ? 'من المعرض' : 'Galerie'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Category Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>
                        {language === 'ar' ? 'الفئة *' : 'Catégorie *'}
                    </Text>
                    <View style={styles.categoryGrid}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.value}
                                style={[
                                    styles.categoryCard,
                                    category === cat.value && styles.categoryCardSelected,
                                ]}
                                onPress={() => setCategory(cat.value)}
                            >
                                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                                <Text style={styles.categoryLabel}>
                                    {language === 'ar' ? cat.labelAr : cat.labelFr}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.label}>
                        {language === 'ar' ? 'الوصف (اختياري)' : 'Description (facultatif)'}
                    </Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder={language === 'ar' ? 'صف المشكلة...' : 'Décrivez le problème...'}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        returnKeyType="done"
                        blurOnSubmit={true}
                        onSubmitEditing={() => Keyboard.dismiss()}
                    />
                </View>

                {/* Location */}
                <View style={styles.section}>
                    <Text style={styles.label}>
                        {language === 'ar' ? 'الموقع' : 'Localisation'}
                    </Text>
                    {location ? (
                        <View style={styles.locationBox}>
                            <Text style={styles.locationText}>
                                📍 {location.coords.latitude.toFixed(6)},{' '}
                                {location.coords.longitude.toFixed(6)}
                            </Text>
                            <Text style={styles.locationSubtext}>
                                {language === 'ar' ? 'سيدي سليمان، المغرب' : 'Sidi Slimane, Maroc'}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.locationBox}>
                            <ActivityIndicator />
                            <Text style={styles.locationText}>
                                {language === 'ar' ? 'جاري الحصول على الموقع...' : 'Obtention de la localisation...'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.submitButtonText}>
                            {language === 'ar' ? 'إرسال البلاغ' : 'Envoyer le signalement'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.primary,
        padding: 20,
        paddingTop: 60,
    },
    backButton: {
        color: COLORS.white,
        fontSize: 16,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.white,
        opacity: 0.9,
        marginTop: 4,
    },
    content: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: 12,
    },
    photoButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    photoButton: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        alignItems: 'center',
    },
    photoButtonText: {
        fontSize: 40,
        marginBottom: 8,
    },
    photoButtonLabel: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 13,
    },
    photoPreview: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    changePhotoButton: {
        marginTop: 12,
        padding: 12,
        backgroundColor: COLORS.backgroundElevated,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray[300],
    },
    changePhotoText: {
        color: COLORS.text.secondary,
        fontWeight: '600',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryCard: {
        width: '48%',
        backgroundColor: COLORS.backgroundElevated,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        alignItems: 'center',
    },
    categoryCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '15',
    },
    categoryIcon: {
        fontSize: 36,
        marginBottom: 8,
    },
    categoryLabel: {
        fontSize: 13,
        textAlign: 'center',
        color: COLORS.text.primary,
        fontWeight: '600',
    },
    textArea: {
        backgroundColor: COLORS.backgroundElevated,
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: 12,
        padding: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        fontSize: 15,
    },
    locationBox: {
        backgroundColor: COLORS.backgroundElevated,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.gray[300],
    },
    locationText: {
        fontSize: 14,
        color: COLORS.text.primary,
        fontWeight: '500',
    },
    locationSubtext: {
        fontSize: 13,
        color: COLORS.text.secondary,
        marginTop: 4,
    },
    submitButton: {
        backgroundColor: COLORS.secondary,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 17,
        fontWeight: '600',
    },
});
