import { StatusBar, View } from 'react-native';

import { BottomNavigation } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SystemNavigationBar from "react-native-system-navigation-bar";
import SplashScreen from 'react-native-splash-screen';
import React, { useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Tab1 } from './Tab1/Tab1';
import { Tab2 } from './Tab2/Tab2';
import { Tab3 } from './Tab3/Tab3-2';
import { Tab4 } from './Tab4/Tab4';

import { Global2 } from './@scripts/Global';
import { CombinedDarkTheme, CombinedDefaultTheme } from './Styles';
import { ApiManga } from './@scripts/ApiAnime';
import { chapterInfo } from './@types/ViewInfo';
import { ViewsList } from './@scripts/ViewsList';
import { PreferencesContext } from './@scripts/PreferencesContext';
import { Download } from './@scripts/Download';

import RNFS from 'react-native-fs';
import notifee, { AndroidGroupAlertBehavior } from '@notifee/react-native';

const apiManga = new ApiManga();
const viewsList = new ViewsList();
const download = new Download();

const HomeScreen = (props: any)=>{
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'recents', title: 'Recientes', icon: 'history' },
    { key: 'favorites', title: 'Favoritos', icon: 'heart' },
    { key: 'search', title: 'Buscar', icon: 'magnify' },
    { key: 'settings', title: 'Configuraciones', icon: 'cog' }
  ]);

  /* ##### Global ##### */
  const [infoView, setInfoView] = useState(false);
  const [infoData, setInfoData] = useState({ title: '', date: '', type: '', synopsis: '', image: '', genders: [{ title: '', url: '' }], chapters: [{ chapter: '', url: '', view: false, viewInfo: { url: '', date: '', views: 0 } }], url: '' });
  const [infoListChaptersFlip, setInfoListChaptersFlip] = useState(false);
  const infoClose = ()=>{
    setInfoView(false);
    setInfoListChaptersFlip(false);
    setInfoData({ title: '', date: '', type: '', synopsis: '', image: '', genders: [{ title: '', url: '' }], chapters: [{ chapter: '', url: '', view: false, viewInfo: { url: '', date: '', views: 0 } }], url: '' });
  };
  const [vMangaSources, setVMangaSources] = useState(['']);
  const [vMangaView, setVMangaView] = useState(false);
  const [vMangaViewLocal, setVMangaViewlocal] = useState(false);
  const [vMangaTitle, setVMangaTitle] = useState('');
  const [vMangaChapter, setVMangaChapter] = useState('');
  const vMangaClose = ()=>{
    setVMangaSources(['']);
    setVMangaView(false);
    setVMangaViewlocal(false);
    setVMangaChapter('');
    setVMangaTitle('');
    setVMangaChapter('');
  };
  const [vImageSrc, setVImageSrc] = useState('');
  const [vImageView, setVImageView] = useState(false);
  const vImageClose = ()=>{
    setVImageSrc('');
    setVImageView(false);
  };
  const [vImagesMangaSources, setVImagesMangaSources] = useState('');
  const [vImagesMangaView, setVImagesMangaView] = useState(false);
  const [vImagesMangaViewLocal, setVImagesMangaViewLocal] = useState(false);
  const vImagesMangaClose = ()=>{
    setVImagesMangaSources('');
    setVImagesMangaView(false);
    setVImagesMangaViewLocal(false);
  };
  const [loadingView, setLoadingView] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [vGenderView, setVGenderView] = useState(false);
  const [vGenderView18, setVGenderView18] = useState(false);
  const [vGenderPages, setVGenderPages] = useState(0);
  const [vGenderGender, setVGenderGender] = useState('');
  const [vGenderTitle, setVGenderTitle] = useState('');
  const [vGenderList, setVGenderList] = useState([{ title: '', image: '', url: '', type: '' }]);
  const vGenderClose = ()=>{
    setVGenderView(false);
    setVGenderView18(false);
    setVGenderPages(0);
    setVGenderGender('');
    setVGenderTitle('');
    setVGenderList([]);
  };
  const [Tab3ViewGenderList, setTab3ViewGenderList] = useState(false);
  const stateTab3ViewGenderList = (state: boolean)=>setTab3ViewGenderList(state);
  const [alertView, setAlertView] = useState(false);
  const [errorCode, setErrorCode] = useState(-1);
  const [errorData, setErrorData] = useState('');
  const alertClose = ()=>{
    setAlertView(false);
    setErrorCode(-1);
    setErrorData('');
  };
  const goToChapter = (url: string, title: string, chapter: string, resolve: ()=>any)=>{
    setLoadingView(true);
    setLoadingText('Obteniendo información...');
    apiManga.getImagesChapter(url).then((images)=>{
      setLoadingView(false);
      setVMangaSources(images);
      setVMangaTitle(title);
      setVMangaChapter(chapter);
      setVMangaView(true);
      viewsList.addItem(url).then(()=>resolve());
    }).catch(()=>{
      setLoadingView(false);
      showAlertError(1, JSON.stringify({ 'url': url, 'title': title }));
    });
  };
  const goToChapterLocal = async(index: number, title: string, resolve: ()=>any)=>{
    setLoadingView(true);
    setLoadingText('Obteniendo información...');
    var data = await download.getJsonExist();
    var mangaData = data[index];
    setVMangaSources(mangaData.images_files);
    setVMangaTitle(title);
    setLoadingView(false);
    setVMangaViewlocal(true);
    resolve();
  };
  const goInfoManga = (url: string, resolve: ()=>any)=>{
    setLoadingView(true);
    setLoadingText('Obteniendo información...');
    if (infoView) infoClose();
    apiManga.getInformation(url).then((data)=>{
      setLoadingView(false);
      setInfoData(data);
      setInfoView(true);
      resolve();
    }).catch(()=>{
      setLoadingView(false);
      showAlertError(2, url);
    });
  };
  const flipChapters = ()=>{
    var listChapters = infoData.chapters;
    var newInfo = infoData;
    newInfo.chapters = listChapters.reverse();
    setInfoListChaptersFlip(!infoListChaptersFlip);
    setInfoData(newInfo);
  };
  const refreshInfoManga = ()=>{
    var chapters = infoData.chapters;
    var newChapters: chapterInfo[] = [];
    chapters.forEach(async(value, index)=>{
      var info = await viewsList.getItem(value.url);
      var viewInfo: any = info;
      newChapters.push({
        chapter: value.chapter,
        url: value.url,
        view: (info)? true : false,
        viewInfo: (info)? viewInfo : { url: '', date: '', views: 0 }
      });
      if ((chapters.length - 1) == index) {
        var infoManga = infoData;
        infoManga.chapters = newChapters;
        setInfoData(infoManga);
      }
    });
  };
  const goOpenImageViewer = (urlImage: string)=>{
    setVImageSrc(urlImage);
    setVImageView(true);
  };
  const goOpenImageViewer2 = (urlImage: string)=>{
    setVImagesMangaSources(urlImage);
    setVImagesMangaView(true);
  };
  const goOpenImageViewerLocal = (urlImage: string)=>{
    setVImagesMangaSources(urlImage);
    setVImagesMangaViewLocal(true);
  };
  const goVGenderList = (gender: string, title: string)=>{
    setLoadingView(true);
    setLoadingText('Obteniendo información...');
    if (vGenderView18 || vGenderView) vGenderClose();
    if (gender == 'adulto-+18') {
      return apiManga.getGender18().then((data)=>{
        setLoadingView(false);
        setVGenderList(data.list);
        setVGenderPages(data.pages);
        setVGenderGender(gender);
        setVGenderTitle(title);
        setVGenderView18(true);
      }).catch(()=>{
        setLoadingView(false);
        showAlertError(3, JSON.stringify({ gender: gender, title: title }));
      });
    }
    apiManga.getGender(gender).then((data)=>{
      setLoadingView(false);
      setVGenderList(data.list);
      setVGenderPages(data.pages);
      setVGenderGender(gender);
      setVGenderTitle(title);
      setVGenderView(true);
    }).catch(()=>{
      setLoadingView(false);
      showAlertError(3, JSON.stringify({ gender: gender, title: title }));
    });
  };
  const actionLoading = (visible: boolean, text?: string)=>{
    if (visible) {
      setLoadingText(String(text));
      setLoadingView(true);
    } else {
      setLoadingText('');
      setLoadingView(false);
    }
  };
  const showAlertError = (errorCode: number, errorData: string)=>{
    setAlertView(true);
    setErrorCode(errorCode);
    setErrorData(errorData);
  };
  /* ##### Final Global ##### */


  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'recents':
        return(<Tab1
          goToChapter={(url: string, title: string, chapter: string)=>goToChapter(url, title, chapter, ()=>undefined)}
          goInfoManga={(url: string)=>goInfoManga(url, ()=>{return;})}
        />);
      case 'favorites':
        return(<Tab2
          goInfoManga={(url: string)=>goInfoManga(url, ()=>{return;})}
        />);
      case 'search':
        return <Tab3
          goInfoManga={(url: string)=>goInfoManga(url, ()=>{return;})}
          goVGenderList={(gender: string, title: string)=>goVGenderList(gender, title)}
          Tab3ViewGenderList={Tab3ViewGenderList}
          stateTab3ViewGenderList={(state: boolean)=>stateTab3ViewGenderList(state)}
        />;
      case 'settings':
        return <Tab4
          actionLoading={(visible: boolean, text?: string)=>actionLoading(visible, text)}
          goToChapterLocal={(index: number, title: string, resolve: ()=>any)=>goToChapterLocal(index, title, ()=>resolve())}
        />;
    }
  };

  const { isThemeDark } = React.useContext(PreferencesContext);
  return(
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={(isThemeDark)? '#212121': '#C33509'} barStyle={'light-content'} />
      <Global2
        infoView={infoView}
        infoData={infoData}
        infoFlipListChapter={infoListChaptersFlip}
        infoClose={()=>infoClose()}
        vMangaSources={vMangaSources}
        vMangaView={vMangaView}
        vMangaViewLocal={vMangaViewLocal}
        vMangaTitle={vMangaTitle}
        vMangaChapter={vMangaChapter}
        vMangaClose={()=>vMangaClose()}
        vImageSrc={vImageSrc}
        vImageView={vImageView}
        vImageClose={()=>vImageClose()}
        vImagesMangaSources={vImagesMangaSources}
        vImagesMangaView={vImagesMangaView}
        vImagesMangaViewLocal={vImagesMangaViewLocal}
        vImagesMangaClose={()=>vImagesMangaClose()}
        loadingView={loadingView}
        loadingText={loadingText}
        vGenderView={vGenderView}
        vGenderView18={vGenderView18}
        vGenderGender={vGenderGender}
        vGenderTitle={vGenderTitle}
        vGenderList={vGenderList}
        vGenderPages={vGenderPages}
        vGenderClose={()=>vGenderClose()}
        alertView={alertView}
        errorCode={errorCode}
        errorData={errorData}
        alertClose={()=>alertClose()}
        goToChapter={(url: string, title: string, chapter: string, resolve: ()=>any)=>goToChapter(url, title, chapter, ()=>resolve())}
        goToChapterLocal={(index: number, title: string, resolve: ()=>any)=>goToChapterLocal(index, title, ()=>resolve())}
        goOpenImageViewer={(urlImage: string)=>goOpenImageViewer(urlImage)}
        goOpenImageViewer2={(urlImage: string)=>goOpenImageViewer2(urlImage)}
        goOpenImageViewerLocal={(urlImage: string)=>goOpenImageViewerLocal(urlImage)}
        goInfoManga={(url: string, resolve: ()=>any)=>goInfoManga(url, ()=>resolve())}
        refreshInfoManga={()=>refreshInfoManga()}
        stateTab3ViewGenderList={(state: boolean)=>stateTab3ViewGenderList(state)}
        actionLoading={(visible: boolean, text?: string)=>actionLoading(visible, text)}
        goVGenderList={(gender: string, title: string)=>goVGenderList(gender, title)}
        flipChapters={()=>flipChapters()}
      />
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </View>
  );
};

