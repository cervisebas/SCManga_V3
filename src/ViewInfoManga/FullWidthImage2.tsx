import React, { PureComponent } from 'react';
import { Dimensions, Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { PreferencesContext } from "../@scripts/PreferencesContext";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { StyleDark, StylesDefaults } from '../Styles';

interface IProps {
    source: { uri: string | undefined };
    style?: any;
};
interface IState {
    width: number;
    height: number;
    isLoad: boolean;
};

const { width } = Dimensions.get('window');

export class FullWidthImage extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            isLoad: true
        };
        this.Loading = this.Loading.bind(this);
    }
    private _isMount: boolean = true;
    static contextType = PreferencesContext;

    componentWillUnmount() {
        this._isMount = false;
    }
    componentDidMount() {
        this._isMount = true;
    }

    _onLayout(event: LayoutChangeEvent) {
        if (!this._isMount) return;
        const containerWidth = event.nativeEvent.layout.width;
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
                });
            }
        }
    }

    Loading(a: { isDark: boolean }) {
        return(<View style={styles.loadingContent}>
            <SkeletonPlaceholder
                backgroundColor={(a.isDark)? StyleDark.skeletonBackground: StylesDefaults.skeletonBackground}
                highlightColor={(a.isDark)? StyleDark.skeletonColor: StylesDefaults.skeletonColor}>
                <SkeletonPlaceholder.Item
                    width={width - 16}
                    height={this.state.height}
                    minHeight={120}
                />
            </SkeletonPlaceholder>
        </View>);

    }

    render() {
        const { isThemeDark } = this.context;
        return ((this._isMount) && <View onLayout={this._onLayout.bind(this)} style={{ minHeight: 120 }}>
            <FastImage
                source={{
                    uri: this.props.source.uri,
                    priority: FastImage.priority.normal
                }}
                style={{
                    ...this.props.style,
                    width: this.state.width,
                    height: this.state.height
                }}
                onLoadStart={()=>this.setState({ isLoad: true })}
                onLoadEnd={()=>setTimeout(()=>this.setState({ isLoad: false }), 512)}
                resizeMode={FastImage.resizeMode.stretch}
            />
            {(this.state.isLoad)? <this.Loading isDark={isThemeDark} /> : null}
        </View>);
    }
}

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