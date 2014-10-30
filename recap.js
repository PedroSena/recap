window.onload = function(){
	document.getElementById('searchField').addEventListener('keyup', _.debounce(function(){
		var text = this.value;
		var message = {
			type: 'query',
			content: text
		};
		if ( text.length < 3 ) return;
		chrome.extension.sendMessage(message, function(results){
			var entries = results.entries;
			$('.resultsContainer').empty();
			for ( var i = 0, limit = entries.length; i < limit; i++ ) {
				var entry = entries[i];
				var template = $('#resultTemplate').clone().show();
				template.find('.content').attr('href', entry.url);
				template.find('.title').text("..." + entry.content + "...");
				template.find('.link').text(entry.url);
				$('.resultsContainer').append(template);
			}
		});
	}, 1000), false);
}