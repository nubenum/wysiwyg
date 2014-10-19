document.getElementById('editable').focus();
pE = document.getElementById('editable');
document.getElementById('editable').onclick = function (e) {
    editable_slide(false, 'image-menu') ;
    editable_slide(false, 'table-menu') ;
    editable_slide(false, 'href-menu') ;
    var elem;
    var evt = e ? e:event;
    if (evt.srcElement)  pE = evt.srcElement;
    else if (evt.target) pE = evt.target;
    if (pE == "[object HTMLImageElement]") {        
        editable_slide(true, 'image-menu', pE);
    } else if (pE == "[object HTMLTableCellElement]" || pE == "[object HTMLTableDataCellElement]") {
        editable_slide(true, 'table-menu', pE.parentNode.parentNode.parentNode);
    } else if (pE.toString().replace('http://', '') != pE.toString()) {
        editable_slide(true, 'href-menu', pE);
    }
}
try {
    document.execCommand("enableObjectResizing", false, false);
    document.execCommand("enableInlineTableEditing", false, false);
} catch (e) {};

var open_appr = '';
var open_lag = '';
function toggle_more(moreid) {
    if (open_lag != open_appr) {
        document.getElementById(open_appr).style.display = 'none';
        var db = document.getElementById(open_appr+'-button');
        db.className = db.className.replace("active", "");        
    } 
    if (moreid != null) {
        doopen = false;
        if (open_appr != null) {
            if (open_appr != moreid) doopen = true;    
        } else {
            doopen = true;
        }
        if (doopen) {
            open_appr = moreid;
            open_lag = moreid;
            window.setTimeout("open_lag = ''", 200);
            document.getElementById(moreid).style.display = 'block';
            var db = document.getElementById(open_appr+'-button');
            db.className = db.className + " active";
            //document.getElementById(moreid).focus();  
        }   
    }
    if (open_lag != open_appr) {
        open_appr = '';
    }
}
function tm_noclose(moreid) {
    open_lag = moreid;
    window.setTimeout("open_lag = ''", 200);
}
function saveSelection() {
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            var ranges = [];
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                ranges.push(sel.getRangeAt(i));
            }
            return ranges;
        }
    } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
    }
    return null;
}

function restoreSelection(savedSel) {
    if (savedSel) {
        if (window.getSelection) {
            sel = window.getSelection();
            sel.removeAllRanges();
            for (var i = 0, len = savedSel.length; i < len; ++i) {
                sel.addRange(savedSel[i]);
            }
        } else if (document.selection && savedSel.select) {
            savedSel.select();
        }
    }
}

