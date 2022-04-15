import React, { Component } from "react";
import { View } from "react-native";
import { Appbar, List, TouchableRipple } from "react-native-paper";
import { StyleDark } from '../Styles';
import { Downloads } from "../downloads/downloads";

type IProps = {
    goToChapterLocal: (index: number, title: string, resolve: ()=>any)=>any;
    actionLoading: (visible: boolean, text?: string)=>any;
    pageGo: (page: string)=>any;
};
type IState = {
    viewDownload: boolean;
};
export class Tab4 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            viewDownload: false,
        };
    }
    render(): React.ReactNode {
        return(<View style={{ flex: 2 }}>
            <Appbar.Header>
                <Appbar.Content title={'Configuraciones'}></Appbar.Content>
            </Appbar.Header>
            <TouchableRipple onPress={()=>this.setState({ viewDownload: true })} style={{ justifyContent: 'center' }} rippleColor={StyleDark.rippleColor}>
                <List.Item
                    title='Descargas'
                    left={(props)=><List.Icon {...props} icon={'download'}/>}
                />
            </TouchableRipple>
            <TouchableRipple onPress={()=>this.props.pageGo('scmanga')} style={{ justifyContent: 'center' }} rippleColor={StyleDark.rippleColor}>
                <List.Item
                    title='Volver a SCManga'
                    left={(props)=><List.Icon {...props} icon={'exit-to-app'}/>}
                />
            </TouchableRipple>
            <Downloads actionLoading={(visible: boolean, text?: string)=>this.props.actionLoading(visible, text)} visible={this.state.viewDownload} goToChapterLocal={(index, title, resolve)=>this.props.goToChapterLocal(index, title, ()=>resolve())} close={()=>this.setState({ viewDownload: false })} />
        </View>);
    }
}