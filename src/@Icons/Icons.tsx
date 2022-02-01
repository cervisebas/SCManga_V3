import React from "react";
import { PreferencesContext } from "../@scripts/PreferencesContext";
import { StyleProp, ViewStyle } from "react-native";
import SearchIcon from './magnify.svg';
import HeartOffIcon from './heart-off-outline.svg';
import AlertIcon from './alert.svg';

import SearchIconDark from './magnify-dark.svg';
import HeartOffIconDark from './heart-off-outline-dark.svg';
import AlertIconDark from './alert-dark.svg';

const Search = (props: { width?: number, height?: number, fillColor?: string, style?: StyleProp<ViewStyle> })=> {
  const { isThemeDark } = React.useContext(PreferencesContext);
  var width: number = (props.width == undefined)? 64: props.width;
  var height: number = (props.height == undefined)? 64: props.height;
  return((isThemeDark)? <SearchIconDark width={width} height={height} style={props.style} />: <SearchIcon width={width} height={height} style={props.style} />);
};
const HeartOff = (props: { width?: number, height?: number, fillColor?: string, style?: StyleProp<ViewStyle> })=> {
  const { isThemeDark } = React.useContext(PreferencesContext);
  var width: number = (props.width == undefined)? 64: props.width;
  var height: number = (props.height == undefined)? 64: props.height;
  return((isThemeDark)? <HeartOffIconDark width={width} height={height} style={props.style} />: <HeartOffIcon width={width} height={height} style={props.style} />);
};
const Alert = (props: { width?: number, height?: number, fillColor?: string, style?: StyleProp<ViewStyle> })=> {
  const { isThemeDark } = React.useContext(PreferencesContext);
  var width: number = (props.width == undefined)? 64: props.width;
  var height: number = (props.height == undefined)? 64: props.height;
  return((isThemeDark)? <AlertIconDark width={width} height={height} style={props.style} />: <AlertIcon width={width} height={height} style={props.style} />);
};

export {
  Search,
  HeartOff,
  Alert
};