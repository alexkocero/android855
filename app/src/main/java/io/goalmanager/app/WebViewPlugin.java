package io.goalmanager.app;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.webkit.JavascriptInterface;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WebViewPlugin")
public class WebViewPlugin extends Plugin {
    private static final String TAG = "WebViewPlugin";

    /**
     * Bu metot, web sayfasından referans kodunu paylaşmak için kullanılır
     */
    @PluginMethod
    public void shareReferralCode(PluginCall call) {
        try {
            String referralCode = call.getString("referralCode", "");
            String message = call.getString("message", "Goal Manager uygulamasına davet edildiniz!");
            
            if (referralCode.isEmpty()) {
                call.reject("Referans kodu gereklidir");
                return;
            }
            
            // Varsayılan mesaj
            if (message.isEmpty()) {
                message = "Merhaba Goal Manager projesinde madencilik yaparak GM Coin kazanmak için uygulamayi indir " + 
                          referralCode + " referans kodumu kullanarak üye ol birlikte kazanalim. https://goalmanager.io";
            }
            
            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("text/plain");
            shareIntent.putExtra(Intent.EXTRA_TEXT, message);
            
            getContext().startActivity(Intent.createChooser(shareIntent, "Referans Kodu Paylaş"));
            
            JSObject result = new JSObject();
            result.put("success", true);
            call.resolve(result);
        } catch (Exception e) {
            Log.e(TAG, "Referans kodu paylaşılırken hata oluştu", e);
            call.reject("Referans kodu paylaşılırken hata oluştu: " + e.getMessage());
        }
    }
    
    /**
     * Bu metot web sayfasından diğer uygulamalara link açmak için kullanılır
     */
    @PluginMethod
    public void openExternalUrl(PluginCall call) {
        try {
            String url = call.getString("url", "");
            
            if (url.isEmpty()) {
                call.reject("URL gereklidir");
                return;
            }
            
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            getContext().startActivity(intent);
            
            JSObject result = new JSObject();
            result.put("success", true);
            call.resolve(result);
        } catch (Exception e) {
            Log.e(TAG, "Harici URL açılırken hata oluştu", e);
            call.reject("Harici URL açılırken hata oluştu: " + e.getMessage());
        }
    }
    
    /**
     * Bu metot ağ durumunu kontrol etmek için kullanılır
     */
    @PluginMethod
    public void checkNetworkStatus(PluginCall call) {
        try {
            NetworkManager networkManager = new NetworkManager(getContext());
            boolean isConnected = networkManager.isNetworkAvailable();
            boolean isWifi = networkManager.isWifiConnected();
            boolean isMobileData = networkManager.isMobileDataConnected();
            
            JSObject result = new JSObject();
            result.put("connected", isConnected);
            result.put("wifi", isWifi);
            result.put("mobileData", isMobileData);
            call.resolve(result);
        } catch (Exception e) {
            Log.e(TAG, "Ağ durumu kontrol edilirken hata oluştu", e);
            call.reject("Ağ durumu kontrol edilirken hata oluştu: " + e.getMessage());
        }
    }
}