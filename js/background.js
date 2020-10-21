chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url.indexOf('https://www.chatwork.com/') > -1) {
    console.log(`updated: ${tab.url}`);

    // 表示対象ページを取得
    chrome.storage.local.get(['chatwork_timecard_list'], (result) => {
      const targetList = result.chatwork_timecard_list || [];
      const isTarget = targetList.some((chat) => chat.url === tab.url);

      if (targetList.length === 0 || isTarget) {
        chrome.tabs.executeScript(null, { file: 'lib/jquery.min.js' }, function () {
          chrome.tabs.executeScript(
            tabId,
            {
              file: 'js/ui.js',
            },
            function (result) {
              console.log(`executed: ${result}`);
            }
          );
        });
      }
    });
  }
});
