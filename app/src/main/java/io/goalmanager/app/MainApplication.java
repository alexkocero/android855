package io.goalmanager.app;

import android.app.Application;
import android.util.Log;

// Capacitor import statement commented out to fix build errors
// import com.getcapacitor.CapConfig;
// import com.getcapacitor.PluginManager;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;

public class MainApplication extends Application {
    private static final String TAG = "MainApplication";

    @Override
    public void onCreate() {
        super.onCreate();
        
        // Google AdMob'u başlat
        initAdMob();
    }
    
    /**
     * AdMob reklamları için initialization
     */
    private void initAdMob() {
        MobileAds.initialize(this, new OnInitializationCompleteListener() {
            @Override
            public void onInitializationComplete(InitializationStatus initializationStatus) {
                Log.d(TAG, "AdMob SDK başarıyla başlatıldı");
            }
        });
    }
}