
var report = new Report();

function Report() {

    this.HTML_DEFAULT_STYLES = '<style>\
    body {\
        font-family: sans-serif;\
        font-size: 62.5%;\
        background-color: rgb(251,251,251);\
    }\
    h1,h2 {\
        font-weight: normal;\
        color: rgb(0,0,180);\
        padding-left: 0.5rem;\
    }\
    h1 {\
        font-size: 1.6rem;\
        border-left: 0.3rem solid blue;\
    }\
    h2 {\
        font-size: 1.4rem;\
        margin-top: 3rem;\
        border-left: 0.3rem solid red;\
    }\
    p,td,th {\
        font-size: 1rem;\
    }\
    .info > p {\
        padding: 0;\
        margin: 0.8rem 0 0 1rem;\
        font-size: 0.9rem;\
    }\
    table {\
        border-collapse: collapse;\
        width: 85%;\
    }\
    td,th {\
        padding: 0.7rem 0.5rem;\
        border: 0.1rem solid gray;\
    }\
    th {\
        text-align: left;\
        background-color: rgb(229,239,250);\
    }\
    tbody th {\
        font-weight: normal;\
        width: 40%;\
        background-color: rgb(245,245,245);\
    }\
    td.lvl { width: 4rem; }\
    .pass { background-color: rgb(239,251,245) }\
    .fail { background-color: rgb(251,239,245) }\
    .na { background-color: rgb(240,240,240) }\
    .unverified { background-color: rgb(255,255,240) }\
    .todo { background-color: rgb(255,255,200) }\
    .label {\
        font-weight: bold;\
        display: inline-block;\
        width: 12rem;\
        vertical-align: top;\
    }\
    .value {\
        display: inline-block;\
        max-width: 40rem;\
    }\
</style>';

}



Report.prototype.validateConformanceReport = function() {
    
    var err = false;
    
    error.clearAll();
    
    
    /* validate the title in the config */
    var title_elem = document.getElementById('title');
    
    if (title_elem.value.trim() == '') {
        title_elem.setAttribute('aria-invalid',true);
        title_elem.parentNode.classList.add(format.BG.ERR);
        error.write('config','title','err','Title is a required field.');
        err = true;
    }
    
    else {
        title_elem.setAttribute('aria-invalid',false);
        title_elem.parentNode.classList.remove(format.BG.ERR);
    }
    
    
    /* check there is a custom style sheet url */
    if (document.getElementById('add-custom-css').checked) {
        var url_elem = document.getElementById('custom-css-url');
        if (url_elem.value.trim() == '') {
            url_elem.setAttribute('aria-invalid',true);
            url_elem.parentNode.classList.add(format.BG.ERR);
            error.write('config','add-custom-css','err','URL to the custom style sheet is required.');
            err = true;
        }
        
        else {
            url_elem.setAttribute('aria-invalid',false);
            url_elem.parentNode.classList.remove(format.BG.ERR);
        }
    }

    /* validate that the stated conformance matches the evaluation results */
    var failed = document.querySelectorAll('input[value="unverified"]:checked, section.a input[value="fail"]:checked, section.aa input[value="fail"]:checked, section#eg-2 input[value="fail"]:checked').length > 0 ? true : false;
    var wcag_result = document.querySelector('input[name="conf-result"]:checked').value;
    var conf_elem = document.getElementById('conf-result');
    
    if ((wcag_result != 'fail') && failed) {
        conf_elem.classList.add(format.BG.ERR);
        error.write('conformance','conf-result','err','Conformance to the EPUB specification claimed, but report contains unverified success criteria and/or failures.');
        err = true;
    }
    
    else {
        /* also check that the form configured wcag level matches the stated conformance */
        if (conf.wcag_level != wcag_result) {
            if (conf.wcag_level == 'a') {
                conf_elem.classList.add(format.BG.ERR);
                error.write('conformance','conf-result','err','Tool is configured for testing Level A but Level AA conformance has been claimed.');
            }
            else {
                conf_elem.classList.add(format.BG.WARN);
                error.write('conformance','conf-result','warn','Tool is configured for testing Level AA but Level A conformance has been claimed.');
            }
            err = true;
        }
        else {
            conf_elem.classList.remove(format.BG.ERR);
        }
    }
    
    if (!conf_meta.validate(true)) {
        err = true;
    }
    
    if (!disc.validate(true)) {
        err = true;
    }
    
    if (err) {
        if (!confirm('Report did not validate successfully!\n\nClick Ok to generate anyway, or Cancel to exit.')) {
            return;
        }
    }
    
    this.generateConformanceReport();
}


