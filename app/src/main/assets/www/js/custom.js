var lang;
var muskeln = [];
var test = false;
var debug = true;

var historyback = 0;
var maxpositioncount = 72;

var options = $.jStorage.get('musicsettings',  { backgroundmusic: false, buttonmusic: false });

if (debug) {
	console.log('settings test: ' + test)
	console.log('settings debug: ' + debug)
	console.log('androidlang: start');
}
var androidlang = '';
if (test) androidlang = navigator.language;
else androidlang = window.AndroidLanguage.getLanguage();
if (debug) console.log('androidlang: ' + androidlang);

var langabbr = 'en';
if (androidlang.indexOf("de") > -1) {
	langabbr = 'de';
} else if (androidlang.indexOf("es") > -1) {
	langabbr = 'es';
} else if (androidlang.indexOf("fr") > -1) {
	langabbr = 'fr';
} else if (androidlang.indexOf("it") > -1) {
	langabbr = 'it';
} else if (androidlang.indexOf("ko") > -1) {
	langabbr = 'ko';
} else if (androidlang.indexOf("ru") > -1) {
	langabbr = 'ru';
} else if (androidlang.indexOf("zh") > -1) {
	langabbr = 'zh';
}
//langabbr = 'de';

var databasename = 'SportKamasutra' + langabbr;

var backgroundmusic = null;
//var buttonmusic = null;


if (test) onDeviceReady();
else {
	//Wait for PhoneGap to load
	//
	document.addEventListener("deviceready", onDeviceReady, false);
}

//PhoneGap is ready
//
function onDeviceReady() {
	if (debug) console.log('onDeviceReady');
	
	if (debug) console.log('onDeviceReady: open Database');
	  var db = window.openDatabase(databasename + "DB", "1.0", databasename, 400000);
	  db.transaction(populateDB, errorCB, successCB);
  
	  if (options.backgroundmusic){
		  setSettings();
	  }
	  
	  document.addEventListener("backbutton", function(e){
	    if ($.mobile.activePage.is('#home1')){
	        e.preventDefault();
	        navigator.app.exitApp();
	    }
	    else {
	        navigator.app.backHistory()
	    }
	}, false);
	  
//  if (typeof Media === "function"){
//		backgroundmusic = new Media("/android_asset/www/Loop_BillyInstrumental_16bit_22k.mp3", // success callback
//	        function() {
//	            console.log("playAudio():Audio Success");
//	            if (options.backgroundmusic){
//	      		  backgroundmusic.play();
//	            }
//	        },
//	        // error callback
//	        function(err) {
//	            console.log("playAudio():Audio Error: "+err);
//	        });
//		buttonmusic = new Media("/android_asset/www/thozi_daClick.mp3");
		
//		options.backgroundmusic = true;
//		if (debug) console.log("backgroundmusic: "+ typeof backgroundmusic);
//		if (debug) console.log("options.backgroundmusic: "+ options.backgroundmusic);
//		if (options.backgroundmusic && typeof backgroundmusic === "object"){
//			  backgroundmusic.play();
//			  setSettings();
//	      }
//	}
}

$.ajax({
	type: 'GET',
	url: 'lang_'+langabbr+'.json',
	dataType: 'json',
	beforeSend: function(){
		console.log('Lade Sprachdatei...');
	},
	success: function(data) {
		   console.log('Sprachdatei erfolgreich geladen.');
		   lang = data;
		   
		   var i = 0;
		   function setMuskel(filename, label, text){
			   	muskeln[i] = {};
				muskeln[i].filename = filename;
				muskeln[i].label = label;
				muskeln[i++].text = text;
		   }
		   
		   setMuskel('MuskelBiceps', 'M. biceps brachii', lang["This muscle is a double-headed muscle and is simply called biceps. It is responsible for almost all pulling motions."]);
		   setMuskel('MuskelTriceps', 'M. triceps brachii', lang["The triceps is a three-headed muscle and it is the antagonistic muscle of the biceps. It is situated on the back of the upper arm and it is responsible for the extension of the arm."]);
		   setMuskel('MuskelAbdominis', 'M. rectus abdominis', lang["This muscle is one of the most aesthetic muscles. It is also known as the six pack. It is responsible for flexing the torso."]);
		   setMuskel('MuskelLatissimus', 'M. latissimus dorsi', lang["This muscle is the broadest muscle of the back. It powers all pulling motions and helps provide a V-shaped torso."]);
		   setMuskel('MuskelGluteus', 'M. gluteus', lang["It is the largest muscle of the body. The muscle is responsible for the extension and stabilization of the thighs."]);
		   setMuskel('MuskelPectoralis', 'M. pectoralis', lang["This muscle group is situated at the chest. It is responsible for pulling up the arms to the body."]);
			// diese Muskeln werden nur im Wissenbereich angezeigt
		   setMuskel('MuskelAdductor', 'M. adductor', lang["There are two types of adductors: the adductor longus, the adductor magnus and the adductor brevis. These muscles are responsible for pulling up the leg. The antagonistic muscles are the abductors."]);
		   setMuskel('MuskelDeltoideus', 'M. deltoideus', lang["This muscle can be divided into three areas. It is also known as the deltoid muscle. It is responsible for frontal lifting movements."]);
		   setMuskel('MuskelErectorSpinae', 'M. erector spinae', lang["This muscle is responsible for spinal extension."]);
		   setMuskel('MuskelIschiocrurale', 'M. ischiocrurale', lang["This muscle is also known as the hamstring. It is primarily responsible for squats and hip extensions."]);
		   setMuskel('MuskelQuadricepts', 'M. quadriceps', lang["This muscle is the four-headed muscle of the femur. It is responsible for the extension of the knee joint and enables the extension out of the squat. It is one of the strongest muscles."]);
		   setMuskel('MuskelSternocleidomastoideus', 'M. sternocleido.', lang["This double-headed muscle is also known as the sternomastoid. It is located on both sides of the neck."]);
		   setMuskel('MuskelTrapezius', 'M. trapezius', lang["This muscle is composed of three parts. It extends from the shoulders to the spine and is shaped triangularly."]);
		   setMuskel('MuskelTricepsSurae', 'M. triceps surae', lang["This muscle is three-headed and also known as the calf muscle. It is responsible for jumping and running."]);
		   
		   initLanguage();
		   
	   },
	 error: function (jqXHR, textStatus, errorThrown){
		 console.log('Sprachdatei Fehler: ' + textStatus);
		 console.log('Sprachdatei Fehler: ' + errorThrown);
	 }
});

