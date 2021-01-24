import React from 'react';
import {
  View,
  Dimensions,
  FlatList,
  StyleSheet,
  ColorValue,
} from 'react-native';
import DynamicTabViewScrollHeader from './DynamicTabViewScrollHeader';
import PropTypes from 'prop-types';
export interface DynamicTabProps {
  defaultIndex: Number,
  containerStyle: StyleSheet,
  headerContainerStyle: StyleSheet,
  headerBackgroundColor: ColorValue,
  headerTextStyle: StyleSheet,
  headerActiveTextStyle: StyleSheet,
  headerUnderlayColor: ColorValue,
  highlightStyle: StyleSheet,
  data: any,
  tabContainerStyle: StyleSheet
  noHighlightStyle: StyleSheet,
  extraData: any,
  renderTab: CallableFunction,
  onChangeTab: CallableFunction
}
const DynamicTabView: React.FC<DynamicTabProps> = (props) => {
  const { containerStyle,
    headerContainerStyle,
    headerBackgroundColor,
    headerTextStyle,
    headerActiveTextStyle,
    headerUnderlayColor,
    highlightStyle,
    tabContainerStyle,
    noHighlightStyle,
    extraData,
    data, ...restProps } = props;
  const [index, setIndex] = React.useState(props.defaultIndex ? props.defaultIndex : 0);
  const [containerWidth, setContainerWidth] = React.useState(Dimensions.get("window").width);
  const viewConfigRef = React.useRef({
    viewAreaCoveragePercentThreshold: 60,
  })
  const flatListRef = React.useRef(null);
  const scrollHeaderRef = React.useRef(null);
  const [isRunWithOnPress, setIsRunWithOnPress] = React.useState(false);
  const getItemLayout = (data, index) => ({
    length: containerWidth,
    offset: containerWidth * index,
    index
  });

  const goToPage = (index, withOnPress) => {
    flatListRef?.current?.scrollToIndex({ index });
    scrollHeaderRef?.current?.scrollToIndex({ index });
    if (props.onChangeTab) {
      props.onChangeTab(index);
    }
    setIndex(index)
    setIsRunWithOnPress(withOnPress)
  };
  const onViewableItemsChanged = React.useRef(({ viewableItems, changed }) => {
    if (viewableItems && viewableItems.length > 0 && !isRunWithOnPress) {
      goToPage(viewableItems[0].index, false)
    }

  });
  const onLayout = e => {
    const { width } = e.nativeEvent.layout;
    setContainerWidth(width)
  };
  const RenderHeader = () => {
    return (
      <View
        style={[
          styles.headerContainer,
          headerContainerStyle
        ]}
      >
        <DynamicTabViewScrollHeader
          data={data}
          goToPage={goToPage}
          scrollHeaderRef={scrollHeaderRef}
          selectedTab={index}
          headerBackgroundColor={headerBackgroundColor}
          headerTextStyle={headerTextStyle}
          headerActiveTextStyle={headerActiveTextStyle}
          headerUnderlayColor={headerUnderlayColor}
          highlightStyle={highlightStyle}
          noHighlightStyle={noHighlightStyle}
          extraData={extraData}
        />
      </View>
    );
  };
  const RenderTab = ({ item, index }) => {
    return (
      <View
        style={[
          { width: containerWidth },
          styles.tabContainer,
          tabContainerStyle
        ]}
      >
        {props.renderTab(item, index)}
      </View>
    );
  };
  return (
    <View
      onLayout={onLayout}
      style={[styles.container, containerStyle]}
    >
      {RenderHeader()}
      <FlatList
        data={data}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        ref={flatListRef}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        renderItem={RenderTab}
        scrollEventThrottle={10}
        keyboardDismissMode={"on-drag"}
        pagingEnabled={true}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfigRef.current}
      />
    </View>
  );

}

const styles: any = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    backgroundColor: "white"
  },
  tabContainer: {
    flex: 1
  },
  labelStyle: {
    color: "white"
  },
  indicatorStyle: {
    backgroundColor: "white",
    marginVertical: 1,
    bottom: 4, //indicatorStyle is implemented in absolute in the library
    height: 4
  }
});

export default DynamicTabView;