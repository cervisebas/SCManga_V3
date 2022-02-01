import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Divider, List, Text, TouchableRipple, Button, Chip } from "react-native-paper";
import { popular, newMangas, favorite } from "../@types/ApiManga";
import { chapterInfo } from "../@types/ViewInfo";
import { Alert } from '../@Icons/Icons';
import { rippleColor, themeDefault } from "../Styles";

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
    }
});

const itemList1 = (data: popular, action: (url: string)=>void)=>{
    return(<View style={styles.container}>
        <TouchableRipple theme={themeDefault} onPress={()=>{ action(data.url); }} style={{ justifyContent: 'center' }} rippleColor={rippleColor}>
            <List.Item
                title={data.title}
                description={()=><Text style={{ marginLeft: 8, color: '#666666' }}>{data.type}</Text>}
                style={styles.itemList1}
                theme={themeDefault}
                left={()=><Image source={{ uri: data.image }} style={{ width: 110, height: 150, borderRadius: 4 }} /> }
            />
        </TouchableRipple>
        <Divider />
    </View>);
};
const itemList2 = (data: newMangas, action: (url: string, chapter: string)=>void)=>{
    return(<View style={styles.container}>
        <TouchableRipple theme={themeDefault} onPress={()=>{ action(data.url, `Capitulo ${data.chapter} - ${data.title}`); }} style={{ justifyContent: 'center' }} rippleColor={rippleColor}>
            <List.Item
                title={data.title}
                description={()=><Text style={{ marginLeft: 4, color: '#666666' }}>Capitulo {data.chapter}</Text>}
                style={styles.itemList2}
                theme={themeDefault}
                left={()=><Image source={require('../Assets/Icon1.png')} style={{ width: 70, height: 70, borderRadius: 4 }} /> }
            />
        </TouchableRipple>
        <Divider />
    </View>);
};
const itemList3 = (data: chapterInfo, key: number, title: string, action: (url: string, chapter: string)=>void)=>{
    return(<View style={styles.container} key={key}>
        <TouchableRipple theme={themeDefault} onPress={()=>{ action(data.url, `Capitulo ${data.chapter} - ${title}`); }} style={{ justifyContent: 'center' }} rippleColor={rippleColor}>
            <List.Item
                title={data.chapter}
                style={styles.itemList3}
                theme={themeDefault}
                right={()=><View style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}>{(data.view) && <Chip style={{ height: 32 }} mode="outlined" icon={'eye'}>{data.viewInfo.views}</Chip>}</View>}
                left={()=><Image source={require('../Assets/Icon1.png')} style={{ width: 50, height: 50 }} /> }
            />
        </TouchableRipple>
        <Divider />
    </View>);
};
const ShowError = (props: { retry: ()=>any })=>{
    return(<View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Alert width={96} height={96} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 8 }}>Lo siento, ocurrió un error.</Text>
            <Button icon="reload" color="#f4511e" style={{ marginTop: 8 }} onPress={()=>props.retry()} mode="text">Reintentar</Button>
        </View>
    </View>);
};
const itemList4 = (data: favorite, action: (url: string)=>void)=>{
    return(<View style={styles.container}>
        <TouchableRipple theme={themeDefault} onPress={()=>{ action(data.url); }} style={{ justifyContent: 'center' }} rippleColor={rippleColor}>
            <List.Item
                title={data.title}
                description={()=><Text style={{ marginLeft: 8, color: '#666666' }}>{data.type}{"\n"}{"\n"}{`Añadido: ${data.date}`}</Text>}
                style={styles.itemList1}
                theme={themeDefault}
                left={()=><Image source={{ uri: data.image }} style={{ width: 110, height: 150, borderRadius: 4 }} /> }
            />
        </TouchableRipple>
        <Divider />
    </View>);
};

export {
    itemList1,
    itemList2,
    itemList3,
    itemList4,
    ShowError
};