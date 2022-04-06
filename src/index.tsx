import {
  requireNativeComponent,
  UIManager,
  Platform,
  ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package '@azesmway/react-native-rutube' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

type ReactNativeRutubeProps = {
  color: string;
  style: ViewStyle;
};

const ComponentName = 'ReactNativeRutubeView';

export const ReactNativeRutubeView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<ReactNativeRutubeProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
