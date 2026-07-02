package com.avivare.app;

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
            // Disable native overscroll/rubber-banding
            webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
            
            // Set custom WebViewClient extending BridgeWebViewClient
            webView.setWebViewClient(new BridgeWebViewClient(this.bridge) {
                @Override
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    injectCustomScriptsAndHideSplash(view);
                }

                @Override
                public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                    super.onReceivedError(view, request, error);
                    // Fallback to hide splash screen if page load fails
                    injectCustomScriptsAndHideSplash(view);
                }
            });
        }
    }

    @Override
    public void onBackPressed() {
        WebView webView = this.bridge.getWebView();
        if (webView != null && webView.canGoBack()) {
            webView.goBack(); // Go back in WebView history
        } else {
            super.onBackPressed(); // Default behavior (exit app)
        }
    }

    private void injectCustomScriptsAndHideSplash(WebView view) {
        // Inject JavaScript to set user-select: none, -webkit-touch-callout: none, and overscroll-behavior: none on body
        // Also hide the splash screen once page load finishes
        String js = "(function() {" +
                    "  var style = document.createElement('style');" +
                    "  style.type = 'text/css';" +
                    "  style.innerHTML = 'body { -webkit-user-select: none !important; user-select: none !important; -webkit-touch-callout: none !important; overscroll-behavior: none !important; }';" +
                    "  document.head.appendChild(style);" +
                    "  if (document.body) {" +
                    "    document.body.style.webkitUserSelect = 'none';" +
                    "    document.body.style.userSelect = 'none';" +
                    "    document.body.style.webkitTouchCallout = 'none';" +
                    "  }" +
                    "  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SplashScreen) {" +
                    "    window.Capacitor.Plugins.SplashScreen.hide();" +
                    "  }" +
                    "})();";
        view.evaluateJavascript(js, null);
    }
}
