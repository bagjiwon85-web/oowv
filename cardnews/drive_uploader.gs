/**
 * 카드뉴스 드라이브 업로더 (Google Apps Script 웹앱)
 *
 * 드라이브 전체 권한(drive)은 Google이 "This app is blocked"로 막기 때문에,
 * 이 스크립트가 직접 만든 파일에만 접근하는 drive.file 권한만 쓴다.
 * 그래서 업로드는 스크립트가 만든 '카드뉴스 자동 업로드' 폴더 안에 쌓이고,
 * 이 폴더를 드라이브의 '카드뉴스' 폴더 안으로 한 번 옮겨 두면 이후 계속 그 안에 올라간다.
 *
 * 설치: cardnews/drive_uploader_SETUP.md 참고 (appsscript.json도 함께 붙여넣기)
 *
 * 요청(POST, JSON): {token, folderName, files: [{name, base64, mimeType}]}
 * 같은 이름의 폴더가 있으면 그 안에 넣고, 같은 이름 파일은 휴지통으로 보낸 뒤 새로 올린다.
 */
const TOKEN = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';
const ROOT_NAME = '카드뉴스 자동 업로드';
const FOLDER = 'application/vnd.google-apps.folder';

/** 편집기에서 한 번 실행: 권한 승인 + 업로드 폴더 생성. 로그에 폴더 링크가 나온다. */
function setup() {
  Logger.log('업로드 폴더: https://drive.google.com/drive/folders/' + rootId());
}

function doPost(e) {
  const req = JSON.parse(e.postData.contents);
  if (req.token !== TOKEN) return json({ok: false, error: 'bad token'});
  const folderId = childFolder(rootId(), req.folderName);
  const saved = [];
  (req.files || []).forEach(function (f) {
    find(folderId, f.name, null).forEach(function (old) {
      Drive.Files.update({trashed: true}, old.id);
    });
    const blob = Utilities.newBlob(Utilities.base64Decode(f.base64), f.mimeType || 'image/png', f.name);
    saved.push(Drive.Files.create({name: f.name, parents: [folderId]}, blob).name);
  });
  return json({ok: true, folderId: folderId,
               folderUrl: 'https://drive.google.com/drive/folders/' + folderId, saved: saved});
}

function rootId() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('ROOT_ID');
  if (id) {
    try {
      if (!Drive.Files.get(id, {fields: 'trashed'}).trashed) return id;
    } catch (err) { /* 지워졌으면 새로 만든다 */ }
  }
  id = Drive.Files.create({name: ROOT_NAME, mimeType: FOLDER}).id;
  props.setProperty('ROOT_ID', id);
  return id;
}

function childFolder(parentId, name) {
  const found = find(parentId, name, FOLDER);
  if (found.length) return found[0].id;
  return Drive.Files.create({name: name, mimeType: FOLDER, parents: [parentId]}).id;
}

function find(parentId, name, mimeType) {
  const esc = name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  let q = "name = '" + esc + "' and '" + parentId + "' in parents and trashed = false";
  if (mimeType) q += " and mimeType = '" + mimeType + "'";
  return Drive.Files.list({q: q, fields: 'files(id,name)'}).files || [];
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
