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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { apiService } from '../services/api';
import { COLORS } from '../config/constants';
import { useLanguage } from '../utils/LanguageContext';

export default function LoginScreen() {
    const navigation = useNavigation();
    const { language, t } = useLanguage();
    const [cinNumber, setCinNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!cinNumber.trim()) {
            Alert.alert(
                t('error'),
                language === 'ar' ? 'الرجاء إدخال رقم البطاقة الوطنية' : 'Veuillez entrer votre numéro CIN'
            );
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.login({ cinNumber: cinNumber.trim() });

            (navigation as any).navigate('OTPVerification', {
                userId: response.data.userId,
                isLogin: true,
            });
        } catch (error: any) {
            console.error('Login error:', error);
            Alert.alert(
                t('error'),
                error.response?.data?.message ||
                (language === 'ar' ? 'فشل تسجيل الدخول' : 'Échec de la connexion')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={COLORS.gradients.mint as any}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />

            <KeyboardAvoidingView
                style={styles.content}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Logo/Title */}
                <View style={styles.header}>
                    <Text style={styles.title}>{t('appName')}</Text>
                    <Text style={styles.subtitle}>
                        {language === 'ar' ? 'تسجيل الدخول' : 'Connexion'}
                    </Text>
                </View>

                {/* Glass Form Card */}
                <BlurView intensity={60} tint="light" style={styles.formCard}>
                    <View style={styles.formContent}>
                        <Text style={styles.label}>
                            {language === 'ar' ? 'رقم البطاقة الوطنية (CIN)' : 'Numéro CIN'}
                        </Text>
                        <View style={styles.inputWrapper}>
                            <BlurView intensity={40} tint="light" style={styles.inputBlur}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={language === 'ar' ? 'أدخل رقم البطاقة' : 'Entrez votre CIN'}
                                    placeholderTextColor={COLORS.gray[400]}
                                    value={cinNumber}
                                    onChangeText={setCinNumber}
                                    autoCapitalize="characters"
                                    autoCorrect={false}
                                    maxLength={15}
                                />
                            </BlurView>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={loading ? [COLORS.gray[200], COLORS.gray[300]] : [COLORS.primary, COLORS.primaryLight] as any}
                                style={styles.button}
                            >
                                {loading ? (
                                    <ActivityIndicator color={COLORS.white} />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        {language === 'ar' ? 'إرسال رمز التحقق' : 'Envoyer le code'}
                                    </Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Register Link */}
                        <TouchableOpacity
                            style={styles.registerLink}
                            onPress={() => (navigation as any).navigate('Register')}
                        >
                            <Text style={styles.registerText}>
                                {language === 'ar' ? 'ليس لديك حساب؟ ' : 'Pas de compte ? '}
                                <Text style={styles.registerTextBold}>
                                    {language === 'ar' ? 'سجّل' : 'Inscrivez-vous'}
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        color: COLORS.text.primary,
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '600',
        color: COLORS.text.primary,
        opacity: 0.9,
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
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: 12,
    },
    inputWrapper: {
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.glass.border,
    },
    inputBlur: {
        borderRadius: 16,
    },
    input: {
        padding: 18,
        fontSize: 16,
        color: COLORS.text.primary,
        fontWeight: '500',
    },
    button: {
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.glass.border,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 17,
        fontWeight: '700',
    },
    registerLink: {
        alignItems: 'center',
        marginTop: 8,
    },
    registerText: {
        fontSize: 15,
        color: COLORS.text.primary,
        opacity: 0.8,
    },
    registerTextBold: {
        fontWeight: '700',
        opacity: 1,
    },
});
