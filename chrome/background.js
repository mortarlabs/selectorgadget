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

  console.log(["tab:", tabId, "frame:", frameId].join(" "));

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
