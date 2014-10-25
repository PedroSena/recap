window.onload = function(){
	document.getElementById('searchField').addEventListener('keyup', function(){
		var text = this.value;
		var message = {
			type: 'query',
			content: text
		};
		chrome.extension.sendMessage(message, function(results){
			var entries = results.entries;
			$('.resultsContainer').empty();
			for ( var i = 0; i < Math.min(5,entries.length); i++ ) {
				var entry = entries[i];
				var template = $('#resultTemplate').clone().show();
				template.find('.content')
					.attr('src', entry.url)
					.text(getRelevantContent(entry.content, text));
				$('.resultsContainer').append(template);
			}
		});
	}, false);

	function getRelevantContent(allContent, keyword) {
		var tokens = allContent.split(" ");
		var indices = [];
		for ( var i = 0; i < tokens.length; i++ ) {
			var token = tokens[i];
			if ( token == keyword ) {
				indices.push(i);
			}
		}
		var words = [];
		for ( var i = 0; i < indices.length; i++ ) {
			var index = indices[i];
			for ( var j = -5; j < 6; j++ ) {
				words.push(tokens[index+j]);	
			}
		}
		return words.join(" ");
	}
}