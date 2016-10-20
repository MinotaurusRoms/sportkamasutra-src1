// Populate the database 
//
function populateDB(tx) {
	
	if (debug) console.log('lang: ' + langabbr);
	if (debug) console.log('populateDB');
	
     tx.executeSql('DROP TABLE IF EXISTS Musclegroup');
     tx.executeSql('CREATE TABLE Musclegroup (ID unique, Musclegroup)');
     
     tx.executeSql('DROP TABLE IF EXISTS Position');
     tx.executeSql('CREATE TABLE Position(ID,Title,MainDescription,Description,PrimaryMuscleMale,SecondaryMuscleMale,PrimaryMuscleFemale,SecondaryMuscleFemale,Pro,Male,Female,IntimicyLevel,StrainLevel)');
     
     tx.executeSql('DROP TABLE IF EXISTS Position2Musclegroup');
     tx.executeSql('CREATE TABLE Position2Musclegroup(PositionID,MusclegroupID,Gender)');
     
     tx.executeSql('DROP TABLE IF EXISTS Position2Sports');
     tx.executeSql('CREATE TABLE Position2Sports(PositionID,SportsID,Gender)');
     
     tx.executeSql('DROP TABLE IF EXISTS Sports');
     tx.executeSql('CREATE TABLE Sports(ID,Sport)');
     
     function readData(data){
    	 var lines = data.split('\r');
    	 
        $.each(lines, function(){
        	var sql = this;
    		//console.log('executeSql: ' + sql);
   		 	tx.executeSql(sql);
    	 });
     }
     
     insertTabledata('Musclegroup', readData);
     $.ajax({
       	 type: 'GET',
       	 async: false,
       	 url:'db/' + langabbr + '/Position.sql',
       	 dataType: 'html',
       	 success: readData
        });
     insertTabledata('Position2Musclegroup', readData);
     insertTabledata('Position2Sports', readData);
     insertTabledata('Sports', readData);
     
//     tx.executeSql('SELECT * FROM Musclegroup', [], querySuccess, errorCB);
//     tx.executeSql('SELECT * FROM Position', [], querySuccess, errorCB);
//     tx.executeSql('SELECT * FROM Position2Musclegroup', [], querySuccess, errorCB);
//     tx.executeSql('SELECT * FROM Position2Sports', [], querySuccess, errorCB);
//     tx.executeSql('SELECT * FROM Sports', [], querySuccess, errorCB);
     
     if (debug) console.log('populateDB end');
}

function insertTabledata(data, fn){
	$.ajax({
   	 type: 'GET',
   	 async: false,
   	 url:'db/' + data + '.sql',
   	 dataType: 'html',
   	 success: fn
    });
}

// Transaction error callback
//
function errorCB(err) {
    console.log("Error processing SQL: "+err.message);
    console.log("Error processing SQL: "+err);
}

// Transaction success callback
//
function successCB() {
	console.log("db init success!");
}

function querySuccess(tx, results) {
    // the number of rows returned by the select statement
    console.log("Rows Length = " + results.rows.length);
}

function runSql(fn_tx, fn_success){
	var db = window.openDatabase(databasename + "DB", "1.0", databasename, 400000);
    db.transaction(fn_tx, errorCB, fn_success);
}

function transactionsuccess() {
}

function runSqlPosition(fnresults){
	if (debug) console.log('runSqlPosition(fnresults) sessionStorage.id: ' + sessionStorage.id);
	runSql(function (tx) {
		tx.executeSql('SELECT * FROM Position where ID = ?', [sessionStorage.id], 
				fnresults,
		    errorCB);
		}, transactionsuccess);
}
