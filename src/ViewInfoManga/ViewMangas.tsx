import React, { Component, PureComponent } from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, SafeAreaView, FlatList, Modal } from 'react-native';
import { Appbar } from 'react-native-paper';
import { PreferencesContext } from '../@scripts/PreferencesContext';
import { StyleDark, StylesDefaults } from '../Styles';
import { FullWidthImage } from './FullWidthImage2';
import { Download } from '../@scripts/Download';

const { width, height } = Dimensions.get('window');
const download = new Download();

interface IProps {
    visible: boolean;
    title: string;
    information: {
        title: string;
        idName: string;
        chapter: string;
        cover: string;
    };
    close: ()=>any;
    images: string[];
    openImage: (image: string)=>any;
};
interface IState {
    _isMount: boolean;
};

export class ViewMangas extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            _isMount: false
        };
    }
    static contextType = PreferencesContext;
    componentWillUnmount() {
        this.setState({ _isMount: false });
    }
    componentDidMount() {
        this.setState({ _isMount: true });
    }
    render(): React.ReactNode {
        const { isThemeDark } = this.context;
        return(<Modal visible={this.props.visible} onRequestClose={()=>this.props.close()} animationType="slide" hardwareAccelerated={true} transparent={false}>
            {(this.state._isMount) && <View style={{ backgroundColor: (isThemeDark)? StyleDark.background: StylesDefaults.background, flex: 1 }}>
                <Appbar.Header style={{ backgroundColor: (isThemeDark)? StyleDark.headerColor: StylesDefaults.headerColor }}>
                    <Appbar.BackAction onPress={()=>this.props.close()} />
                    <Appbar.Content title={this.props.title} titleStyle={{ color: StylesDefaults.headerText }}/>
                    <Appbar.Action icon="download" onPress={()=>download.goDownload(this.props.information.title, this.props.information.idName, this.props.information.chapter, this.props.information.cover, this.props.images)} />
                </Appbar.Header>
                <SafeAreaView style={{ ...styles.content, position: 'relative' }}>
                    <FlatList
                        data={this.props.images}
                        keyExtractor={(_item, index)=>index.toString()}
                        //renderItem={({item, index})=><TouchableOpacity key={index} onPress={()=>this.props.openImage(item)}><View style={styles.imageContent}><FullWidthImage source={{ uri: item }} /></View></TouchableOpacity>}
                        renderItem={({item, index})=><ImageView key={index} image={item} openImage={()=>this.props.openImage(item)} />}
                    />
                </SafeAreaView>
            </View>}
        </Modal>);
    }
};

type IPropsI = { image: string; openImage: ()=>any; };
type IStateI = { _isMount: boolean; };
class ImageView extends PureComponent<IPropsI, IStateI> {
    constructor(props: IPropsI) { super(props); this.state = { _isMount: false }; }
    componentWillUnmount() { this.setState({ _isMount: false }); }
    componentDidMount() { this.setState({ _isMount: true }); }
    render(): React.ReactNode {
        return(<View style={{ flex: 2 }}>
            {(this.state._isMount) && <TouchableOpacity onPress={()=>this.props.openImage()}>
                <View style={styles.imageContent}>
                    <FullWidthImage source={{ uri: this.props.image }} />
                </View>
            </TouchableOpacity>}
        </View>);
    }
};

const styles = StyleSheet.create({
    content: {
        height: (height - 32),
        width: width,
        flex: 2
    },
    imageContent: {
        paddingLeft: 8,
        paddingRight: 8
    },
    image: {
        width: (width - 16),
        height: undefined
    }
});