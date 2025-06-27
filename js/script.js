// progressbar.js@1.0.0 version is used
// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/

// comments
// 2025/06/25 update -- you can delete the rehabilitation record by URL parameter each0~3=false

// grobal variables
var numberOfClass = 0;
var nowClass = 0;

// Query parameters are saved to local storage as key-value pairs.
function saveQueryParamsToLocalStorage() {
    const params = new URLSearchParams(location.search);
    params.forEach((value, key) => localStorage.setItem(key, decodeURIComponent(value)));
}
saveQueryParamsToLocalStorage();

// URLパラメータの中の処理
(function handleEachParamsFromUrl() {
    const params = new URLSearchParams(location.search);
    
    // 従来のeach0-3パラメータの処理（下位互換性のため）
    for (let i = 0; i <= 3; i++) {
        const eachKey = `each${i}`;
        const rehabKey = `rehabilitation${i + 1}`;
        const paramValue = params.get(eachKey);
        const localValue = localStorage.getItem(rehabKey);
        
        if (localValue === 'true' && paramValue === 'false') {
            var rehabName = '';
            switch (i) {
                case 0:
                    rehabName = '理学療法';
                    break;
                case 1:
                    rehabName = '言語療法';
                    break;
                case 2:
                    rehabName = '作業療法';
                    break;
                case 3:
                    rehabName = '心理療法';
                    break;
                default:
                    rehabName = `未定義`;
            }
            alert(`${rehabName}の記録を削除します。`);
            localStorage.setItem(rehabKey, 'false');
        } else if(paramValue === 'false'){
            alert('このリハビリの記録はありません。');
        }
    }
    
    // 新しいランダムIDパラメータの処理
    if (typeof REHAB_IDS !== 'undefined') {
        Object.keys(REHAB_IDS).forEach(index => {
            const randomId = REHAB_IDS[index];
            const rehabKey = `rehabilitation${parseInt(index) + 1}`;
            const paramValue = params.get(randomId);
            const localValue = localStorage.getItem(rehabKey);
            
            if (localValue === 'true' && paramValue === 'false') {
                var rehabName = '';
                switch (parseInt(index)) {
                    case 0:
                        rehabName = '理学療法';
                        break;
                    case 1:
                        rehabName = '言語療法';
                        break;
                    case 2:
                        rehabName = '作業療法';
                        break;
                    case 3:
                        rehabName = '心理療法';
                        break;
                    default:
                        rehabName = `未定義`;
                }
                alert(`${rehabName}の記録を削除します。`);
                localStorage.setItem(rehabKey, 'false');
            } else if(paramValue === 'false'){
                alert('このリハビリの記録はありません。');
            }
        });
    }
})();

// 日付が変わった場合にlocalStorageの古いデータを削除する
(function clearOldDataOnNewDay() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式
    const lastAccessDate = localStorage.getItem('lastAccessDate');

    if (lastAccessDate !== today) {
        // 日付が変わった場合、従来のeach0~3と新しいランダムIDを削除
        for (let i = 0; i <= 3; i++) {
            localStorage.removeItem(`each${i}`);
            // 新しいランダムIDも削除
            if (typeof REHAB_IDS !== 'undefined' && REHAB_IDS[i]) {
                localStorage.removeItem(REHAB_IDS[i]);
            }
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

// localstrageのkey(従来のeach0~3または新しいランダムID)のvalueがtrueである場合、cntを足して、その数を、localstrageのkey=nmboftrueに保存する
function saveTrueCountToLocalStorage() {
    let cnt = 0;
    let achievedStatus = [];
    for (let i = 0; i <= 3; i++) {
        // 新しいランダムIDを優先的に使用
        let key = `each${i}`;
        if (typeof REHAB_IDS !== 'undefined' && REHAB_IDS[i]) {
            key = REHAB_IDS[i];
        }
        
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
        // キャンセルを押した場合は何もしない
        if (!confirm('OKを押して、次の画面で設定を行います。\nはじめてではない方は、キャンセルを押してください。')) {
            // rehabilitation.htmlにリダイレクトする
            alert('いつもと違うブラウザーでアクセスしている可能性があります。いつもと同じブラウザーでアクセスしてください。');
        }
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

// Display icons based on local storage values for each0 to each3 (または新しいランダムID)
function displayIconsBasedOnLocalStorage() {
    for (let i = 0; i <= 3; i++) {
        // 新しいランダムIDを優先的に使用
        let key = `each${i}`;
        if (typeof REHAB_IDS !== 'undefined' && REHAB_IDS[i]) {
            key = REHAB_IDS[i];
        }
        
        const value = localStorage.getItem(key);
        const element = document.getElementById(`each${i}`); // HTMLのIDは変更しない

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

// ランダムIDを使用してリハビリの記録を設定する関数
function setRehabRecord(rehabIndex, value) {
    let key = `each${rehabIndex}`;
    if (typeof REHAB_IDS !== 'undefined' && REHAB_IDS[rehabIndex]) {
        key = REHAB_IDS[rehabIndex];
    }
    localStorage.setItem(key, value);
    // 従来のeach0~3も同時に設定（下位互換性のため）
    localStorage.setItem(`each${rehabIndex}`, value);
}

// ランダムIDからリハビリの記録を取得する関数
function getRehabRecord(rehabIndex) {
    let key = `each${rehabIndex}`;
    if (typeof REHAB_IDS !== 'undefined' && REHAB_IDS[rehabIndex]) {
        key = REHAB_IDS[rehabIndex];
    }
    return localStorage.getItem(key);
}

// QRコード用のURLを生成する関数（新しいランダムIDを使用）
function generateQRCodeURL(rehabIndex, baseURL = window.location.origin + window.location.pathname) {
    let paramKey = `each${rehabIndex}`;
    if (typeof REHAB_IDS !== 'undefined' && REHAB_IDS[rehabIndex]) {
        paramKey = REHAB_IDS[rehabIndex];
    }
    return `${baseURL}?${paramKey}=true`;
}

// 削除用URLを生成する関数（新しいランダムIDを使用）
function generateDeleteURL(rehabIndex, baseURL = window.location.origin + window.location.pathname) {
    let paramKey = `each${rehabIndex}`;
    if (typeof REHAB_IDS !== 'undefined' && REHAB_IDS[rehabIndex]) {
        paramKey = REHAB_IDS[rehabIndex];
    }
    return `${baseURL}?${paramKey}=false`;
}

// ランダムIDのURLパラメータでリハビリを実行する処理
(function handleRandomIdParams() {
    if (typeof REHAB_IDS === 'undefined') return;
    
    const params = new URLSearchParams(location.search);
    
    Object.keys(REHAB_IDS).forEach(index => {
        const randomId = REHAB_IDS[index];
        const paramValue = params.get(randomId);
        
        if (paramValue === 'true') {
            // ランダムIDでアクセスされた場合、そのリハビリを実行済みにする
            localStorage.setItem(randomId, 'true');
            localStorage.setItem(`each${index}`, 'true'); // 下位互換性のため
        }
    });
})();

// ページを強制的にリロードする関数
function forceReload() {
    // URLパラメータをクリアしてリロード
    const url = new URL(window.location.href);
    url.search = ''; // パラメータをクリア
    window.location.href = url.toString();
}
// ページをリロードするボタンのイベントリスナー
if (window.location.search) {
    forceReload();
}