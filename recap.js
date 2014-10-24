window.onload = function(){
	document.getElementById('searchField').addEventListener('keyup', function(){
		var text = this.value;
		var message = {
			type: 'query',
			content: text
		};
		chrome.extension.sendMessage(message, function(results){
			var entries = results.entries;
			for ( var i = 0; i < 5; i++ ) {
				var entry = entries[i];
				var template = $('#resultTemplate').clone().show();
				template.find('.url').html(entry.url);
				template.find('.content').html("Hey");
				$('.resultsContainer').append(template);
			}
		});
	}, false);
}