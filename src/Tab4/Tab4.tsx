import React, { Component } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View,ToastAndroid } from "react-native";
import { Appbar, List, Switch, TouchableRipple } from "react-native-paper";
import { themeDefault, StylesDefaults, StyleDark } from '../Styles';
import { PreferencesContext } from '../@scripts/PreferencesContext'
import SplashScreen from "react-native-splash-screen";

type IProps = {};
type IState = {
    isSwitchOn: boolean;
};
export class Tab4 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isSwitchOn: false
        };
    }
    static contextType = PreferencesContext;
    componentDidMount() {
        this.getData().then((data: any)=>{
            var status = (data !== null)? JSON.parse(data).status : false;
            this.setState({ isSwitchOn: status });
        });
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
    render(): React.ReactNode {
        const { toggleTheme, isThemeDark } = this.context;
        return(<View style={{ flex: 2 }}>
            <Appbar.Header dark={true}>
                <Appbar.Content title={'Configuraciones'} titleStyle={{ color: StylesDefaults.headerText }}></Appbar.Content>
            </Appbar.Header>
            <List.Item
                title="Modo oscuro"
                left={(props)=><List.Icon {...props} icon={'weather-night'} />}
                right={(props)=><Switch
                    {...props}
                    color={StylesDefaults.accentColor}
                    theme={themeDefault}
                    value={isThemeDark}
                    onValueChange={()=>{
                        SplashScreen.show();
                        this.onToggleSwitch();
                        setTimeout(()=>toggleTheme(), 256);
                        setTimeout(()=>SplashScreen.hide(), 1024);
                    }}
                />}
            />
            <TouchableRipple onPress={()=>console.log('Hola')} style={{ justifyContent: 'center' }} rippleColor={(isThemeDark)? StyleDark.rippleColor: StylesDefaults.rippleColor}>
                <List.Item
                    title='Información'
                    left={(props)=><List.Icon {...props} icon={'information'}/>}
                />
            </TouchableRipple>
        </View>);
    }
}