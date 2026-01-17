import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/utils/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </LanguageProvider>
  );
}
