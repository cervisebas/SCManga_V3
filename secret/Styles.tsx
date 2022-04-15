import { DefaultTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';

const themeDefault: ReactNativePaper.Theme = {
  ...DefaultTheme,
  dark: false
};
const rippleColor: string = 'rgba(0, 0, 0, .16)';

const StylesDefaults = {
  background: '#FFFFFF',
  colorText: '#000000',
  components: '#FFFFFF',
  accentColor: '#FC0293',
  headerColor: '#FC0293',
  headerText: '#FFFFFF',
  subtitleColor: '#666666',
  rippleColor: 'rgba(0, 0, 0, .16)',
  statusBar: '#C33509',
  textCard: '#000000',
  drawerColor: '#EEEEEE',
  secondHeaderColor: '#fd59b8',
  skeletonBackground: '#858585',
  skeletonColor: '#DDDDDD',
  svgColor: '#000000',
  progressBar: '#000000',
  darkMode: false
};

const StyleDark = {
  background: '#121212',
  colorText: '#FFFFFF',
  components: '#212121',
  subtitleColor: '#b2b2b2',
  headerColor: '#212121',
  rippleColor: 'rgba(255, 255, 255, .16)',
  statusBar: '#212121',
  textCard: '#b2b2b2',
  drawerColor: '#A0A0A0',
  secondHeaderColor: '#303030',
  skeletonBackground: '#000000',
  skeletonColor: '#404040',
  svgColor: '#FFFFFF',
  progressBar: '#FFFFFF',
  darkMode: true
};

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    primary: '#FC0293',
    background: '#121212',
    card: '#FC0293',
    text: '#FFFFFF',
    surface: '#121212',
    accent: '#FC0293',
    onSurface: '#121212'
  },
  dark: true
};
const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    primary: '#FC0293',
    background: '#121212',
    card: '#FC0293',
    text: '#FFFFFF',
    surface: '#121212',
    accent: '#FC0293',
    onSurface: '#121212'
  },
};

export {
  themeDefault,
  rippleColor,
  StylesDefaults,
  StyleDark,
  CombinedDefaultTheme,
  CombinedDarkTheme
};