const checkNoMedia = async()=>{
  var exist = await RNFS.exists(`${RNFS.ExternalDirectoryPath}/.nomedia`);
  if (!exist) await RNFS.writeFile(`${RNFS.ExternalDirectoryPath}/.nomedia`, '');
};

const App = ()=>{
  setTimeout(() => SplashScreen.hide(), 1500);
  const Stack = createNativeStackNavigator();
  const [isThemeDark, setIsThemeDark] = React.useState(false);
  var theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;
  const toggleTheme = React.useCallback(()=>setIsThemeDark(!isThemeDark), [isThemeDark]);
  const preferences = React.useMemo(()=>({ toggleTheme, isThemeDark}), [toggleTheme, isThemeDark]);
  SystemNavigationBar.setNavigationColor((isThemeDark)? '#212121': '#C33509', true);
  checkNoMedia();

  //console.log(RNFS.ExternalDirectoryPath);

  AsyncStorage.getItem('@DarkMode').then((value)=>{
    if (value !== null) {
      if (JSON.parse(value).status) {
        setIsThemeDark(true);
      } else {
        setIsThemeDark(false);
      }
    } else {
      setIsThemeDark(false);
    }
  });

  return(<PreferencesContext.Provider value={preferences}>
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator initialRouteName='scmanga' screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}>
          <Stack.Screen name='scmanga' component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  </PreferencesContext.Provider>);
};

export default App;
