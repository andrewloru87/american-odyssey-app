import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';
export default function Root({ children }: PropsWithChildren) {
  return <html lang="en"><head>
    <meta charSet="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#171717" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Wanna" />
    <link rel="manifest" href="/manifest.json" />
    <ScrollViewStyleReset />
    <style dangerouslySetInnerHTML={{__html:`html,body,#root{height:100%;margin:0;background:#F7F7F5}body{overscroll-behavior-y:none;-webkit-font-smoothing:antialiased}`}} />
  </head><body>{children}</body></html>;
}
