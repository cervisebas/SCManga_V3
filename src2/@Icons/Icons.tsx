import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import SearchIconDark from './magnify-dark.svg';
import HeartOffIconDark from './heart-off-outline-dark.svg';
import AlertIconDark from './alert-dark.svg';
import NoDownloadIconDark from './no-download-dark.svg';

const Search = (props: { width?: number, height?: number, fillColor?: string, style?: StyleProp<ViewStyle> })=> {
  var width: number = (props.width == undefined)? 64: props.width;
  var height: number = (props.height == undefined)? 64: props.height;
  return(<SearchIconDark width={width} height={height} style={props.style} />);
};
const HeartOff = (props: { width?: number, height?: number, fillColor?: string, style?: StyleProp<ViewStyle> })=> {
  var width: number = (props.width == undefined)? 64: props.width;
  var height: number = (props.height == undefined)? 64: props.height;
  return(<HeartOffIconDark width={width} height={height} style={props.style} />);
};
const Alert = (props: { width?: number, height?: number, fillColor?: string, style?: StyleProp<ViewStyle> })=> {
  var width: number = (props.width == undefined)? 64: props.width;
  var height: number = (props.height == undefined)? 64: props.height;
  return(<AlertIconDark width={width} height={height} style={props.style} />);
};
const NoDownload = (props: { width?: number, height?: number, fillColor?: string, style?: StyleProp<ViewStyle> })=> {
  var width: number = (props.width == undefined)? 64: props.width;
  var height: number = (props.height == undefined)? 64: props.height;
  return(<NoDownloadIconDark width={width} height={height} style={props.style} />);
};

export {
  Search,
  HeartOff,
  Alert,
  NoDownload
};