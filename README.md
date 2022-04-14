# @azesmway/react-native-rutube

React Native Rutube plugin

## Installation

```sh
npm install @azesmway/react-native-rutube react-native-webview

or

yarn add @azesmway/react-native-rutube react-native-webview
```



## Usage

```js
import RutubeView from "@azesmway/react-native-rutube";

// ...

<RutubeView
  source={'https://rutube.ru/video/3754df0851ce78756a6ca0e0a95689fc/'}
  width={400}
  height={200}
/>

// ...
```

#### Links supported

```js
https://rutube.ru/video/3754df0851ce78756a6ca0e0a95689fc/
https://rutube.ru/play/embed/3754df0851ce78756a6ca0e0a95689fc
https://rutube.ru/pl/?pl_id&pl_type&pl_video=3754df0851ce78756a6ca0e0a95689fc
```

#### Props
- `source: string` - url rutube video
- `width: number` - Rutube width component
- `height: number` - Rutube height component
- `webViewStyle?: ViewStyle` - style for RutubeView
- `webViewProps?: {}` - props for WebView

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
