package io.goalmanager.app;

import android.app.Activity;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.OnUserEarnedRewardListener;
import com.google.android.gms.ads.RequestConfiguration;
import com.google.android.gms.ads.rewarded.RewardItem;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

import java.util.Arrays;

public class AdMobPlugin {
    private static final String TAG = "AdMobPlugin";
    private final Activity activity;
    private final WebView webView;
    private RewardedAd rewardedAd;
    private boolean isLoading = false;
    
    public AdMobPlugin(Activity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
        
        setupAdMob();
    }
    
    private void setupAdMob() {
        MobileAds.initialize(activity, initializationStatus -> {
            Log.d(TAG, "AdMob SDK initialized");
            
            // Reklam test cihazlarını ayarla (geliştirme sırasında)
            RequestConfiguration configuration = new RequestConfiguration.Builder()
                .setTestDeviceIds(Arrays.asList("ABCDEF012345"))
                .build();
            MobileAds.setRequestConfiguration(configuration);
            
            // Uygulama başlatıldığında ilk reklamı yükle
            loadRewardedAd();
        });
    }
    
    private void loadRewardedAd() {
        if (isLoading) {
            return;
        }
        
        isLoading = true;
        
        // AdMob test reklamlı ödül ID'si (geliştirme sırasında)
        // Gerçek uygulamada bunu kendi AdMob ID'niz ile değiştirin
        String adUnitId = "ca-app-pub-3940256099942544/5224354917"; // Test ID
        
        AdRequest adRequest = new AdRequest.Builder().build();
        
        RewardedAd.load(activity, adUnitId, adRequest, new RewardedAdLoadCallback() {
            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                Log.e(TAG, "Ödüllü reklam yüklenemedi: " + loadAdError.getMessage());
                rewardedAd = null;
                isLoading = false;
                
                // JavaScript'e reklam yükleme hatası bildir
                notifyJavaScript("onAdFailedToLoad", loadAdError.getMessage());
                
                // Birkaç saniye sonra tekrar yüklemeyi dene
                new Handler(Looper.getMainLooper()).postDelayed(() -> {
                    loadRewardedAd();
                }, 60000); // 1 dakika sonra tekrar dene
            }
            
            @Override
            public void onAdLoaded(@NonNull RewardedAd ad) {
                Log.d(TAG, "Ödüllü reklam başarıyla yüklendi");
                rewardedAd = ad;
                isLoading = false;
                
                // JavaScript'e reklam yükleme başarısını bildir
                notifyJavaScript("onAdLoaded", "success");
                
                // Reklam gösterim geri çağrılarını ayarla
                setupRewardedAdCallbacks();
            }
        });
    }
    
    private void setupRewardedAdCallbacks() {
        if (rewardedAd == null) {
            return;
        }
        
        rewardedAd.setFullScreenContentCallback(new FullScreenContentCallback() {
            @Override
            public void onAdClicked() {
                Log.d(TAG, "Reklama tıklandı");
            }
            
            @Override
            public void onAdDismissedFullScreenContent() {
                Log.d(TAG, "Reklam kapatıldı");
                rewardedAd = null;
                
                // JavaScript'e reklamın kapatıldığını bildir
                notifyJavaScript("onAdClosed", "ad_closed");
                
                // Yeni bir reklam yükle
                loadRewardedAd();
            }
            
            @Override
            public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                Log.e(TAG, "Reklam gösterilemedi: " + adError.getMessage());
                rewardedAd = null;
                
                // JavaScript'e reklam gösterme hatasını bildir
                notifyJavaScript("onAdFailedToShow", adError.getMessage());
                
                // Yeni bir reklam yükle
                loadRewardedAd();
            }
            
            @Override
            public void onAdImpression() {
                Log.d(TAG, "Reklam gösterimi kaydedildi");
            }
            
            @Override
            public void onAdShowedFullScreenContent() {
                Log.d(TAG, "Reklam tam ekran gösterildi");
                
                // JavaScript'e reklamın gösterildiğini bildir
                notifyJavaScript("onAdShowed", "ad_showed");
            }
        });
    }
    
    @JavascriptInterface
    public void showRewardedAd() {
        if (rewardedAd == null) {
            Log.e(TAG, "Gösterilecek reklam yok, yeni reklam yükleniyor...");
            notifyJavaScript("onAdNotReady", "no_ad_available");
            loadRewardedAd();
            return;
        }
        
        activity.runOnUiThread(() -> {
            rewardedAd.show(activity, new OnUserEarnedRewardListener() {
                @Override
                public void onUserEarnedReward(@NonNull RewardItem rewardItem) {
                    Log.d(TAG, "Kullanıcı ödül kazandı: " + rewardItem.getAmount() + " " + rewardItem.getType());
                    
                    // JavaScript'e ödül bilgisini gönder
                    notifyJavaScript("onRewardEarned", rewardItem.getAmount() + "");
                }
            });
        });
    }
    
    @JavascriptInterface
    public boolean isRewardedAdReady() {
        return rewardedAd != null;
    }
    
    private void notifyJavaScript(String event, String data) {
        String script = String.format("javascript:window.dispatchEvent(new CustomEvent('admob', " +
                "{detail: {event: '%s', data: '%s'}}));", event, data);
        
        activity.runOnUiThread(() -> {
            webView.evaluateJavascript(script, null);
        });
    }
}