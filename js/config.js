// last updated 2025.6.26
// 各リハビリのランダムIDを定義
const c=q;(function(K,o){const h=q,B=K();while(!![]){try{const j=parseInt(h(0x17f))/0x1+-parseInt(h(0x182))/0x2*(-parseInt(h(0x184))/0x3)+-parseInt(h(0x17d))/0x4*(-parseInt(h(0x17b))/0x5)+parseInt(h(0x180))/0x6+-parseInt(h(0x17e))/0x7+-parseInt(h(0x17c))/0x8+parseInt(h(0x183))/0x9;if(j===o)break;else B['push'](B['shift']());}catch(l){B['push'](B['shift']());}}}(X,0xe6a11));function q(K,o){const B=X();return q=function(j,l){j=j-0x17b;let h=B[j];return h;},q(K,o);}function X(){const b=['32965RKIxKF','14185488hEXWDi','8tVKicw','9944977oJMLAy','310903ojwDrf','7699044sxptCH','Uw3C8o0pEWh1TENMeNVRCnhkUFi5MaGs','238GPGiMk','20273337lFvlKW','7026GKArNj','sROzJ0KeEToFxND8sMiev9wNWMdJ6al4'];X=function(){return b;};return X();}const REHAB_IDS={0x0:'v5WJpcBdQQKLugkN4XYcyC5cKz6TEqFy',0x1:'aS1i66p81J14YWcpgRw4sBYL6gWUuKAw',0x2:c(0x185),0x3:c(0x181)};

// 逆引き用マッピング（ランダムIDから番号を取得）
const REHAB_ID_TO_INDEX = {};
Object.keys(REHAB_IDS).forEach(index => {
    REHAB_ID_TO_INDEX[REHAB_IDS[index]] = parseInt(index);
});

// ヘルパー関数
function getRehabId(index) {
    return REHAB_IDS[index] || `each${index}`;
}

function getIndexFromRehabId(rehabId) {
    return REHAB_ID_TO_INDEX[rehabId] !== undefined ? REHAB_ID_TO_INDEX[rehabId] : null;
}
