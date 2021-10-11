const notif = new Notification(notification);
const card = notif.movedCard();
console.log('Moved: ' + card.name());

// createSpreadsheet('bankobot', 'sheet1');

// sheet_id 
var sheet = getSpreadsheet('1x2kF_coIu8lNS2mdB96sLcBJKO0sLSajT1j03o-dGho', 'sheet1');

console.log('sheet: ' + sheet);

if(sheet === null) {
  var response = createSpreadsheet('bankobot', 'sheet1');
  console.log('sheet created successfully');
  console.log('Response: ' + response);
}


updateData('1x2kF_coIu8lNS2mdB96sLcBJKO0sLSajT1j03o-dGho', ['Benkobot','Rocks!', '\\m//' ], 1)


console.log('successfully updated');