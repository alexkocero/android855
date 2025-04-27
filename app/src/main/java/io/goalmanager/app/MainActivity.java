package io.goalmanager.app;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;
import com.getcapacitor.BridgeActivity;
// import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
    
    private NetworkManager networkManager;
    private AdMobPlugin adMobPlugin;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Ağ bağlantısı yöneticisi
        networkManager = new NetworkManager(this);
        
        // İnternet bağlantısını kontrol et
        if (!networkManager.isNetworkAvailable()) {
            showNetworkErrorDialog();
            return;
        }

        // Özel eklentileri kaydet - registerPlugin metodu için try-catch eklendi
        try {
            // Capacitor plugin'lerini kaydet
            registerPlugin(WebViewPlugin.class);
        } catch (Exception e) {
            Log.e("MainActivity", "Plugin kayıt hatası: " + e.getMessage());
        }

        // WebView'ı optimize et
        WebView webView = getBridge().getWebView();
        configureWebView(webView);
        
        // AdMob plugin'i başlat
        adMobPlugin = new AdMobPlugin(this, webView);
    }

    private void configureWebView(WebView webView) {
        WebSettings settings = webView.getSettings();

        // JavaScript ve web storage etkinleştir
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);

        // Dosya erişimlerini yapılandır
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);

        // Önbellek ayarları
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        // Mobil görünüm ayarları
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        
        // Performans optimizasyonu
        settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
        settings.setAppCacheEnabled(true);
        
        // Diğer optimizasyonlar
        webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);
        
        // Özel WebViewClient ata
        webView.setWebViewClient(new GoalManagerWebViewClient());
        
        // JQuery ve modernizr gibi kütüphanelerin düzgün çalışması için
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        
        // Mediaları otomatik oynatma özelliği
        settings.setMediaPlaybackRequiresUserGesture(false);
        
        // JavaScript arayüzü ekle - AdMob
        webView.addJavascriptInterface(new Object() {
            @android.webkit.JavascriptInterface
            public void showRewardedAd() {
                if (adMobPlugin != null) {
                    adMobPlugin.showRewardedAd();
                }
            }
            
            @android.webkit.JavascriptInterface
            public boolean isRewardedAdReady() {
                return adMobPlugin != null && adMobPlugin.isRewardedAdReady();
            }
        }, "AdMobBridge");
        
        // Sayfayı temizle ve ana URL'ye yönlendir
        webView.clearCache(true);
        webView.clearHistory();
        webView.clearFormData();
    }
    
    /**
     * İnternet bağlantı hatası dialog'unu gösterir
     */
    private void showNetworkErrorDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Bağlantı Hatası");
        builder.setMessage("İnternet bağlantınız yok. Lütfen WiFi veya mobil veri bağlantınızı kontrol edip tekrar deneyiniz.");
        builder.setPositiveButton("Tekrar Dene", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                if (networkManager.isNetworkAvailable()) {
                    recreate(); // Aktiviteyi yeniden başlat
                } else {
                    Toast.makeText(MainActivity.this, "Hala internet bağlantısı yok!", Toast.LENGTH_SHORT).show();
                    showNetworkErrorDialog();
                }
            }
        });
        builder.setNegativeButton("Kapat", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                finish(); // Uygulamayı kapat
            }
        });
        builder.setCancelable(false);
        builder.show();
    }
    
    @Override
    public void onBackPressed() {
        WebView webView = getBridge().getWebView();
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}