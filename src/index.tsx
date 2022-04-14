import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { WebView } from 'react-native-webview';

interface IProps {
  source: string;
  width: number;
  height: number;
  webViewStyle?: ViewStyle;
  webViewProps?: any;
}

const RutubeView = ({
  source,
  width,
  height,
  webViewStyle,
  webViewProps,
}: IProps) => {
  const webViewRef = useRef(null);
  const [playUrl, setPlayUrl] = useState('');

  const fetchVideoData = async (url: string) => {
    let videoId: string = '';

    if (url.indexOf('pl_video=') > -1) {
      videoId = url.substring(url.indexOf('pl_video=') + 9, url.length);
    } else if (url.indexOf('video/') > -1) {
      videoId = url
        .substring(url.indexOf('pl_video=') + 6, url.length)
        .replace('/', '');
    } else if (url.indexOf('embed/') > -1) {
      videoId = url
        .substring(url.indexOf('embed/') + 6, url.length)
        .replace('/', '');
    }

    if (videoId === '') {
      console.error('Video id not recognized: ', videoId);

      return;
    }

    try {
      const metaUrl = `https://rutube.ru/pangolin/api/web/video/${videoId}/?pageType=video&client=wdp`;
      const videoJson = await fetch(metaUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!videoJson.ok) {
        console.error('The request resulted in an error: ', url, videoJson);

        return;
      }

      const videoData = await videoJson.json();

      if (videoData && videoData.result) {
        if (videoData.result.video && videoData.result.video.embed_url) {
          setPlayUrl(videoData.result.video.embed_url);
        }
      }
    } catch (error) {
      // @ts-ignore
      console.error('Error parse json', error.message);
    }
  };

  useEffect(() => {
    fetchVideoData(source);
  }, [source]);

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
        <ActivityIndicator animating size="large" color={'#ccc'} />
      </View>
    );
  };

  const getHtmlCode = () => {
    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    >
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

    return { html };
  };

  if (playUrl === '') {
    return renderLoading();
  }

  return (
    <View style={{ height, width }}>
      <WebView
        useWebKit={Platform.OS !== 'web'}
        source={getHtmlCode()}
        ref={webViewRef}
        bounces={false}
        originWhitelist={['*']}
        scalesPageToFit={true}
        scrollEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback
        style={[styles.webView, webViewStyle]}
        allowsFullscreenVideo={true}
        startInLoadingState={true}
        renderLoading={renderLoading}
        automaticallyAdjustContentInsets={false}
        {...webViewProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  webView: { backgroundColor: 'transparent' },
});

export default RutubeView;
