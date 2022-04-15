import React, { Component } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View,ToastAndroid, StyleSheet } from "react-native";
import { Appbar, Dialog, List, Paragraph, Portal, Switch, TouchableRipple, Button, RadioButton, Text, Snackbar } from "react-native-paper";
import { StylesDefaults, StyleDark, CombinedDarkTheme, CombinedDefaultTheme } from '../Styles';
import { PreferencesContext } from '../@scripts/PreferencesContext';
import { Downloads } from "../downloads/downloads";
import SplashScreen from "react-native-splash-screen";
import { InfoApp } from "../info-app/InfoApp";
import { getConfigPDF, setConfigPDF } from "../@scripts/Configuration";

type IProps = {
    goToChapterLocal: (index: number, title: string, resolve: ()=>any)=>any;
    actionLoading: (visible: boolean, text?: string)=>any;
    pageGo: (page: string)=>any;
};
type IState = {
    isSwitchOn: boolean;
    viewDownload: boolean;
    viewInfo: boolean;
    showSnackBar: boolean;
    textSnackBar: string;
    showQuality: boolean;
    optionQuality: number;
    optionQualityString: string;
};
export class Tab4 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isSwitchOn: false,
            viewDownload: false,
            viewInfo: false,
            showSnackBar: false,
            textSnackBar: '',
            showQuality: false,
            optionQuality: 0,
            optionQualityString: 'default'
        };
    }
    static contextType = PreferencesContext;
    async componentDidMount() {
        this.getData().then((data: any)=>{
            var status = (data !== null)? JSON.parse(data).status : false;
            this.setState({ isSwitchOn: status });
        });
        getConfigPDF().then((value)=>this.setState({ optionQuality: value, optionQualityString: (value == 0)? 'default': (value == 1)? 'high-quality': 'low-quality' }));
    }
    async setData(data: boolean) {
        try {
            await AsyncStorage.setItem('@DarkMode', JSON.stringify({ status: data }));
        
        } catch {
            ToastAndroid.show('Ocurrió un error al guardar el estado del tema.', ToastAndroid.SHORT);
        }
    }
    async getData() {
        return await AsyncStorage.getItem('@DarkMode');
    }
    onToggleSwitch() {
        this.setData(!this.state.isSwitchOn);
        this.setState({ isSwitchOn: !this.state.isSwitchOn });
    }
    setConfigPDF() {
        setConfigPDF(String(this.state.optionQuality)).then((value)=>{
            if (value) this.setState({ showSnackBar: true, textSnackBar: 'Configuración de calidad guardada' }); else this.setState({ showSnackBar: true, textSnackBar: 'Error al guardar la configuración de calidad' });
            setTimeout(()=>this.setState({ showSnackBar: false }), 2048);
        });
    }
    render(): React.ReactNode {
        const { toggleTheme, isThemeDark } = this.context;
        return(<View style={{ flex: 2 }}>
            <Appbar.Header>
                <Appbar.Content title={'Configuraciones'}></Appbar.Content>
            </Appbar.Header>
            <List.Item
                title="Modo oscuro"
                left={(props)=><List.Icon {...props} icon={'weather-night'} />}
                right={(props)=><Switch
                    {...props}
                    color={(isThemeDark)? CombinedDarkTheme.colors.accent: CombinedDefaultTheme.colors.accent}
                    value={isThemeDark}
                    onValueChange={()=>{
                        SplashScreen.show();
                        this.onToggleSwitch();
                        setTimeout(()=>toggleTheme(), 256);
                        setTimeout(()=>SplashScreen.hide(), 1024);
                    }}
                />}
            />
            <TouchableRipple onPress={()=>this.setState({ viewDownload: true })} style={{ justifyContent: 'center' }} rippleColor={(isThemeDark)? StyleDark.rippleColor: StylesDefaults.rippleColor}>
                <List.Item
                    title='Descargas'
                    left={(props)=><List.Icon {...props} icon={'download'}/>}
                />
            </TouchableRipple>
            <TouchableRipple onPress={()=>this.setState({ showQuality: true })} style={{ justifyContent: 'center' }} rippleColor={(isThemeDark)? StyleDark.rippleColor: StylesDefaults.rippleColor}>
                <List.Item
                    title={'Calidad de PDF'}
                    right={(props)=><Button {...props} style={{ opacity: .65 }}>{(this.state.optionQuality == 0)? 'Optimo': (this.state.optionQuality == 1)? 'Alta': 'Baja'}</Button>}
                    left={(props)=><List.Icon {...props} icon={'file-pdf-box'}/>}
                />
            </TouchableRipple>
            <TouchableRipple onPress={()=>this.setState({ viewInfo: true })} style={{ justifyContent: 'center' }} rippleColor={(isThemeDark)? StyleDark.rippleColor: StylesDefaults.rippleColor}>
                <List.Item
                    title='Información'
                    left={(props)=><List.Icon {...props} icon={'information'}/>}
                />
            </TouchableRipple>


            <Snackbar visible={this.state.showSnackBar} onDismiss={()=>{return;}} action={{ label: 'Cerrar', onPress: ()=>this.setState({ showSnackBar: false }) }}><Text>{this.state.textSnackBar}</Text></Snackbar>
            <Portal>
                <Dialog visible={this.state.showQuality} dismissable={true} onDismiss={()=>this.setState({ showQuality: false })}>
                    <Dialog.Title>Calidad de conversión de PDF</Dialog.Title>
                    <Dialog.Content>
                        <RadioButton.Group onValueChange={(value)=>this.setState({ optionQuality: (value == 'default')? 0: (value == 'high-quality')? 1: 2, optionQualityString: value })} value={this.state.optionQualityString}>
                            <View style={styles.radioActions}>
                                <RadioButton value="default" />
                                <Text>Calidad optima</Text>
                            </View>
                            <View style={styles.radioActions}>
                                <RadioButton value="high-quality" />
                                <Text>Alta calidad</Text>
                            </View>
                            <View style={styles.radioActions}>
                                <RadioButton value="low-quality" />
                                <Text>Baja calidad</Text>
                            </View>
                        </RadioButton.Group>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>{this.setState({ showQuality: false });}}>Cancelar</Button>
                        <Button onPress={()=>{this.setState({ showQuality: false });this.setConfigPDF();}}>Aceptar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Downloads actionLoading={(visible: boolean, text?: string)=>this.props.actionLoading(visible, text)} visible={this.state.viewDownload} goToChapterLocal={(index, title, resolve)=>this.props.goToChapterLocal(index, title, ()=>resolve())} close={()=>this.setState({ viewDownload: false })} />
            <InfoApp pageGo={(page)=>this.props.pageGo(page)} visible={this.state.viewInfo} close={()=>this.setState({ viewInfo: false })} />
        </View>);
    }
}

const styles = StyleSheet.create({
    radioActions: {
        width: '100%',
        height: 48,
        flexDirection: 'row',
        alignItems: 'center'
    }
});