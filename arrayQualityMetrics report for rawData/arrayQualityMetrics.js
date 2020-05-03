// (C) Wolfgang Huber 2010-2011

// Script parameters - these are set up by R in the function 'writeReport' when copying the 
//   template for this script from arrayQualityMetrics/inst/scripts into the report.

var highlightInitial = [ true, true, true, true, true, false, false, false, false, true, true, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false ];
var arrayMetadata    = [ [ "1", "GSM144311.cel", "non48h", "NonAlergic", "48" ], [ "2", "GSM144347.cel", "non96h", "NonAlergic", "96" ], [ "3", "GSM144362.cel", "non0h", "NonAlergic", "0" ], [ "4", "GSM144366.cel", "non7h", "NonAlergic", "7" ], [ "5", "GSM144367.cel", "non96h", "NonAlergic", "96" ], [ "6", "GSM144368.cel", "non7h", "NonAlergic", "7" ], [ "7", "GSM144369.cel", "non48h", "NonAlergic", "48" ], [ "8", "GSM144370.cel", "non96h", "NonAlergic", "96" ], [ "9", "GSM144371.cel", "non0h", "NonAlergic", "0" ], [ "10", "GSM144372.cel", "non7h", "NonAlergic", "7" ], [ "11", "GSM144373.cel", "non48h", "NonAlergic", "48" ], [ "12", "GSM144419.cel", "non48h", "NonAlergic", "48" ], [ "13", "GSM144432.cel", "ale48h", "Alergic", "48" ], [ "14", "GSM144433.cel", "ale96h", "Alergic", "96" ], [ "15", "GSM144434.cel", "ale0h", "Alergic", "0" ], [ "16", "GSM144435.cel", "ale7h", "Alergic", "7" ], [ "17", "GSM144436.cel", "ale96h", "Alergic", "96" ], [ "18", "GSM144437.cel", "ale0h", "Alergic", "0" ], [ "19", "GSM144438.cel", "ale7h", "Alergic", "7" ], [ "20", "GSM144439.cel", "ale48h", "Alergic", "48" ], [ "21", "GSM144440.cel", "ale96h", "Alergic", "96" ], [ "22", "GSM144441.cel", "ale0h", "Alergic", "0" ], [ "23", "GSM144442.cel", "ale7h", "Alergic", "7" ], [ "24", "GSM144443.cel", "ale96h", "Alergic", "96" ], [ "25", "GSM144444.cel", "ale0h", "Alergic", "0" ], [ "26", "GSM144445.cel", "ale7h", "Alergic", "7" ], [ "27", "GSM144446.cel", "ale96h", "Alergic", "96" ], [ "28", "GSM144447.cel", "ale7h", "Alergic", "7" ], [ "29", "GSM144448.cel", "ale48h", "Alergic", "48" ], [ "30", "GSM144449.cel", "ale96h", "Alergic", "96" ] ];
var svgObjectNames   = [ "pca", "dens" ];

var cssText = ["stroke-width:1; stroke-opacity:0.4",
               "stroke-width:3; stroke-opacity:1" ];

// Global variables - these are set up below by 'reportinit'
var tables;             // array of all the associated ('tooltips') tables on the page
var checkboxes;         // the checkboxes
var ssrules;


function reportinit() 
{
 
    var a, i, status;

    /*--------find checkboxes and set them to start values------*/
    checkboxes = document.getElementsByName("ReportObjectCheckBoxes");
    if(checkboxes.length != highlightInitial.length)
	throw new Error("checkboxes.length=" + checkboxes.length + "  !=  "
                        + " highlightInitial.length="+ highlightInitial.length);
    
    /*--------find associated tables and cache their locations------*/
    tables = new Array(svgObjectNames.length);
    for(i=0; i<tables.length; i++) 
    {
        tables[i] = safeGetElementById("Tab:"+svgObjectNames[i]);
    }

    /*------- style sheet rules ---------*/
    var ss = document.styleSheets[0];
    ssrules = ss.cssRules ? ss.cssRules : ss.rules; 

    /*------- checkboxes[a] is (expected to be) of class HTMLInputElement ---*/
    for(a=0; a<checkboxes.length; a++)
    {
	checkboxes[a].checked = highlightInitial[a];
        status = checkboxes[a].checked; 
        setReportObj(a+1, status, false);
    }

}


