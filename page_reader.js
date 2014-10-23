window.onload = function(){
	var page_content = document.body.innerHTML.replace("/<script>.*</script>?/",'');
	var tmp = document.createElement("DIV");
	tmp.innerHTML = page_content;
	page_content = (tmp.textContent || tmp.innerHTML);
	page_content = page_content.replace("/ +(?= )|\n/g",'');
	var message = {
		url: document.location.href,
		content: page_content
	}
	chrome.extension.sendMessage(message);
}