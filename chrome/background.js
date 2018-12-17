function injectExtension(tabId, frameId) {
  var cssObj = {
  	file: "combined.css"
  }, jsObj = {
  	file: "combined.js"
  };

  if (frameId) {
  	cssObj.frameId = frameId;
  	jsObj.frameId = frameId;
  };

  chrome.tabs.insertCSS(tabId, cssObj);
  chrome.tabs.executeScript(tabId, jsObj);
}

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.webNavigation.getAllFrames({ tabId: tab.id }, function(arrFrames) {
  	if (arrFrames.length > 1) {
  	  for (var i = 0; i < arrFrames.length; i++) {
  	  	if (arrFrames[i].frameId > 0)
  	  		injectExtension(tab.id, arrFrames[i].frameId);
  	  }
  	} else {
  	  injectExtension(tab.id);
  	}
  });
});

chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
		var responseHeaders = [];
    for (var i = 0; i < details.responseHeaders.length; ++i) {
			if (details.responseHeaders[i].name.toLowerCase() != 'x-frame-options' &&
					details.responseHeaders[i].name.toLowerCase() != 'content-security-policy') {
				responseHeaders.push(details.responseHeaders[i]);
			}
		}
		return {
			responseHeaders: responseHeaders
		};
  }, {
    urls: ["<all_urls>"]
  }, ["blocking", "responseHeaders"]);