function safeGetElementById(id)
{
    res = document.getElementById(id);
    if(res == null)
        throw new Error("Id '"+ id + "' not found.");
    return(res)
}

/*------------------------------------------------------------
   Highlighting of Report Objects 
 ---------------------------------------------------------------*/
function setReportObj(reportObjId, status, doTable)
{
    var i, j, plotObjIds, selector;

    if(doTable) {
	for(i=0; i<svgObjectNames.length; i++) {
	    showTipTable(i, reportObjId);
	} 
    }

    /* This works in Chrome 10, ssrules will be null; we use getElementsByClassName and loop over them */
    if(ssrules == null) {
	elements = document.getElementsByClassName("aqm" + reportObjId); 
	for(i=0; i<elements.length; i++) {
	    elements[i].style.cssText = cssText[0+status];
	}
    } else {
    /* This works in Firefox 4 */
    for(i=0; i<ssrules.length; i++) {
        if (ssrules[i].selectorText == (".aqm" + reportObjId)) {
		ssrules[i].style.cssText = cssText[0+status];
		break;
	    }
	}
    }

}

/*------------------------------------------------------------
   Display of the Metadata Table
  ------------------------------------------------------------*/
function showTipTable(tableIndex, reportObjId)
{
    var rows = tables[tableIndex].rows;
    var a = reportObjId - 1;

    if(rows.length != arrayMetadata[a].length)
	throw new Error("rows.length=" + rows.length+"  !=  arrayMetadata[array].length=" + arrayMetadata[a].length);

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = arrayMetadata[a][i];
}

function hideTipTable(tableIndex)
{
    var rows = tables[tableIndex].rows;

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = "";
}


/*------------------------------------------------------------
  From module 'name' (e.g. 'density'), find numeric index in the 
  'svgObjectNames' array.
  ------------------------------------------------------------*/
function getIndexFromName(name) 
{
    var i;
    for(i=0; i<svgObjectNames.length; i++)
        if(svgObjectNames[i] == name)
	    return i;

    throw new Error("Did not find '" + name + "'.");
}


/*------------------------------------------------------------
  SVG plot object callbacks
  ------------------------------------------------------------*/
function plotObjRespond(what, reportObjId, name)
{

    var a, i, status;

    switch(what) {
    case "show":
	i = getIndexFromName(name);
	showTipTable(i, reportObjId);
	break;
    case "hide":
	i = getIndexFromName(name);
	hideTipTable(i);
	break;
    case "click":
        a = reportObjId - 1;
	status = !checkboxes[a].checked;
	checkboxes[a].checked = status;
	setReportObj(reportObjId, status, true);
	break;
    default:
	throw new Error("Invalid 'what': "+what)
    }
}

/*------------------------------------------------------------
  checkboxes 'onchange' event
------------------------------------------------------------*/
function checkboxEvent(reportObjId)
{
    var a = reportObjId - 1;
    var status = checkboxes[a].checked;
    setReportObj(reportObjId, status, true);
}


/*------------------------------------------------------------
  toggle visibility
------------------------------------------------------------*/
function toggle(id){
  var head = safeGetElementById(id + "-h");
  var body = safeGetElementById(id + "-b");
  var hdtxt = head.innerHTML;
  var dsp;
  switch(body.style.display){
    case 'none':
      dsp = 'block';
      hdtxt = '-' + hdtxt.substr(1);
      break;
    case 'block':
      dsp = 'none';
      hdtxt = '+' + hdtxt.substr(1);
      break;
  }  
  body.style.display = dsp;
  head.innerHTML = hdtxt;
}
