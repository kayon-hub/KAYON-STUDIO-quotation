// ============================================
// KAYON STUDIO 報價合約 — 自動寄信 Google Apps Script
// ============================================
// 部署步驟：
// 1. 前往 https://script.google.com → 新增專案
// 2. 把這段程式碼貼進去（取代預設的 myFunction）
// 3. 點選「部署」→「新增部署作業」
// 4. 類型選「網頁應用程式」
// 5. 執行身分：「我」
// 6. 存取權限：「所有人」
// 7. 按「部署」→ 授權 → 複製網址
// 8. 把網址貼到 index.html 的 APPS_SCRIPT_URL 變數
// ============================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const pdfBlob = Utilities.newBlob(
      Utilities.base64Decode(data.pdf),
      'application/pdf',
      data.filename || 'KAYON_STUDIO_報價合約.pdf'
    );

    const htmlBody = `
      <div style="font-family:sans-serif;color:#333;">
        <h2 style="color:#4a86c8;">KAYON STUDIO 報價合約</h2>
        <p>您好，</p>
        <p>附件為報價合約（<strong>${data.quoteNo}</strong>）的已簽署 PDF 副本。</p>
        <p>客戶：${data.customerName}<br>
        報價日期：${data.quoteDate}<br>
        封印時間：${data.sealedAt}</p>
        <hr style="border:none;border-top:1px solid #ddd;">
        <p style="font-size:12px;color:#999;">
          鎧洋聲影科技工作室 KAYON STUDIO<br>
          電話：03-6219005<br>
          Email：kayon@karbonxgaiaentertainment.com
        </p>
      </div>
    `;

    data.recipients.forEach(function(email) {
      GmailApp.sendEmail(email, data.subject, '', {
        htmlBody: htmlBody,
        attachments: [pdfBlob],
        name: 'KAYON STUDIO 鎧洋聲影科技工作室'
      });
    });

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
