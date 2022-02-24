import React, { Component, createRef } from "react";
import { Dimensions, FlatList, Modal, NativeScrollEvent, SafeAreaView, View } from "react-native";
import { Appbar, ProgressBar, Provider as PaperProvider } from "react-native-paper";
import { ApiManga } from "../@scripts/ApiAnime";
import { ItemList1 } from '../@scripts/NewComponents';
import { PreferencesContext } from "../@scripts/PreferencesContext";
import { popular } from "../@types/ApiManga";
import { CombinedDefaultTheme, StyleDark } from "../Styles";

type IProps = {
    gender: string;
    visible: boolean;
    close: ()=>any;
    title: string;
    list: popular[];
    pages: number;
    goInfoManga: (url: string)=>any;
};
type IState = {
    currentPage: number;
    currentPost: number;
    data: popular[];
    isLoading: boolean;
    _isMount: boolean;
};

const apiAnime = new ApiManga();
const { height, width } = Dimensions.get('window');

export class ViewGenders extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            currentPage: 1,
            currentPost: 0,
            data: [],
            isLoading: false,
            _isMount: false
        };
    }
    static contextType = PreferencesContext;
    private FlatListRef = createRef<FlatList>();
    componentDidMount() {
        this.setState({ _isMount: true });
    }
    componentWillUnmount() {
        this.setState({ _isMount: false });
    }
    ifCloseToBottom({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) {
        const paddingToBottom = 1;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    render(): React.ReactNode {
        const { isThemeDark } = this.context;
        return(<Modal visible={this.props.visible} onRequestClose={()=>this.props.close()} animationType="slide" transparent={false} hardwareAccelerated={true} onShow={()=>this.setState({ data: this.props.list })}>
            {(this.state._isMount) && <View style={{ flex: 2, backgroundColor: StyleDark.background }}>
                <PaperProvider theme={CombinedDefaultTheme}>
                    <Appbar.Header dark={true}>
                        <Appbar.BackAction onPress={()=>this.props.close()} />
                        <Appbar.Content title={this.props.title}/>
                    </Appbar.Header>
                    <SafeAreaView style={{ position: 'relative' }}>
                        {(this.state.isLoading) && <ProgressBar indeterminate={true} color={StyleDark.progressBar} style={{ position: 'absolute', top: 0, left: 0, right: 0, width: width, zIndex: 20 }} />}
                        <FlatList
                            data={this.state.data}
                            horizontal={false}
                            style={{ height: (this.state.isLoading)? (height - 64) : (height - 60), marginTop: (this.state.isLoading)? 4: 0 }}
                            renderItem={({item, index})=><ItemList1 data={item} key={index} action={(url: string)=>this.props.goInfoManga(url)}/>}
                            ref={this.FlatListRef}
                            onScroll={({ nativeEvent })=>{
                                if (this.ifCloseToBottom(nativeEvent) && !this.state.isLoading && this.props.pages !== this.state.currentPage) {
                                    this.setState({ currentPost: nativeEvent.contentOffset.y, isLoading: true });
                                    apiAnime.getMoreGender(this.props.gender, String(this.state.currentPage + 1)).then((data)=>{
                                        this.setState({
                                            currentPage: (this.state.currentPage + 1),
                                            data: this.state.data.concat(data),
                                            isLoading: false
                                        });
                                    }).catch(()=>{
                                        this.setState({ isLoading: false });
                                    });
                                }
                            }}
                            scrollEventThrottle={400}
                        />
                    </SafeAreaView>
                </PaperProvider>
            </View>}
        </Modal>);
    }
}