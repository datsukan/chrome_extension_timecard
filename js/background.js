chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && tab.url.indexOf("https://www.chatwork.com/") > -1) {
        console.log(`updated: ${tab.url}`)
        chrome.tabs.executeScript(null, { file: "lib/jquery.min.js" }, function() {
            chrome.tabs.executeScript(
                tabId,
                {
                    file: "js/ui.js"
                },
                function(result) {
                    console.log(`executed: ${result}`)
                }
            )
        })
    }
})
