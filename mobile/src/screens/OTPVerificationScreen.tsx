import React, { useState, useEffect, useRef } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiService, setAuthTokens } from '../services/api';
import { COLORS } from '../config/constants';
import { useLanguage } from '../utils/LanguageContext';

export default function OTPVerificationScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { language, t } = useLanguage();

    const { userId, isLogin } = (route.params as any) || {};

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(300);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleOTPChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (index === 5 && text && newOtp.every(digit => digit)) {
            handleVerify(newOtp.join(''));
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (otpCode?: string) => {
        const code = otpCode || otp.join('');

        if (code.length !== 6) {
            Alert.alert(
                t('error'),
                language === 'ar' ? 'الرجاء إدخال الرمز كاملاً' : 'Entrez le code complet'
            );
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.verifyOTP({ userId, otpCode: code });
            setAuthTokens(response.accessToken, response.refreshToken);

            (navigation as any).reset({
                index: 0,
                routes: [{ name: 'MainApp' }],
            });
        } catch (error: any) {
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();

            Alert.alert(
                t('error'),
                error.response?.data?.message ||
                (language === 'ar' ? 'رمز غير صحيح' : 'Code incorrect')
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResending(true);
        try {
            await apiService.resendOTP(userId);
            setCountdown(300);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();

            Alert.alert(
                language === 'ar' ? 'تم' : 'Succès',
                language === 'ar' ? 'تم إرسال رمز جديد' : 'Nouveau code envoyé'
            );
        } catch (error: any) {
            Alert.alert(t('error'), error.response?.data?.message);
        } finally {
            setResending(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={COLORS.gradients.nature as any}
                style={StyleSheet.absoluteFill}
            />

            <KeyboardAvoidingView
                style={styles.content}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← {language === 'ar' ? 'رجوع' : 'Retour'}</Text>
                </TouchableOpacity>

                <Text style={styles.title}>
                    {language === 'ar' ? 'رمز التحقق' : 'Code de vérification'}
                </Text>
                <Text style={styles.subtitle}>
                    {language === 'ar'
                        ? 'أدخل الرمز المرسل'
                        : 'Entrez le code envoyé'}
                </Text>

                {/* Glass Card */}
                <BlurView intensity={60} tint="light" style={styles.otpCard}>
                    <View style={styles.otpContent}>
                        {/* OTP Inputs */}
                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <BlurView key={index} intensity={40} tint="light" style={styles.otpInputWrapper}>
                                    <TextInput
                                        ref={(ref) => (inputRefs.current[index] = ref)}
                                        style={styles.otpInput}
                                        value={digit}
                                        onChangeText={(text) => handleOTPChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        selectTextOnFocus
                                    />
                                </BlurView>
                            ))}
                        </View>

                        {/* Timer */}
                        <Text style={styles.timerText}>
                            {countdown > 0 ? (
                                <>{language === 'ar' ? 'ينتهي في ' : 'Expire dans '}{formatTime(countdown)}</>
                            ) : (
                                language === 'ar' ? 'انتهت الصلاحية' : 'Code expiré'
                            )}
                        </Text>

                        {/* Verify Button */}
                        <TouchableOpacity
                            onPress={() => handleVerify()}
                            disabled={loading || otp.some(d => !d)}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={[COLORS.accent, COLORS.accentLight] as any}
                                style={styles.button}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color={COLORS.white} />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        {language === 'ar' ? 'تحقق' : 'Vérifier'}
                                    </Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Resend */}
                        <TouchableOpacity
                            style={styles.resendButton}
                            onPress={handleResendOTP}
                            disabled={resending || countdown > 0}
                        >
                            <Text style={[styles.resendText, countdown > 0 && styles.resendTextDisabled]}>
                                {language === 'ar' ? 'إعادة إرسال' : 'Renvoyer'}
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
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        justifyContent: 'center',
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
        marginBottom: 40,
    },
    otpCard: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.glass.border,
    },
    otpContent: {
        padding: 32,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    otpInputWrapper: {
        width: 50,
        height: 60,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.glass.border,
    },
    otpInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        color: COLORS.text.primary,
    },
    timerText: {
        fontSize: 15,
        color: COLORS.text.tertiary,
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 17,
        fontWeight: '700',
    },
    resendButton: {
        alignItems: 'center',
        padding: 12,
    },
    resendText: {
        fontSize: 15,
        color: COLORS.accent,
        fontWeight: '600',
    },
    resendTextDisabled: {
        opacity: 0.4,
    },
});
