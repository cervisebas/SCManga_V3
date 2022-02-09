import React, { Component } from "react";
import { Dimensions, StyleSheet, Modal } from "react-native";
import { ActivityIndicator, Text, Button } from "react-native-paper";
import ImageViewer from 'react-native-image-zoom-viewer';

const { width, height } = Dimensions.get('window');

interface IProps {
    visible: boolean;
    image: string;
    dissmiss: ()=>any;
};
interface IState {};

export class ImageViewMangaLocal extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    header() {
        return(<Button icon="close" mode="text" color={'#f4511e'} onPress={()=>this.props.dissmiss()} style={styles.button}>Cerrar</Button>);
    }
    render(): React.ReactNode {
        return(<Modal visible={this.props.visible} style={styles.modal} onDismiss={()=>this.props.dissmiss()}>
            <ImageViewer
                imageUrls={[{ url: `file://${this.props.image}` }]}
                enableImageZoom={true}
                saveToLocalByLongPress={false}
                enableSwipeDown={true}
                onSwipeDown={()=>this.props.dissmiss()}
                menuContext={{ saveToLocal: 'Guardar en la galería', cancel: 'Cerrar' }}
                onCancel={()=>this.props.dissmiss()}
                flipThreshold={100}
                loadingRender={()=><ActivityIndicator animating={true} size='large' color='#ff5131' style={{ marginTop: 16 }}/>}
                renderIndicator={()=><Text></Text>}
                renderHeader={()=>this.header()}
            />
        </Modal>);
    }
}

const styles = StyleSheet.create({
    modal: {
        width: width,
        height: height
    },
    button: {
        position: 'absolute',
        top: 8,
        left: 8,
        zIndex: 5
    }
});