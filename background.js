var db = openDatabase('recap','0.0.1', 'recap', 2 * 1024 * 1024);
db.transaction(function(tx){
	tx.executeSql("CREATE TABLE IF NOT EXISTS HISTORY (url, content, date)");
});

chrome.extension.onMessage.addListener(function(message, sender, sendResponse){
	if (message.type == "insert") {
		db.transaction(function(tx){
			tx.executeSql("INSERT INTO HISTORY (url,content,date) VALUES (?,?,?)", 
				[message.url, message.content, new Date().getTime()]);	
			console.log("Inserted new entry on history");
		});	
	}
	if (message.type == "query") {
		db.transaction(function(tx){
			tx.executeSql("SELECT * FROM HISTORY", [], function(tx,result){
				var len = result.rows.length;
				var entries = [];
				for ( var i = 0; i < len; i++ ) {
					var item = result.rows.item(i);
					var entry = {
						url: item.url,
						content: item.content,
						date: item.date
					};
					entries.push(entry);
				}
				sendResponse({entries: entries});
			});
		}, null);		
	}
	return true;
});