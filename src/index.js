import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { WebView } from './WebView';

const RutubeView = ({ source, width, height, webViewStyle, webViewProps }) => {
  const webViewRef = useRef(null);
  const [playUrl, setPlayUrl] = useState('');
  const [video, setVideo] = useState({});

  const fetchVideoData = async (url) => {
    const videoId = url
      .substring(url.indexOf('video/') + 6, url.length)
      .replace('/', '');
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

    try {
      const videoData = await videoJson.json();

      if (videoData && videoData.result) {
        setVideo(videoData.result);

        if (videoData.result.video && videoData.result.video.embed_url) {
          setPlayUrl(videoData.result.video.embed_url);
        }
      }
    } catch (error) {
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
