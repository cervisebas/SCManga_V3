import React, { Component } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { Modal } from "react-native-paper";

const { width, height } = Dimensions.get('window');
const pWidth = (perc: number): number =>Math.floor((perc * width)/100);
const pHeight = (perc: number): number =>Math.floor((perc * height)/100);


interface IProps {
    visible: boolean;
    image: string;
    dissmiss: ()=>any;
};

export function ImageView3(props: IProps) {
    return(<Modal visible={props.visible} style={{ width: width, height: height }} dismissable={true} onDismiss={()=>props.dissmiss()}>
        <View style={styles.View1}>
            <View style={styles.View2}>
                <Image style={styles.Image} source={{ uri: ((props.image !== "")? props.image : undefined) }} />
            </View>
        </View>
    </Modal>);
}

const styles = StyleSheet.create({
    View1: {
        flex: 1,
        flexDirection: 'column',
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    View2: {
        width: pWidth(80),
        height: pHeight(80),
        margin: 0,
        backgroundColor: '#FFFFFF'
    },
    Image: {
        width: pWidth(80),
        height: pHeight(80),
        resizeMode: 'contain'
    }
});