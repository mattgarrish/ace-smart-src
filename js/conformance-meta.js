
var conf_meta = new ConformanceMeta();

function ConformanceMeta() {}

ConformanceMeta.prototype.generateConformanceMeta = function() {
    
    if (!this.validate()) {
        return;
    }
    
    var conf_str = 'http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-' + conf.wcag_level;
    var meta = '';
    
    if (!document.querySelector('input[name="conf-result"][value="fail"]').checked) {
        meta = format.metaTag(false,'dcterms:conformsTo',conf_str);
    }
    
    meta += format.metaTag(true,'a11y:certifiedBy',document.getElementById('certifier').value.trim());
    meta += format.metaTag(true,'a11y:certifierCredential',document.getElementById('credential').value);
    meta += format.metaTag(false,'a11y:certifierReport',document.getElementById('reportLink').value);
    
    document.getElementById('conf-meta').value = meta;
}


ConformanceMeta.prototype.validate = function (quiet) {
    
    if (!quiet) {
        error.clearAll('conformance');
    }
    
    var cert_elem = document.getElementById('certifier');
    var certifier = cert_elem.value.trim();
    
    if (certifier == '') {
        error.write('conformance','certifier','err','Certifier name is a required field.');
        cert_elem.setAttribute('aria-invalid',true);
        cert_elem.parentNode.classList.add(format.BG.ERR);
        
        if (quiet) {
            return false;
        }
        else {
            if (!confirm('Metadata failed validation.\n\nClick Ok to generate anyway, or Cancel to review errors.')) {
                return false;
            }
        }
    }
    
    else {
        cert_elem.parentNode.classList.remove(format.BG.ERR);
    }
    
    return true;
}

