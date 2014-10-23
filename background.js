var db = openDatabase('recap','0.0.1', 'recap', 2 * 1024 * 1024);
db.transaction(function(tx){
	tx.executeSql("CREATE TABLE IF NOT EXISTS HISTORY (url, content, date)");
});

chrome.extension.onMessage.addListener(function(message){
	db.transaction(function(tx){
		tx.executeSql("INSERT INTO HISTORY (url,content,date) VALUES (?,?,?)", 
			[message.url, message.content, new Date().getTime()]);
		/*
		tx.executeSql("SELECT * FROM HISTORY",[],function(t,results){
			var len = results.rows.length;
			for ( var i = 0; i < len; i++ ) {
				console.dir(results.rows.item(i));	
			}
		});
		*/
	});	
});