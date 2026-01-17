// Language context for bilingual support
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ar' | 'fr';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations = {
    ar: {
        appName: 'مدينتي',
        appSubtitle: 'سيدي سليمان',
        noReports: 'لا توجد بلاغات بعد',
        noReportsSubtext: 'كن أول من يبلّغ عن مشكلة!',
        reportProblem: 'بلّغ عن مشكلة',
        loading: 'جاري التحميل...',
        retry: 'إعادة المحاولة',
        failedToLoad: 'فشل تحميل البلاغات. تأكد أن الخادم يعمل.',
        category: 'الفئة',
        status: 'الحالة',
        back: 'رجوع',
        photo: 'الصورة',
        takePhoto: 'التقط صورة',
        chooseFromGallery: 'اختر من المعرض',
        description: 'الوصف',
        descriptionOptional: 'الوصف (اختياري)',
        descriptionPlaceholder: 'صف المشكلة...',
        location: 'الموقع',
        gettingLocation: 'جاري تحديد الموقع...',
        submit: 'إرسال',
        submitReport: 'إرسال البلاغ',
        success: 'نجح!',
        successMessage: 'تم إرسال بلاغك. شكراً لجعل سيدي سليمان أفضل!',
        ok: 'حسناً',
        error: 'خطأ',
        missingField: 'حقل مفقود',
        selectCategory: 'الرجاء اختيار فئة',
        missingLocation: 'موقع مفقود',
        enableLocation: 'الرجاء تفعيل خدمات الموقع',
        missingPhoto: 'صورة مفقودة',
        takePhotoOfIssue: 'الرجاء التقاط صورة للمشكلة',
        failedToSubmit: 'فشل إرسال البلاغ. الرجاء المحاولة مرة أخرى.',
        changePhoto: 'تغيير الصورة',
        permissionDenied: 'تم رفض الإذن',
        locationPermissionRequired: 'إذن الموقع مطلوب للإبلاغ عن المشاكل',
        cameraPermissionRequired: 'إذن الكاميرا مطلوب',
        galleryPermissionRequired: 'إذن المعرض مطلوب',
    },
    fr: {
        appName: 'Madinti',
        appSubtitle: 'Sidi Slimane',
        noReports: 'Aucun signalement',
        noReportsSubtext: 'Soyez le premier à signaler un problème!',
        reportProblem: 'Signaler un Problème',
        loading: 'Chargement...',
        retry: 'Réessayer',
        failedToLoad: 'Échec du chargement. Assurez-vous que le serveur fonctionne.',
        category: 'Catégorie',
        status: 'Statut',
        back: 'Retour',
        photo: 'Photo',
        takePhoto: 'Prendre une photo',
        chooseFromGallery: 'Choisir de la galerie',
        description: 'Description',
        descriptionOptional: 'Description (optionnel)',
        descriptionPlaceholder: 'Décrivez le problème...',
        location: 'Emplacement',
        gettingLocation: 'Obtention de la localisation...',
        submit: 'Envoyer',
        submitReport: 'Envoyer le Signalement',
        success: 'Succès!',
        successMessage: 'Votre signalement a été envoyé. Merci de rendre Sidi Slimane meilleur!',
        ok: 'OK',
        error: 'Erreur',
        missingField: 'Champ manquant',
        selectCategory: 'Veuillez sélectionner une catégorie',
        missingLocation: 'Emplacement manquant',
        enableLocation: 'Veuillez activer les services de localisation',
        missingPhoto: 'Photo manquante',
        takePhotoOfIssue: 'Veuillez prendre une photo du problème',
        failedToSubmit: 'Échec de l\'envoi. Veuillez réessayer.',
        changePhoto: 'Changer la photo',
        permissionDenied: 'Permission refusée',
        locationPermissionRequired: 'Permission de localisation requise',
        cameraPermissionRequired: 'Permission de caméra requise',
        galleryPermissionRequired: 'Permission de galerie requise',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('ar');

    const t = (key: string): string => {
        return translations[language][key as keyof typeof translations['ar']] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
