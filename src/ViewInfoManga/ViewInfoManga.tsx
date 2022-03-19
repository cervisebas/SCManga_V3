import React, { useRef, useState } from "react";
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, View, ToastAndroid, Modal, FlatList } from "react-native";
import { Appbar, Text, Card, TouchableRipple, Drawer, Divider, FAB, Provider as PaperProvider } from "react-native-paper";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { ItemList3 } from "../@scripts/NewComponents";
import { Info } from "../@types/ViewInfo";
import { ApiManga } from "../@scripts/ApiAnime";
import { CombinedDarkTheme, CombinedDefaultTheme, StyleDark, StylesDefaults, themeDefault } from "../Styles";
import { PreferencesContext } from "../@scripts/PreferencesContext";
import { getNavigationBarHeight } from "react-native-android-navbar-height";

const apiManga = new ApiManga();
const { width, height } = Dimensions.get('window');

const getForPercent = (px: number, perc: number)=>Math.fround((perc*px)/100);

interface IProps {
    close: ()=>any;
    data: Info;
    visible: boolean;
    clickViewImage: (src: string)=>any;
    clickGoToChapter: (url: string, title: string, chapter: string)=>any;
    goVGenderList: (gender: string, title: string)=>any;
    flipChapters: ()=>any;
    isFlipList: boolean;
    showMoreOptions: (actualUrl: { url: string; title: string; chapter: string; })=>any;
};


