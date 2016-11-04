function doPost(req) {
  var files= DriveApp.getFilesByName(req.parameters.filename);
  
  while (files.hasNext())
  {
    
    DriveApp.removeFile(files.next());
  }
   
   var dataJson = req.parameters.data;
 // return ContentService.createTextOutput(dataJson).downloadAsFile("data2.txt");
  var json = JSON.parse(dataJson);
  
  
  var ss=createReport(req.parameters.filename,json);
    
  SpreadsheetApp.setActiveSpreadsheet(ss);
      
  return HtmlService.createHtmlOutput("<script>parent.parent.opener.postMessage('"+ss.getUrl()+"','*');</script>");
      
}


function createReport(fname,data) {
  
  var ss= SpreadsheetApp.create(fname);
  
  var totSheet= ss.getActiveSheet();
  totSheet.setName("Resumen de datos trimestrales");
  var thumb="";
  data.forEach(function(row) {
    thumb=row[0];
    row[0]="";
    totSheet.appendRow(row); 
    if (thumb !== "Thumbnail" && thumb.length>10) {
     // totSheet.insertImage("data:image/jpeg;base64,"+thumb, 1, totSheet.getLastRow());
      //totSheet.setRowHeight(totSheet.getLastRow(), 90);
    }
    
    if (row[3] && row[3].indexOf("TOTAL")!==-1) {
      totSheet.getRange(totSheet.getLastRow(), 1)
      .setBorder(true, false, false, false, true, true, "black", null).setBackground("grey").setFontWeight("bold");
      totSheet.getRange(totSheet.getLastRow(), 2).setBorder(true, false, false, false, true, true, "black", null).setBackground("grey").setFontWeight("bold");
      totSheet.getRange(totSheet.getLastRow(), 3).setBorder(true, false, false, false, true, true, "black", null).setBackground("grey").setFontWeight("bold");
      totSheet.getRange(totSheet.getLastRow(), 4).setBorder(true, false, false, false, true, true, "black", null).setBackground("grey").setFontWeight("bold");
      totSheet.getRange(totSheet.getLastRow(), 5).setBorder(true, false, false, false, true, true, "black", null).setBackground("grey").setFontWeight("bold");
      totSheet.getRange(totSheet.getLastRow(), 6).setBorder(true, false, false, false, true, true, "black", null).setBackground("grey").setFontWeight("bold");
      totSheet.getRange(totSheet.getLastRow(), 7).setBorder(true, false, false, false, true, true, "black", null).setBackground("grey").setFontWeight("bold");
      totSheet.setRowHeight(totSheet.getLastRow(), 50);
    }
    
    if (row[1] && row[1].indexOf("Canal")!==-1) {
      totSheet.getRange(totSheet.getLastRow(), 2).setFontWeight("bold").setHorizontalAlignment('center').setFontSize(14);
      totSheet.getRange(totSheet.getLastRow(), 3).setFontWeight("bold").setHorizontalAlignment('center').setFontSize(14);
      totSheet.getRange(totSheet.getLastRow(), 4).setFontWeight("bold").setHorizontalAlignment('center').setFontSize(14);
      totSheet.getRange(totSheet.getLastRow(), 5).setFontWeight("bold").setHorizontalAlignment('center').setFontSize(14);
      totSheet.getRange(totSheet.getLastRow(), 6).setFontWeight("bold").setHorizontalAlignment('center').setFontSize(14);
      totSheet.getRange(totSheet.getLastRow(), 7).setFontWeight("bold").setHorizontalAlignment('center').setFontSize(14);
    }
  });
 
  
  totSheet.hideRow(totSheet.getRange(totSheet.getLastRow(),2));
  
  totSheet.setColumnWidth(1, 123);
  totSheet.setColumnWidth(2, 270);
  totSheet.setColumnWidth(3, 340);
  totSheet.setColumnWidth(4, 340);
  totSheet.setColumnWidth(5, 240);
  totSheet.setColumnWidth(6, 200);
  
  var data=JSON.parse(Utilities.newBlob(Utilities.base64Decode(data[data.length-1][1],Utilities.Charset.UTF_8)).getDataAsString())
  
  genTotalRevenue(ss,data);
  
  data.channels.forEach(function(channel) {
      genChannelRevenue(ss,data,channel);  
  });
  
  return ss;
   
}


