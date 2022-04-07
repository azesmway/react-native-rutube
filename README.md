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
  source={'https://rutube.ru/video/ec3602e67e169a4a904deb059b873bb4/'}
  width={400}
  height={200}
/>

// ...
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
