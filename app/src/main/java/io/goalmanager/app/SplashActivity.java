package io.goalmanager.app;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {

    private static final int SPLASH_DISPLAY_LENGTH = 2000; // 2 saniye
    private NetworkManager networkManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        // Ağ bağlantısı kontrolcüsünü oluştur
        networkManager = new NetworkManager(this);

        // Logo animasyonu
        ImageView logoImageView = findViewById(R.id.splash_logo);
        TextView appNameTextView = findViewById(R.id.app_name);
        ProgressBar loadingSpinner = findViewById(R.id.loading_spinner);

        // Fade-in animasyonu
        AlphaAnimation fadeIn = new AlphaAnimation(0.0f, 1.0f);
        fadeIn.setDuration(1000);
        fadeIn.setFillAfter(true);

        logoImageView.startAnimation(fadeIn);
        appNameTextView.startAnimation(fadeIn);

        // Logo animasyonu bitince ana aktiviteye geçiş yap
        fadeIn.setAnimationListener(new Animation.AnimationListener() {
            @Override
            public void onAnimationStart(Animation animation) {
                loadingSpinner.setVisibility(View.VISIBLE);
            }

            @Override
            public void onAnimationEnd(Animation animation) {
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        // İnternet bağlantısını kontrol et
                        if (!networkManager.isNetworkAvailable()) {
                            // Bağlantı yoksa ana aktiviteye yönlendir,
                            // MainActivity içinde hata mesajı gösterilecek
                        }

                        // Ana aktiviteye geçiş
                        Intent mainIntent = new Intent(SplashActivity.this, MainActivity.class);
                        startActivity(mainIntent);
                        finish();
                    }
                }, SPLASH_DISPLAY_LENGTH);
            }

            @Override
            public void onAnimationRepeat(Animation animation) {
                // Animasyon tekrarı durumunda
            }
        });
    }
}