function genChannelRevenue(ss,dataSource,channel) {
  
  var videos = dataSource.videos.filter(function(video) {
      return video.channel == channel.channel;
  });
  
  var series = dataSource.series.filter(function(serie) {
      return serie.channel == channel.channel;
  });
  
  
  var sheet = ss.insertSheet('Grafico de ganancias de canal: "'+channel.channel+'"');
  
  var rangeA=sheet.getRange("A1:A"+videos.length);  
  var rangeB=sheet.getRange("B1:B"+videos.length); 
  
  var rangeC=sheet.getRange("D1:D"+series.length);
  var rangeD=sheet.getRange("E1:D"+series.length); 
  
  
  
  var i=1;
  var colors=[],chColors=[];
  var lastSerie = "",colH=0,colS=0,colL=0,ch=[],lS;
  
  var k=0.01,k2=0.03;
  
  var hueVals = new ArrayRotate([0.1,0.5,0.4,0.7,0.9,1.0]);
  videos.forEach(function(video) {
    
    if (video.serie == lastSerie) { //HSL gradient
       
          
      
       if (colS+k<1)
         colS += k;
      
      if (colL+k2<0.85)
         colL += k2;
    
      
    } else { // new color
      
       colH = hueVals.next();
            
        colS = 0.4;
        colL = 0.2;
       
    }
    
    
   // colors.push("rgb("+Math.round(colR*alpha)%255+","+Math.round(colG*alpha)%255+","+Math.round(colB*alpha)%255+")");
    
    var rgb=hslToRgb(colH,colS,colL);
    
    colors.push("rgb("+Math.abs(rgb[0])+","+Math.abs(rgb[1])+","+Math.abs(rgb[2])+")");
    
   //colors.push("hsl(120,100%,50%)");
    
    
    sheet.getRange(i, 1).setValue(video.title);
    sheet.getRange(i, 2).setValue(parseFloat(video.earnings));
    sheet.getRange(i, 3).setValue(video.serie);
    
    //channels[video.channel]+= video.views;
       
   lastSerie = video.serie; 
   i++; 
  });
  
 
  sheet.hideColumns(1);
  sheet.hideColumns(2);
  sheet.hideColumns(3);
  sheet.hideColumns(4);
  sheet.hideColumns(5);
  
  sheet.sort(3);
 
  var j=1; 
  series.forEach(function(serie) {
    
    sheet.getRange(j, 4).setValue(serie.serie);
    sheet.getRange(j, 5).setValue(serie.views);
  
    j++;
    
  });
     
  
  //Browser.msgBox(JSON.stringify(chColors));
 var chart = sheet.newChart()
     .setChartType(Charts.ChartType.PIE)
     .addRange(rangeA)
     .addRange(rangeB)
     .setPosition(3, 3, 0, 0)
     .asPieChart()
     .setTitle("Ganancias agrupados por serie (mismo tono de color)")
     .set3D()
     .setColors(colors)
     .build();
  
var chart2 = sheet.newChart()
     .setChartType(Charts.ChartType.BAR)
     .addRange(rangeC)
     .addRange(rangeD)
     .setPosition(3, 12, 0, 0)
     .asBarChart()
     .setXAxisTitle("Reproduciones")
     .setYAxisTitle("Serie")     
     .setTitle("Reproduciones de cada serie")
     //.setColors(chColors)
     .build();
  
  sheet.insertChart(chart);
  sheet.insertChart(chart2);
 
  
  
  
  
}

function genTotalRevenue(ss,dataSource) {
  //var ss = SpreadsheetApp.getActiveSpreadsheet();
  
    
  if ((sheet=ss.getSheetByName('Grafico de ganancias totales'))!=null)
  {
    ss.setActiveSheet(sheet);
    return;
  }
  var sheet= ss.insertSheet('Grafico de ganancias totales');
  
  var rangeA=sheet.getRange("A1:A"+dataSource.videos.length);  
  var rangeB=sheet.getRange("B1:B"+dataSource.videos.length); 
  
  var rangeC=sheet.getRange("C1:C"+dataSource.channels.length);  
  var rangeD=sheet.getRange("D1:D"+dataSource.channels.length); 
  
  var i=1;
  var colors=[],chColors=[];
  var lastChannel = "",colH=0,colS=0,colL=0,ch=[];
  var alpha =1.0;
  var k=0.01,k2=0.03;
  var hueVals = new ArrayRotate([0.1,0.3,0.5,0.7,0.9,1.0]);
  dataSource.videos.forEach(function(video) {
    
    if (video.channel == lastChannel) { //HSL gradient
       
          
      
       if (colS+k<1)
         colS += k;
      
      if (colL+k2<0.85)
         colL += k2;
      
     
       
      
      
    } else { // new color
       colH = hueVals.next();//.toPrecision(2);
       colS = 0.4;//.toPrecision(2);
       colL = 0.2;
    }
    
    
    
   // colors.push("rgb("+Math.round(colR*alpha)%255+","+Math.round(colG*alpha)%255+","+Math.round(colB*alpha)%255+")");
    
    var rgb=hslToRgb(colH,colS,colL);
    
    colors.push("rgb("+Math.abs(rgb[0])+","+Math.abs(rgb[1])+","+Math.abs(rgb[2])+")");
    
   //colors.push("hsl(120,100%,50%)");
    
    
    sheet.getRange(i, 1).setValue(video.title);
    sheet.getRange(i, 2).setValue(parseFloat(video.earnings));
    
    //channels[video.channel]+= video.views;
       
   lastChannel = video.channel; 
   i++; 
  });
  
 
  sheet.hideColumns(1);
  sheet.hideColumns(2);
  sheet.hideColumns(3);
  sheet.hideColumns(4);
  
 
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
     .setTitle("Ganancias agrupados por canal (mismo tono de color)\n Total por trimestre: "+Math.round(parseFloat(dataSource.totals.earnings))+" USD")
     .set3D()
     .setColors(colors)
     .build();
  
var chart2 = sheet.newChart()
     .setChartType(Charts.ChartType.BAR)
     .addRange(rangeC)
     .addRange(rangeD)
     .setPosition(3, 12, 0, 0)
     .asBarChart()
     .setXAxisTitle("Reproduciones")
     .setYAxisTitle("Canal")     
     .setTitle("Reproduciones de cada canal")
     //.setColors(chColors)
     .build();
  
 sheet.insertChart(chart);
 sheet.insertChart(chart2);
  

}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l) {
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t) {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}



function ArrayRotate(val) {
  this.arr= val;
  
  this.pos = 0;
  
  this.next = function() {
    ret =  this.arr[this.pos];
    
    if (this.pos+1== this.arr.length) {
      
      this.pos=0;
    }
    else
      this.pos++;
    
    return ret;
  }
  
}

