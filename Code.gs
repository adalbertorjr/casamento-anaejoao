function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById('1W6Af3a--t6w5RcUBnwnGfvt7mQkswxRFmRtFk25y2q0').getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Data', 'Nome', 'Itens', 'Total', 'Status']);
    }

    sheet.appendRow([
      new Date(),
      data.nome,
      data.itens,
      data.total,
      data.status || 'Pendente'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', sheet: 'Casamento Ana e Joao' }))
    .setMimeType(ContentService.MimeType.JSON);
}
