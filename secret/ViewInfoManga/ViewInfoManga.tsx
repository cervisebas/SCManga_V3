import React, { useState } from "react";
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, View, ToastAndroid, Modal, FlatList } from "react-native";
import { Appbar, Text, Card, TouchableRipple, Drawer, Divider, FAB, Provider as PaperProvider, Banner } from "react-native-paper";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { ItemList3 } from "../@scripts/NewComponents";
import { Info } from "../@types/ViewInfo";
import { ApiManga } from "../@scripts/ApiAnime";
import { CombinedDarkTheme, CombinedDefaultTheme, StyleDark, StylesDefaults, themeDefault } from "../Styles";

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
    showMoreOptions: (data: { url: string; title: string; chapter: string; })=>any;
};


export function ViewInfoManga3(props: IProps) {
    const [routes] = useState([{ key: 'info', title: 'Información' }, { key: 'chapters', title: 'Capítulos' }]);
    const [index, setIndex] = useState(0);
    const [colorFavorite, setColorFavorite] = useState('#FFFFFF');
    const [favorite, setFavorite] = useState(false);
    const [showBanner, setShowBanner] = useState(true);

    /* ##### Rendes & Actions & Elements ##### */
    const renderTabBar = (props: any)=>{
        return(<TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: StylesDefaults.secondHeaderColor }}
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
        return(<View style={{ flex: 2 }}>
            <PaperProvider theme={CombinedDefaultTheme}>
                <FlatList
                    data={props.data.chapters}
                    ListHeaderComponent={()=><Banner theme={CombinedDarkTheme} visible={showBanner} actions={[{ label: 'Esconder', onPress: ()=>setShowBanner(false) }]} icon={({size})=><Image source={require('../Assets/information-dark.png')} style={{ width: size, height: size }} />}>Mantén presionado un capítulo para ver más opciones o toca el botón de menú.</Banner>}
                    renderItem={({item, index})=><ItemList3 moreActions={(data)=>props.showMoreOptions(data)} data={item} key={index.toString()} title={props.data.title} action={(url: string, title: string, chapter: string)=>props.clickGoToChapter(url, title, chapter)} />}
                />
                <FAB
                    icon={(props.isFlipList)? 'arrow-down-bold': 'arrow-up-thick'}
                    style={{
                        position: 'absolute',
                        right: 16,
                        bottom: 16,
                        margin: 0,
                        backgroundColor: StylesDefaults.secondHeaderColor
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
            </PaperProvider>
        </View>);
    };
    const viewInfo = ()=>{
        const renderListGenders = props.data.genders.map((data, index)=>{
            const processURL = (str: string)=>str.slice(str.indexOf('genero/')+7, str.length);
            return(<Drawer.Item
                key={index}
                style={{ backgroundColor: StylesDefaults.drawerColor }}
                theme={{...CombinedDefaultTheme, colors: { ...CombinedDefaultTheme.colors, text: '#000000' }}}
                label={data.title}
                onPress={()=>props.goVGenderList(processURL(data.url), data.title)} />);
        });
        return(<ScrollView style={{ flex: 2 }}>
            <Card style={{ backgroundColor: StyleDark.background }} theme={themeDefault}>
                <Card.Title title="Información:" titleStyle={{ color: StyleDark.colorText }} />
                <Card.Content>
                    <Text style={{ color: StyleDark.textCard }}><Text style={{ fontWeight: 'bold', color: StyleDark.colorText }}>{'\t'}Nombre:</Text> {props.data.title}{'\n'}</Text>
                    <Text style={{ color: StyleDark.textCard }}><Text style={{ fontWeight: 'bold', color: StyleDark.colorText }}>{'\t'}Fecha de publicación:</Text> {props.data.date}{'\n'}</Text>
                    <Text style={{ color: StyleDark.textCard }}><Text style={{ fontWeight: 'bold', color: StyleDark.colorText }}>{'\t'}Tipo:</Text> {props.data.type}{'\n'}</Text>
                </Card.Content>
            </Card>
            <Divider />
            <Card style={{ backgroundColor: StyleDark.background }} theme={themeDefault}>
                <Card.Title title="Sinopsis:" titleStyle={{ color: StyleDark.colorText }} />
                <Card.Content>
                    <Text style={{ paddingLeft: 16, color: StyleDark.textCard }}>{props.data.synopsis}</Text>
                </Card.Content>
            </Card>
            <Divider />
            <Card style={{ backgroundColor: StyleDark.background }} theme={themeDefault}>
                <Card.Title title="Generos:" titleStyle={{ color: StyleDark.colorText }} />
                <Card.Content>{renderListGenders}</Card.Content>
            </Card>
        </ScrollView>);
    };
    const renderScene = SceneMap({ info: viewInfo, chapters: viewChapters });

    loading();
    return(<Modal visible={props.visible} onRequestClose={()=>{ props.close(); setIndex(0); }} animationType="slide" hardwareAccelerated={true} transparent={false}>
        <PaperProvider theme={CombinedDefaultTheme}>
            <Appbar.Header dark={true} style={{ backgroundColor: CombinedDefaultTheme.colors.card }}>
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
                <View style={{ flex: 1, backgroundColor: StyleDark.background }}>
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
        height: (getForPercent(height, 65) - 32),
        backgroundColor: '#FFFFFF',
        flex: 2
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