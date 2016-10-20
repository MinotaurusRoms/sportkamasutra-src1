package com.schaul.plugins.share;

import com.sknv.SportKamasutraActivity;

public class Language {

	  private SportKamasutraActivity mGap;

	  public Language(SportKamasutraActivity gap)
	  {
	    mGap = gap;
	  }

	  public String getLanguage(){
	    return mGap.getResources().getConfiguration().locale.toString();
	  }
	  
	  public boolean getSound(){
	    return mGap.soundEnabled;
	  }
	  
	  public void setSound(boolean sound) {
		  mGap.soundEnabled = sound;
		  if (mGap.soundEnabled){
			  mGap.player.start();
		  }
		  else {
			  mGap.player.pause();
		  }
	  }

}
