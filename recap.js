window.onload = function(){
	document.getElementById('searchField').addEventListener('keyup', _.debounce(function(){
		var text = this.value;
		var message = {
			type: 'query',
			content: text
		};
		chrome.extension.sendMessage(message, function(results){
			var entries = results.entries;
			$('.resultsContainer').empty();
			for ( var i = 0, limit = entries.length; i < limit; i++ ) {
				var entry = entries[i];
				var template = $('#resultTemplate').clone().show();
				template.find('.content')
					.attr('href', entry.url)
					.text("..." + entry.content + "... | " + entry.url);	
				$('.resultsContainer').append(template);
			}
		});
	}, 1000), false);
}