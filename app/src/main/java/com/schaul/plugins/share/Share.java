/**
 * 
 * Phonegap share plugin for Android
 * Kevin Schaul 2011
 *
 */

package com.schaul.plugins.share;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.R.drawable;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.text.Html;

import com.sknv.SportKamasutraActivity;
import com.sknv.R;

public class Share extends Plugin {

	@Override
	public PluginResult execute(String action, JSONArray args, String callbackId) {
		try {
			JSONObject jo = args.getJSONObject(0);
			doSendIntent(jo.getString("subject"), jo.getString("text"));
			return new PluginResult(PluginResult.Status.OK);
		} catch (JSONException e) {
			return new PluginResult(PluginResult.Status.JSON_EXCEPTION);
		}
	}

	private void doSendIntent(String subject, String text) {
		
//		text = "<!DOCTYPE html><html><body>" + text + "</body></html>";
		
		Intent sendIntent = new Intent(android.content.Intent.ACTION_SEND, Uri.parse("mailto:"));
		sendIntent.setType("text/html");
		sendIntent.putExtra(android.content.Intent.EXTRA_SUBJECT, subject);
		ImageGetter ig = new ImageGetter();
		sendIntent.putExtra(android.content.Intent.EXTRA_TEXT,
				Html.fromHtml(text, ig, null));
		
		
//		Intent sendIntent;
//
//		sendIntent = new Intent(Intent.ACTION_SEND);
//		sendIntent.putExtra(Intent.EXTRA_SUBJECT, "Test Subject");
//		sendIntent.putExtra(Intent.EXTRA_TEXT, "Test Text");
//		sendIntent.putExtra(Intent.EXTRA_STREAM, Uri.parse("file:///android_asset/www/img/Muskelpartien/Frau/MuskelpartienFrau1.png"));
//		sendIntent.setType("image/jpeg");

//
//		 File file = new File("/android_asset/www/" + image);
//		 sendIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
//		 sendIntent.setType("image/jpeg");
//		 sendIntent.putExtra(Intent.EXTRA_STREAM,
//		 Uri.parse("file://"+"/android_asset/www/" + image));

		this.cordova.startActivityForResult(this, sendIntent, 0);
	}
	
	private class ImageGetter implements Html.ImageGetter
	{
	    public Drawable getDrawable(String source)
	    {
	    	Drawable d = null;
			try {
				//InputStream issrc = new FileInputStream(new File("/android_asset/www/thozi_daClick.mp3"));
				//InputStream src = imageFetch(source);
				
				InputStream open = SportKamasutraActivity.assetManager.open("www/" + source);
				d = Drawable.createFromStream(open, "src");
				if (d != null) {
					d.setBounds(0, 0, d.getIntrinsicWidth(),
							d.getIntrinsicHeight());
				}
			} catch (MalformedURLException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}

			return d;
	    }
	    
	    public InputStream imageFetch(String source)
				throws MalformedURLException, IOException {
			URL url = new URL(source);
			Object o = url.getContent();
			InputStream content = (InputStream) o;
			// add delay here (see comment at the end)
			return content;
		}
	};

}