import React, { PureComponent } from 'react';
import { Dimensions, Image, ImageStyle, LayoutChangeEvent, StyleProp, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { StyleDark } from '../Styles';

interface IProps {
    source: { uri: string | undefined };
    style?: StyleProp<ImageStyle> | any;
};
interface IState {
    width: number;
    viewWidth: number;
    height: number;
    isLoad: boolean;
    isError: boolean;
};

const { width } = Dimensions.get('window');

export class FullWidthImage extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            width: 0,
            viewWidth: 0,
            height: 0,
            isLoad: false,
            isError: false
        };
    }
    private _isMount: boolean = true;

    componentWillUnmount() {
        this._isMount = false;
        this.setState({
            width: 0,
            viewWidth: 0,
            height: 0,
            isLoad: false,
            isError: false
        });
    }
    componentDidMount() {
        this._isMount = true;
    }

    _onLayout(event: LayoutChangeEvent) {
        if (!this._isMount) return;
        const containerWidth = event.nativeEvent.layout.width;
        this.setState({ viewWidth: containerWidth });
        if (!this.state.isError) {
            if (typeof this.props.source === 'number') {
                const source = Image.resolveAssetSource(this.props.source);
                this.setState({
                    width: containerWidth,
                    height: (containerWidth * source.height / source.width)
                });
            } else if (typeof this.props.source === 'object') {
                if (this.props.source.uri !== undefined) {
                    Image.getSize(String(this.props.source.uri), (width, height) => {
                        this.setState({
                            width: containerWidth,
                            height: (containerWidth * height / width)
                        });
                    }, ()=>this.launchError());
                }
            }
        }
    }
    launchError() {
        const source = Image.resolveAssetSource(require('../Assets/error-image.png'));
        this.setState({
            width: this.state.viewWidth,
            height: (this.state.viewWidth * source.height / source.width)
        });
        this.setState({ isError: true, isLoad: true });
    }
    render() {
        return (<View onLayout={this._onLayout.bind(this)} style={{ minHeight: 120 }}>
            {(this._isMount) && <View>
                <FastImage
                    source={(!this.state.isError)? {
                        uri: this.props.source.uri,
                        priority: FastImage.priority.normal
                    }: require('../Assets/error-image.png')}
                    style={{
                        ...this.props.style,
                        width: this.state.width,
                        height: this.state.height
                    }}
                    onLoadStart={()=>this.setState({ isLoad: false })}
                    onLoadEnd={()=>setTimeout(()=>this.setState({ isLoad: true }), 512)}
                    onError={()=>this.launchError()}
                    resizeMode={FastImage.resizeMode.stretch}
                />
                <Loading loading={this.state.isLoad} height={this.state.height} />
            </View>}
        </View>);
    }
}

type IProps2 = {
    loading: boolean;
    height: number;
};
class Loading extends PureComponent<IProps2> {
    constructor(props: IProps2) {
        super(props);
    }
    render(): React.ReactNode {
        return(<>
            {(!this.props.loading) && <View style={styles.loadingContent}>
                <SkeletonPlaceholder
                    backgroundColor={StyleDark.skeletonBackground}
                    highlightColor={StyleDark.skeletonColor}>
                    <SkeletonPlaceholder.Item
                        width={width - 16}
                        height={this.props.height}
                        minHeight={120}
                    />
                </SkeletonPlaceholder>
            </View>}
        </>);
    }
};

const styles = StyleSheet.create({
    loadingContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: (width - 16),
        minHeight: 120,
        height: 'auto'
    }
});