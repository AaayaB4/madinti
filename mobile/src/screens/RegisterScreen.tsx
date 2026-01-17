import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { apiService } from '../services/api';
import { COLORS } from '../config/constants';
import { useLanguage } from '../utils/LanguageContext';

export default function RegisterScreen() {
    const navigation = useNavigation();
    const { language, t } = useLanguage();
    const [cinNumber, setCinNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!cinNumber.trim() || !phoneNumber.trim() || !fullName.trim()) {
            Alert.alert(
                t('error'),
                language === 'ar' ? 'الرجاء ملء جميع الحقول' : 'Veuillez remplir tous les champs'
            );
            return;
        }

        const phoneRegex = /^(\+212|0)[5-7]\d{8}$/;
        if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
            Alert.alert(
                t('error'),
                language === 'ar'
                    ? 'رقم الهاتف غير صحيح'
                    : 'Numéro de téléphone invalide'
            );
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.register({
                cinNumber: cinNumber.trim(),
                phoneNumber: phoneNumber.replace(/\s/g, ''),
                fullName: fullName.trim(),
            });

            (navigation as any).navigate('OTPVerification', {
                userId: response.data.userId,
                isLogin: false,
            });
        } catch (error: any) {
            console.error('Registration error:', error);
            Alert.alert(
                t('error'),
                error.response?.data?.message ||
                (language === 'ar' ? 'فشل التسجيل' : 'Échec de l\'inscription')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={COLORS.gradients.sky as any}
                style={StyleSheet.absoluteFill}
            />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backButtonText}>← {language === 'ar' ? 'رجوع' : 'Retour'}</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>
                        {language === 'ar' ? 'إنشاء حساب' : 'Créer un compte'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {language === 'ar' ? 'انضم إلى مدينتي' : 'Rejoignez Madinti'}
                    </Text>

                    {/* Glass Form */}
                    <BlurView intensity={60} tint="light" style={styles.formCard}>
                        <View style={styles.formContent}>
                            {/* CIN Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>
                                    {language === 'ar' ? 'رقم البطاقة الوطنية' : 'Numéro CIN'} *
                                </Text>
                                <BlurView intensity={40} tint="light" style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="AB123456"
                                        placeholderTextColor={COLORS.gray[400]}
                                        value={cinNumber}
                                        onChangeText={setCinNumber}
                                        autoCapitalize="characters"
                                        maxLength={15}
                                    />
                                </BlurView>
                            </View>

                            {/* Phone Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>
                                    {language === 'ar' ? 'رقم الهاتف' : 'Téléphone'} *
                                </Text>
                                <BlurView intensity={40} tint="light" style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="+212 6XX XX XX XX"
                                        placeholderTextColor={COLORS.gray[400]}
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                        keyboardType="phone-pad"
                                        maxLength={17}
                                    />
                                </BlurView>
                            </View>

                            {/* Name Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>
                                    {language === 'ar' ? 'الاسم الكامل' : 'Nom complet'} *
                                </Text>
                                <BlurView intensity={40} tint="light" style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed'}
                                        placeholderTextColor={COLORS.gray[400]}
                                        value={fullName}
                                        onChangeText={setFullName}
                                        autoCapitalize="words"
                                    />
                                </BlurView>
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                onPress={handleRegister}
                                disabled={loading}
                                activeOpacity={0.9}
                            >
                                <LinearGradient
                                    colors={[COLORS.primary, COLORS.accent] as any}
                                    style={styles.button}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color={COLORS.white} />
                                    ) : (
                                        <Text style={styles.buttonText}>
                                            {language === 'ar' ? 'متابعة' : 'Continuer'}
                                        </Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Login Link */}
                            <TouchableOpacity
                                style={styles.loginLink}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.loginText}>
                                    {language === 'ar' ? 'لديك حساب؟ ' : 'Déjà un compte ? '}
                                    <Text style={styles.loginTextBold}>
                                        {language === 'ar' ? 'سجّل الدخول' : 'Connectez-vous'}
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    backButton: {
        marginBottom: 24,
    },
    backButtonText: {
        color: COLORS.text.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: COLORS.text.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: COLORS.text.secondary,
        marginBottom: 32,
    },
    formCard: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.glass.border,
    },
    formContent: {
        padding: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.secondary,
        marginBottom: 8,
    },
    inputWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.glass.border,
    },
    input: {
        padding: 16,
        fontSize: 16,
        color: COLORS.text.primary,
        fontWeight: '500',
    },
    button: {
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 17,
        fontWeight: '700',
    },
    loginLink: {
        alignItems: 'center',
        marginTop: 8,
    },
    loginText: {
        fontSize: 15,
        color: COLORS.text.tertiary,
    },
    loginTextBold: {
        color: COLORS.accent,
        fontWeight: '700',
    },
});
