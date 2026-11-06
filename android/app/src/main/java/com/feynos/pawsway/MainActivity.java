package com.feynos.pawsway;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.JavascriptInterface;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Iterator;

public class MainActivity extends Activity {
    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setSupportMultipleWindows(true);
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                Uri u = req.getUrl();
                if ("file".equals(u.getScheme())) return false;
                openExternal(u);
                return true;
            }
        });
        // target="_blank" links (Google Maps) open in the Maps app or browser
        web.setWebChromeClient(new android.webkit.WebChromeClient() {
            @Override
            public boolean onCreateWindow(WebView view, boolean isDialog, boolean userGesture, android.os.Message resultMsg) {
                WebView.HitTestResult r = view.getHitTestResult();
                String url = r.getExtra();
                if (url != null) openExternal(Uri.parse(url));
                return false;
            }
        });
        web.addJavascriptInterface(new Bridge(), "PawswayNative");
        setContentView(web);
        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl("file:///android_asset/index.html");
    }

    /** Lets the page call Google's Routes API without browser CORS limits. Only HTTPS to googleapis.com is allowed. */
    class Bridge {
        @JavascriptInterface
        public void request(final String id, final String method, final String url, final String headersJson, final String body) {
            new Thread(() -> {
                int status = 0;
                String text;
                try {
                    URL u = new URL(url);
                    if (!"https".equals(u.getProtocol()) || !u.getHost().endsWith(".googleapis.com")) throw new Exception("Blocked host");
                    HttpURLConnection c = (HttpURLConnection) u.openConnection();
                    c.setConnectTimeout(15000);
                    c.setReadTimeout(30000);
                    c.setRequestMethod(method);
                    JSONObject h = new JSONObject(headersJson == null ? "{}" : headersJson);
                    for (Iterator<String> it = h.keys(); it.hasNext(); ) { String k = it.next(); c.setRequestProperty(k, h.getString(k)); }
                    if (body != null && !body.isEmpty()) {
                        c.setDoOutput(true);
                        try (OutputStream os = c.getOutputStream()) { os.write(body.getBytes(StandardCharsets.UTF_8)); }
                    }
                    status = c.getResponseCode();
                    InputStream is = status >= 400 ? c.getErrorStream() : c.getInputStream();
                    ByteArrayOutputStream bo = new ByteArrayOutputStream();
                    if (is != null) { byte[] buf = new byte[8192]; int n; while ((n = is.read(buf)) > 0) bo.write(buf, 0, n); is.close(); }
                    text = bo.toString("UTF-8");
                } catch (Exception e) {
                    text = "Network error: " + e.getMessage();
                }
                final String js = "window.__pwCb(" + JSONObject.quote(id) + "," + status + "," + JSONObject.quote(text) + ")";
                runOnUiThread(() -> web.evaluateJavascript(js, null));
            }).start();
        }
    }

    private void openExternal(Uri u) {
        try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) { }
    }

    @Override protected void onSaveInstanceState(Bundle out) { super.onSaveInstanceState(out); web.saveState(out); }
    @Override public void onBackPressed() { if (web.canGoBack()) web.goBack(); else super.onBackPressed(); }
}
