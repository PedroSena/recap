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
			tx.executeSql("SELECT DISTINCT url,content FROM HISTORY where content like ?", 
				["%" + message.content + "%"], function(tx,result){
					var len = result.rows.length;
					var entries = [];
					for ( var i = 0; i < len; i++ ) {
						var item = result.rows.item(i);
						var relevantContent = getRelevantContent(item.content, message.content);
						_.forEach(relevantContent, function(keywordMatch){
							entries.push({
								url: item.url,
								content: keywordMatch
							});
						});
					}
					entries = _.uniq(entries, function(entry) { return entry.content });
					sendResponse({entries: entries});
				}
			);
		}, null);		
	}
	return true;
});

function removeHTML(content) {
	content = content.replace(/<script.*>[\s\S]+?<\/script>/gi,"");
	content = content.replace(/(\s){2,}/g,"");
	return $(content).text();
}


function getRelevantContent(allContent, keyword) {
	var regex = new RegExp("(.{1,20}" + keyword + ".{1,20})", "gi");
	return allContent.match(regex);
}