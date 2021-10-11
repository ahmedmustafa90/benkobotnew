function get_access_token(){
	var options =  {
  		headers:{'content-type': 'application/x-www-form-urlencoded'},
  		body: "client_id="+ ___persistence.get("GOOGLE_CLIENT_ID") +"&client_secret="+ ___persistence.get("GOOGLE_CLIENT_SECRET") +"&refresh_token="+ ___persistence.get("GOOGLE_REFRESH_TOKEN") +"&grant_type=refresh_token"
	}
  	var response = ___request("POST","https://oauth2.googleapis.com/token",options);
 	var data = JSON.parse(response.getBody());	
	return data.access_token;
}


function get_spreadsheet_data(key , access_token , spreadsheet_id){
  	var token = 'Bearer '+ access_token;
  	var options =  {
    	headers:{'authorization': token},
   		qs:{'key':key},
  	}
	var response = ___request("GET","https://content-sheets.googleapis.com/v4/spreadsheets/" + spreadsheet_id,options);
	var data = JSON.parse(response.getBody());
  	return data;
}


function sheet_by_name(spreadSheet_obj,name,access_token,key,spreadsheet_id){
	var sheets = spreadSheet_obj.sheets;
  	try{
  		sheets.forEach(sheet=>{
    		if(name == sheet.properties.title) {
          		throw sheet.properties.sheetId;
        	}
    	});
    }
  	catch(e){
  		var token = 'Bearer '+ access_token;
  		var options =  {
    		headers:{'authorization': token},
   			qs:{'key':key,'alt':'json'},
    		json: {"dataFilters":[{"gridRange":{"sheetId":e}}]}
  		}
		var response = ___request("POST","https://content-sheets.googleapis.com/v4/spreadsheets/" + spreadsheet_id + '/values:batchGetByDataFilter',options);
    	var response_data =JSON.parse(response.getBody());
    	return response_data;
  	}
}

function populateData(access_token,key,spreadsheet_id,data_array,range){
  	var token = 'Bearer '+ access_token;
  	var options =  {
    	headers:{'authorization': token},
   		qs:{'key':key,'alt':'json','valueInputOption': 'RAW'},
    	json: {"values":[data_array]}  	}
	var response = ___request("POST","https://content-sheets.googleapis.com/v4/spreadsheets/" + spreadsheet_id + '/values/'+range+':append',options);    	
}


function updateDataExistingCard(access_token,key,spreadsheet_id,data_array,count,sheet_name){
  	var token = 'Bearer '+ access_token;
  	var options =  {
    	headers:{'authorization': token},
   		qs:{'key':key,'alt':'json','valueInputOption': 'RAW'},
    	json: {"values":[data_array]}  	}
	var response = ___request("PUT","https://content-sheets.googleapis.com/v4/spreadsheets/" + spreadsheet_id + '/values/'+sheet_name+'!A'+count+':Z'+count,options);
}


function createNewSpreadsheet(access_token,key,spreadsheet_name,sheet_name){
	var token = 'Bearer '+ access_token;
 	var options =  {
    	headers:{'authorization': token},
   		qs:{'key':key,'alt':'json'},
    	json:{"properties":{"title":spreadsheet_name},"sheets":[{"properties":{"title":sheet_name}}]}
    }
    var response = ___request("POST","https://content-sheets.googleapis.com/v4/spreadsheets",options);
	var data = JSON.parse(response.getBody());
  	return data.spreadsheetId;
  
}


function createSpreadsheet(spreadsheet_name,sheet_name){
	var access_token = get_access_token();
  	var key =___persistence.get("GOOGLE_KEY");
  	var response = createNewSpreadsheet(access_token,key,spreadsheet_name,sheet_name);
	return response;
}


function updateData(spreadsheet_id,data_array,count,sheet_name = "sheet1"){
	var access_token = get_access_token();
  	var key = ___persistence.get("GOOGLE_KEY");
  	var response = updateDataExistingCard(access_token,key,spreadsheet_id,data_array,count,sheet_name);
}


function appendData(spreadsheet_id,data_array,range = "sheet1!A1:Z1"){
	var access_token = get_access_token();
  	var key = ___persistence.get("GOOGLE_KEY");
  	var response = populateData(access_token,key,spreadsheet_id,data_array,range);  	
}


function getSpreadsheet(spreadsheet_id,sheet_name){
  try{
	var access_token = get_access_token();
	var key = ___persistence.get("GOOGLE_KEY");
  	var spreadSheet_data_obj = get_spreadsheet_data(key,access_token,spreadsheet_id);
  	var sheet = sheet_by_name(spreadSheet_data_obj,sheet_name,access_token,key,spreadsheet_id);  
  	return sheet.valueRanges[0].valueRange.values;
  }
  catch(e)
  {
    return null;
  }
}
