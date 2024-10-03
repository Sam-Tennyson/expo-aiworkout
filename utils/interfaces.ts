import { Href } from 'expo-router';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface INavbarTabs {
  label: string;
  path: any;
}

export interface ITabItem {
  key: string;
  value: string;
  path: Href<string | object>;
}

export interface ICustomSwitch {
  isEnabled: boolean;
  toggleSwitch: () => void;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export interface IAddWorkoutModalProps {
  isModalVisible: boolean;
  headerTitle: string;
  closeModal: () => void;
  children: React.ReactNode;
  footerChildren?: React.ReactNode;
}