var pE = null;
var store_sel = null;
var store_html = null;
function notebox (html, selection) {  
    var nb = document.getElementById('notebox-container'); 
    var hnb = document.getElementById(html);     
    if (hnb.className.indexOf('notebox') == -1) {
        if (selection != null) store_sel = selection;
        hnb.className = hnb.className.replace('box-content', 'notebox');
        store_html = html;
        nb.className = nb.className + ' box-active';
        document.getElementById(html).focus();
    } else {  
        if (store_sel != null) restoreSelection(store_sel);              
        if (store_html != null) hnb.className = hnb.className.replace('notebox', 'box-content');
        store_sel = null;
        store_html = null;
        nb.className = nb.className.replace('box-active', '');
    }
}
function itag (var1, var2) {
    document.getElementById('editable').focus();
    document.execCommand(var1,false,var2);
}
function iclass(option) {
    var range = window.getSelection().getRangeAt(0);
    var sel = window.getSelection();
    range.setStart( sel.anchorNode, sel.anchorOffset );
    range.setEnd(sel.focusNode,sel.focusOffset);

    highlightSpan = document.createElement("abbr");
    highlightSpan.setAttribute("className", option);
    highlightSpan.appendChild(range.extractContents());
    range.insertNode(highlightSpan);
}
function itext(text) {
    if (!document.execCommand("InsertInputText", false, text)) {
        document.execCommand("InsertHTML", false, text);
    }
}
function replaceSelection(replacementText) {
    var sel, range;
    var nd = document.createTextNode(replacementText);
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(nd);
        }
        return nd;
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.txt = replacementText;
        return null;
    }

}
function returnSelection() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}
function setSelection(el) {
    if (window.getSelection && document.createRange) {
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (document.selection && document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.select();
    }
}

var pe_active = null;
function editable_slide(dowhat, eleid, markid) {
    var cont = document.getElementById('editable-menu-container');
    if (dowhat) {
        document.getElementById(eleid).style.display = 'inline-block';
        cont.className = cont.className + ' slide';
        markid.className = markid.className + ' editable-active';
        pe_active = markid;
    } else {
        document.getElementById(eleid).style.display = 'none';
        cont.className = cont.className.replace('slide', '');
        if(pe_active != null) pe_active.className = pe_active.className.replace('editable-active', '');
    }

}
function generate_table(rows, columns) {
    document.getElementById('editable').focus();
      // creates a <table> element and a <tbody> element
      var tbl     = document.createElement("table");
      var tblBody = document.createElement("tbody");
      var cell, temp;
      // creating all cells
      for (var j = 0; j < rows; j++) {
        // creates a table row
        var row = document.createElement("tr");

        for (var i = 0; i < columns; i++) {
          // Create a <td> element and a text node, make the text
          // node the contents of the <td>, and put the <td> at
          // the end of the table row
          var cell = document.createElement("td");
          cell.innerHTML = '&nbsp;';
          row.appendChild(cell);
        }

        // add the row to the end of the table body
        tblBody.appendChild(row);
      }

      // put the <tbody> in the <table>
      tbl.appendChild(tblBody);
      // appends <table> into <body>
      pE.appendChild(tbl);

}
function add_row(isbefore) {
    var count = pE.parentNode.childNodes.length;
    i = 0;
    var tr = document.createElement('tr');
    while (i < count) {
        var td = document.createElement('td');
        td.innerHTML = '&nbsp;';
        tr.appendChild(td);
        i++;
    }
    var tbl = pE.parentNode.parentNode;
    if (isbefore) tbl.insertBefore(tr, pE.parentNode); else tbl.appendChild(tr);
}
function add_thead() {
    var count = pE.parentNode.childNodes.length;
    i = 0;
    var tr = document.createElement('tr');
    while (i < count) {
        var td = document.createElement('td');
        td.innerHTML = '&nbsp;';
        tr.appendChild(td);
        i++;
    }
    tr.className = 'thead';
    var tbl = pE.parentNode.parentNode;
    tbl.insertBefore(tr, pE.parentNode.parentNode.childNodes[0]);
}
function add_column(isbefore) {
    var arr = pE.parentNode.parentNode.childNodes;
    if(isbefore) {
        var number = 0;
        var child = pE;
        while( (child = child.previousSibling) != null ) number++;
    }

    i = 0;
    while (i < arr.length) {
        var td = document.createElement('td');
        td.innerHTML = '&nbsp;';
        if (isbefore) arr[i].insertBefore(td, arr[i].childNodes[number]); else arr[i].appendChild(td);
        i++;
    }

}
function remove_row() {
    if(pE.parentNode.parentNode.childNodes.length == 1) {
        pE.parentNode.parentNode.parentNode.parentNode.removeChild(pE.parentNode.parentNode.parentNode);
    } else {
        pE.parentNode.parentNode.removeChild(pE.parentNode);
    }
    document.getElementById('editable').click();
}
function remove_column() {
    var arr = pE.parentNode.parentNode.childNodes;

    if (pE.parentNode.childNodes.length == 1) {
        pE.parentNode.parentNode.parentNode.parentNode.removeChild(pE.parentNode.parentNode.parentNode);
    } else {
        var number = 0;
        var child = pE;
        while( (child = child.previousSibling) != null ) number++;

        i = 0;
        while (i < arr.length) {
            arr[i].removeChild(arr[i].childNodes[number]);
            i++;
        }
    }

    document.getElementById('editable').click();
}
function getChildIndex(node) {
  var i = 0;
  while( (node = node.previousSibling) ) {
    i++;
  }
  return i;
}
function imagesize(para) {
    if (para == 0) {
        pE.style.maxWidth = 'none';
        pE.style.maxHeight = 'none';
    } else if (para == 1) {
        pE.style.maxWidth = '10%';
        pE.style.maxHeight = 'none';
    } else if (para == 2) {
        pE.style.maxWidth = '20%';
        pE.style.maxHeight = 'none';
    } else if (para == 3) {
        pE.style.maxWidth = '30%';
        pE.style.maxHeight = 'none';
    } else if (para == 4) {
        pE.style.maxWidth = '40%';
        pE.style.maxHeight = 'none';
    } else if (para == 5) {
        pE.style.maxWidth = '50%';
        pE.style.maxHeight = 'none';
    } else if (para == 6) {
        pE.style.maxWidth = '100%';
        pE.style.maxHeight = 'none';
    }
}
function elementstyle(cssclass, deleclass1, deleclass2) {
    if (deleclass1 != null) pE.className = pE.className.replace(deleclass1, '');
    if (deleclass2 != null) pE.className = pE.className.replace(deleclass2, '');
    if (pE.className.indexOf(cssclass) != -1 && cssclass != null) {
        pE.className = pE.className.replace(cssclass, '');
    } else if (cssclass != null) {
        pE.className = pE.className +' '+ cssclass;
    }

}
function tablestyle(cssclass) {
var pN = pE.parentNode.parentNode.parentNode;
    if (pN.className.indexOf(cssclass) != -1) {
        pN.className = pN.className.replace(cssclass, '');
    } else {
        pN.className = pN.className +' '+ cssclass;
    }
}

function getid(ele) {
    return document.getElementById(ele);
}

getid('font-more-button').onclick = function(){toggle_more('font-more');}
getid('font-more-1').onclick = function(){itag('fontname', 'Arial');}
getid('font-more-2').onclick = function(){itag('fontname', 'Calibri');}
getid('font-more-3').onclick = function(){itag('fontname', 'Cambria');}
getid('font-more-4').onclick = function(){itag('fontname', 'Comic Sans MS');}
getid('font-more-5').onclick = function(){itag('fontname', 'Courier New');}
getid('font-more-6').onclick = function(){itag('fontname', 'Georgia');}
getid('font-more-7').onclick = function(){itag('fontname', 'Impact');}
getid('font-more-8').onclick = function(){itag('fontname', 'Times New Roman');}
getid('font-more-9').onclick = function(){itag('fontname', 'Verdana');}

getid('size-more-button').onclick = function(){toggle_more('size-more');}
getid('size-more-1').onclick = function(){document.execCommand('formatBlock', false, 'div'); itag('fontsize', 2);}
getid('size-more-2').onclick = function(){itag('formatBlock', '<h1>');}
getid('size-more-3').onclick = function(){itag('formatBlock', '<h2>');}
getid('size-more-4').onclick = function(){itag('formatBlock', '<h3>');}
getid('size-more-5').onclick = function(){itag('formatBlock', '<h4>');}

getid('size-more-6').onclick = function(){itag('fontsize', 1);}
getid('size-more-7').onclick = function(){itag('fontsize', 3);}
getid('size-more-8').onclick = function(){itag('fontsize', 4);}
getid('size-more-9').onclick = function(){itag('fontsize', 5);}
getid('size-more-10').onclick = function(){itag('fontsize', 6);}

getid('color-more-button').onclick = function(){toggle_more('color-more');}
getid('color-more-1').onclick = function(){itag('forecolor', '#000000');}
getid('color-more-2').onclick = function(){itag('forecolor', '#CF2917');}
getid('color-more-3').onclick = function(){itag('forecolor', '#CF17BC');}
getid('color-more-4').onclick = function(){itag('forecolor', '#14B876');}
getid('color-more-5').onclick = function(){itag('forecolor', '#E9A33A');}
getid('color-more-6').onclick = function(){itag('forecolor', '#17BCCF');}
getid('color-more-7').onclick = function(){itag('forecolor', '#8517CF');}
getid('color-more-8').onclick = function(){itag('forecolor', '#B87614');}
getid('color-more-9').onclick = function(){itag('forecolor', '#6BE619');}
getid('color-more-10').onclick = function(){itag('forecolor', '#808080');}
getid('color-more-11').onclick = function(){itag('forecolor', '#AFAFAF');}

getid('bold-button').onclick = function(){itag('bold');}
getid('italic-button').onclick = function(){itag('italic');}
getid('strike-button').onclick = function(){itag('strikethrough');}

getid('justify-more-button').onclick = function(){toggle_more('justify-more');}
getid('justify-more-1').onclick = function(){itag('justifyleft');}
getid('justify-more-2').onclick = function(){itag('justifycenter');}
getid('justify-more-3').onclick = function(){itag('justifyright');}
getid('justify-more-4').onclick = function(){itag('justifyfull');}
getid('justify-more-5').onclick = function(){itag('indent');}
getid('justify-more-6').onclick = function(){itag('outdent');}

getid('insert-more-button').onclick = function(){toggle_more('insert-more');}
getid('insert-more-1').onclick = function(){notebox('image-box', saveSelection());}
getid('insert-more-2').onclick = function(){generate_table(2,2);}
//getid('insert-more-3').onclick = function(){itext('[[TOC]]');}
getid('insert-more-4').onclick = function(){itext('<hr>');}
getid('insert-more-5').onclick = function(){itag('formatBlock', '<pre>');}
//getid('insert-more-6').onclick = function(){itext('[[e = mc^2]]');}
getid('insert-more-7').onclick = function(){itag('insertunorderedlist');}
getid('insert-more-8').onclick = function(){itag('insertorderedlist');}
getid('insert-more-9').onclick = function(){itag('superscript');}
getid('insert-more-10').onclick = function(){itag('subscript');}

getid('removeformat-button').onclick = function(){replaceSelection(returnSelection().replace(/<(?:.|\n)*?>/gm, ''));}
getid('link-button').onclick = function(){notebox('link-box', saveSelection());}

getid('image-box').onfocus = function(){document.getElementById('image-box-url').focus();}
getid('image-box-url').onkeypress = function(){if(event.keyCode == 13) document.getElementById('image-box-button').click();}
getid('image-box-button').onclick = function(){notebox('image-box');itag('insertimage', document.getElementById('image-box-url').value);}
getid('image-box-cancel').onclick = function(){notebox('image-box');}

getid('link-box').onfocus = function(){document.getElementById('link-box-url').focus();}
getid('link-box-url').onkeypress = function(){if(event.keyCode == 13) document.getElementById('link-box-button').click();}
getid('link-box-button').onclick = function(){
    var lu = document.getElementById('link-box-url').value; 
    notebox('link-box'); 
    if (returnSelection() == '') {
    var a = document.createElement('a'); 
    a.href = lu; 
    a.innerHTML = lu; 
    pE.appendChild(a);
    } else itag('createlink', lu);
}
getid('link-box-cancel').onclick = function(){notebox('link-box');}
getid('link-box-test').onclick = function(){if(!window.open(document.getElementById('link-box-url').value)) alert('Bad URL.');}

getid('imagesize-more-button').onclick = function(){toggle_more('imagesize-more');}
getid('imagesize-more-1').onclick = function(){imagesize(1);}
getid('imagesize-more-2').onclick = function(){imagesize(2);}
getid('imagesize-more-3').onclick = function(){imagesize(3);}
getid('imagesize-more-4').onclick = function(){imagesize(4);}
getid('imagesize-more-5').onclick = function(){imagesize(5);}
getid('imagesize-more-6').onclick = function(){imagesize(6);}
getid('imagesize-more-7').onclick = function(){imagesize(0);}

getid('imagefloat-more-button').onclick = function(){toggle_more('imagefloat-more');}
getid('imagefloat-more-1').onclick = function(){elementstyle(null, 'leftfloat', 'rightfloat');}
getid('imagefloat-more-2').onclick = function(){elementstyle('leftfloat', 'rightfloat');}
getid('imagefloat-more-3').onclick = function(){elementstyle('rightfloat', 'leftfloat');}

getid('cellborder-button').onclick = function(){tablestyle('noborder');}
getid('fullwidth-button').onclick = function(){tablestyle('fullwidth');}

getid('tablerow-more-button').onclick = function(){toggle_more('tablerow-more');}
getid('tablerow-more-1').onclick = function(){add_row(true);tm_noclose('tablerow-more');}
getid('tablerow-more-2').onclick = function(){add_row(false);tm_noclose('tablerow-more');}
getid('tablerow-more-3').onclick = function(){add_thead();}
getid('tablerow-more-4').onclick = function(){remove_row();}

getid('tablecolumn-more-button').onclick = function(){toggle_more('tablecolumn-more');}
getid('tablecolumn-more-1').onclick = function(){add_column(true);tm_noclose('tablecolumn-more');}
getid('tablecolumn-more-2').onclick = function(){add_column(false);tm_noclose('tablecolumn-more');}
getid('tablecolumn-more-3').onclick = function(){remove_column();}

getid('target-button').onclick = function(){if (pE.target != '_blank') pE.target = '_blank'; else pE.target = '';}
getid('test-button').onclick = function(){if(!window.open(pE.href)) alert('Bad URL.');}

document.body.onclick = function(){toggle_more();}    
