const CHROME_SYNC_STORAGE_KEY = "smtb_direct_numbers";

/**
 * syncストレージから値を取得する
 */
async function loadValues()
{
  const storageKey = CHROME_SYNC_STORAGE_KEY;
  const storages = await chrome.storage.sync.get();
  const items = storages[storageKey];
  return items;
}

/**
 * 入力欄に値をセットする
 */
async function setValues()
{
  const target = '.directInput';
  const inputs = document.querySelectorAll(target);
  const items = await loadValues();

  inputs.forEach(input => {
    const key = input.getAttribute('id');
    const value = items[key];

    if(value) input.value = value;
  });
}

/**
 * syncストレージに値を保存する
 */
function saveValues()
{
  const storageKey = CHROME_SYNC_STORAGE_KEY;
  const items = {};
  const inputs = document.querySelectorAll('.directInput');
  inputs.forEach(input => {
    const key = input.getAttribute('id');
    const value = input.value;

    items[key] = value;
  });

  chrome.storage.sync.set({[storageKey]: items}, function(){
    console.log('保存しました。', items);
    alert('保存しました。');
  });
}

/**
 * syncストレージに保存された値を消去する
 */
function clearValues()
{
  chrome.storage.sync.clear(function(){
    console.log('データをクリアしました。');
    alert('データをクリアしました。');
    window.location.reload();
  });
}

/**
 * ページ読み込み完了時のアクション
 */
function actionLoad()
{
  setValues();
}

/**
 * 保存ボタン押下時のアクション
 */
function actionSave()
{
  const target = 'saveButton';
  const button = document.getElementById(target);

  button.addEventListener('click', function(event) {
    event.preventDefault();
    saveValues();
  });
}

/**
 * クリアボタン押下時のアクション
 */
function actionClear()
{
  const target = 'clearButton';
  const button = document.getElementById(target);

  button.addEventListener('click', function(event) {
    event.preventDefault();
    clearValues();
  });
}

/**
 * アクション一覧
 */
function actions()
{
  actionLoad();
  actionSave();
  actionClear();
}

/**
 * メイン処理
 */
function main()
{
  document.addEventListener('DOMContentLoaded', function() {
    actions();
  });
}

main();