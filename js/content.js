const CHROME_SYNC_STORAGE_KEY = "smtb_direct_numbers";
const SMTB_LABELS = 'span.kakunin-no-label > nobr';
const SMTB_INPUTS = 'input.kakunin-no-field';

/**
 * 全角文字を半角文字に変換する
 *
 * @param {String} str - 変換対象の文字列
 * @return {String} halfWidthText - 変換された半角文字列
 */
function zenkaku2Hankaku(str)
{
  const halfWidthText = str.replace(/[Ａ-Ｚａ-ｚ０-９－]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
  });
  return halfWidthText;
}

/**
 * 現在求められている確認番号のキーを配列で返す
 *
 * @return {Array} currentKeys - 確認番号のキー配列 e.g. ["A-1", "B-2", "D-5"]
 */
function getCurrentKeys()
{
  let currentKeys = [];
  const targets = SMTB_LABELS;
  const kakuninLabels = document.querySelectorAll(targets);

  kakuninLabels.forEach(label => {
    const labelText = label.textContent.trim().toUpperCase(); // e.g. "Ａ－１"
    const currentKey = zenkaku2Hankaku(labelText); // e.g. "A-1"
    currentKeys.push(currentKey);
  });

  console.log("currentKeys:", currentKeys);
  return currentKeys;
}

/**
 * 現在求められている確認番号の値を配列で返す
 *
 * @param {Array} currentKeys - 確認番号のキー配列 e.g. ["A-1", "B-2", "D-5"]
 * @return {Array} currentNumbers - 現在の確認番号の値配列 e.g. ["01", "12", "44"]
 */
async function getCurrentNumbers(currentKeys)
{
  const items = await loadValues();
  const currentNumbers = currentKeys.map(key => items[key]);

  console.log("currentNumbers:", currentNumbers);
  return currentNumbers;
}

/**
 * 入力欄に確認番号をセットする
 */
async function autoFillNumbers()
{
  const currentKeys = getCurrentKeys();
  const currentNumbers = await getCurrentNumbers(currentKeys);
  const targets = SMTB_INPUTS;
  const inputFields = document.querySelectorAll(targets);

  inputFields.forEach((field, index) => {
    field.value = currentNumbers[index] || ''; // 現在の番号がない場合は空文字列をセット
  });
}

/**
 * syncストレージから値を取得する
 */
async function loadValues()
{
  const storages = await chrome.storage.sync.get();
  const storageKey = CHROME_SYNC_STORAGE_KEY;
  const items = storages[storageKey];
  return items;
}

// ダイレクト番号の自動入力を実行
autoFillNumbers();
