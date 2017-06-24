
var format = new Format();

function Format() {
    this.epub_version = 3;
    this.BG = {
        "ERR": 'err',
        "NA": 'na',
        "PASS": 'pass',
        "WARN": 'warn'
    };
}

Format.prototype.metaTag = function(isMeta, property, value) {
    if (value.trim() != '') {
        if (this.epub_version == 3) {
            if (isMeta) {
                return '<meta property="' + property + '">' + value + '</meta>\n';
            }
            else {
                return '<link rel="' + property + '" href="' + value + '"/>\n';
            }
        }
        else {
            return '<meta name="' + property + '" content="' + value + '"/>\n';
        }
    }
    return '';
}

Format.prototype.pubInfo = function(id,label,value,prop) {
    return '<p id="' + id + '"><span class="label">' + label + ':</span> <span class="value"' + ((prop === undefined || prop == null || prop == '') ? '' : ' property="' + prop + '"') + '>' + value + '</span></p>\n';
}

Format.prototype.toTitleCase = function (str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

Format.prototype.setVersion = function(num) {
    this.epub_version = num;
}

Format.prototype.generateTimestamp = function(sep) {
    var today = new Date();
    var timestamp= today.toLocaleString('en-us', { month: 'long' }) + ' ' + today.getDate() + ', ' + today.getFullYear();
        timestamp += (sep == 'dash') ? '-' : ' at ' 
        timestamp += today.getHours().pad(2) + ':' + today.getMinutes().pad(2) + ':' + today.getSeconds().pad(2);
    return timestamp;
}

/* zero pad times */
Number.prototype.pad = function (len) {
    return (new Array(len+1).join("0") + this).slice(-len);
}