Report.prototype.generateConformanceReport = function() {
    
    var criteria = {
        'wcag': document.querySelectorAll('.a, .aa, .aaa'),
        'epub': document.querySelectorAll('.epub')
    }
    
    var title = document.getElementById('title').value;
    
    var reportHeader = '<h1>Accessibility Conformance Report for ' + title + '</h1>\n';
    
    reportHeader += '<div class="info">\n';
    
    /* add publication info */
    
    var info = {'title': 'name', 'author': 'author', 'identifier': 'identifier', 'publisher': 'publisher'};
    
    for (var key in info) {
        var value = document.getElementById(key).value.trim();
        if (value != '') {
            reportHeader += format.pubInfo(key,format.toTitleCase(key),value,info[key]);
        }
    }
    
    reportHeader += format.pubInfo('format','Publication Format', 'EPUB ' + document.querySelector('input[name="epub-format"]:checked').value);
    
    var reportTable = '';
    var stat = { "pass": 0, "fail": 0, "na": 0, "unverified": 0 };
    
    var showAA = document.getElementById('show-aa').checked;
    var showAAA = document.getElementById('show-aaa').checked;
    
    for (var cat in criteria) {
    
        reportTable += '<h2 id="' + cat + '">' + cat.toUpperCase() + ' Conformance</h2>\n<table>\n<thead>\n<tr><th>Success Criteria</th>\n';
        reportTable += (cat == 'wcag') ? '<th>Level</th>' : ''; 
        reportTable += '<th>Result</th>\n</thead>\n<tbody>\n';
        
        for (var i = 0; i < criteria[cat].length; i++) {
            
            var conf_level = criteria[cat][i].classList.contains('a') ? 'a' : (criteria[cat][i].classList.contains('aa') ? 'aa' : (criteria[cat][i].classList.contains('aaa') ? 'aaa' : 'epub'));
            
            // whether to include in stats for meeting the user specified wcag level
            var log = (conf_level == 'aaa' || conf.wcag_level == 'a' && conf_level != 'a') ? false : true;
            
            var status = document.querySelector('input[name="'+criteria[cat][i].id+'"]:checked').value;
            
            // skip AA (if A conformance) and AAA (all the time) SCs if not selected to show in config options
            if ((conf_level == 'aa' && conf.wcag_level == 'a' && !showAA) || (conf_level == 'aaa' && !showAAA)) {
                continue;
            }
            
            // skip reporting AA (if A conformance) and AAA (all the time) SCs if they are n/a
            if ((conf_level == 'aaa' || (conf_level == 'aa' && conf.wcag_level == 'a'))
                    && (status == 'unverified')) {
                continue;
            }
            
            reportTable += '<tr>\n<th>' + (criteria[cat][i].getElementsByClassName('label'))[0].textContent + '</th>\n';
            
            if (cat == 'wcag') {
                reportTable += '<td class="lvl">' + conf_level.toUpperCase() + '</td>\n';
            }
            
            reportTable += '<td class="' + status + '"><span class="label">';
            
            if (status == 'pass') {
                reportTable += 'Pass</span>'
                if (log) {
                    stat.pass += 1;
                }
            }
            
            else if (status == 'fail') {
                var err = document.getElementById(criteria[cat][i].id+'-err').value;
                reportTable += 'Fail:</span> ' + ((err == '') ? 'No reason provided.' : err);
                if ((criteria[cat]['name'] != 'EPUB') || ((criteria[cat]['name'] == 'EPUB') && (criteria[cat][i].id != 'eg-2'))) {
                    if (log) {
                        stat.fail += 1;
                    }
                }
            }
            
            else if (status == 'na') {
                reportTable += 'Not Applicable</span>';
                if (log) {
                    stat.na += 1;
                }
            }
            
            else {
                reportTable += 'Not checked</span>';
                if (log) {
                    stat.unverified += 1;
                }
            }
            
            if ((document.getElementsByName(criteria[cat][i].id+'-note'))[0].checked) {
                reportTable += '\n<p><span class="label">Additional info:</span> <span class="value">' + document.getElementById(criteria[cat][i].id+'-info').value + '</span></p>\n';
            }
            
            reportTable += '</td>\n</tr>\n';
        }
        
        reportTable += '</tbody>\n</table>';
    }
    
    /* add conformance */
    
    var wcag_conf = document.querySelector('input[name="conf-result"]:checked').value;
    var wcag_label = (wcag_conf == 'a') ? 'EPUB + WCAG Level A' : (wcag_conf == 'aa' ? 'EPUB + WCAG Level AA' : 'Failed');
    
    reportHeader += format.pubInfo('conformance','Conformance',wcag_label);
    
    var cert = ['certifier','credential'];
    
    for (var i = 0; i < cert.length; i++) {
        var value = document.getElementById(cert[i]).value.trim();
        if (value != '') {
            reportHeader += format.pubInfo(cert[i],format.toTitleCase(cert[i]),value);
        }
    }
    
    var stats = (stat.fail ? stat.fail + ' fail, ' : '') + (stat.unverified ? stat.unverified + ' unverified, ' : '') + stat.pass + ' pass' + (stat.na ? ', ' + stat.na + ' not applicable' : '');
    
    reportHeader += format.pubInfo('result','Statistics',stats);
    
    reportHeader += format.pubInfo('timestamp','Report Generated',format.generateTimestamp('at'));
    
    reportHeader += '</div>\n';
    
    var discoveryInfo = '<h2 id="discovery">Discovery Information</h2>\n<div class="info">';
    
    discoveryInfo += format.pubInfo('summary','Accessibility Summary',document.getElementById('summary').value,'accessibilitySummary');
    discoveryInfo += format.pubInfo('features','Accessibility Features',this.listDiscoveryMeta('features','accessibilityFeature'));
    discoveryInfo += format.pubInfo('hazards','Accessibility Hazards',this.listDiscoveryMeta('hazards','accessibilityHazard'));
    discoveryInfo += format.pubInfo('modes','Access Mode(s)',this.listDiscoveryMeta('modes','accessMode'));
    discoveryInfo += '</div>';
    
    var cssURL = document.getElementById('add-custom-css').checked ? document.getElementById('custom-css-url').value.trim() : '';
    
    var css = document.getElementById('default-styles').checked ? this.HTML_DEFAULT_STYLES : '';
        css += (cssURL != '') ? '\n<link rel="stylesheet" type="text/css" href="'+cssURL+'"/>\n' : ''; 
    
    var reportWin = window.open('report.html','reportWin');
        reportWin.addEventListener('load', function() { reportWin.init('Accessibility Conformance Report for ' + title, css, reportHeader + discoveryInfo + reportTable); });
}



