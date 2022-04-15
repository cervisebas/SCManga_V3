import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { LogBox, StatusBar } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import SplashScreen from "react-native-splash-screen";
import SystemNavigationBar from "react-native-system-navigation-bar";
import { PreferencesContext } from "./scmanga/@scripts/PreferencesContext";
import { CombinedDarkTheme, CombinedDefaultTheme } from "./scmanga/Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from 'react-native-fs';
import HomeScreen from "./scmanga/App";
import HomeScreenHentai from "./secret/App";

const checkNoMedia = async()=>{
  var exist = await RNFS.exists(`${RNFS.ExternalDirectoryPath}/.nomedia`);
  if (!exist) await RNFS.writeFile(`${RNFS.ExternalDirectoryPath}/.nomedia`, '');
};

const App = ()=>{
  setTimeout(()=>SplashScreen.hide(), 1500);
  const Stack = createNativeStackNavigator();
  const [isThemeDark, setIsThemeDark] = React.useState(false);
  const [page, setPage] = React.useState(0);
  var theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;
  const toggleTheme = React.useCallback(()=>setIsThemeDark(!isThemeDark), [isThemeDark]);
  const preferences = React.useMemo(()=>({ toggleTheme, isThemeDark}), [toggleTheme, isThemeDark]);
  SystemNavigationBar.setNavigationColor((page == 0)? (isThemeDark)? '#212121': '#C33509' : '#a3015f', true);
  AsyncStorage.getItem('@DarkMode').then((value)=>setIsThemeDark((value !== null)? (JSON.parse(value).status)? true: false: false));
  LogBox.ignoreLogs(['new NativeEventEmitter']);
  LogBox.ignoreAllLogs();
  checkNoMedia();
  return(<PreferencesContext.Provider value={preferences}>
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <StatusBar backgroundColor={(page == 0)? (isThemeDark)? '#212121': '#C33509' : '#a3015f'} barStyle={'light-content'} />
        <Stack.Navigator initialRouteName='scmanga' screenListeners={{ state: (e: any)=>setPage(e.data.state.index)}} screenOptions={{ headerShown: false, animation: 'slide_from_bottom', gestureEnabled: false }}>
          <Stack.Screen name='scmanga' component={HomeScreen} />
          <Stack.Screen name='scmangahentai' component={HomeScreenHentai} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  </PreferencesContext.Provider>);
};
export default App;