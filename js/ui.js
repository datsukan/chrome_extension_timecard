// DOMの変更を検知してセット
check()

function check () {

    // 監視ターゲットの取得
    const target = document.getElementById('_chatSendToolbar')

    // 監視ターゲットが取得できるまで時間を置いて繰り返す
    if (! target) {
        window.setTimeout(check,500)
        return
    }

    addScript()
    initialize()
}

// ページにJavaScript
function addScript() {
    $('head').append(
        '<script>\
            function timecardBegin() {\
                const textarea = document.getElementById("_chatText");\
                textarea.select();\
                textarea.focus();\
                const text = "おはようございます。業務開始します。";\
                document.execCommand("delete");\
                document.execCommand("insertText", false, text);\
                window.setTimeout(timecardSubmit,100);\
            }\
            function timecardFinish() {\
                const textarea = document.getElementById("_chatText");\
                textarea.select();\
                textarea.focus();\
                const text = "業務終了します。お疲れさまでした。";\
                document.execCommand("delete");\
                document.execCommand("insertText", false, text);\
                window.setTimeout(timecardSubmit,100);\
            }\
            function timecardSubmit() {\
                document.getElementsByClassName("chatInput__submit")[0].click();\
            }\
        </script>'
    )
}

// 初期画面上にUIを追加
function initialize() {
    // 既存の要素を削除
    $("#timecardItem").remove()

    // 要素を追加
    $("#_chatSendToolbar").children("#_chatSendTool").after(
        `<ul id="timecardItem" class="timecard-Item">\
            <span\
                class="timecard-begin-btn"\
                onClick="timecardBegin()">\
                業務開始
            </span>\
            <span\
                class="timecard-finish-btn"\
                onClick="timecardFinish()">\
                業務終了
            </span>\
        </ul>`
    )
}
