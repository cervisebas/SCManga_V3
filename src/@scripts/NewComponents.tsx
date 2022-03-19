import React, { PureComponent, ReactNode } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Button, Chip, Divider, IconButton, List, Text, TouchableRipple } from "react-native-paper";
import { favorite, newMangas, popular } from "../@types/ApiManga";
import { chapterInfo } from "../@types/ViewInfo";
import { StyleDark, StylesDefaults } from "../Styles";
import { PreferencesContext } from "./PreferencesContext";
import FastImage from 'react-native-fast-image';

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
    }
});


type IProps0 = { data: popular, action: (url: string)=>any };
class ItemList1 extends PureComponent<IProps0, {}> {
    constructor(props: IProps0) { super(props); }
    render(): ReactNode {
        return(<View style={styles.container}>
            <TouchableRipple onPress={()=>{ this.props.action(this.props.data.url); }} style={{ justifyContent: 'center' }} rippleColor={StylesDefaults.rippleColor}>
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

type IProps1 = { data: chapterInfo, title: string, action: (url: string, title: string, chapter: string)=>any, moreActions: (url: { url: string; title: string; chapter: string; })=>any };
class ItemList3 extends PureComponent<IProps1, { _isMount: boolean; }> {
    constructor(props: IProps1) { super(props); this.state = { _isMount: false }; }
    static contextType = PreferencesContext;
    componentDidMount() { this.setState({ _isMount: true }); }
    componentWillUnmount() { this.setState({ _isMount: false }); }
    render(): React.ReactNode {
        const { isThemeDark } = this.context;
        return(<View style={styles.container}>
            {(this.state._isMount) && <TouchableRipple onLongPress={()=>this.props.moreActions({ url: this.props.data.url, title: this.props.title, chapter: this.props.data.chapter })} onPress={()=>{ this.props.action(this.props.data.url, `Capítulo ${this.props.data.chapter} - ${this.props.title}`, this.props.data.chapter); }} style={{ justifyContent: 'center' }} rippleColor={(isThemeDark)? StyleDark.rippleColor: StylesDefaults.rippleColor}>
                <List.Item
                    title={`Capítulo ${this.props.data.chapter}`}
                    titleStyle={{ color: (isThemeDark)? StyleDark.colorText : StylesDefaults.colorText }}
                    style={styles.itemList3}
                    right={()=><View style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}>{(this.props.data.view) && <Chip style={{ height: 32 }} mode="outlined" icon={'eye'}>{this.props.data.viewInfo.views}</Chip>}</View>}
                    left={()=><FastImage source={(isThemeDark)? require('../Assets/Icon1-Dark.png') : require('../Assets/Icon1.png')} style={{ width: 50, height: 50 }} /> }
                />
            </TouchableRipple>}
            <Divider theme={{ dark: isThemeDark }}/>
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
            <TouchableRipple onPress={()=>this.props.action(this.props.data.url, `Capítulo ${this.props.data.chapter} - ${this.props.data.title}`, this.props.data.chapter)} style={{ justifyContent: 'center' }} rippleColor={StylesDefaults.rippleColor}>
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
            <TouchableRipple onPress={()=>this.props.action(this.props.data.url)} style={{ justifyContent: 'center' }} rippleColor={StylesDefaults.rippleColor}>
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
    static contextType = PreferencesContext;
    render(): React.ReactNode {
        const { isThemeDark } = this.context;
        return(<View style={styles.container}>
            <TouchableRipple onLongPress={()=>this.props.moreMenu(this.props.data.index)} onPress={()=>this.props.action(this.props.data.index, `Capítulo ${this.props.data.chapter} - ${this.props.title}`)} style={{ justifyContent: 'center' }} rippleColor={(isThemeDark)? StyleDark.rippleColor: StylesDefaults.rippleColor}>
                <List.Item
                    title={`Capítulo ${this.props.data.chapter}`}
                    description={`${this.props.data.length} paginas`}
                    titleStyle={{ color: (isThemeDark)? StyleDark.colorText : StylesDefaults.colorText }}
                    style={styles.itemList5}
                    left={()=><FastImage source={(isThemeDark)? require('../Assets/Icon1-Dark.png') : require('../Assets/Icon1.png')} style={{ width: 50, height: 50 }} /> }
                    right={()=><IconButton icon={'dots-vertical'} />}
                />
            </TouchableRipple>
            <Divider theme={{ dark: isThemeDark }}/>
        </View>);
    }
}

export {
    ItemList1,
    ItemList2,
    ItemList3,
    ItemList4,
    ItemList5
};