package io.goalmanager.app;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

public class NetworkManager {
    
    private Context context;
    
    public NetworkManager(Context context) {
        this.context = context;
    }
    
    /**
     * İnternet bağlantısının aktif olup olmadığını kontrol eder
     * @return bağlantı varsa true, yoksa false
     */
    public boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager = (ConnectivityManager) 
            context.getSystemService(Context.CONNECTIVITY_SERVICE);
        
        if (connectivityManager != null) {
            NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
            return activeNetworkInfo != null && activeNetworkInfo.isConnected();
        }
        
        return false;
    }
    
    /**
     * WiFi bağlantısının aktif olup olmadığını kontrol eder
     * @return WiFi bağlantısı varsa true, yoksa false
     */
    public boolean isWifiConnected() {
        ConnectivityManager connectivityManager = (ConnectivityManager) 
            context.getSystemService(Context.CONNECTIVITY_SERVICE);
        
        if (connectivityManager != null) {
            NetworkInfo networkInfo = connectivityManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
            return networkInfo != null && networkInfo.isConnected();
        }
        
        return false;
    }
    
    /**
     * Mobil veri bağlantısının aktif olup olmadığını kontrol eder
     * @return Mobil veri bağlantısı varsa true, yoksa false
     */
    public boolean isMobileDataConnected() {
        ConnectivityManager connectivityManager = (ConnectivityManager) 
            context.getSystemService(Context.CONNECTIVITY_SERVICE);
        
        if (connectivityManager != null) {
            NetworkInfo networkInfo = connectivityManager.getNetworkInfo(ConnectivityManager.TYPE_MOBILE);
            return networkInfo != null && networkInfo.isConnected();
        }
        
        return false;
    }
}