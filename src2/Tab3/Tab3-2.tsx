import React, { Component } from "react";
import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, FAB, Searchbar } from "react-native-paper";
import { Search } from "../@Icons/Icons";
import { ApiManga } from "../@scripts/ApiAnime";
import { ItemList1 } from "../@scripts/NewComponents";
import { popular } from "../@types/ApiManga";
import { CombinedDarkTheme, CombinedDefaultTheme, StylesDefaults } from "../Styles";
import { GendersList } from "./GendersList";

type IProps = {
    goInfoManga: (url: string)=>any;
    goVGenderList: (gender: string, title: string)=>any;
    Tab3ViewGenderList: boolean;
    stateTab3ViewGenderList: (state: boolean)=>any;
};
type IState = {
    searchQuery: string;
    searchResults: popular[];
    isLoading: boolean;
    notFound: boolean;
    showList: boolean;
};

const apiManga = new ApiManga();
const { width, height } = Dimensions.get('window');

export class Tab3 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            searchQuery: '',
            searchResults: [],
            isLoading: true,
            notFound: true,
            showList: false
        };
    }

    onChangeSearch(query: string) { this.setState({ searchQuery: query }); }

    Loading() { return(<View style={styles.verticalAling}><ActivityIndicator animating={true} size='large' color={CombinedDefaultTheme.colors.accent} style={{ marginTop: 16 }}/></View>); }
    nowSearch(a: { color: string }) {
        return(<View style={styles.verticalAling}>
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Search width={96} height={96} fillColor={a.color} />
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 8, color: a.color }}>No hay resultados</Text>
            </View>
        </View>);
    }
    goSearch(search: string) {
        this.setState({ isLoading: true, notFound: false });
        apiManga.getSearchResults(search).then((results)=>{
            return this.setState({ searchResults: results, notFound: false, isLoading: false });
        }).catch(()=>{
            return this.setState({ isLoading: false, notFound: true });
        })
    }

    render(): React.ReactNode {
        return(<View style={{ flex: 1 }}>
            <View style={{ ...styles.header, backgroundColor: CombinedDarkTheme.colors.card }}>
                <View style={styles.headerText}>
                    <Text style={{ ...styles.headerTextContent, color: StylesDefaults.headerText }}>Directorios</Text>
                </View>
                <View style={styles.headerSearch}>
                    <Searchbar
                        placeholder="Buscar..."
                        onChangeText={(e)=>this.onChangeSearch(e)}
                        value={this.state.searchQuery}
                        onSubmitEditing={({ nativeEvent: { text }})=>this.goSearch(text)}
                    />
                </View>
            </View>
            <SafeAreaView style={{ flex: 2 }}>
                {(this.state.notFound)? <this.nowSearch color={CombinedDarkTheme.colors.text}/> : ((this.state.isLoading)? <this.Loading /> : <FlatList
                    data={this.state.searchResults}
                    extraData={this.state.isLoading}
                    renderItem={({item, index})=><ItemList1 data={item} key={index} action={(url: string)=>this.props.goInfoManga(url)} />}
                />)}
            </SafeAreaView>
            <FAB
                icon={'filter-variant'}
                style={{ ...styles.fab, backgroundColor: StylesDefaults.secondHeaderColor }}
                color={'#FFFFFF'}
                onPress={()=>this.props.stateTab3ViewGenderList(true)}
            />
            <GendersList
                visible={this.props.Tab3ViewGenderList}
                goGender={(name: string, title: string)=>this.props.goVGenderList(name, title)}
                close={()=>this.props.stateTab3ViewGenderList(false)}
            />
        </View>);
    }
}

const styles = StyleSheet.create({
    header: {
        width: width,
        height: 116,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    headerText: { 
        width: width,
    },
    headerTextContent: {
        margin: 16,
        fontSize: 20,
        marginBottom: 8,
        fontWeight: 'bold'
    },
    headerSearch: {
        width: width,
        height: 64,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 8,
        paddingBottom: 8,
    },
    verticalAling: {
        width: width,
        flex: 2,
        textAlign: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    }
});