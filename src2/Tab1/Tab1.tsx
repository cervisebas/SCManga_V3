import React, { useState } from "react";
import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { ApiManga } from "../@scripts/ApiAnime";
import { ShowError } from "../@scripts/Components";
import { ItemList1, ItemList2 } from "../@scripts/NewComponents";
import { CombinedDarkTheme, CombinedDefaultTheme, StylesDefaults } from "../Styles";

const apiManga = new ApiManga();
const { width, height } = Dimensions.get('window');

type IProps = {
    goToChapter: (url: string, title: string, chapter: string)=>any;
    goInfoManga: (url: string)=>any;
};

export function Tab1(props: IProps) {
    const [mangas, setMangas] = useState([]);
    const [popular, setPopular] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isNowLoading, setIsNowLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    function fetching() {
        setIsError(false);
        setIsLoading(true);
        apiManga.getRecents().then((recents: any)=>{
            setPopular(recents.popular);
            setMangas(recents.newMangas);
            setIsLoading(false);
        }).catch(()=>{
            setIsLoading(false);
            setIsError(true);
        });
    };

    function refresh() { if (isNowLoading) { fetching(); console.log('Loading'); setIsNowLoading(false); } }
    refresh();

    function retryList() {
        setIsNowLoading(true);
        refresh();
    }

    const Loading = ()=><View style={styles.verticalAling}><ActivityIndicator animating={true} size='large' color={CombinedDefaultTheme.colors.accent} style={{ marginTop: 16 }}/></View>;
    const ViewMangas = ()=>{
        return(
            <View style={styles.container}>
                <SafeAreaView style={styles.container2}>
                    {isLoading ? <Loading/> : ((isError)? <ShowError retry={()=>retryList()} /> : <FlatList
                        data={popular}
                        extraData={isLoading}
                        horizontal={false}
                        keyExtractor={(_item, index)=>index.toString()}
                        getItemLayout={(_data, index) => ({
                            length: 165,
                            offset: 165 * index,
                            index
                        })}
                        renderItem={({item, index})=><ItemList1 data={item} key={index} action={(url)=>props.goInfoManga(url)} />}
                    /> )}
                </SafeAreaView>
            </View>
        );
    };
    const ViewUploads = ()=>{
        return(
            <View style={styles.container}>
                <SafeAreaView style={styles.container2}>
                    {isLoading ? <Loading/> : ((isError)? <ShowError retry={()=>retryList()} /> : <FlatList
                        data={mangas}
                        extraData={isLoading}
                        horizontal={false}
                        keyExtractor={(_item, index)=>index.toString()}
                        getItemLayout={(_data, index) => ({
                            length: 85,
                            offset: 85 * index,
                            index
                        })}
                        renderItem={({item, index})=><ItemList2 data={item} key={index} action={(url, title, chapter)=>props.goToChapter(url, title, chapter)} />}
                    />)}
                </SafeAreaView>
            </View>
        );
    };

    //##### Other #####
    const renderScene = SceneMap({ newmangas: ViewMangas, newuploads: ViewUploads });
    const layout = Dimensions.get('window');
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([{ key: 'newmangas', title: 'Últimos Mangas/Doujins' }, { key: 'newuploads', title: 'Últimas subidas' }]);

    const renderTabBar = (props: any)=>(
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: CombinedDarkTheme.colors.card }}
            getLabelText={({route})=>route.title}
            renderLabel={({ route, color }) => ( <Text style={{ color, margin: 8 }}> {route.title} </Text> )}
        />
    );

    return(
        <View style={{ ...styles.container }}>
            <View style={{ ...styles.header, backgroundColor: CombinedDarkTheme.colors.card }}>
                <Text style={{ ...styles.headerText, color: StylesDefaults.headerText}}>Recientes</Text>
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
                initialLayout={{ width: layout.width }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container2: {
        flex: 2,
    },
    header: { 
        width: width
    },
    headerText: {
        margin: 16,
        fontSize: 20,
        marginBottom: 8,
        fontWeight: 'bold'
    },
    verticalAling: {
        width: width,
        height: (height - 180),
        textAlign: 'center',
        justifyContent: 'center'
    }
});