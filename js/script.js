// progressbar.js@1.0.0 version is used
// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/

// comments

// grobal variables
var numberOfClass = 0;
var nowClass = 0;

// Query parameters are saved to local storage as key-value pairs.
function saveQueryParamsToLocalStorage() {
    const params = new URLSearchParams(location.search);
    params.forEach((value, key) => localStorage.setItem(key, decodeURIComponent(value)));
}
saveQueryParamsToLocalStorage();

// 日付が変わった場合にlocalStorageの古いデータを削除する
(function clearOldDataOnNewDay() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式
    const lastAccessDate = localStorage.getItem('lastAccessDate');

    if (lastAccessDate !== today) {
        // 日付が変わった場合、each0~3を削除
        for (let i = 0; i <= 3; i++) {
            localStorage.removeItem(`each${i}`);
        }

        // 1年以上前のデータを削除
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 365); // 365日前の日付
        const oneWeekAgoString = oneWeekAgo.toISOString().split('T')[0];

        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('status_')) {
                const date = key.split('_')[1];
                if (date < oneWeekAgoString) {
                    localStorage.removeItem(key);
                }
            }
        });

        // // 30日以上前のデータを削除
        // const thirtyDaysAgo = new Date();
        // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // 30日前の日付
        // const thirtyDaysAgoString = thirtyDaysAgo.toISOString().split('T')[0];

        // Object.keys(localStorage).forEach(key => {
        //     if (key.startsWith('status_')) {
        //         const date = key.split('_')[1];
        //         if (date < thirtyDaysAgoString) {
        //             localStorage.removeItem(key);
        //         }
        //     }
        // });

        // 今日の日付を保存
        localStorage.setItem('lastAccessDate', today);
    }
})();

// localstrageのkey(each0~3)のvalueがtrueである場合、cntを足して、その数を、localstrageのkey=nmboftrueに保存する
function saveTrueCountToLocalStorage() {
    let cnt = 0;
    let achievedStatus = [];
    for (let i = 0; i <= 3; i++) {
        const key = `each${i}`;
        const value = localStorage.getItem(key);
        const key2 = `rehabilitation${i + 1}`;
        const value2 = localStorage.getItem(key2);
        // 取り組むリハビリのみ記録
        if (value2 === 'true') {
            if (value === 'true') {
                cnt++;
                achievedStatus.push(`${key}=true`);
            } else {
                achievedStatus.push(`${key}=false`);
            }
        }
    }
    localStorage.setItem('nmboftrue', cnt);
    nowClass = cnt;

    // 日付ごとの達成状況を保存
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式
    const totalRehabilitations = parseInt(localStorage.getItem('numberofClass') || 0);

    let statusValue = '';
    if (cnt === totalRehabilitations && totalRehabilitations > 0) {
        statusValue = 'clear';
    } else {
        statusValue = cnt.toString();
    }
    // すべてのリハビリの達成状況をカンマ区切りで追加
    if (achievedStatus.length > 0) {
        statusValue += ',' + achievedStatus.join(',');
    }
    localStorage.setItem(`status_${today}`, statusValue);
}
saveTrueCountToLocalStorage();

// localstrage のkey=rehabilitation1~4のvalueを取得して、htmlのid=rehabilitation1~4のcheckboxにチェックを入れる
function loadCheckboxStates() {
    let cnt = 0;
    for (let i = 1; i <= 4; i++) {
        const key = `rehabilitation${i}`;
        const value = localStorage.getItem(key);
        if (value === 'true') {
            cnt++;
        }
    }
    // numberofClassにcntを代入する
    if(cnt>0){
        numberOfClass = cnt;
    }else{
        // ポップアップで「リハビリテーションを選択してください」と表示する
        alert('初期設定を行います。次の画面で自分のリハビリテーションを種類を選択してください');
        // rehabilitation.htmlにリダイレクトする
        location.href = 'setting.html';
        return;
    }
    // localstrageのkey=numberofClassにcntを保存する
    localStorage.setItem('numberofClass', numberOfClass);
}
loadCheckboxStates();

