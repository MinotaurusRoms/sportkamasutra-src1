package com.sknv;

import org.apache.cordova.DroidGap;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.AssetManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings.Secure;

import com.google.android.apps.analytics.GoogleAnalyticsTracker;
import com.schaul.plugins.share.Language;
import com.sknv.R;
import com.test.vending.licensing.AESObfuscator;
import com.test.vending.licensing.LicenseChecker;
import com.test.vending.licensing.LicenseCheckerCallback;
import com.test.vending.licensing.Policy;
import com.test.vending.licensing.ServerManagedPolicy;

public class SportKamasutraActivity extends DroidGap {
	
	public static AssetManager assetManager;
	private Language language;
	public MediaPlayer player; 
	public boolean soundEnabled = false;
	
    /** Called when the activity is first created. */
    public void start() {
        language = new Language(this);
        appView.addJavascriptInterface(language, "AndroidLanguage");
        assetManager = getAssets();
        
        super.loadUrl("file:///android_asset/www/index.html", 4000);
        
        // Play Background Sound
        player = MediaPlayer.create(this, R.raw.backgroundsound);
        if (player != null){
        	player.setLooping(true); // Set looping 
            player.setVolume(100,100); 
        }
    }
    
	@Override
	protected void onPause() {
		super.onPause();
		if (player != null && player.isPlaying()){
			player.pause();
		}
	}

	@Override
	protected void onResume() {
		super.onResume();
		if (player != null && soundEnabled){
			player.start();
		}
	};
	
	
	
	
	
	
	
	
	private static final String BASE64_PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnEX/PT7X9MECS6wntHPHGxXecrLzj2Y4wmRz7wpypK8TY59GdkoV7gipHzVlL+xSbpR3QsyIqIqDfDNQlckkY8Ny6jLUANqdV35jgWVmqlnKcZWNfR8doCN3XK6AIB0QBlpAC/1HZ+sAuHzNXWKWmu8TZNo2SncZFA/pn3tFYBohvmZTkx/FDZJ1RhiqER8fuyoDxr+z1VGZu1t6f8S3fEst9mLliCRluunGtI14Jlkcn5dVdYjf1KijJ5cnu+z7TPu995lbAIDgqyKntcJLWqKutGUFkuAcH3LCEzRhKarbklbYmK7eIdWXo2vXbUq/wZTjK3s46KuKism5UfkBXwIDAQAB";

	// Generate your own 20 random bytes, and put them here.
	private static final byte[] SALT = new byte[] {
	     -46, 65, 30, -128, -103, -57, 74, -64, 51, 88, -95,
	     -45, 77, -117, -33, -113, -11, 32, -64, 89
	     };

	private LicenseCheckerCallback mLicenseCheckerCallback;
	private LicenseChecker mChecker;
	// A handler on the UI thread.
	private Handler mHandler;
	private GoogleAnalyticsTracker tracker;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		/* START LVL */
		
		super.onCreate(savedInstanceState);
        super.init();
        super.setIntegerProperty("splashscreen", R.drawable.ic_launcher);
        
        tracker = GoogleAnalyticsTracker.getInstance();

        // Start the tracker in manual dispatch mode...
        tracker.startNewSession("UA-35907632-1", this);
		
//		requestWindowFeature(Window.FEATURE_INDETERMINATE_PROGRESS);
//		setContentView(R.layout.main);

		mHandler = new Handler();

		// Try to use more data here. ANDROID_ID is a single point of attack.
		String deviceId = Secure.getString(getContentResolver(),
				Secure.ANDROID_ID);

		// Library calls this when it's done.
		mLicenseCheckerCallback = new MyLicenseCheckerCallback();
		// Construct the LicenseChecker with a policy.
		mChecker = new LicenseChecker(this, new ServerManagedPolicy(this,
				new AESObfuscator(SALT, getPackageName(), deviceId)),
				BASE64_PUBLIC_KEY);
//		doCheck();
		start();
		/* END LVL */
	}

	protected Dialog onCreateDialog(int id) {
		final boolean bRetry = id == 1;
		return new AlertDialog.Builder(this)
				.setTitle(R.string.unlicensed_dialog_title)
				.setMessage(
						bRetry ? R.string.unlicensed_dialog_retry_body
								: R.string.unlicensed_dialog_body)
				.setPositiveButton(
						bRetry ? R.string.retry_button : R.string.buy_button,
						new DialogInterface.OnClickListener() {
							boolean mRetry = bRetry;

							public void onClick(DialogInterface dialog,
									int which) {
								if (mRetry) {
									doCheck();
								} else {
									Intent marketIntent = new Intent(
											Intent.ACTION_VIEW,
											Uri.parse("http://market.android.com/details?id="
													+ getPackageName()));
									startActivity(marketIntent);
								}
							}
						})
				.setNegativeButton(R.string.quit_button,
						new DialogInterface.OnClickListener() {
							public void onClick(DialogInterface dialog,
									int which) {
								finish();
							}
						}).create();
	}

	private void doCheck() {
//		setProgressBarIndeterminateVisibility(true);
		mChecker.checkAccess(mLicenseCheckerCallback);
	}

	private void displayResult(final String result) {
		mHandler.post(new Runnable() {
			public void run() {
//				setProgressBarIndeterminateVisibility(false);
			}
		});
	}

	private void displayDialog(final boolean showRetry) {
		mHandler.post(new Runnable() {
			public void run() {
//				setProgressBarIndeterminateVisibility(false);
				showDialog(showRetry ? 1 : 0);
			}
		});
	}

	private class MyLicenseCheckerCallback implements LicenseCheckerCallback {
		public void allow(int policyReason) {
			if (isFinishing()) {
				// Don't update UI if Activity is finishing.
				return;
			}
			// Should allow user access.
			displayResult(getString(R.string.allow));

			start();
		}

		public void dontAllow(int policyReason) {
			if (isFinishing()) {
				// Don't update UI if Activity is finishing.
				return;
			}
			displayResult(getString(R.string.dont_allow));
			// Should not allow access. In most cases, the app should assume
			// the user has access unless it encounters this. If it does,
			// the app should inform the user of their unlicensed ways
			// and then either shut down the app or limit the user to a
			// restricted set of features.
			// In this example, we show a dialog that takes the user to Market.
			// If the reason for the lack of license is that the service is
			// unavailable or there is another problem, we display a
			// retry button on the dialog and a different message.
			displayDialog(policyReason == Policy.RETRY);
		}

		public void applicationError(int errorCode) {
			if (isFinishing()) {
				// Don't update UI if Activity is finishing.
				return;
			}
			// This is a polite way of saying the developer made a mistake
			// while setting up or calling the license checker library.
			// Please examine the error code and fix the error.
//			String result = String.format(
//					getString(R.string.application_error), errorCode);
//			displayResult(result);
			displayDialog(false);
		}

//		private void startMainActivity() {
//			Intent myIntent = new Intent(LicenseCheck.this, SportKamasutraActivity.class);
//			LicenseCheck.this.startActivity(myIntent);
//			finish();
//		}
	}

	@Override
	public void onDestroy() {
		super.onDestroy();
		mChecker.onDestroy();
		
		// Stop the tracker when it is no longer needed.
	    tracker.stopSession();
	}
	
	
}