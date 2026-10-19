/**
 * 카드뉴스 드라이브 업로더 (Google Apps Script 웹앱)
 *
 * 설치:
 * 1. https://script.google.com 에서 새 프로젝트를 만들고 이 코드를 붙여넣기
 * 2. 아래 TOKEN 값을 아무도 모르는 긴 문자열로 바꾸기
 * 3. 배포 > 새 배포 > 유형: 웹 앱, 실행: 나, 액세스: 모든 사용자 > 배포
 * 4. 웹 앱 URL과 TOKEN을 Claude 환경 변수 CARDNEWS_UPLOAD_URL, CARDNEWS_UPLOAD_TOKEN 으로 등록
 *
 * 요청(POST, JSON): {token, parentId, folderName, files: [{name, base64, mimeType}]}
 * 같은 이름의 폴더가 있으면 그 안의 같은 이름 파일을 덮어쓴다.
 */
const TOKEN = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';

function doPost(e) {
  const req = JSON.parse(e.postData.contents);
  if (req.token !== TOKEN) return json({ok: false, error: 'bad token'});
  const parent = DriveApp.getFolderById(req.parentId);
  const found = parent.getFoldersByName(req.folderName);
  const folder = found.hasNext() ? found.next() : parent.createFolder(req.folderName);
  const saved = [];
  (req.files || []).forEach(function (f) {
    const old = folder.getFilesByName(f.name);
    while (old.hasNext()) old.next().setTrashed(true);
    const blob = Utilities.newBlob(Utilities.base64Decode(f.base64), f.mimeType || 'image/png', f.name);
    saved.push(folder.createFile(blob).getName());
  });
  return json({ok: true, folderId: folder.getId(), folderUrl: folder.getUrl(), saved: saved});
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
