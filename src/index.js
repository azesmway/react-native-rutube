import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { WebView } from './WebView';
import { EventEmitter } from 'events';

const CUSTOM_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36';

// export interface IRutube {
//   source: string;
//   width: number;
//   height: number;
//   webViewStyle: ViewStyle;
//   webViewProps: ViewStyle;
//   forceAndroidAutoplay: boolean;
//   onFullScreenChange: (_status: any) => void;
// }

// export interface IVideoData extends Response {
//   video?: {
//     embed_url?: string;
//   };
// }

const RutubeView = ({
  source,
  width,
  height,
  webViewStyle,
  webViewProps,
  forceAndroidAutoplay = false,
  onFullScreenChange = (_status) => {},
}) => {
  const webViewRef = useRef(null);
  const eventEmitter = useRef(new EventEmitter());
  const [playUrl, setPlayUrl] = useState('');
  const [video, setVideo] = useState({});

  const fetchVideoData = async (url) => {
    const videoData = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (videoData && videoData.result) {
      setVideo(videoData.result);

      if (videoData.result.video && videoData.result.video.embed_url) {
        setPlayUrl(videoData.result.video.embed_url);
      }
    }
  };

  useEffect(() => {
    fetchVideoData(source).then(() => {});
  }, [source]);

  const onWebMessage = useCallback(
    (event) => {
      try {
        const message = JSON.parse(event.nativeEvent.data);

        switch (message.eventType) {
          case 'fullScreenChange':
            onFullScreenChange(message.data);
            break;
          default:
            eventEmitter.current.emit(message.eventType, message.data);
            break;
        }
      } catch (error) {
        console.warn(error);
      }
    },
    [onFullScreenChange]
  );

  const renderLoading = () => {
    return (
      <View
        style={{
          height,
          width,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}
      >
        <ActivityIndicator animating size="large" color={'#037aff'} />
      </View>
    );
  };

  const MAIN_SCRIPT = () => {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    >
    <style>
      body {
        margin: 0;
      }
      .container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;
      }
      .video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
      }
    </style>
  </head>
  <body>
    <iframe
      width="${width}"
      height="${height}"
      src="${playUrl}"
      frameborder="0"
      allowfullscreen
      allow="encrypted-media">
    </iframe>
  </body>
</html>`;
  };

  return (
    <View style={{ height, width }}>
      <WebView
        bounces={false}
        originWhitelist={['*']}
        scalesPageToFit={true}
        scrollEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback
        style={[styles.webView, webViewStyle]}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={true}
        startInLoadingState={true}
        renderLoading={renderLoading}
        automaticallyAdjustContentInsets={false}
        userAgent={
          forceAndroidAutoplay
            ? Platform.select({ android: CUSTOM_USER_AGENT, ios: '' })
            : ''
        }
        {...webViewProps}
        source={MAIN_SCRIPT()}
        ref={webViewRef}
        onMessage={onWebMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  webView: { backgroundColor: 'transparent' },
});

export default RutubeView;