Report.prototype.addReporting = function() {

    var sc = document.querySelectorAll('.a, .aa, .aaa, .epub');
    
    for (var i = 0; i < sc.length; i++) {
    
        /* add wrapper div with reporting class for hiding later */
        var report = document.createElement('div');
            report.setAttribute('class','reporting');
        
        /*  add the status radio buttons */
        var status = document.createElement('fieldset');
            status.setAttribute('class','status');
        
        var status_legend = document.createElement('legend');
            status_legend.appendChild(document.createTextNode('Status:'));
        
        status.appendChild(status_legend);
        
        var stats = {'unverified': 'Unverified', 'pass': 'Pass', 'fail': 'Fail', 'na': 'N/A'};
        
        for (var stat in stats) {
            var status_label = document.createElement('label');
            var status_input = document.createElement('input');
                status_input.setAttribute('type','radio');
                status_input.setAttribute('name', sc[i].id);
                status_input.setAttribute('value',stat);
                status_input.setAttribute('onclick','conf.setStatus(this)');
            
            if (stat == 'unverified') {
                status_input.setAttribute('checked','checked');
            }
            
            var status_span = document.createElement('span');
                status_span.appendChild(status_input);
                status_span.appendChild(document.createTextNode(' ' + stats[stat]));
            
            status_label.appendChild(status_span);
            status.appendChild(status_label);
            status.appendChild(document.createTextNode(' '));
        }
        
        /* add the failure textarea */
        
        var err = document.createElement('div');
            err.setAttribute('id',sc[i].id+'-fail');
            err.setAttribute('class','failure');
        
        var err_p = document.createElement('p');
        
        var err_label = document.createElement('label');
            err_label.setAttribute('for',sc[i].id+'-err');
            err_label.appendChild(document.createTextNode('Describe failure(s):'));
        
        err.appendChild(err_label);
        
        var err_textarea = document.createElement('textarea');
            err_textarea.setAttribute('id',sc[i].id+'-err');
            err_textarea.setAttribute('rows','5');
            err_textarea.setAttribute('cols','80');
        
        err.appendChild(err_textarea);
        
        status.appendChild(err);
        
        report.appendChild(status);
        
        /* add the note checkbox and textarea */
        
        var note_p = document.createElement('p');
        
        var note_label = document.createElement('label');
        
        var note_input = document.createElement('input');
            note_input.setAttribute('type','checkbox');
            note_input.setAttribute('name',sc[i].id+'-note');
            note_input.setAttribute('onclick','conf.showNote(this)');
        
        note_label.appendChild(note_input);
        note_label.appendChild(document.createTextNode(' Add Note'));
        
        note_p.appendChild(note_label);
        
        report.appendChild(note_p);
        
        var note_div = document.createElement('div');
            note_div.setAttribute('id',sc[i].id+'-note');
            note_div.setAttribute('class','info');
        
        var note_textarea = document.createElement('textarea');
            note_textarea.setAttribute('id',sc[i].id+'-info');
            note_textarea.setAttribute('rows','5');
            note_textarea.setAttribute('cols','80');
            note_textarea.setAttribute('aria-label','Note');
        
        note_div.appendChild(note_textarea);
        
        report.appendChild(note_div);
        
        sc[i].appendChild(report);
    }
}


/* generate the reporting fields when page loads */
window.onload = report.addReporting();


/* return discovery metadata sets as strings */

Report.prototype.listDiscoveryMeta = function(id,prop) {
    var elemList = document.getElementById(id).getElementsByTagName('input');
    var str = '';
    
    for (var i = 0; i < elemList.length; i++) {
        if (elemList[i].checked) {
            str += '<span property="' + prop + '">' + elemList[i].parentNode.textContent.trim() + '</span>, ';
        }
    }
    
    str = str.replace(/, $/,'');
    
    return (str == '' ? 'Not specified' : str);
}



Report.prototype.openConfig = function() {
    document.getElementById('label_config').click();
}
