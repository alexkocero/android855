package io.goalmanager.app;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class GoalManagerWebViewClient extends WebViewClient {
    
    private NetworkManager networkManager;
    private boolean errorOccurred = false;

    public GoalManagerWebViewClient() {
        super();
    }
    
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        String url = request.getUrl().toString();
        Context context = view.getContext();
        
        // NetworkManager henüz başlatılmadıysa başlat
        if (networkManager == null) {
            networkManager = new NetworkManager(context);
        }
        
        // İnternet bağlantısını kontrol et
        if (!networkManager.isNetworkAvailable()) {
            showConnectionErrorDialog(context, view, url);
            return true;
        }
        
        // app.goalmanager.io domainini veya goalmanager.io domainini doğrudan WebView'da aç
        if (url.contains("goalmanager.io")) {
            return false; // WebView tarafından yüklenmesine izin ver
        }
        
        // Paylaşma URL'lerini ele alın
        if (url.startsWith("whatsapp:") || url.startsWith("tg:") || 
            url.startsWith("facebook:") || url.startsWith("twitter:") ||
            url.startsWith("intent:") || url.startsWith("mailto:") || 
            url.startsWith("sms:") || url.startsWith("tel:")) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                context.startActivity(intent);
                return true;
            } catch (Exception e) {
                Toast.makeText(context, "Bu işlemi gerçekleştirecek bir uygulama bulunamadı", Toast.LENGTH_SHORT).show();
                return true;
            }
        }
        
        // Diğer URL'ler için tarayıcı kullan
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            context.startActivity(intent);
            return true;
        } catch (Exception e) {
            Toast.makeText(context, "Bağlantı açılamadı", Toast.LENGTH_SHORT).show();
            return true;
        }
    }
    
    @Override
    public void onPageStarted(WebView view, String url, Bitmap favicon) {
        super.onPageStarted(view, url, favicon);
        
        // Sayfanın yüklenmeye başladığını bildir
        Context context = view.getContext();
        errorOccurred = false;
        
        // NetworkManager henüz başlatılmadıysa başlat
        if (networkManager == null) {
            networkManager = new NetworkManager(context);
        }
    }
    
    @Override
    public void onPageFinished(WebView view, String url) {
        super.onPageFinished(view, url);
        
        // Hata oluşmadıysa ve sayfa yüklendiyse
        if (!errorOccurred) {
            // Sayfa yüklendiğinde mobil uyumluluk için CSS enjekte et
            String css = "body { -webkit-text-size-adjust: 100%; } " +
                         "* { max-width: 100%; box-sizing: border-box; } " +
                         "@media (max-width: 768px) { .container { width: 100% !important; padding: 0 10px; } }";
            
            String js = "var style = document.createElement('style');" +
                        "style.innerHTML = '" + css + "';" +
                        "document.head.appendChild(style);";
            
            view.evaluateJavascript(js, null);
            
            // Sayfaları görüntüsünü iyileştirme
            view.evaluateJavascript(
                "document.querySelector('meta[name=\"viewport\"]').setAttribute('content', " +
                "'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');", null);
        }
    }
    
    @Override
    public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
        super.onReceivedError(view, request, error);
        
        // Ana URL yüklenirken hata oluşursa
        if (request.isForMainFrame()) {
            errorOccurred = true;
            Context context = view.getContext();
            
            // NetworkManager henüz başlatılmadıysa başlat
            if (networkManager == null) {
                networkManager = new NetworkManager(context);
            }
            
            // İnternet bağlantısı yoksa kullanıcıya bildir
            if (!networkManager.isNetworkAvailable()) {
                showConnectionErrorDialog(context, view, view.getUrl());
            }
        }
    }
    
    /**
     * İnternet bağlantı hatası dialog'unu gösterir
     */
    private void showConnectionErrorDialog(Context context, final WebView webView, final String url) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle(context.getString(R.string.connection_error));
        builder.setMessage(context.getString(R.string.please_check_connection));
        builder.setPositiveButton(context.getString(R.string.try_again), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                if (networkManager.isNetworkAvailable()) {
                    // Sayfayı yeniden yükle
                    webView.loadUrl(url);
                } else {
                    Toast.makeText(context, context.getString(R.string.no_internet), Toast.LENGTH_SHORT).show();
                    showConnectionErrorDialog(context, webView, url);
                }
            }
        });
        builder.setNegativeButton(context.getString(R.string.close), null);
        builder.setCancelable(false);
        builder.show();
    }
}