// claer local storage when URL contains ?clear=true
if (location.search.includes('clear=true')) {
    var result = confirm('すべてのデータを削除しますか？※削除するとデータを復元することはできません。\nOK: 削除する\nキャンセル: 削除しない');
    if(result == true){
        // localStorageのすべてのデータを削除する
        localStorage.clear();
    }
    // urlに?以下の文字が含まれている場合は、その文字列を消去してからリロードする
    if (location.search) {
        const url = location.href.split('?')[0];
        history.replaceState(null, null, url);
    }
    location.reload();  
};

// Display icons based on local storage values for each0 to each3
function displayIconsBasedOnLocalStorage() {
    for (let i = 0; i <= 3; i++) {
        const key = `each${i}`;
        const value = localStorage.getItem(key);
        const element = document.getElementById(key);

        const key2 = `rehabilitation${i+1}`;
        const value2 = localStorage.getItem(key2);
        const element2 = document.getElementById(key2);

        if (value === 'true') {
            if(value2 === 'false'){
                // 登録処理を行う
                localStorage.setItem(key2, 'true');
                // アラートを表示
                alert('設定されていないリハビリのため、新規登録されました。');
                // リロードする
                location.reload();
                return;
            }
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.setAttribute('class', 'bi bi-check-circle-fill');
            icon.setAttribute('fill', 'green');
            icon.setAttribute('viewBox', '0 0 16 16');
            icon.setAttribute('width', '36'); // Set the width of the icon (e.g., 24px)
            icon.setAttribute('height', '36'); // Set the height of the icon (e.g., 24px)
            icon.innerHTML = `
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 10.97a.75.75 0 0 0 1.07 0l3.992-3.992a.75.75 0 1 0-1.06-1.06L7.5 9.44 6.067 8.007a.75.75 0 1 0-1.06 1.06l1.963 1.963z"/>
            `;
            icon.className = 'fas fa-check-circle'; // Example icon class (Font Awesome)
            icon.style.color = 'green'; // Example icon color
            element.appendChild(icon);

        }else if(value2 === 'false'){
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.setAttribute('class', 'bi bi-dash');
            icon.setAttribute('fill', 'currentColor');
            icon.setAttribute('viewBox', '0 0 16 16');
            icon.setAttribute('width', '36'); // Set the width of the icon (e.g., 24px)
            icon.setAttribute('height', '36'); // Set the height of the icon (e.g., 24px)
            icon.innerHTML = `
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
            `;
            icon.style.color = 'gray'; // Example icon color
            element.appendChild(icon);
        }else{
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.setAttribute('class', 'bi bi-x-circle-fill');
            icon.setAttribute('fill', 'red');
            icon.setAttribute('viewBox', '0 0 16 16');
            icon.setAttribute('width', '36'); // Set the width of the icon (e.g., 24px)
            icon.setAttribute('height', '36'); // Set the height of the icon (e.g., 24px)
            icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
            </svg>
            `;
            icon.style.color = 'gray'; // Example icon color
            element.appendChild(icon);
        }
    }
}
displayIconsBasedOnLocalStorage();


// 連続達成日数を計算する関数（本日から遡って連続している場合のみカウント）
function getConsecutiveClearDays() {
    let count = 0;
    let date = new Date();
    while (true) {
        const dateStr = date.toISOString().split('T')[0];
        const status = localStorage.getItem(`status_${dateStr}`);
        // 修正: "clear"で始まる場合もカウント
        if (status && status.startsWith('clear')) {
            count++;
            // 前日へ
            date.setDate(date.getDate() - 1);
        } else {
            // 本日が未達成の場合は0日とする
            if (count === 0) return 0;
            break;
        }
    }
    return count;
}

// main progress bar
function createProgressBar(container, color, duration, fromColor, toColor, strokeWidth, trailWidth) {
    return new ProgressBar.Circle(container, {
        color: color,
        strokeWidth: strokeWidth,
        trailWidth: trailWidth,
        easing: 'easeInOut',
        duration: duration,
        text: {
            autoStyleContainer: false
        },
        from: { color: fromColor, width: strokeWidth },
        to: { color: toColor, width: strokeWidth },
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            var value = Math.round(circle.value() * 100);
            var consecutiveDays = getConsecutiveClearDays();
            if (value === 0 || numberOfClass === 0) {
                circle.setText(
                    '<div style="font-size:1.5rem;">きょう</div>' +
                    '<div style="font-size:3rem;">0</div>' +
                    (consecutiveDays === 0
                        ? '<div style="border-top:1px solid #ccc; margin-top:6px; padding-top:4px; font-size:1.2rem;">あと' + '<b style="font-size:1.8rem;">' +　(numberOfClass - nowClass) +  '</b><div style="font-size:1.2rem; display:inline;">つ</div>'
                        : '<div style="border-top:1px solid #ccc; margin-top:6px; padding-top:4px; font-size:1rem;">' +
                            '<span style="font-size:1.8rem;font-weight:bold;">' + consecutiveDays + '</span>日連続達成中！</div>')
                );
            } else {
                circle.setText(
                    '<div style="font-size:1.5rem;">きょう</div>' +
                    '<div style="font-size:3rem; display:inline;">' + nowClass + '</div>' +
                    // '<div style="font-size:2rem; display:inline;"> / ' + numberOfClass + '</div>' +
                    (consecutiveDays === 0
                        ? '<div style="border-top:1px solid #ccc; margin-top:6px; padding-top:4px; font-size:2rem;">' + '<div style="font-size:1.2rem;">あと' + '<b style="font-size:1.8rem;">'+ (numberOfClass - nowClass) + '</b><div style="font-size:1.2rem; display:inline;">つ</div>'
                        : '<div style="border-top:1px solid #ccc; margin-top:6px; padding-top:4px; font-size:1rem;">' +
                            '<span style="font-size:1.8rem;font-weight:bold;">' + consecutiveDays + '</span>日連続クリア</div>')
                );
            }
        }
    });
}

// main progress bar
var bar = createProgressBar(container, '#000000', 1400, '#4a9cbf', '#4a9cbf', 5, 6);
bar.text.style.fontSize = '3rem';
var animate = nowClass/numberOfClass;
if(animate >1) animate = 1;
bar.animate(animate);  // Number from 0.0 to 1.0

// function displayWeeklyStatus() {
//     const container = document.getElementById('weekly-status-container');
//     container.innerHTML = ''; // コンテナを初期化

//     const today = new Date();
//     const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土']; // 曜日リスト

//     for (let i = 0; i < 7; i++) {
//         const date = new Date(today);
//         date.setDate(today.getDate() - i);
//         const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD形式
//         const dayOfWeek = daysOfWeek[date.getDay()]; // 曜日を取得

//         const status = localStorage.getItem(`status_${dateString}`) || 0; // データがない場合は0
//         const totalRehabilitations = parseInt(localStorage.getItem('numberofClass') || 0); // その日のリハビリ数

//         // 曜日と数字を含む要素を作成
//         const item = document.createElement('div');
//         item.className = 'weekly-status-item';

//         const dayElement = document.createElement('div');
//         dayElement.className = 'day-of-week';
//         dayElement.textContent = dayOfWeek; // 曜日を設定

//         const statusElement = document.createElement('div');
//         statusElement.className = 'status-number';

//         if (status === 'clear') {
//             // チェックマークを表示
//             const checkMark = document.createElement('div');
//             checkMark.className = 'check-mark';
//             checkMark.innerHTML = `
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="green" class="bi bi-check-circle-fill" viewBox="0 0 16 16" width="24" height="24">
//                     <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 10.97a.75.75 0 0 0 1.07 0l3.992-3.992a.75.75 0 1 0-1.06-1.06L7.5 9.44 6.067 8.007a.75.75 0 1 0-1.06 1.06l1.963 1.963z"/>
//                 </svg>
//             `;
//             statusElement.appendChild(checkMark);
//         } else {
//             statusElement.textContent = status; // 数字を設定
//         }

//         // 曜日と数字を親要素に追加
//         item.appendChild(dayElement);
//         item.appendChild(statusElement);

//         container.appendChild(item);
//     }
// }
saveTrueCountToLocalStorage();
// displayWeeklyStatus();

// 各リハビリ療法の表示/非表示制御
function hideUnusedRehabilitation() {
    // 各療法の親ブロック（.rehab-block）を取得
    for (let i = 1; i <= 4; i++) {
        const key = `rehabilitation${i}`;
        const value = localStorage.getItem(key);
        const block = document.querySelector(`.rehab-block[data-rehab="${key}"]`);
        if (value !== 'true' && block) {
            block.style.display = 'none';
        }
    }
}
hideUnusedRehabilitation();

// // 新しい指標を計算する関数群

// // 今月の「clear」達成日数とリハビリに取り組んだ総日数を計算する関数
// function getMonthlyRehabStats() {
//     let clearDaysThisMonth = 0;
//     let daysWithRehabThisMonth = 0;
//     const today = new Date();
//     const currentMonth = today.getMonth(); // 0-11
//     const currentYear = today.getFullYear();

//     // 今月の1日から今日までの日付をループ
//     for (let d = 1; d <= today.getDate(); d++) {
//         const date = new Date(currentYear, currentMonth, d);
//         const dateStr = date.toISOString().split('T')[0];
//         const status = localStorage.getItem(`status_${dateStr}`);

//         if (status) { // statusが存在する（何かしらリハビリに取り組んだ）
//             daysWithRehabThisMonth++;
//             if (status.startsWith('clear')) {
//                 clearDaysThisMonth++;
//             }
//         }
//     }
//     return { clearDaysThisMonth, daysWithRehabThisMonth };
// }

// // 過去7日間の達成状況を計算する関数
// function getLast7DaysStatus() {
//     let clearCount = 0;
//     let partialCount = 0; // 一部達成
//     let noRehabCount = 0; // リハビリ未実施

//     for (let i = 0; i < 7; i++) {
//         const date = new Date();
//         date.setDate(date.getDate() - i);
//         const dateStr = date.toISOString().split('T')[0];
//         const status = localStorage.getItem(`status_${dateStr}`);

//         if (status && status.startsWith('clear')) {
//             clearCount++;
//         } else if (status && !isNaN(parseInt(status.split(',')[0]))) { // 数値（一部達成）の場合
//             partialCount++;
//         } else { // statusがない、またはclearでも数値でもない場合
//             noRehabCount++;
//         }
//     }
//     return { clearCount, partialCount, noRehabCount };
// }

// // メッセージを自動生成して表示する関数（修正版）
// function displayAutomaticMessage() {
//     const today = new Date().toISOString().split('T')[0]; //
//     const status = localStorage.getItem(`status_${today}`); //
//     const messageContainer = document.querySelector('#dividestatus.bg-info'); //

//     let message = '';
//     let bestMessagePriority = -1; // メッセージの優先度を管理（高いほど優先）

//     const nmboftrue = parseInt(localStorage.getItem('nmboftrue') || '0', 10); //
//     const numberofClass = parseInt(localStorage.getItem('numberofClass') || '0', 10); //
//     const consecutiveDays = getConsecutiveClearDays(); // 連続達成日数
//     const monthlyStats = getMonthlyRehabStats();
//     const last7DaysStats = getLast7DaysStatus();

//     // 1. リハビリが設定されていない場合の最優先メッセージ
//     if (numberofClass === 0) { //
//         message = `「設定」タブから今日行うリハビリを選択してください。`;
//         if (messageContainer) {
//             messageContainer.textContent = message;
//         }
//         return; // これが最優先なので、他のチェックはしない
//     }

//     // 2. 今日の達成状況に基づいたメッセージ
//     if (status && status.startsWith('clear')) { //
//         // 今日クリアの場合
//         if (consecutiveDays >= 3 && consecutiveDays < 7) { //
//             message = `🎉 おめでとうございます！${consecutiveDays}日連続達成中です！素晴らしい！`;
//             bestMessagePriority = 5;
//         } else if (consecutiveDays >= 7) { //
//             message = `🏆 連続達成記録更新中！${consecutiveDays}日連続達成、この調子です！`;
//             bestMessagePriority = 6;
//         } else {
//             message = '🙌 全てのリハビリを達成しました！よく頑張りました！';
//             bestMessagePriority = 4;
//         }
//     } else if (nmboftrue > 0 && nmboftrue < numberofClass) { //
//         // 一部達成の場合
//         const remaining = numberofClass - nmboftrue; //
//         message = `あと${remaining}個のリハビリで今日の目標達成です！頑張りましょう！`;
//         bestMessagePriority = 3;
//     } else if (nmboftrue === 0 && numberofClass > 0) { //
//         // 未達成の場合（リハビリが設定されているが一つも達成していない）
//         message = `今日はまだリハビリが始まっていません。一つずつ取り組んでいきましょう！`;
//         bestMessagePriority = 2;
//     } else {
//         // その他の場合や、初回アクセスなどでstatusがnullの場合
//         message = '今日のリハビリに取り組みましょう！';
//         bestMessagePriority = 1;
//     }

//     // 3. 他の指標に基づいたメッセージ（優先度を考慮して上書き）
//     // 月間達成率が高い場合
//     if (monthlyStats.daysWithRehabThisMonth > 0) {
//         const monthlyAchieveRate = (monthlyStats.clearDaysThisMonth / monthlyStats.daysWithRehabThisMonth) * 100;
//         if (monthlyAchieveRate >= 80 && bestMessagePriority < 4) { // 今日の達成メッセージより優先度が低い場合のみ
//             message = `✨ 今月の達成率は${Math.round(monthlyAchieveRate)}%！素晴らしいペースです！`;
//             bestMessagePriority = 4; // 連続達成よりは低いが、今日未達成なら優先
//         }
//     }

//     // 今月のクリア日数が特定の数を超えた場合
//     if (monthlyStats.clearDaysThisMonth >= 5 && bestMessagePriority < 4) { // 例: 5日以上クリア
//         message = `💪 今月はすでに${monthlyStats.clearDaysThisMonth}日達成しています！この調子で頑張りましょう！`;
//         bestMessagePriority = 4;
//     }

//     // 過去7日間で全てクリアの日があった場合（今日クリアでないが、過去は頑張っていた場合など）
//     if (last7DaysStats.clearCount >= 5 && status && !status.startsWith('clear') && bestMessagePriority < 4) {
//         message = `📈 過去7日間で${last7DaysStats.clearCount}日も達成していますね！素晴らしい努力です！`;
//         bestMessagePriority = 4;
//     }


//     if (messageContainer) {
//         messageContainer.textContent = message;
//     }
// }

// // ページロード時と、リハビリ状況が更新される可能性のあるタイミングでメッセージ表示関数を呼び出す
// document.addEventListener('DOMContentLoaded', displayAutomaticMessage); //

// // 既存の saveTrueCountToLocalStorage() の後に呼び出す
// // 現状のscript.jsではsaveTrueCountToLocalStorage()が複数回呼ばれるので、
// // 最後のdisplayAutomaticMessage()呼び出しで最新の状態が反映されます
// // 最後の呼び出し部分を以下のように修正:
// saveTrueCountToLocalStorage(); //
// // displayWeeklyStatus(); // コメントアウトされているため、必要であれば有効にしてください
// displayAutomaticMessage(); // ここに呼び出しを追加