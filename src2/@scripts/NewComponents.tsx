import React, { PureComponent, ReactNode } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Button, Chip, Divider, IconButton, List, Text, TouchableRipple } from "react-native-paper";
import { favorite, newMangas, popular } from "../@types/ApiManga";
import { chapterInfo } from "../@types/ViewInfo";
import { CombinedDefaultTheme, StyleDark, StylesDefaults } from "../Styles";
import { PreferencesContext } from "./PreferencesContext";
import FastImage from 'react-native-fast-image';
import { Alert } from "../@Icons/Icons";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemList1: {
        margin: 0,
        height: 165,
        flexGrow: 0
    },
    itemList2: {
        margin: 0,
        height: 85,
        flexGrow: 0
    },
    itemList3: {
        margin: 0,
        height: 65,
        flexGrow: 0
    },
    itemList5: {
        margin: 0,
        height: 65,
        flexGrow: 0
    },
    showErrorContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    showErrorContent2: {
        flexDirection: 'column',
        alignItems: 'center'
    }
});


type IProps0 = { data: popular, action: (url: string)=>any };
class ItemList1 extends PureComponent<IProps0, {}> {
    constructor(props: IProps0) { super(props); }
    render(): ReactNode {
        return(<View style={styles.container}>
            <TouchableRipple onPress={()=>{ this.props.action(this.props.data.url); }} style={{ justifyContent: 'center' }} rippleColor={StyleDark.rippleColor}>
                <List.Item
                    title={this.props.data.title}
                    description={()=><Text style={{ marginLeft: 8, opacity: 0.65 }}>{this.props.data.type}</Text>}
                    style={styles.itemList1}
                    left={()=><FastImage source={{ uri: this.props.data.image }} style={{ width: 110, height: 150, borderRadius: 4 }} /> }
                />
            </TouchableRipple>
            <Divider />
        </View>);
    }
}

type IProps1 = { data: chapterInfo, title: string, action: (url: string, title: string, chapter: string)=>any, moreActions: (data: { url: string; title: string; chapter: string; })=>any };
class ItemList3 extends PureComponent<IProps1, { _isMount: boolean; }> {
    constructor(props: IProps1) { super(props); this.state = { _isMount: false }; }
    componentDidMount() { this.setState({ _isMount: true }); }
    componentWillUnmount() { this.setState({ _isMount: false }); }
    render(): React.ReactNode {
        return(<View style={styles.container}>
            {(this.state._isMount) && <TouchableRipple onLongPress={()=>this.props.moreActions({ url: this.props.data.url, title: this.props.title, chapter: this.props.data.chapter })} onPress={()=>{ this.props.action(this.props.data.url, `Capítulo ${this.props.data.chapter} - ${this.props.title}`, this.props.data.chapter); }} style={{ justifyContent: 'center' }} rippleColor={StyleDark.rippleColor}>
                <List.Item
                    title={`Capítulo ${this.props.data.chapter}`}
                    style={styles.itemList3}
                    right={(props)=><View {...props} style={{ height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        {(this.props.data.view) && <Chip {...props} style={{ height: 32 }} mode="outlined" icon={'eye'}>{this.props.data.viewInfo.views}</Chip>}
                        <IconButton {...props} icon={'dots-vertical'} onPress={()=>this.props.moreActions({ url: this.props.data.url, title: this.props.title, chapter: this.props.data.chapter })} />
                    </View>}
                    left={()=><FastImage source={require('../Assets/Icon1.png')} style={{ width: 50, height: 50 }} /> }
                />
            </TouchableRipple>}
            <Divider />
        </View>);
    }
}

type IProps2 = { data: newMangas, action: (url: string, title: string, chapter: string)=>any };
class ItemList2 extends PureComponent<IProps2> {
    constructor(props: IProps2) { super(props); }
    static contextType = PreferencesContext;
    render(): React.ReactNode {
        const { isThemeDark } = this.context;
        return(<View style={styles.container}>
            <TouchableRipple onPress={()=>this.props.action(this.props.data.url, `Capítulo ${this.props.data.chapter} - ${this.props.data.title}`, this.props.data.chapter)} style={{ justifyContent: 'center' }} rippleColor={StyleDark.rippleColor}>
                <List.Item
                    title={this.props.data.title}
                    description={()=><Text style={{ marginLeft: 4, opacity: 0.65 }}>Capítulo {this.props.data.chapter}</Text>}
                    style={styles.itemList2}
                    left={()=><FastImage source={(isThemeDark)? require('../Assets/Icon1-Dark.png'): require('../Assets/Icon1.png')} style={{ width: 70, height: 70, borderRadius: 4 }} /> }
                />
            </TouchableRipple>
            <Divider />
        </View>);
    }
}

type IProps3 = { data: favorite, action: (url: string)=>any };
class ItemList4 extends PureComponent<IProps3> {
    constructor(props: IProps3) { super(props); }
    render(): React.ReactNode {
        return(<View style={styles.container}>
            <TouchableRipple onPress={()=>this.props.action(this.props.data.url)} style={{ justifyContent: 'center' }} rippleColor={StyleDark.rippleColor}>
                <List.Item
                    title={this.props.data.title}
                    description={()=><Text style={{ marginLeft: 8, opacity: 0.65 }}>{this.props.data.type}{"\n"}{"\n"}{`Añadido: ${this.props.data.date}`}</Text>}
                    style={styles.itemList1}
                    left={()=><FastImage source={{ uri: this.props.data.image }} style={{ width: 110, height: 150, borderRadius: 4 }} /> }
                />
            </TouchableRipple>
            <Divider />
        </View>);
    }
}

type IProps4 = { data: { index: number, title: string, chapter: string, length: number }, title: string, action: (index: number, title: string)=>any, moreMenu: (index: number)=>any };
class ItemList5 extends PureComponent<IProps4> {
    constructor(props: IProps4) { super(props); }
    render(): React.ReactNode {
        return(<View style={styles.container}>
            <TouchableRipple onLongPress={()=>this.props.moreMenu(this.props.data.index)} onPress={()=>this.props.action(this.props.data.index, `Capítulo ${this.props.data.chapter} - ${this.props.title}`)} style={{ justifyContent: 'center' }} rippleColor={StyleDark.rippleColor}>
                <List.Item
                    title={`Capítulo ${this.props.data.chapter}`}
                    description={`${this.props.data.length} paginas`}
                    titleStyle={{ color: CombinedDefaultTheme.colors.text }}
                    style={styles.itemList5}
                    left={()=><FastImage source={require('../Assets/Icon1.png')} style={{ width: 50, height: 50 }} /> }
                    right={(props)=><IconButton {...props} icon={'dots-vertical'} />}
                />
            </TouchableRipple>
            <Divider theme={{ dark: true }}/>
        </View>);
    }
}

type IProps5 = { retry: ()=>any; };
class ShowError extends PureComponent<IProps5> {
    constructor(props: IProps5) { super(props); }
    static contextType = PreferencesContext;
    render(): React.ReactNode {
        const { isThemeDark } = this.context;
        return(<View style={styles.showErrorContent}>
            <View style={styles.showErrorContent2}>
                <Alert width={96} height={96} />
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 8 }}>Lo siento, ocurrió un error.</Text>
                <Button icon="reload" color={CombinedDefaultTheme.colors.accent} style={{ marginTop: 8 }} onPress={()=>this.props.retry()} mode="text">Reintentar</Button>
            </View>
        </View>);
    }
}

export {
    ItemList1,
    ItemList2,
    ItemList3,
    ItemList4,
    ItemList5,
    ShowError
};