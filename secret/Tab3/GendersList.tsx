import React, { Component, PureComponent } from "react";
import { Dimensions, FlatList, Modal, SafeAreaView, View } from "react-native";
import { Appbar, Divider, List, TouchableRipple, Provider as PaperProvider } from "react-native-paper";
import { PreferencesContext } from "../@scripts/PreferencesContext";
import { CombinedDefaultTheme, StyleDark, StylesDefaults, themeDefault } from "../Styles";

type IProps = {
    visible: boolean,
    goGender: (gender: string, title: string)=>any,
    close: ()=>any
};
type IState = {
    _isMount: boolean;
};

const { height } = Dimensions.get('window');

export class GendersList extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            _isMount: false
        };
    }
    static contextType = PreferencesContext;
    public genders: string[] = ['Ecchi', 'Yaoi', 'Yuri', 'Anal', 'Tetonas', 'Escolares', 'Incesto', 'Virgenes', 'Masturbacion', 'Maduras', 'Lolicon', 'Bikini', 'Sirvientas', 'Enfermera', 'Embarazada', 'Ahegao', 'Casadas', 'Chica con Pene', 'Juguetes Sexuales', 'Orgias', 'Harem', 'Romance', 'Profesores', 'Tentaculos', 'Mamadas', 'Shota', 'Interracial', 'Full Color', 'Sin Censura', 'Futanari', 'Doble Penetracion', 'Cosplay'];
    componentDidMount() {
        this.setState({ _isMount: true });
    }
    componentWillUnmount() {
        this.setState({ _isMount: false });
    }
    render(): React.ReactNode {
        const { isThemeDark } = this.context;
        return(<Modal visible={this.props.visible} hardwareAccelerated={true} onRequestClose={()=>this.props.close()} animationType="slide">
            <PaperProvider theme={CombinedDefaultTheme}>
                <View style={{ flex: 1, backgroundColor: StyleDark.background }}>
                    <Appbar.Header dark={true} style={{ backgroundColor: (isThemeDark)? StyleDark.headerColor: StylesDefaults.headerColor }}>
                        <Appbar.BackAction onPress={()=>this.props.close()} />
                        <Appbar.Content title={'Lista de generos'} titleStyle={{ color: StylesDefaults.headerText }}/>
                    </Appbar.Header>
                    <FlatList
                        data={this.genders}
                        horizontal={false}
                        renderItem={({item, index})=><ItemRender
                            key={index}
                            text={item}
                            color={StyleDark.colorText}
                            rippleColor={StyleDark.rippleColor}
                            action={(idname, name)=>this.props.goGender(idname, name)}
                        />}
                    />
                </View>
            </PaperProvider>
        </Modal>);
    }
}

type IProps2 = {
    text: string;
    color: string;
    rippleColor: string;
    action: (idName: string, name: string)=>any;
};
class ItemRender extends PureComponent<IProps2> {
    constructor(props: any) {
        super(props);
    }
    processName(name: string) {
        return name
            .replace(/á/gi, 'a')
            .replace(/ä/gi, 'a')
            .replace(/à/gi, 'a')
            .replace(/A/gi, 'a')
            .replace(/é/gi, 'e')
            .replace(/ë/gi, 'e')
            .replace(/è/gi, 'e')
            .replace(/E/gi, 'e')
            .replace(/í/gi, 'i')
            .replace(/ï/gi, 'i')
            .replace(/ì/gi, 'i')
            .replace(/I/gi, 'i')
            .replace(/ó/gi, 'o')
            .replace(/ö/gi, 'o')
            .replace(/ò/gi, 'o')
            .replace(/O/gi, 'o')
            .replace(/ú/gi, 'u')
            .replace(/ü/gi, 'u')
            .replace(/ù/gi, 'u')
            .replace(/U/gi, 'u')
            .replace(/\ /gi, '-')
            .toLowerCase();
    }
    render(): React.ReactNode {
        return(<View style={{ flex: 1 }}>
            <TouchableRipple theme={themeDefault} onPress={()=>this.props.action(this.processName(this.props.text), this.props.text)} style={{ justifyContent: 'center' }} rippleColor={this.props.rippleColor}>
                <List.Item
                    title={this.props.text}
                    titleStyle={{ color: this.props.color }}
                    left={(props)=><List.Icon {...props} color={this.props.color} icon="fire" />}
                />
            </TouchableRipple>
            <Divider />
        </View>);
    }
}