export function ViewInfoManga3(props: IProps) {
    const [routes] = useState([{ key: 'info', title: 'Información' }, { key: 'chapters', title: 'Capítulos' }]);
    const [index, setIndex] = useState(0);
    const [colorFavorite, setColorFavorite] = useState('#FFFFFF');
    const [favorite, setFavorite] = useState(false);
    const [navBarHeight, setNavBarHeight] = useState(0);
    const { isThemeDark } = React.useContext(PreferencesContext);
    const flatListChapters = useRef<FlatList | null>(null);

    setTimeout(async()=>setNavBarHeight(await getNavigationBarHeight()));

    /* ##### Rendes & Actions & Elements ##### */
    const renderTabBar = (props: any)=>{
        return(<TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: (isThemeDark)? StyleDark.secondHeaderColor: StylesDefaults.secondHeaderColor }}
            getLabelText={({route})=>route.title}
            renderLabel={({ route, color })=>(<Text style={{ color, margin: 8 }}>{route.title}</Text>)}
        />);
    };
    const loading = ()=>{
        apiManga.isIntoFavorites(props.data.url).then((isFavorite)=>{
            setFavorite(isFavorite);
            setColorFavorite((isFavorite)? '#00FF00': '#FFFFFF');
        }).catch(()=>{
            setFavorite(false);
            setColorFavorite('#FFFFFF');
        });
    };
    const actionButtonFavorite = ()=>{
        if (favorite) {
            apiManga.removeFavorite(props.data.url).then(()=>{
                ToastAndroid.showWithGravity('Se ha quitado de favoritos.', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                return loading();
            });
        } else {
            apiManga.addFavorite(props.data).then(()=>{
                ToastAndroid.showWithGravity('Se ha añadido a favoritos.', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                return loading();
            });
        }
    };


    /* ##### Views ##### */
    const viewChapters = ()=>{
        const [isLoading, setIsLoading] = useState(false);
        return(<View style={{ flex: 3 }}>
            <FlatList
                data={props.data.chapters}
                style={{ marginBottom: 32 }}
                ref={flatListChapters}
                keyExtractor={(_item, index)=>index.toString()}
                getItemLayout={(_data, index)=>({ length: 65, offset: 65 * index, index })}
                renderItem={({item, index})=><ItemList3 moreActions={(data)=>props.showMoreOptions(data)} data={item} key={index.toString()} title={props.data.title} action={(url: string, title: string, chapter: string)=>props.clickGoToChapter(url, title, chapter)} />}
            />
            <FAB
                icon={(props.isFlipList)? 'arrow-down-bold': 'arrow-up-thick'}
                style={{
                    position: 'absolute',
                    right: 16,
                    //bottom: (56),
                    bottom: (navBarHeight !== 0)? (56 - (navBarHeight / 2) + 8): 56,
                    margin: 0,
                    backgroundColor: (isThemeDark)? StyleDark.secondHeaderColor: StylesDefaults.secondHeaderColor
                }}
                color={'#FFFFFF'}
                loading={isLoading}
                onPress={()=>{
                    setIsLoading(true);
                    setTimeout(() => {
                        props.flipChapters();
                        setIsLoading(false);
                    }, 128);
                }}
            />
        </View>);
    };
    const viewInfo = ()=>{
        const renderListGenders = props.data.genders.map((data, index)=>{
            const processURL = (str: string)=>str.slice(str.indexOf('genero/')+7, str.length);
            return(<Drawer.Item
                key={index}
                style={{ backgroundColor: StylesDefaults.drawerColor }}
                theme={CombinedDefaultTheme}
                label={data.title}
                onPress={()=>props.goVGenderList(processURL(data.url), data.title)} />);
        });
        return(<ScrollView style={{ marginBottom: 32 }}>
            <Card style={{ backgroundColor: (isThemeDark)? StyleDark.background: StylesDefaults.background }} theme={themeDefault}>
                <Card.Title title="Información:" titleStyle={{ color: (isThemeDark)? StyleDark.colorText: StylesDefaults.colorText }} />
                <Card.Content>
                    <Text style={{ color: (isThemeDark)? StyleDark.textCard: StylesDefaults.textCard }}><Text style={{ fontWeight: 'bold', color: (isThemeDark)? StyleDark.colorText: StylesDefaults.colorText }}>{'\t'}Nombre:</Text> {props.data.title}{'\n'}</Text>
                    <Text style={{ color: (isThemeDark)? StyleDark.textCard: StylesDefaults.textCard }}><Text style={{ fontWeight: 'bold', color: (isThemeDark)? StyleDark.colorText: StylesDefaults.colorText }}>{'\t'}Año de publicación:</Text> {props.data.date}{'\n'}</Text>
                    <Text style={{ color: (isThemeDark)? StyleDark.textCard: StylesDefaults.textCard }}><Text style={{ fontWeight: 'bold', color: (isThemeDark)? StyleDark.colorText: StylesDefaults.colorText }}>{'\t'}Tipo:</Text> {props.data.type}{'\n'}</Text>
                </Card.Content>
            </Card>
            <Divider />
            <Card style={{ backgroundColor: (isThemeDark)? StyleDark.background: StylesDefaults.background }} theme={themeDefault}>
                <Card.Title title="Sinopsis:" titleStyle={{ color: (isThemeDark)? StyleDark.colorText: StylesDefaults.colorText }} />
                <Card.Content>
                    <Text style={{ paddingLeft: 16, color: (isThemeDark)? StyleDark.textCard: StylesDefaults.textCard }}>{props.data.synopsis}</Text>
                </Card.Content>
            </Card>
            <Divider />
            <Card style={{ backgroundColor: (isThemeDark)? StyleDark.background: StylesDefaults.background }} theme={themeDefault}>
                <Card.Title title="Generos:" titleStyle={{ color: (isThemeDark)? StyleDark.colorText: StylesDefaults.colorText }} />
                <Card.Content>{renderListGenders}</Card.Content>
            </Card>
        </ScrollView>);
    };
    const renderScene = SceneMap({ info: viewInfo, chapters: viewChapters });

    loading();
    return(<Modal visible={props.visible} onRequestClose={()=>{ props.close(); setIndex(0); }} animationType="slide" hardwareAccelerated={true} transparent={false}>
        <PaperProvider theme={(isThemeDark)? CombinedDarkTheme : CombinedDefaultTheme}>
            <Appbar.Header dark={true} style={{ backgroundColor: (isThemeDark)? StyleDark.headerColor: StylesDefaults.headerColor }}>
                <Appbar.BackAction onPress={()=>{ props.close(); setIndex(0); }} />
                <Appbar.Content title={props.data.title} titleStyle={{ color: StylesDefaults.headerText }}/>
                <Appbar.Action icon="heart" color={colorFavorite} onPress={()=>actionButtonFavorite()}/>
            </Appbar.Header>
            <View style={styles.image}>
                <TouchableRipple onPress={()=>props.clickViewImage(props.data.image)}>
                    <Image source={{ uri: ((props.data.image !== "")? props.data.image : undefined) }} style={styles.imageComponent}/>
                </TouchableRipple>
            </View>
            <SafeAreaView style={styles.content}>
                <View style={{ flex: 1, backgroundColor: (isThemeDark)? StyleDark.background: StylesDefaults.background }}>
                    <TabView
                        navigationState={{index, routes}}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        renderTabBar={renderTabBar}
                        initialLayout={{ width: width }}
                    />
                </View>
            </SafeAreaView>
        </PaperProvider>
    </Modal>);
}

const styles = StyleSheet.create({
    content: {
        width: width,
        //height: (height - 352),
        height: (getForPercent(height, 65) - 32),
        backgroundColor: '#FFFFFF'
    },
    image: {
        width: width,
        //height: 320,
        height: getForPercent(height, 35),
        backgroundColor: '#000000'
    },
    imageComponent: {
        width: width,
        //height: 384,
        height: (getForPercent(height, 35) + 64),
        resizeMode: 'cover'
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        right: 16,
        bottom: (56),
        margin: 0
    }
});