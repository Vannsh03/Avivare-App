package com.avviare.crm;

import android.os.Bundle;
import android.view.View;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        WebView webView = this.bridge.getWebView();
        if (webView != null) {
            // 1. Disable native overscroll/rubber-banding
            webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
            
            // 2. Disable long-press contextual menus
            webView.setOnLongClickListener(new View.OnLongClickListener() {
                @Override
                public boolean onLongClick(View v) {
                    return true;
                }
            });
            
            // 3. Set custom WebViewClient extending BridgeWebViewClient
            webView.setWebViewClient(new BridgeWebViewClient(this.bridge) {
                @Override
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    injectLocalAssetsAndHideSplash(view);
                }

                @Override
                public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                    super.onReceivedError(view, request, error);
                    injectLocalAssetsAndHideSplash(view);
                }
            });
        }
    }

    @Override
    public void onBackPressed() {
        WebView webView = this.bridge.getWebView();
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    private void injectLocalAssetsAndHideSplash(WebView view) {
        // Read local JS asset
        String jsContent = readAssetFile("public/assets/native-modifier.js");
        if (jsContent != null) {
            view.evaluateJavascript(jsContent, null);
        }

        // Read local CSS asset
        String cssContent = readAssetFile("public/assets/native-theme.css");
        if (cssContent != null) {
            String escapedCss = cssContent.replace("\\", "\\\\")
                                          .replace("'", "\\'")
                                          .replace("\n", "\\n")
                                          .replace("\r", "\\r");
            String injectCssJs = "(function() {" +
                                 "  var style = document.createElement('style');" +
                                 "  style.type = 'text/css';" +
                                 "  style.innerHTML = '" + escapedCss + "';" +
                                 "  document.head.appendChild(style);" +
                                 "})();";
            view.evaluateJavascript(injectCssJs, null);
        }

        // Hide Splash Screen (always run as fallback/success)
        String hideSplashJs = "(function() {" +
                              "  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SplashScreen) {" +
                              "    window.Capacitor.Plugins.SplashScreen.hide();" +
                              "  }" +
                              "})();";
        view.evaluateJavascript(hideSplashJs, null);
    }

    private String readAssetFile(String filePath) {
        try {
            java.io.InputStream is = this.getAssets().open(filePath);
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            return new String(buffer, "UTF-8");
        } catch (java.io.IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
