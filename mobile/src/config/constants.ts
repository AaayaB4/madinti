export const API_BASE_URL = 'http://10.252.114.209:3000/api';

// Fresh Modern Theme - Emerald Green + Soft Teal
export const COLORS = {
    // Primary - Emerald Green
    primary: '#10B981', // Emerald
    primaryLight: '#34D399', // Light Emerald
    primaryDark: '#059669',

    // Beautiful gradients - Green to Teal
    gradients: {
        ocean: ['#F0FDFA', '#CCFBF1', '#99F6E4', '#5EEAD4'], // Teal gradient
        mint: ['#ECFDF5', '#D1FAE5', '#A7F3D0', '#6EE7B7'], // Mint green
        sky: ['#F0F9FF', '#E0F2FE', '#BAE6FD', '#7DD3FC'], // Light blue
        sunset: ['#FEF3C7', '#FDE68A', '#FCD34D'], // Warm accent
        nature: ['#F0FDFA', '#CCFBF1', '#A7F3D0'], // Green-teal blend
        gradient: ['#10B981', '#14B8A6', '#06B6D4'], // Emerald to teal
    },

    // Accent colors - Teal/Cyan
    accent: '#14B8A6', // Teal
    accentLight: '#5EEAD4', // Light teal
    accentDark: '#0D9488',

    // Secondary - Soft Cyan
    secondary: '#06B6D4', // Cyan
    secondaryLight: '#67E8F9',

    // System colors - Light & Fresh
    background: '#FFFFFF', // Pure white
    backgroundCard: '#F9FAFB', // Very light gray
    backgroundDark: '#F3F4F6',
    backgroundTeal: '#F0FDFA', // Teal tint

    // Glass effect colors
    glass: {
        light: '#FFFFFF',
        dark: '#F9FAFB',
        border: 'rgba(20, 184, 166, 0.2)', // Teal tint
        teal: 'rgba(94, 234, 212, 0.15)', // Soft teal overlay
    },

    // UI Status colors
    success: '#10B981', // Green
    warning: '#F59E0B', // Amber
    danger: '#EF4444', // Red
    info: '#06B6D4', // Cyan

    // Text colors - Dark on light
    text: {
        primary: '#111827', // Almost black
        secondary: '#6B7280', // Gray
        tertiary: '#9CA3AF', // Light gray
        inverse: '#FFFFFF', // White for colored backgrounds
    },

    // Grayscale
    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },

    white: '#FFFFFF',
    black: '#000000',
};

// Categories with updated colors
export const CATEGORIES = [
    { value: 'ROAD', labelFr: 'Voirie & Routes', labelAr: 'الطرق والمسالك', icon: '禁', color: '#10B981' },
    { value: 'LIGHTING', labelFr: 'Éclairage Public', labelAr: 'الإنارة العمومية', icon: '💡', color: '#F59E0B' },
    { value: 'WASTE', labelFr: 'Déchets & Propreté', labelAr: 'النفايات والنظافة', icon: '🧹', color: '#06B6D4' },
    { value: 'WATER', labelFr: 'Eau & Fuites', labelAr: 'الماء والتسربات', icon: '💧', color: '#3B82F6' },
    { value: 'SANITATION', labelFr: 'Assainissement', labelAr: 'التطهير السائل', icon: '🚽', color: '#8B5CF6' },
    { value: 'PUBLIC_SPACE', labelFr: 'Espaces Verts', labelAr: 'المساحات الخضراء', icon: '🌳', color: '#10B981' },
    { value: 'SIGNAGE', labelFr: 'Signalisation', labelAr: 'التشوير الطرقي', icon: '🪧', color: '#EF4444' },
    { value: 'OTHER', labelFr: 'Autre', labelAr: 'أخرى', icon: '📍', color: '#6B7280' },
];
