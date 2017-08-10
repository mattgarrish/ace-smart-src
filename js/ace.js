
var ace = new Ace();

function Ace() {
	this.report = '';
}

Ace.prototype.storeJSON = function(json) {
	this.report = json;
}

Ace.prototype.loadReport = function(json) {
	document.getElementById('title').value = this.getMetadata('dc:title');
	document.getElementById('identifier').value = this.getMetadata('dc:identifier');
	document.getElementById('author').value = this.getMetadata('dc:creator');
	document.getElementById('publisher').value = this.getMetadata('dc:publisher');
}

Ace.prototype.getMetadata = function(id) {
	if (this.report['earl:testSubject']['metadata'].hasOwnProperty(id)) {
		var meta = this.report['earl:testSubject']['metadata'][id];
		
		if (Object.prototype.toString.call(meta) === '[object Array]') {
			var str = '';
			
			if () {
				
			}
			
			else {
				for (var i = 0; i < meta.length; i++) {
					str += (i > 0) ? ', ' : '';
					str += meta[i];
				}
			}
			return str;
		}
		else {
			return meta;
		}
	}
	return '';
}
