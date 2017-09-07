var error = new Error();

function Error() {
	this.err_pane = '';
	this.err_msg = '';
	
	this.severity = {'err': 'ERROR', 'warn': 'WARNING'};
	
	this.visible = false;
}

Error.prototype.init = function() {
	this.err_pane = document.getElementById('error-pane');
	this.err_msg = document.getElementById('error-msg');
}

Error.prototype.clearMessages = function() {
	/* clear the message panel */
	if (this.err_msg != '') {
		while (this.err_msg.firstChild) {
			this.err_msg.removeChild(this.err_msg.firstChild);
		};
	}
}


Error.prototype.clearInvalid = function(scope) {	
	/* clear all aria-invalid attributes */
	scope = (scope != '') ? '#'+scope+' ' : ''; 
	var invalid = document.querySelectorAll(scope + '*[aria-invalid="true"]');
	for (var i = 0; i < invalid.length; i++) {
		invalid[i].setAttribute('aria-invalid',false);
	}
}


Error.prototype.clearAll = function(scope) {
	this.clearMessages();
	this.clearInvalid(scope);
	this.clearBGs(scope);
}


Error.prototype.clearBGs = function(scope) {
	var fields = { "discovery": ['accessibilityFeature','summary-field','accessibilityHazard','accessMode','accessModeSufficient','accessibilityAPI','accessibilityControl'],
				   "conformance": ['certifier']};
	
	if (scope != null && scope != '') {
		fields[scope].forEach( function(id) {
			document.getElementById(id).classList.remove(format.BG.ERR, format.BG.WARN, format.BG.PASS, format.BG.NA);
		});
	}
	
	else {
		for (var key in fields) {
			fields[key].forEach( function(id) {
				document.getElementById(id).classList.remove(format.BG.ERR, format.BG.WARN, format.BG.PASS, format.BG.NA);
			});
		}
	}
}


Error.prototype.write = function(page,id,level,msg) {
	if (this.err_msg == '') {
		return;
	}
	
	if (!this.visible) {
		this.show();
	}
	var errNo = (this.err_msg.childElementCount + 1).pad(2);
	var err_li = document.createElement('li');
		err_li.setAttribute('id', 'err'+errNo);

	var err_link = document.createElement('a');
		err_link.setAttribute('href', '#err'+errNo);
		err_link.setAttribute('onclick', "error.jumpToError('"+page+"','"+id+"'); return false;");
		err_link.appendChild(document.createTextNode('[' + this.severity[level] + '] ' + msg));
	
	err_li.appendChild(err_link);
	this.err_msg.appendChild(err_li);
}

Error.prototype.show = function() {
	this.err_pane.style.display = 'block';
	document.body.style.marginBottom = '13rem';
	this.visible = true;
}

Error.prototype.hide = function() {
	this.err_pane.style.display = 'none';
	document.body.style.marginBottom = '0';
	this.visible = false;
}

Error.prototype.alert = function(msg) {
	alert('Report is incomplete or invalid.\n\nSee error panel for more information.');
}

Error.prototype.jumpToError = function(tab,id) {
	var err_elem = document.getElementById(id);
	
	if (tab == 'config') {
		config_dialog.dialog('open');
	}
	
	else {
		document.getElementById('label_'+tab).click();
		var top = err_elem.offsetTop;
		window.scrollTo(0,top-100);
	}
	
	err_elem.focus();
}
 