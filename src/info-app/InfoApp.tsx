import React, { Component } from 'react';
import { Dimensions, Modal, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, List, Provider as PaperProvider, Text, TouchableRipple } from 'react-native-paper';
import { CombinedDarkTheme, CombinedDefaultTheme, StyleDark, StylesDefaults } from '../Styles';
import { PreferencesContext } from '../@scripts/PreferencesContext';
import FastImage from 'react-native-fast-image';

type IProps = {
    visible: boolean;
    close: ()=>any;
};
type IState = {
    _isMount: boolean;
};

const { width, height } = Dimensions.get('window');

export class InfoApp extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            _isMount: false
        };
    }
    static contextType = PreferencesContext;
    componentDidMount() { this.setState({ _isMount: true }); }
    componentWillUnmount() { this.setState({ _isMount: false }); }
    render(): React.ReactNode {
        const { isThemeDark } = this.context;
        const imageStyle: { borderColor: string, borderWidth: number, borderRadius: number } = (isThemeDark)? { borderColor: '#FFFFFF', borderWidth: 2, borderRadius: 50 }: { borderColor: '#000000', borderWidth: 2, borderRadius: 50 };
        return(<Modal visible={this.props.visible} onRequestClose={()=>this.props.close()} animationType="slide" hardwareAccelerated={true} transparent={false}>
            {(this.state._isMount) && <View style={{ flex: 2, backgroundColor: (isThemeDark)? StyleDark.background: StylesDefaults.background }}>
                <PaperProvider theme={(isThemeDark)? CombinedDarkTheme: CombinedDefaultTheme}>
                    <Appbar.Header>
                        <Appbar.BackAction onPress={()=>this.props.close()} />
                        <Appbar.Content title="Información"/>
                    </Appbar.Header>
                    <SafeAreaView style={{ ...styles.content, position: 'relative' }}>
                        <ScrollView>
                            <View style={{ paddingLeft: 10, paddingTop: 20, marginBottom: 5 }}>
                                <Text style={{ fontSize: 16 }}>Esta aplicación fue creada gracias a:</Text>
                            </View>
                            <View style={{ paddingLeft: 10 }}>
                                <List.Item
                                    title="LeerManga (leermanga.net)"
                                    description="Contenido"
                                    left={(props)=><FastImage {...props} style={{ ...imageStyle, width: 50, height: 50, overflow: 'hidden' }} source={require('../Assets/LeerManga-min.png')} />}
                                />
                                <List.Item
                                    title="React Native"
                                    description="Base de la aplicación"
                                    left={(props)=><FastImage {...props} style={{ ...imageStyle, width: 50, height: 50, overflow: 'hidden' }} source={require('../Assets/React-Native-min.png')} />}
                                />
                                <List.Item
                                    title="React Native Paper"
                                    description="Mayoría del diseño"
                                    left={(props)=><FastImage {...props} style={{ ...imageStyle, width: 50, height: 50, overflow: 'hidden' }} source={require('../Assets/Paper-min.png')} />}
                                />
                                <TouchableRipple onPress={()=>console.log(true)} style={{ justifyContent: 'center' }} rippleColor={(isThemeDark)? StyleDark.rippleColor: StylesDefaults.rippleColor}>
                                    <List.Item
                                        title="React Native Navigator"
                                        description="Navegación de la aplicación"
                                        left={(props)=><FastImage {...props} style={{ ...imageStyle, width: 50, height: 50, overflow: 'hidden' }} source={require('../Assets/Navigation-min.png')} />}
                                    />
                                </TouchableRipple>
                                <List.Item
                                    title="TypeScript"
                                    description="Lenguaje de programación utilizado"
                                    left={(props)=><FastImage {...props} style={{ ...imageStyle, width: 50, height: 50, overflow: 'hidden' }} source={require('../Assets/TypeScript-min.png')} />}
                                />
                                <List.Item
                                    title="JSON"
                                    description="Manejo y guardado de datos"
                                    left={(props)=><FastImage {...props} style={{ ...imageStyle, width: 50, height: 50, overflow: 'hidden' }} source={require('../Assets/JSON-min.png')} />}
                                />
                            </View>
                            <View style={{ paddingLeft: 10, paddingTop: 20, marginBottom: 5 }}>
                                <Text style={{ fontSize: 16 }}>Otros:</Text>
                            </View>
                            <View style={{ paddingLeft: 10, marginBottom: 34 }}>
                                <List.Item
                                    title="@alessiocancian/react-native-actionsheet"
                                    description="Hoja de acción"
                                />
                                <List.Item
                                    title="@react-native-async-storage/async-storage"
                                    description="Base de datos local"
                                />
                                <List.Item
                                    title="moment.js"
                                    description="Fácil manejo del tiempo para el desarrollo"
                                />
                                <List.Item
                                    title="react-native-device-info"
                                    description="Obtención de la información básica del dispositivo"
                                />
                                <List.Item
                                    title="react-native-fast-image"
                                    description="Componente para visualizar imágenes"
                                />
                                <List.Item
                                    title="react-native-fs"
                                    description="Manejo de archivos"
                                />
                                <List.Item
                                    title="react-native-image-zoom-viewer"
                                    description="Visualizador de imágenes con zoom"
                                />
                                <List.Item
                                    title="react-native-material-dialog"
                                    description="Cartel de alerta"
                                />
                                <List.Item
                                    title="react-native-skeleton-placeholder"
                                    description="Indicador de carga"
                                />
                                <List.Item
                                    title="react-native-svg"
                                    description="Componente para mostrar imágenes vectoriales"
                                />
                                <List.Item
                                    title="react-native-system-navigation-bar"
                                    description="Personalización de barra de navegación"
                                />
                                <List.Item
                                    title="react-native-tab-view"
                                    description="Navegación por pestañas"
                                />
                                <List.Item
                                    title="react-native-vector-icons"
                                    description="Paquete de iconos"
                                />
                                <List.Item
                                    title="cheerio.js"
                                    description="Ayuda con el WebScrapping"
                                />
                                <List.Item
                                    title="react-native-splash-screen"
                                    description="Pantalla de carga"
                                />
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </PaperProvider>
            </View>}
        </Modal>);
    }
};

const styles = StyleSheet.create({
    content: {
        height: (height - 32),
        width: width
    }
});