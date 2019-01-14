var SS_TABS = {};

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

chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		SS_TABS[details.tabId] = details.url;
	}, {
		urls: ['*://*.saversage.com/*'],
		types: ['main_frame']
	},
	['blocking']
);


chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
		if (details.parentFrameId > -1 && details.tabId in SS_TABS) {
			var requestHeaders = [];
			for (var i = 0; i < details.requestHeaders.length; ++i) {
				if (details.requestHeaders[i].name.toLowerCase() != 'cookie' && 
						details.requestHeaders[i].name.toLowerCase() != 'referer') {
					requestHeaders.push(details.requestHeaders[i]);
				}
			}
			return {
				requestHeaders: requestHeaders
			};	
		}
  }, {
		urls: ['<all_urls>'],
		types: ['sub_frame']
  }, ['blocking', 'requestHeaders']);

chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
		if (details.parentFrameId > -1 && details.tabId in SS_TABS) {
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
		}
  }, {
		urls: ['<all_urls>'],
		types: ['sub_frame']
  }, ['blocking', 'responseHeaders']);