var domready;
function initLanguage(){
	if (typeof lang === 'undefined' || typeof domready === 'undefined'){
		return;
	}
	
	if (debug) console.log('initLanguage: start');
	
	$('img.headerimg').attr('src', 'img/Sonstige/' + lang["Header_en.png"]);
	
	$('#home1 #categorylink > span').text(lang["Categories"]);	
	$('#home1 #all >  span').text(lang["All"]);	
	$('#home1 #notdone > span').text(lang["Not Done"]);	
	$('#home1 #done > span').text(lang["Done"]);	
	$('#home1 #like > span').text(lang["I Like"]);	
	$('#home1 #wish > span').text(lang["Wish"]);	
	$('#home1 #profi > span').text(lang["Professional"]);	
	$('#home1 #knowledge > span').text(lang["Knowledge"]);	
	$('#home1 #randomize > span').text(lang["Random"]);
	
	$('#home1 #tipps > span').text(lang["Hints"]);
	$('#home1 #settings > span').text(lang["Settings"]);
	$('#home1 #settings_page h1').text(lang["Settings"]);
	$('#home1 #feedback > span').text(lang["Feedback"]);
	$('#home1 #suggest > span').text(lang["Rate"]);
	$('#home1 #facebook > span').text(lang["Facebook"]);
	$('#home1 #twitter > span').text(lang["Twitter"]);
	$('#home1 #likeus > span').text(lang["Suggest"]);
	$('#home1 #website > span').text(lang["Website"]);
	$('#home1 #website').attr('href', 'http://sportkamasutra.com?app=android&lang=' + langabbr);
	$('#home1 #aboutus > span').text(lang["About us"]);
	
	$('#category .backbutton .text, #home1 h1').text(lang["Overview"]);
	$('#category h1').text(lang["Categories"]);
	$('#category #category_belastungsgrad > span').text(lang["Strain level"]);
	$('#category #category_mann > span').text(lang["Male"]);
	$('#category #category_frau > span').text(lang["Female"]);
	$('#category #category_intimitaetsgrad > span').text(lang["Intimicy level"]);
	$('#category #category_sportarten > span').text(lang["Sports"]);
	$('#category #category_muskulatur > span').text(lang["Musculature"]);
	
	$('#home1 h1').text(lang["More"]);
	$('#position_page #muscle > span.muscle_label').text(lang["Musclegroup"]);	
	$('#knowledge_page .backbutton .text').text(lang["Overview"]);	
	$('#muscle_page_man .backbutton .text').text(lang["Back"]);	
	$('#muscle_page_woman .backbutton .text').text(lang["Back"]);	
	$('#knowledge_details_page .backbutton .text').text(lang["Back"]);
	
	$('#settings_page .backbutton .text').text(lang["Back"]);
	var settings = $('#settings_page .contentlinks');
	settings.find('.backgroundmusic > div > div').text(lang["Music"]);
//	settings.find('.buttonmusic > div > div').text(lang["Button sounds"]);
	settings.find('.video > div > div').text(lang["Video"]);
	
	$('#muscle_page_man .overlay .first, #muscle_page_woman .overlay .first').text(lang["Primary:"]);
	$('#muscle_page_man .overlay .sec, #muscle_page_woman .overlay .sec').html(lang["Secondary:"]);
	
	$('#position_page .toolbar-bottom .cancel').text(lang["Cancel"]);
	
	$('#position_page .done span').text(lang["Done"]);
	$('#position_page .like span').text(lang["I Like"]);
	$('#position_page .wish span').text(lang["Wish"]);
	
	if (debug) console.log('initLanguage: end');
}

