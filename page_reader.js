window.onload = function(){
	var message = {
		url: document.location.href,
		content: document.body.innerHTML,
		type: 'insert'
	}
	chrome.extension.sendMessage(message);
}