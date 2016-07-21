function doPost(req) {
  var files= DriveApp.getFilesByName(req.parameters.filename);
  
  
  //var newFile=file.makeCopy(req.parameters.filename);
  
  while (files.hasNext())
  {
    
    DriveApp.removeFile(files.next());
  }
  
  var dataJson = req.parameters.data;
    var json = JSON.parse(dataJson);
  //return ContentService.createTextOutput(dataJson).setMimeType(ContentService.MimeType.JSON);
  
  var ss=createReport(req.parameters.filename,json);
  
  /*var response = {
    success: true,
    id: reportId
  };*/
  
  //var link= ss.;
 
  
  SpreadsheetApp.setActiveSpreadsheet(ss);
  
  return HtmlService.createHtmlOutput("<script>location.href='"+ss.getUrl()+"';</script>");
  
  //return ContentService.createTextOutput(js).setMimeType(ContentService.MimeType.JAVASCRIPT);
  
}


function createReport(fname,data) {
  
  var ss= SpreadsheetApp.create(fname);
  
  var totSheet= ss.getActiveSheet();
  totSheet.setName("Resumen de datos trimestrales");
  
  data.forEach(function(row) {
    var url=row[0];
    row[0]="";
    totSheet.appendRow(row); 
    if (url.indexOf("https://")!==-1) {
      try {
        var img=UrlFetchApp.fetch(url,{muteHttpExceptions: true});
        //totSheet.getRange(totSheet.getLastRow(), 1).setValue("");
        totSheet.insertImage(img.getBlob(), 1, totSheet.getLastRow());
        totSheet.setRowHeight(totSheet.getLastRow(), 90);
      } catch(e) {}  
      
    }
    
    if (row[2] && row[2].indexOf("TOTAL")!==-1) {
      totSheet.getRange(totSheet.getLastRow(), 1).setBorder(true, false, false, false, true, true, "black", null).setBackground("grey").setFontWeight("bold");
      totSheet.getRange(totSheet.getLastRow(), 2).setBorder(true, false, false, false, true, true, "black", null).setBackground("grey").setFontWeight("bold");
       totSheet.getRange(totSheet.getLastRow(), 3).setBorder(true, false, false, false, true, true, "black", null).setBackground("grey").setFontWeight("bold");
      totSheet.getRange(totSheet.getLastRow(), 4).setBorder(true, false, false, false, true, true, "black", null).setBackground("grey").setFontWeight("bold");
      totSheet.getRange(totSheet.getLastRow(), 5).setBorder(true, false, false, false, true, true, "black", null).setBackground("grey").setFontWeight("bold");
       totSheet.setRowHeight(totSheet.getLastRow(), 50);
    }
    
    if (row[1] && row[1].indexOf("Canal")!==-1) {
      totSheet.getRange(totSheet.getLastRow(), 2).setFontWeight("bold").setHorizontalAlignment('center').setFontSize(14);
      totSheet.getRange(totSheet.getLastRow(), 3).setFontWeight("bold").setHorizontalAlignment('center').setFontSize(14);
      totSheet.getRange(totSheet.getLastRow(), 4).setFontWeight("bold").setHorizontalAlignment('center').setFontSize(14);
      totSheet.getRange(totSheet.getLastRow(), 5).setFontWeight("bold").setHorizontalAlignment('center').setFontSize(14);
    }
  });
  //totSheet.autoResizeColumn(2);totSheet.autoResizeColumn(3);
  
  totSheet.hideRow(totSheet.getRange(totSheet.getLastRow(),2));
  
  totSheet.setColumnWidth(1, 123);
  totSheet.setColumnWidth(2, 200);
  totSheet.setColumnWidth(3, 250);
  
  genChannelRevenue(ss,JSON.parse(Utilities.newBlob(Utilities.base64Decode(data[data.length-1][1],Utilities.Charset.UTF_8)).getDataAsString()));
  
  return ss;
   
}


function genChannelRevenue(ss,dataSource) {
  //var ss = SpreadsheetApp.getActiveSpreadsheet();
  
    
  if ((sheet=ss.getSheetByName('Grafico de ganancias'))!=null)
  {
    ss.setActiveSheet(sheet);
    return;
  }
  var sheet= ss.insertSheet('Grafico de ganancias');
  
  var rangeA=sheet.getRange("A1:A"+dataSource.videos.length);  
  var rangeB=sheet.getRange("B1:B"+dataSource.videos.length); 
  
  var rangeC=sheet.getRange("C1:C"+dataSource.channels.length);  
  var rangeD=sheet.getRange("D1:D"+dataSource.channels.length); 
  
  var i=1;
  var colors=[],chColors=[];
  var lastChannel = "",colR=0,colG=0,colB=0,ch=[];
  var alpha =1.0;
  var k=10;
  dataSource.videos.forEach(function(video) {
    
    if (video.channel == lastChannel) { //alpha gradient
       
      if (colR+k < 255 && colG+k < 255 && colB+k < 255) {
       colR+=k;
       colG+=k;
       colB+=k;
        
      } else if(colR-k >= 0 && colG-k >= 0 && colB-k >= 0) {
        colR-=k;
        colG-=k;
        colB-=k;
        
      }
       
      
      
       //if (colR+k > 250 || colG+k > 250 || colB+k > 255) k=-k;
      //alpha-= 0.01; //Math.random().toPrecision(2);
       
      
      
    } else { // new color
       colR = Math.ceil(Math.random()*245);
       colG = Math.ceil(Math.random()*245);
       colB = Math.ceil(Math.random()*245);
       
    }
    
    
    
   // colors.push("rgb("+Math.round(colR*alpha)%255+","+Math.round(colG*alpha)%255+","+Math.round(colB*alpha)%255+")");
    
   // colors.push("hsl("+colR%255+","+colG%255+","+colB%255+")");
    
    colors.push("hsl(120,100%,50%)");
    
    
    sheet.getRange(i, 1).setValue(video.title);
    sheet.getRange(i, 2).setValue(parseFloat(video.earnings));
    
    //channels[video.channel]+= video.views;
       
   lastChannel = video.channel; 
   i++; 
  });
  
  //Browser.msgBox(JSON.stringify(colors));
  sheet.hideColumns(1);sheet.hideColumns(2);sheet.hideColumns(3);sheet.hideColumns(4);
  //Browser.msgBox(ch);
 
  var j=1; 
  dataSource.channels.forEach(function(channel) {
    
    sheet.getRange(j, 3).setValue(channel.channel);
    sheet.getRange(j, 4).setValue(channel.views);
  
    j++;
    
  });
     
  
  //Browser.msgBox(JSON.stringify(chColors));
 var chart = sheet.newChart()
     .setChartType(Charts.ChartType.PIE)
     .addRange(rangeA)
     .addRange(rangeB)
     .setPosition(3, 3, 0, 0)
     .asPieChart()
     .setTitle("Ganancias agrupados por canal (mismo tono de color)\n Total por trimestre: "+parseFloat(dataSource.totals.earnings).toPrecision(2)+" USD")
     .set3D()
     .setColors(colors)
     .build();
  
var chart2 = sheet.newChart()
     .setChartType(Charts.ChartType.BAR)
     .addRange(rangeC)
     .addRange(rangeD)
     .setPosition(3, 12, 0, 0)
     .asBarChart()
     .setXAxisTitle("Vistas").setYAxisTitle("Canal")     
     .setTitle("Vistas de cada canal")
     //.setColors(chColors)
     .build();
  
 sheet.insertChart(chart);
 sheet.insertChart(chart2);
  

}

