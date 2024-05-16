const apiURL = "https://script.google.com/macros/s/AKfycby8NLCcS6R1HqS5LqCV8eTjoo-2VCStiCnzCUyAGh_EqvZJpUm7Be3dEnPbRqAlXsKFRg/exec";
const interval = 15;
let myNumber = -1;
let timeStr = "";
let durations = {};

// 全角数字を半角に変換
function toHalf(str) {
  str = str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
  return str;
}

function startSearch() {
    //要素取得
    let numberInput = document.getElementsByClassName("numberInput")[0];

    //未入力の場合、処理を打ち切る
    if (numberInput.value == "") return;
    if (numberInput.value == "_reset") {
        localStorage.clear();
        return;
    }
    myNumber = parseInt(toHalf(numberInput.value));
    
    saveMyNumber();

    //スプレッドシートからその受付番号の予定時間を文字列で取得
    let numberInputText = durations[parseInt(myNumber)];

    let beforeHourAndMinute = numberInputText.split(",").map(s => parseInt(s));
    let afterHourAndMinute = calculateAfterTime(beforeHourAndMinute).slice();

    timeStr = `${beforeHourAndMinute[0]}:${beforeHourAndMinute[1].toString().padStart(2,'0')}`;

    showEstimatedTime(timeStr);
    saveMyEstimatedTime();
}

//立命館大学のホームページを開く関数
function openUnivSite() {
    location.href = "https://www.ritsumei.ac.jp/";
}

//予定時刻を表示する関数
function showEstimatedTime(estimatedTimeStr) {
    let outputText = document.getElementsByClassName("output")[0];
    let welcomeText = document.getElementsByClassName("welcome")[0];

    outputText.style.border = "double 5px black";
    welcomeText.innerHTML = "までにお越しください";
    outputText.innerText = estimatedTimeStr;
}

function calculateAfterTime(beforeHourAndMinute) {
    let afterHourAndMinute = beforeHourAndMinute.slice();
    afterHourAndMinute[1] += interval;
    if (afterHourAndMinute[1] >= 60) {
        afterHourAndMinute[1] -= 60;
        afterHourAndMinute[0]++;
    }

    return afterHourAndMinute;
}

function getDurationsFromSheet() {
    //APIからデータを取得
    fetch(apiURL)
    .then(function (fetch_data) {
        return fetch_data.json();
    })
    .then(function (json) {
        for (var i in json) {
            durations[json[i].number] = json[i].duration;
        }

        //受付番号のロードに成功していたら、時刻を表示する
        if (myNumber != -1) {
            showEstimatedTime(timeStr);
        }
    });
}

//自分の受付番号を保存する関数
function saveMyNumber() {
    if (document.getElementsByClassName("numberInput")[0].value == "") return;
    localStorage.setItem("myNumber",myNumber.toString());
}

//予定時刻を保存する関数
function saveMyEstimatedTime() {
    localStorage.setItem("myEstimatedTime",timeStr);
}

//端末に保存されているデータをすべて読み込む関数
function loadData() {
    if (localStorage.getItem("myNumber") != null) myNumber = parseInt(localStorage.getItem("myNumber"));
    if (localStorage.getItem("myEstimatedTime") != null) timeStr = localStorage.getItem("myEstimatedTime");
}

//ページの読み込みが完了したときに呼ばれる関数
function onLoad() {
    loadData();

    //過去に受付番号を保存していたら、ユーザーのために待機文字を表示する
    if (myNumber != -1) {
        let welcomeText = document.getElementsByClassName("welcome")[0];
        welcomeText.innerText = "情報の更新を行っています...";
    }
    getDurationsFromSheet();
    document.getElementsByClassName("numberInput")[0].value = (myNumber == -1 ? "" : myNumber.toString());
}
