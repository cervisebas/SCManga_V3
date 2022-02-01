import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { favorite } from '../@types/ApiManga';
import { ApiManga } from '../@scripts/ApiAnime';
import { HeartOff } from '../@Icons/Icons';
import { CombinedDarkTheme, CombinedDefaultTheme, StylesDefaults } from '../Styles';
import { ItemList4 } from '../@scripts/NewComponents';
import { PreferencesContext } from '../@scripts/PreferencesContext';

const apiManga = new ApiManga();
const { width, height } = Dimensions.get('window');

interface IProps {
    goInfoManga: (url: string)=>any;
};
interface IState {
    favotites: favorite[];
    isLoading: boolean;
    empty: boolean;
};

export class Tab2 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            favotites: [],
            isLoading: true,
            empty: false
        };
        this.getFavorites = this.getFavorites.bind(this);
    }
    public _isMounted: boolean = false;
    static contextType = PreferencesContext;

    componentDidMount() {
        this._isMounted = true;
        this.getFavorites();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    nowEmpty(a: { color: string }) {
        return(<View style={styles.verticalAling}>
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <HeartOff width={96} height={96} fillColor={a.color} />
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 8, color: a.color }}>No hay resultados</Text>
            </View>
        </View>);
    }
    Loading() {
        return(<View style={styles.verticalAling}>
            <ActivityIndicator animating={true} size='large' color='#ff5131' style={{ marginTop: 16 }}/>
        </View>);
    }
    getFavorites() {
        apiManga.getFavorites().then((favorites)=>{
            if (favorites.length !== 0) {
                setTimeout(()=>{
                    this.setState({ favotites: favorites, isLoading: false, empty: false });
                }, 1500);
            } else {
                this.setState({ favotites: [], isLoading: false, empty: true });
            }
        }).catch(()=>this.setState({ favotites: [], isLoading: false, empty: true }));
    }
    render(): React.ReactNode {
        const { isThemeDark } = this.context;
        (this._isMounted) && this.getFavorites();
        return(<View style={{ flex: 2 }}>
            <Appbar.Header dark={true}>
                <Appbar.Content title={'Favoritos'}></Appbar.Content>
            </Appbar.Header>
            <SafeAreaView>
                {(this.state.empty)? <this.nowEmpty color={(isThemeDark)? CombinedDarkTheme.colors.text : CombinedDefaultTheme.colors.text} /> : ((this.state.isLoading)? <this.Loading /> : <FlatList
                    data={this.state.favotites}
                    style={{ marginBottom: 56 }}
                    extraData={this.state.isLoading}
                    renderItem={({item, index})=><ItemList4 data={item} key={index} action={(url)=>this.props.goInfoManga(url)} />}
                />)}
            </SafeAreaView>
        </View>);
    }
}

const styles = StyleSheet.create({
    verticalAling: {
        width: width,
        height: (height - 136),
        textAlign: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    }
});