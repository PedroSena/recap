var db = openDatabase('recap','0.0.1', 'recap', 2 * 1024 * 1024);
db.transaction(function(tx){
	tx.executeSql("DRPO TABLE HISTORY");
	tx.executeSql("CREATE TABLE IF NOT EXISTS HISTORY (url, content, date)");
});

chrome.extension.onMessage.addListener(function(message, sender, sendResponse){
	if (message.type == "insert") {
		db.transaction(function(tx){
			var cleanText = removeHTML(message.content);
			tx.executeSql("INSERT INTO HISTORY (url,content,date) VALUES (?,?,?)", 
				[message.url, cleanText, new Date().getTime()]);
			console.log(cleanText);
		});	
	}
	if (message.type == "query") {
		db.transaction(function(tx){
			tx.executeSql("SELECT DISTINCT url,content FROM HISTORY where content like ?", ["%" + message.content + "%"], function(tx,result){
				var len = result.rows.length;
				console.log("# of entries for " + message.content + ": " + len);
				var entries = [];
				for ( var i = 0; i < len; i++ ) {
					var item = result.rows.item(i);
					var entry = {
						url: item.url,
						content: item.content
					};
					entries.push(entry);
				}
				sendResponse({entries: entries});
			});
		}, null);		
	}
	return true;
});

function removeHTML(content) {
	content = content.replace(/<script.*>[\s\S]+?<\/script>/gi,"");
	content = content.replace(/(\s){2,}/g,"");
	return $(content).text();
}