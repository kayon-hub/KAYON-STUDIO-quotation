// ============================================
// KAYON STUDIO 報價合約 — 自動寄信 + 短連結
// ============================================
// 部署步驟：
// 1. 前往 https://script.google.com → 開啟原本的專案
// 2. 把這段程式碼貼進去（全部取代舊的）
// 3. 點選「部署」→「管理部署作業」→ 鉛筆圖示編輯
// 4. 版本選「新版本」→ 按「部署」
// ============================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === "save") {
      var id = generateId();
      var store = PropertiesService.getScriptProperties();
      store.setProperty("q_" + id, JSON.stringify(data.quotation));
      return ContentService.createTextOutput(JSON.stringify({ success: true, id: id }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (data.action === "send") {
      var pdfBlob = Utilities.newBlob(
        Utilities.base64Decode(data.pdf),
        'application/pdf',
        data.filename || 'KAYON_STUDIO_報價合約.pdf'
      );

      var htmlBody = '<div style="font-family:sans-serif;color:#333;">'
        + '<h2 style="color:#4a86c8;">KAYON STUDIO 報價合約</h2>'
        + '<p>您好，</p>'
        + '<p>附件為報價合約（<strong>' + data.quoteNo + '</strong>）的已簽署 PDF 副本。</p>'
        + '<p>客戶：' + data.customerName + '<br>'
        + '報價日期：' + data.quoteDate + '<br>'
        + '封印時間：' + data.sealedAt + '</p>'
        + '<hr style="border:none;border-top:1px solid #ddd;">'
        + '<p style="font-size:12px;color:#999;">'
        + '鎧洋聲影科技工作室 KAYON STUDIO<br>'
        + '電話：03-6219005<br>'
        + 'Email：kayon@karbonxgaiaentertainment.com</p></div>';

      data.recipients.forEach(function(email) {
        GmailApp.sendEmail(email, data.subject, '', {
          htmlBody: htmlBody,
          attachments: [pdfBlob],
          name: 'KAYON STUDIO 鎧洋聲影科技工作室'
        });
      });

      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Unknown action" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var id = e.parameter.id;
    if (!id) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Missing id" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var store = PropertiesService.getScriptProperties();
    var raw = store.getProperty("q_" + id);
    if (!raw) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Not found" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: JSON.parse(raw) }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function generateId() {
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  var id = "";
  for (var i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
