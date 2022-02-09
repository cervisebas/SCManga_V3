import ActionSheet from "@alessiocancian/react-native-actionsheet";
import React, { Component } from "react";
import { Dimensions, FlatList, Image, Modal, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Appbar, Banner, Card, IconButton, List, Paragraph, Title } from "react-native-paper";
import { Download } from "../@scripts/Download";
import { ItemList5 } from "../@scripts/NewComponents";
import { GeneratePDF } from "../@scripts/PDF-Generate";
import { NoDownload } from '../@Icons/Icons';
import { PreferencesContext } from "../@scripts/PreferencesContext";
import { CombinedDarkTheme, CombinedDefaultTheme, StyleDark, StylesDefaults } from "../Styles";

type JSON_File = {
    title: string;
    chapter: string;
    idName: string;
    cover_file: string;
    images_files: string[];
};
type JSON_File2 = {
    id: number;
    title: string;
    chapter: string;
    idName: string;
    cover_file: string;
    images_files: string[];
};

type IProps = {
    visible: boolean;
    actionLoading: (visible: boolean, text?: string)=>any;
    goToChapterLocal: (index: number, title: string, resolve: ()=>any)=>any;
    close: ()=>any;
};
type IState = {
    _isMount: boolean;
    downloads: { title: string, group: JSON_File2[] }[];
    isLoading: boolean;
    moreOptionsIndex: number;
    empty: boolean;
    showBanner: boolean;
};

const { width, height } = Dimensions.get('window');
const download = new Download();
const generatePDF = new GeneratePDF();

export class Downloads extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            _isMount: false,
            downloads: [],
            isLoading: true,
            moreOptionsIndex: -1,
            empty: false,
            showBanner: true
        };
    }
    static contextType = PreferencesContext;
    private moreOptions: ActionSheet | null = null;
    private moreOptionsComponents: any = [
        <Text style={{ color: CombinedDefaultTheme.colors.primary }}>Eliminar</Text>,
        <Text style={{ color: CombinedDefaultTheme.colors.primary }}>Convertir en PDF</Text>,
        <Text style={{ color: CombinedDefaultTheme.colors.primary, fontWeight: 'bold' }}>Cerrar</Text>
    ];
    componentWillUnmount() {
        this.setState({ _isMount: false });
    }
    componentDidMount() {
        this.setState({ _isMount: true });
    }
    nowEmpty(a: { color: string }) {
        return(<View style={styles.verticalAling}>
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <NoDownload width={96} height={96} fillColor={a.color} />
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 8, color: a.color }}>No hay descargas</Text>
            </View>
        </View>);
    }
    async moreOptionsAction(index: number) {
        switch (index) {
            case 0:
                this.props.actionLoading(true, 'Eliminando descarga...');
                await download.deleteDownload(this.state.moreOptionsIndex);
                this.props.actionLoading(false, 'Eliminando descarga...');
                this.loadData();
                break;
            case 1:
                await generatePDF.goGenerateLocal(this.state.moreOptionsIndex);
                break;
        }
    }
    async loadData() {
        this.setState({ isLoading: true, empty: false });
        var data = await download.getJsonExist();
        if (data.length == 0) return setTimeout(()=>this.setState({ isLoading: false, empty: true }), 1000);
        var list: { title: string, group: JSON_File2[] }[] = [];
        data.forEach((value, index)=>{
            var indexFind = list.findIndex((val)=>val.title == value.title);
            if (indexFind != -1) {
                list[indexFind].group.push({ id: index, title: value.title, chapter: value.chapter, idName: value.idName, cover_file: value.cover_file, images_files: value.images_files });
            } else {
                list.push({ title: value.title, group: [{ id: index, title: value.title, chapter: value.chapter, idName: value.idName, cover_file: value.cover_file, images_files: value.images_files }] });
            }
        });
        return setTimeout(()=>(this.state._isMount)&&this.setState({ downloads: list, isLoading: false }), 1500);
    }
    Loading() {
        return(<View style={styles.verticalAling}>
            <ActivityIndicator animating={true} size='large' color='#ff5131' style={{ marginTop: 16 }}/>
        </View>);
    }
    render(): React.ReactNode {
        const { isThemeDark } = this.context;
        return(<Modal visible={this.props.visible} onShow={()=>this.loadData()} onRequestClose={()=>{ this.props.close(); this.setState({ downloads: [] }); }} animationType="slide" hardwareAccelerated={true} transparent={false}>
            {(this.state._isMount) && <View style={{ backgroundColor: (isThemeDark)? StyleDark.background: StylesDefaults.background }}>
                <Appbar.Header style={{ backgroundColor: (isThemeDark)? StyleDark.headerColor: StylesDefaults.headerColor }}>
                    <Appbar.BackAction onPress={()=>this.props.close()} />
                    <Appbar.Content title={'Descargas'} titleStyle={{ color: StylesDefaults.headerText }}/>
                </Appbar.Header>
                <SafeAreaView style={{ ...styles.content, position: 'relative' }}>
                    <Banner visible={(this.state.isLoading)? false: (this.state.empty)? false: this.state.showBanner} actions={[{ label: 'Esconder', onPress: ()=>this.setState({ showBanner: false }) }]} icon={({size})=><Image source={(isThemeDark)? require('../Assets/information-dark.png'): require('../Assets/information.png')} style={{ width: size, height: size }} />} >
                        Mantén presionado un capítulo para ver más opciones.
                    </Banner>
                    {(this.state.empty)? <this.nowEmpty color={(isThemeDark)? CombinedDarkTheme.colors.text : CombinedDefaultTheme.colors.text} /> : ((this.state.isLoading)? <this.Loading /> : <List.Section theme={(isThemeDark)? CombinedDarkTheme: CombinedDefaultTheme}>
                        <FlatList
                            data={this.state.downloads}
                            extraData={(this.props.visible)? false: true}
                            style={{ marginBottom: 20 }}
                            renderItem={({item, index})=><List.Accordion title={item.title} key={index} theme={(isThemeDark)? CombinedDarkTheme: CombinedDefaultTheme}>
                                <FlatList
                                    data={item.group}
                                    extraData={(this.props.visible)? false: true}
                                    renderItem={(item2)=><ItemList5 
                                        data={{ index: item2.item.id, title: item2.item.title, chapter: item2.item.chapter, length: item2.item.images_files.length }}
                                        title={item2.item.title}
                                        action={(index, title)=>this.props.goToChapterLocal(index, title, ()=>{return;})}
                                        moreMenu={(index)=>{this.setState({ moreOptionsIndex: index });this.moreOptions?.show();}}
                                    />}
                                />
                            </List.Accordion>}
                        />
                    </List.Section>)}
                </SafeAreaView>
                <ActionSheet
                    ref={(ref)=>this.moreOptions = ref}
                    title={'Más opciones'}
                    options={this.moreOptionsComponents}
                    userInterfaceStyle={(isThemeDark)? 'dark': 'light'}
                    cancelButtonIndex={2}
                    onPress={(index)=>this.moreOptionsAction(index)}
                />
            </View>}
        </Modal>);
    }
}

const styles = StyleSheet.create({
    content: {
        height: (height - 32),
        width: width
    },
    imageContent: {
        paddingLeft: 8,
        paddingRight: 8
    },
    image: {
        width: (width - 16),
        height: undefined
    },
    verticalAling: {
        width: width,
        height: (height - 136),
        textAlign: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    }
});