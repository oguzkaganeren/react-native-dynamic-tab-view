import React, { RefObject } from 'react';
import { Button, TouchableHighlight, Text, FlatList, View, StyleSheet, ColorValue } from 'react-native';
import PropTypes from 'prop-types';
export interface DynamicTabViewScrollProps {
	selectedTab: Number,
	goToPage: CallableFunction,
	headerBackgroundColor: ColorValue,
	headerActiveTextStyle: StyleSheet,
	headerTextStyle: StyleSheet,
	highlightStyle: StyleSheet,
	headerUnderlayColor: ColorValue,
	noHighlightStyle: StyleSheet,
	data: any,
	extraData: any,
	scrollFlatRef: RefObject<FlatList>
}
const DynamicTabViewScrollHeader: React.FC<DynamicTabViewScrollProps> = (props) => {
	const { selectedTab, headerBackgroundColor, headerActiveTextStyle, headerTextStyle, highlightStyle, headerUnderlayColor, noHighlightStyle, data, extraData, scrollFlatRef, ...restProps } = props;
	const [selected, setSelected] = React.useState(selectedTab);

	const onPressHeader = (item, index) => {
		props.goToPage(index);
	};
	const renderHighlight = showHighlight => {
		if (showHighlight) {
			return (
				<View
					style={[
						styles.highlight,
						highlightStyle,
						{ backgroundColor: headerUnderlayColor }
					]}
				/>
			);
		} else {
			return (
				<View
					style={[styles.noHighlight, noHighlightStyle]}
				/>
			);
		}
	};
	const renderTitle = ({ item, index }) => {
		let isTabActive = index === selected;
		let fontWeight = isTabActive ? "bold" : "normal";
		return (
			<TouchableHighlight
				onPress={() => onPressHeader(item, index)}
				style={[
					styles.tabItemContainer,
					{ backgroundColor: headerBackgroundColor }
				]}
				underlayColor={"#00000033"}
			>
				<View>
					<Text
						style={[
							{ fontWeight: fontWeight },
							styles.tabItemText,
							isTabActive ? headerActiveTextStyle : headerTextStyle
						]}
					>
						{item["title"]}
					</Text>
					{renderHighlight(isTabActive)}
				</View>
			</TouchableHighlight>
		);
	};
	return (
		<FlatList
			horizontal
			alwaysBounceHorizontal={false}
			bounces={false}
			showsHorizontalScrollIndicator={false}
			data={data}
			ref={scrollFlatRef}
			extraData={extraData}
			renderItem={renderTitle}
			style={[
				styles.headerStyle,
				{ backgroundColor: headerBackgroundColor }
			]}
		/>
	);
};

const styles: any = StyleSheet.create({
	tabItemText: {
		color: "white"
	},
	tabItemContainer: {
		overflow: "hidden",
		backgroundColor: "#555555",
		padding: 20,
		justifyContent: "center",
		alignItems: "center"
	},
	highlight: {
		backgroundColor: "white",
		paddingHorizontal: 10,
		paddingVertical: 2,
		marginTop: 5
	},
	noHighlight: {
		paddingHorizontal: 10,
		paddingVertical: 2,
		marginTop: 5
	}
});

export default DynamicTabViewScrollHeader;