$(document).ready(function() {
	
	domready = true;
	initLanguage();
	
	/*
	*
	*   HOME / Overview
	*
	*/
	$('#home1').swipeleft(function(){
		$.mobile.changePage("#home2", { transition: "slide"});
	});
	$('#home2').swiperight(function(){
		$.mobile.changePage("#home1", { transition: "slide", reverse: true});
	});
	
	$('#categorylink').click(function(){
		sessionStorage.selecteditem = null;
	});
	$('#all').click(function(){
		sessionStorage.selecteditem = null;
		changePageToPreviewPage($(this), '', 'home1', lang["Overview"]);
	});
	$('.selecteditems').click(function(){
		sessionStorage.selecteditem = $(this).data().selected;
		changePageToPreviewPage($(this), '', 'home1', lang["Overview"]);
	});
	$('#profi').click(function(){
		sessionStorage.selecteditem = null;
		changePageToPreviewPage($(this), 'profi', 'home1', lang["Overview"]);
	});
	$('#knowledge').click(function(){
		sessionStorage.selecteditem = null;
		sessionStorage.knowledge_h1_label = $(this).find('span').text();
		$.mobile.changePage("#knowledge_page", { transition: "none"});
	});
	$('#randomize').click(function(){
		sessionStorage.selecteditem = 'randomize';
		sessionStorage.position_backpage = 'home1';
		sessionStorage.id = Math.floor(Math.random()*(maxpositioncount+1));
		historyback = 0;
		$.mobile.changePage("#position_page", { transition: "none"});
	});
	
	
	
	/*
	*
	*   HOME 2 / Overview
	*
	*/
	$('#tipps').click(function(){
		var text = 	'<p class="farnham">' + lang["Almost all positions demand the entire body and therefore represent a full-body workout. The display of the primary and secondary muscles serves to illustrate the focus of each exercise."] + '</p>' +
					'<p class="farnham">' + lang["A special feature of this App is the intimacy level. It is divided into three different areas: low, medium and high. The level of intimacy points out a recommendation that shows how intimate and personal a certain position is. The higher the level of intimacy the more intimate and personal is the position."] + '</p>' +
					'<p class="farnham">' + lang["The level of intimacy is influenced by the following facts:"] + '</p>' +
					'<div class="farnham">' + lang["-    The length of the relationship\n-    Trust of the partner\n-    Age of the partners\n-    Sexual experience of both partners"] + '</div>' +
					'<p class="farnham">' + lang["Remember your personal hygiene! A good personal hygiene is essential when it comes to sexual practices. Therefore talk to your partner about everything beforehand without any taboos. \n\nIt is important not to expect too much from your partner. You should start off with easy positions before you devote yourself to more professional ones."] + '</p>' +
					'<p class="farnham">' + lang["Sports:\nUnder the heading sports you will find all the positions that help you improve at a specific sport. If you choose Basketball for example, you will see all the positions that help you improve at that specific sport. The demanded muscle groups of the sport are the same ones used during the positions."] + '</p>';
		
		sessionStorage.knowledge_detail_h1_label = $(this).find('span').text();
		sessionStorage.knowledge_text = text;
		sessionStorage.knowledge_back_page = 'home2';
		$.mobile.changePage("#knowledge_details_page", { transition: "none"});
	});
	$('#aboutus').click(function(){
		var text = 	'My Media Concepts<br /><br />' +
		'Andreas Schwenn<br />' +
		'Vogelsang 54<br />' +
		'68723 Schwetzingen<br /><br />' +
		'Kontakt<br /><br />' +
		'Mobil 01522/5219466<br />' +
		'E-Mail: Sportkamasutra@gmail.com<br />' +
		'www.sportkamasutra.com<br />' +
		'<p>Created by Arasch M. & Sohil Y.</p>' +
		'<p>Music by Cornelius Bender</p>';
		
		sessionStorage.knowledge_detail_h1_label = $(this).find('span').text();
		sessionStorage.knowledge_text = text;
		sessionStorage.knowledge_back_page = 'home2';
		$.mobile.changePage("#knowledge_details_page", { transition: "none"});
	});
	$('#settings').click(function(){
		$.mobile.changePage("#settings_page", { transition: "none"});
	});
	
	
	
	
	/* Kategorien Seite */
	$('#category_belastungsgrad').click(function(){
		changePageToPreviewPage($(this), 'belastungsgrad', 'category', lang["Back"]);
	});
	$('#category_mann').click(function(){
		changePageToPreviewPage($(this), 'mann', 'category', lang["Back"]);
	});
	$('#category_frau').click(function(){
		changePageToPreviewPage($(this), 'frau', 'category', lang["Back"]);
	});
	$('#category_intimitaetsgrad').click(function(){
		changePageToPreviewPage($(this), 'intimitaetsgrad', 'category', lang["Back"]);
	});
	$('#category_sportarten').click(function(){
		sessionStorage.themelist_backpage = 'category';
		sessionStorage.themelist_backpage_label = lang["Back"];
		sessionStorage.themelist_h1_label = $(this).find('span').text();
		sessionStorage.theme = 'sports';
		$.mobile.changePage("#themelist", { transition: "none"});
	});
	$('#category_muskulatur').click(function(){
		sessionStorage.themelist_backpage = 'category';
		sessionStorage.themelist_backpage_label = lang["Back"];
		sessionStorage.themelist_h1_label = $(this).find('span').text();
		sessionStorage.theme = 'muscle';
		$.mobile.changePage("#themelist", { transition: "none"});
	});
	
	function changePageToPreviewPage(clickelement, category, backpage, backpage_label){
		sessionStorage.position_backpage = 'preview_page';
		sessionStorage.category = category;
		sessionStorage.backpage = backpage;
		sessionStorage.backpage_label = backpage_label;
		sessionStorage.preview_h1_label = $(clickelement).find('span').text();
		$.mobile.changePage("#preview_page", { transition: "none"});
	}
	
	/* Klick auf die Sportart */
	$('.sports_link').live('click', function(){
		sessionStorage.category = 'sports';
		sessionStorage.backpage = 'themelist';
		sessionStorage.backpage_label = lang["Back"];
		sessionStorage.themeid = $(this).data().id;
		sessionStorage.preview_h1_label = $(this).find('span').text();
		$.mobile.changePage("#preview_page", { transition: "none"});
	});
	/* Klick auf die Muskulatur */
	$('.muscle_link').live('click', function(){
		sessionStorage.category = 'muscle';
		sessionStorage.backpage = 'themelist';
		sessionStorage.backpage_label = lang["Back"];
		sessionStorage.themeid = $(this).data().id;
		sessionStorage.preview_h1_label = $(this).find('span').text();
		$.mobile.changePage("#preview_page", { transition: "none"});
	});
	
//	$('#muscle_page_man .switchleft').click(function(e){
//		if (debug) console.log('(#muscle_page_man .switchleft).click');
//		e.stopPropagation();
//		e.preventDefault();
//		$.mobile.changePage("#position_page", { transition: "none"});
//	});
//	$('#muscle_page_man .switchright').click(function(e){
//		if (debug) console.log('(#muscle_page_man .switchright).click');
//		e.stopPropagation();
//		e.preventDefault();
//		$.mobile.changePage("#muscle_page_woman", { transition: "none"});
//	});
//	$('#muscle_page_man .muscle_homelink a').click(function(e){
//		if (debug) console.log('(#muscle_page_man .muscle_homelink a).click');
//		e.stopPropagation();
//		e.preventDefault();
//		$.mobile.changePage("#home1", { transition: "flip"});
//	});
//	$('#muscle_page_woman .switchleft').click(function(e){
//		if (debug) console.log('(#muscle_page_woman .switchleft).click');
//		e.stopPropagation();
//		e.preventDefault();
//		$.mobile.changePage("#muscle_page_man", { transition: "none"});
//	});
//	$('#muscle_page_woman .muscle_homelink a').click(function(e){
//		if (debug) console.log('(#muscle_page_woman .muscle_homelink a).click');
//		e.stopPropagation();
//		e.preventDefault();
//		$.mobile.changePage("#home1", { transition: "flip"});
//	});
	
	/*
	*
	*   themelist Page
	*
	*/

	$('#themelist').bind('pageshow', function() {
    	
    	var page = $('#themelist');
		page.find('.ui-title').empty().append(sessionStorage.themelist_h1_label);
		
		var backbutton = page.find('.backbutton');
		backbutton.attr('href', '#' + sessionStorage.themelist_backpage);
		backbutton.find('.text').text(sessionStorage.themelist_backpage_label);
    	
    	var content = $('#themelist .contentlinks');
        content.empty();
    	
    	if (sessionStorage.theme === 'sports'){
    		runSql(function (tx) {
    			tx.executeSql('SELECT * FROM Sports', [], 
					function (tx, results) {
	    				var len = results.rows.length;
	    		        for (var i=0; i<len; i++){
	    		        	var item = results.rows.item(i);
	    		        	content.append($('<a data-id="'+item.ID+'" href="" data-transition="none" class="sports_link link">' +
	    		                 	'<img src="./img/Sportarten/'+item.ID+'Btn@2x.png" />' +
	    		                 	'<span>'+ lang[item.Sport] + '</span>' +
	    		                 '</a>'));
	    		        }
					},
					errorCB);
    		}, transactionsuccess);
    	}
    	else if (sessionStorage.theme === 'muscle'){
    		runSql(function (tx) {
    			tx.executeSql('SELECT * FROM Musclegroup', [], 
					function (tx, results) {
	    				var len = results.rows.length;
	    		        for (var i=0; i<len; i++){
	    		        	var item = results.rows.item(i);
	    		        	var filename = muskeln[parseInt(item.ID) - 1].filename;
	    		        	var label = muskeln[parseInt(item.ID) - 1].label;
	    		        	content.append($('<a data-id="'+item.ID+'" href="" data-transition="none" class="muscle_link">' +
	    		                 	'<img src="./img/Muskeln/'+ filename+'@2x.png" />' +
	    		                 	'<span>'+ label + '</span>' +
	    		                 '</a>'));
	    		        }
					},
					errorCB);
    		}, transactionsuccess);
    	}
    	
    });
	
	/*
	*
	*   Preview Page
	*
	*/
	
    $('#preview_page').bind('pageshow', function() {
    	historyback = 0;
    	
    	initPageLabel('preview_page');
    	
    	var page = $('#preview_page');
    	var content = page.find('.ui-content');
        var subheader = page.find('.subheader');
        subheader.empty();
        content.css('padding-top', '')
    	console.log('sessionStorage.category: ' + sessionStorage.category);
        if (sessionStorage.category === 'belastungsgrad'){
        	var low = '', middle = '', high = '';
        	if (sessionStorage.level == 2) {
        		high = 'active';
        	}
        	else if (sessionStorage.level == 1) {
        		middle = 'active';
        	}
        	else {
        		low = 'active';
        	}
        	subheader.append('<div class="category_buttons"><a data-item="0" class="low '+low+'" href="">'+lang["Low"]+'</a><a data-item="1" class="middle '+middle+'" href="">'+lang["Middle"]+'</a><a data-item="2" class="high '+high+'" href="">'+lang["High"]+'</a></div><div style="clear:both;"></div>');
        	content.css('padding-top', '60px')
        }
        else if (sessionStorage.category === 'intimitaetsgrad'){
        	var low = '', middle = '', high = '';
        	if (sessionStorage.level_intimicy == 2) {
        		high = 'active';
        	}
        	else if (sessionStorage.level_intimicy == 1) {
        		middle = 'active';
        	}
        	else {
        		low = 'active';
        	}
        	subheader.append('<div class="intimicy_buttons"><a data-item="0" class="low '+low+'" href="">'+lang["Low"]+'</a><a data-item="1" class="middle '+middle+'" href="">'+lang["Middle"]+'</a><a data-item="2" class="high '+high+'" href="">'+lang["High"]+'</a></div><div style="clear:both;"></div>');
        	content.css('padding-top', '60px')
        }
        else if (sessionStorage.category === 'sports' || sessionStorage.category === 'muscle'){
        	var man = '', woman = '';
        	if (sessionStorage.level_gender == 1) {
        		woman = 'active';
        	}
        	else {
        		man = 'active';
        	}
        	subheader.append('<div class="gender_buttons"><a data-item="0" class="man '+man+'" href=""><img src="img/mannBtn@2x_white.png" /></a><a data-item="1" class="woman '+woman+'" href=""><img src="img/frauBtn@2x_white.png" /></a></div><div style="clear:both;"></div>');
        	content.css('padding-top', '60px')
        }
        
        
        // Querys
		
    	if (sessionStorage.category === 'belastungsgrad'){
    		runSqlStrainLevel(sessionStorage.level);
    	}
    	else if (sessionStorage.category === 'mann'){
    		runSql(function (tx) {
        		tx.executeSql('SELECT * FROM Position where Male = "1"', [], 
        					initPagePreview,
        			    errorCB);
        		}, transactionsuccess);
    	}
    	else if (sessionStorage.category === 'frau'){
    		runSql(function (tx) {
    			tx.executeSql('SELECT * FROM Position where Female = "1"', [], 
    					initPagePreview,
    					errorCB);
    		}, transactionsuccess);
    	}
    	else if (sessionStorage.category === 'belastungsgrad'){
    		runSqlIntimicyLevel(sessionStorage.level_intimicy);
    	}
    	else if (sessionStorage.category === 'sports' || sessionStorage.category === 'muscle'){
    		runSqlSports(sessionStorage.level_gender);
    	}
    	else if (sessionStorage.category === 'profi'){
    		runSql(function (tx) {
    			tx.executeSql('SELECT * FROM Position where Pro = "1"', [], 
    					initPagePreview,
    					errorCB);
    		}, transactionsuccess);
    	}
    	else {
    		runSql(function (tx) {
        		tx.executeSql('SELECT * FROM Position', [], 
        					initPagePreview,
        			    errorCB);
        		}, transactionsuccess);
    	}
    	
    });
    
    function initPageLabel(pageid){
    	var page = $('#' + pageid);
		page.find('.ui-title').empty().append(sessionStorage.preview_h1_label);
		
		var backbutton = page.find('.backbutton');
		backbutton.attr('href', '#' + sessionStorage.backpage);
		backbutton.find('.text').text(sessionStorage.backpage_label);
    }
    
    var positionids = [];
    function initPagePreview(tx, results){
    	var page = $('#preview_page');
    	var content = page.find('.ui-content');
        content.empty();
        
        var subheader = page.find('.subheader');
        
        positionids = [];
        var len = results.rows.length;
        console.log('initPagePreview rows: ' + len);
        for (var i=0; i<len; i++){
        	var item = results.rows.item(i);
        	var userdata = loadUserData(item.ID);
        	
        	if (sessionStorage.selecteditem != null){
        		if (sessionStorage.selecteditem === 'notdone' && userdata.done != false){
        			continue;
        		}
        		else if (sessionStorage.selecteditem === 'done' && userdata.done != true){
        			continue;
        		}
        		else if (sessionStorage.selecteditem === 'like' && userdata.like != true){
        			continue;
        		}
        		else if (sessionStorage.selecteditem === 'wish' && userdata.wish != true){
        			continue;
        		}
        	}
        	
        	positionids.push(parseInt(item.ID));
        	content.append($('<a href="#position_page" onClick="javascript:sessionStorage.id=\''+ item.ID + '\';" data-transition="none" class="preview">' +
					'<div class="tab">' +
						'<span class="done '+ (userdata.done ? 'active' : '') +'">&nbsp;</span>' +
						'<span class="like '+ (userdata.like ? 'active' : '') +'">&nbsp;</span>' +
						'<span class="wish '+ (userdata.wish ? 'active' : '') +'">&nbsp;</span>' +
					'</div>' +
					'<div class="previewimg"><img src="./img/Previews/Preview' + item.ID + '@2x.png" /></div>' +
					'<div class="subtitel">'+item.Title+'</div>' +
	            '</a>'));
        }
    }
    
    $('.category_buttons > a').live('click', function (){
    	sessionStorage.level = $(this).data().item;
    	$(this).siblings().removeClass('active');
    	$(this).addClass('active');
    	runSqlStrainLevel(sessionStorage.level);
    });
    $('.intimicy_buttons > a').live('click', function (){
    	sessionStorage.level_intimicy = $(this).data().item;
    	$(this).siblings().removeClass('active');
    	$(this).addClass('active');
    	runSqlIntimicyLevel(sessionStorage.level_intimicy);
    });
    $('.gender_buttons > a').live('click', function (){
    	sessionStorage.level_gender = $(this).data().item;
    	$(this).siblings().removeClass('active');
    	$(this).addClass('active');
    	runSqlSports(sessionStorage.level_gender);
    });
    
    function runSqlStrainLevel(strainlevel){
    	console.log('runSqlStrainLevel(strainlevel):' + strainlevel);
    	if (strainlevel != 1 && strainlevel != 2){
    		strainlevel = 0;
    	}
    	
    	console.log('runSqlStrainLevel(strainlevel):' + strainlevel);
    	runSql(function (tx) {
    		tx.executeSql('SELECT * FROM Position where StrainLevel = "' + strainlevel + '"', [], 
    					initPagePreview,
    			    errorCB);
    		}, transactionsuccess);
    }
    
    function runSqlIntimicyLevel(intimicylevel){
    	console.log('runSqlStrainLevel(intimicylevel):' + intimicylevel);
    	if (intimicylevel != 1 && intimicylevel != 2){
    		intimicylevel = 0;
    	}
    	
    	console.log('runSqlStrainLevel(intimicylevel):' + intimicylevel);
    	runSql(function (tx) {
    		tx.executeSql('SELECT * FROM Position where Intimicylevel = "' + intimicylevel + '"', [], 
    				initPagePreview,
    				errorCB);
    	}, transactionsuccess);
    }
    
    function runSqlSports(gender){
    	console.log('runSqlSports(gender):' + gender);
    	if (gender != 1){
    		gender = 0;
    	}
    	
    	var sql = '';
    	if (sessionStorage.category === 'sports'){
    		sql = 'SELECT * FROM Position2Sports where SportsID = '+sessionStorage.themeid+' and Gender = ' + gender;
    	}
    	else if (sessionStorage.category === 'muscle'){
    		sql = 'SELECT * FROM Position2Musclegroup where MusclegroupID = '+sessionStorage.themeid+' and Gender = ' + gender;
    	}
    	
    	if (debug) console.log('runSqlSports(gender):' + gender + ', sessionStorage.themeid: ' + sessionStorage.themeid);
    	runSql(function (tx) {
    		tx.executeSql(sql, [], 
    				function (tx, results) {
    					var ids = [];
    					var len = results.rows.length;
		    			for (var i=0; i<len; i++){
		    	        	var item = results.rows.item(i);
		    	        	ids.push('"' + item.PositionID + '"');
		    	        }
		    			
		    			console.log('ids: ' + ids);
		    			
		    			runSql(function (tx) {
		    	    		tx.executeSql('SELECT * FROM Position where ID in ('+ids.join(',')+')', [], 
		    	    				initPagePreview,
		    	    				errorCB);
		    	    	}, transactionsuccess);
    				},
    			errorCB);
    	}, transactionsuccess);
    }
    
    
    /*
	*
	*   Position Page
	*
	*/
    
    $('#position_page .overlay, #muscle_page_woman .overlay, #muscle_page_man .overlay').click(function() {
    	$(this).find('div').toggle('fast');
    });
    
    $('#position_page .subline, #muscle_page_woman .subline, #muscle_page_man .subline').click(function() {
    	$(this).next().find('div').toggle('fast');
    });
    
    $('#position_page').bind('pageshow', function() {
    	historyback = historyback - 1;
    	
    	var page = $('#position_page');
    	if (sessionStorage.position_backpage != null){
    		page.find('a.backbutton').attr('href', '#' + sessionStorage.position_backpage);
    		if (sessionStorage.position_backpage === 'home1'){
    			page.find('.backbutton .text').text(lang["Overview"]);
    		}
    		else {
    			page.find('.backbutton .text').text(lang["Back"]);
    		}
    	}
    	
    	page.find('.backbutton').click(function(e) {
    	    	if (debug) console.log('position_page .backbutton: ' + $(this).attr('href'));
    	    	
//    	    	if ($(this).attr('href') === '#' || $(this).attr('href') === '#preview_page'){
    	    		e.stopPropagation();
    	    		e.preventDefault();
    	    		
    	    		if (debug) console.log('historyback: ' + historyback);
    	    		
    	    		history.go(historyback);
//    	    	}
    	    });
    	
    	loadPositionPage();
    	
    });
    
    function loadPositionPage(){
		var page = $('#position_page');
    	
    	runSqlPosition(function (tx, results) {
			var position = results.rows.item(0);
			page.find('.ui-title').empty().append(position.Title).trigger('create');
			page.find('.subline').empty().append(position.MainDescription).trigger('create');
			page.find('.overlay div').empty().append(position.Description).trigger('create');
			
			if (debug) console.log('img src: ' + page.find('.mainimage').attr('src'));
			var mainimage = page.find('.mainimage');
			mainimage.remove();
			page.find('.ui-content').append('<img class="mainimage" src="./img/Stellungen/Stellung'+sessionStorage.id+'@2x.png" />').trigger('create');
			if (debug) console.log('img src: ' + page.find('.mainimage').attr('src'));
	    });
    	
    	
    	buttonsettings('done');
    	buttonsettings('like');
    	buttonsettings('wish');
    }
    
    function buttonsettings(type){
    	
    	//console.log('buttonsettings(type): ' + type);
    	
		$('.' + type, $('#position_page')).each(function(){
			setButtonState($(this), loadUserData()[type]);
        });
	}
    
    $('#position_page').swipeleft(function(){
    	changePositionPage('left');
    	loadPositionPage();
	}).swiperight(function(){
		changePositionPage('right');
		loadPositionPage();
	});
    
    $('#position_page .done').click(function(e){
    	e.stopPropagation();
		e.preventDefault();
    	setButtonStateForButton($(this), 'done');
    });
    $('#position_page .like').click(function(e){
    	e.stopPropagation();
		e.preventDefault();
    	setButtonStateForButton($(this), 'like');
    });
    $('#position_page .wish').click(function(e){
    	e.stopPropagation();
		e.preventDefault();
    	setButtonStateForButton($(this), 'wish');
    });
    
    function changePositionPage(directions){
    	if (sessionStorage.selecteditem == 'randomize'){
			sessionStorage.id = Math.floor(Math.random()*(maxpositioncount+1));			
		}
		else {
			//console.log('positionids: ' + positionids);
			var currentId = parseInt(sessionStorage.id);
			//console.log(directions+': currentId:' + currentId);
			do 
			{
				if (directions == 'left'){
					currentId++;
					if (currentId > maxpositioncount){
						currentId = 1;
					}
				}
				else if (directions == 'right'){
					currentId--;
					if (currentId < 1){
						currentId = maxpositioncount;
					}
				}
			} while (jQuery.inArray(currentId, positionids) === -1);
			//console.log(directions+': currentId:' + currentId);
			sessionStorage.id = '' + currentId;
		}
    }
    
    function setButtonStateForButton(button, buttontype){
    	var loadedUserdata = loadUserData();
    	loadedUserdata[buttontype] = !loadedUserdata[buttontype];
    	$.jStorage.set(sessionStorage.id, loadedUserdata);
    	setButtonState($(button), loadedUserdata[buttontype]);
    }
    
    function setButtonState(span, b_active){
    	//console.log('setButtonState(span, b_active): ' + b_active);
    	var imagepath = $(span).find('img').attr('src');
    	if (b_active){
    		if (imagepath.search(/Selected.png/) === -1){
    			$(span).find('img').attr('src', imagepath.replace('.png', 'Selected.png'));
    		}
    		$(span).addClass('active');
    	}
    	else {
    		$(span).find('img').attr('src', imagepath.replace('Selected.png', '.png'));
    		$(span).removeClass('active');
    	}
    }
    
    function loadUserData(id){
    	var userdata = { done: false, like: false, wish: false };
		var loadedUserdata;
		if (typeof id === "undefined"){
			loadedUserdata = $.jStorage.get(sessionStorage.id, userdata);
		}
		else {
			loadedUserdata = $.jStorage.get(id, userdata);
		}
		
		return loadedUserdata;
    }
    
	$('.sharebutton').click(function (e){
    	e.stopPropagation();
		e.preventDefault();
		
    	$('.toolbar-bottom').toggle();
    });
	
    $('.cancel').click(function (e){
    	e.stopPropagation();
		e.preventDefault();
		
    	$('.toolbar-bottom').toggle();
    });
    
    $('#postfacebook').click(function (e){
    	e.stopPropagation();
		e.preventDefault();
		
    	// Additional initialization code here
    		runSqlPosition(function (tx, results) {
        		var position = results.rows.item(0);
        		var obj = {
          	          method: 'feed',
          	          link: 'http://sportkamasutra.com?app=android&lang=' + langabbr,
          	          picture: 'http://sportkamasutra.com/img/Stellungen/Stellung'+sessionStorage.id+'@2x.png',
          	          name: position.Title,
          	          caption: position.MainDescription,
          	          description: position.Description,
          	          properties: [{ text: lang["Musculature"], href:'http://sportkamasutra.com/img/Muskelpartien/Mann/MuskelpartienMann'+sessionStorage.id+'.png'},{ text:lang["Musculature"], href:'http://sportkamasutra.com/img/Muskelpartien/Frau/MuskelpartienFrau'+sessionStorage.id+'.png'}],
          	          redirect_uri: 'http://sportkamasutra.com?app=android&redirect=true&lang=' + langabbr
          	        };
          	
    	      	FB.ui(obj, function (response) {
    	      		
    	      	});
        	});
    });
    
    //properties: ['1' : {'text':'sdf', 'href':'http://sportkamasutra.com/img/Muskelpartien/Mann/MuskelpartienMann'+sessionStorage.id+'.png'}],
    
    $('#postmail').click(function (){
    	
    	runSqlPosition(function (tx, results) {
    		
    		var body = '';
			var position = results.rows.item(0);
			
			body += '<a href="http://sportkamasutra.com">SportKamasutra App</a><br />';
			body += '<p>' + position.Title + '</p>';
			body += '<p>' + position.MainDescription + '</p>';
			body += '<p>' + position.Description + '</p>';
			body += '<img src="img/Muskelpartien/Mann/MuskelpartienMann'+sessionStorage.id+'.png" />';
			body += '<img src="img/Muskelpartien/Frau/MuskelpartienFrau'+sessionStorage.id+'.png" />';
			
			window.plugins.share.show({
	    	    subject: 'SportKamasutra',
	    	    text: body},
	    	    function() {}, // Success function
	    	    function() {alert('Share failed')} // Failure function
	    	);
			
	    });
    	
    	
    	
    });
    
    /*
	*
	*   Muscle Page Man
	*
	*/
    
    $('#muscle_page_man').bind('pageshow', function() {
    	
    	historyback = historyback - 1;
    	
    	if (debug) console.log('muscle_page_man pageshow');
    	
    	runSqlPosition(function (tx, results) {
    		prepareMusclePage(results, '#muscle_page_man', 'PrimaryMuscleMale', 'SecondaryMuscleMale', 'Mann/MuskelpartienMann');
	    });
    	
    });
    
    function getMuscleName(name){
    	if (debug) console.log('getMuscleName(name): ' + name);
    	if ($.trim(name) == ''){
    		return "-";//lang["Nothing"];
    	}
    	return name;
    }
    
    function prepareMusclePage(results, pageid, primary, secondary, imgpath){
		var position = results.rows.item(0);
		if (debug) console.log('runSqlPosition(function (tx, results): ' + position );
		var page = $(pageid);
		page.find('.ui-title').empty().append(position.Title);
		page.find('.subline').empty().append(lang["These muscle groups are demanded:"]);
		var overlaytable = page.find('.overlay table');
		
		var row1 = overlaytable.find('.row1');
		row1.empty();
		if (debug) console.log('row1: ' + row1.html()  );
		row1.append(getMuscleName(position[primary]));
		if (debug) console.log('row1: ' + row1.html()  );
		
		var row2 = overlaytable.find('.row2');
		row2.empty();
		if (debug) console.log('row2: ' + row2.html()  );
		row2.append(getMuscleName(position[secondary]));
		if (debug) console.log('row2: ' + row2.html()  );
		
		page.find('.muscleimg').remove();
		page.find('.switchleft').after('<img class="muscleimg" src="./img/Muskelpartien/' + imgpath + sessionStorage.id+'.png" />');
    }
    
    
    /*
     *
     *   Muscle Page Woman
     *
     */
    
    $('#muscle_page_woman').bind('pageshow', function() {
    	
    	historyback = historyback - 1;
    	
    	if (debug) console.log('muscle_page_woman pageshow');
    	
    	runSqlPosition(function (tx, results) {
    		prepareMusclePage(results, '#muscle_page_woman', 'PrimaryMuscleFemale', 'SecondaryMuscleFemale', 'Frau/MuskelpartienFrau');
    	});
    	
    });
    
    
    
    /*
    *
    *   Knowledge Page
    *
    */
   
   $('#knowledge_page').bind('pageshow', function() {
	   
	   $('#knowledge_page h1').text(sessionStorage.knowledge_h1_label);
	   
	   var content = $('#knowledge_page .contentlinks');
       content.empty();
       
       for(var i = 0; i < muskeln.length; i++) {
    	   content.append($('<a data-index="'+ i +'" href="" data-transition="none" class="knowledge_link">' +
               	'<img src="./img/Muskeln/'+ muskeln[i].filename+'@2x.png" />' +
               	'<span>'+ muskeln[i].label + '</span>' +
               '</a>'));
       }
       
   	
   });
   
   /* Klick auf die Muskulatur in Wissen */
	$('.knowledge_link').live('click', function(){
		sessionStorage.knowledge_detail_h1_label = $(this).find('span').text();
		sessionStorage.knowledge_back_page = 'knowledge_page';
		sessionStorage.knowledge_text = muskeln[$(this).data().index].text;
		$.mobile.changePage("#knowledge_details_page", { transition: "none"});
	});
	
	/*
    *
    *   Knowledge Details Page
    *
    */
   
   $('#knowledge_details_page').bind('pageshow', function() {
	   var page = $('#knowledge_details_page');
	   page.find('.ui-title').empty().append(sessionStorage.knowledge_detail_h1_label);
	   
	   var backbutton = page.find('.backbutton');
	   backbutton.attr('href', '#' + sessionStorage.knowledge_back_page);
	   
	   var content = page.find('.contentlinks');
	   content.empty().append(sessionStorage.knowledge_text);
   });
	
   
   /*
   *
   *   Settings Page
   *
   */
  
  $('#settings_page .contentlinks .backgroundmusic > a').click(function () {
	  options.backgroundmusic = !options.backgroundmusic;
	  setSettings();
  });
//  $('#settings_page .contentlinks .buttonmusic > a').click(function () {
//	  options.buttonmusic = !options.buttonmusic;
//	  setSettings();
//  });
  $('#settings_page .contentlinks .video > a').click(function () {
	  //options.backgroundmusic = false;
	  setSettings();
  });
  
  
  /*
  *
  *   Global Button Music
  *
  */
  
//  $('a').live('click', function (){
//	  if (options.buttonmusic){
//		  if (buttonmusic !== null){
//			  buttonmusic.play();			  
//		  }
//	  }
//  });
  
});

function setSettings(){
	if (debug) console.log('setSettings()');
	
  $.jStorage.set('musicsettings',  options);
  
  var content = $('#settings_page .contentlinks');
  if (!test){
	  if (options.backgroundmusic){
		  window.AndroidLanguage.setSound(true);
		  //backgroundmusic.play();
		  content.find('.backgroundmusic > a > img').attr('src',  'img/Einstellungen/Check@2x.png');
	  }
	  else {
		  window.AndroidLanguage.setSound(false);
		  //backgroundmusic.stop();
		  content.find('.backgroundmusic > a > img').attr('src',  'img/Einstellungen/NotCheck@2x.png');
	  }
  }
  
//  if (options.buttonmusic){
//	  content.find('.buttonmusic > a > img').attr('src',  'img/Einstellungen/Check@2x.png');
//  }
//  else {
//	  content.find('.buttonmusic > a > img').attr('src',  'img/Einstellungen/NotCheck@2x.png');
//  }
}
