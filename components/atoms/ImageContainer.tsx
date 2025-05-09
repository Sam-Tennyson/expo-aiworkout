import React from 'react';
import { ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';
import { Image, ImageContentFit, ImageContentPosition } from 'expo-image';

export default function ImageContainer(props: {
  source: ImageSourcePropType;
  styleNative?: StyleProp<ImageStyle>;
  styleWeb?: StyleProp<ImageStyle>;
  contentFit?: ImageContentFit;
  blurRadius?: number;
  prefixClassWeb?: string; // used in its corresponding .web file
  contentPosition?: ImageContentPosition;
}) {
  const { source, contentFit, styleNative, blurRadius, contentPosition } = props;
  return (
    <Image
      contentPosition={contentPosition}
      source={source}
      style={styleNative}
      contentFit={contentFit}
      blurRadius={blurRadius}
    />
  );
}
