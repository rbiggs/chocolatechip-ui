
var keyCodes = {
	66: 'bold',
	73: 'italic',
	85: 'underline'
}

var RichTextInterface = new Class({
	events: [],
	properties: [],
	
	constructor: function() {
		this.contentEditable = true;
		this.on('keydown', this.onKeyDown.boundTo(this));
		this.on('dblclick', this.onDblClick.boundTo(this));
	},
	
	exec: function(command, value) {
		document.execCommand(command, false, value);
	},
	
	onDblClick: function() {
		this.contentEditable = true;
	},
	
	onKeyDown: function(event) {
		
		if (event.keyCode == 27) { // esc
			this.contentEditable = false;
		}
		
		if (event.metaKey && event.keyCode != 91) { // metaKey is 91
			
			if (event.keyCode > 47 && event.keyCode <= 54) {
				var level = event.keyCode - 48;
				this.exec('formatBlock', level ? 'H' + level : 'P');
				event.preventDefault();
				return;
			}
			
			if (event.keyCode in keyCodes) {
				this.exec(keyCodes[event.keyCode]);
				event.preventDefault();
			} else if (event.keyCode == 76) { // L
				event.preventDefault();
				var link = prompt('Enter a link:', 'http://');
				if (link && link != 'http://') {
					this.exec('createLink', link);
				}
			} else if (event.keyCode == 86) {
				var sel = getSelection();
				var orig = sel.getRangeAt(0);
				
				setTimeout(function() {
					var range = sel.getRangeAt(0);
					range.setStart(orig.startContainer, orig.startOffset);
					sel.removeAllRanges();
					sel.addRange(range);
					if (confirm('Remove formatting from pasted text?')) {
						document.execCommand('removeFormat');
					}
				}, 10);
			} else console.log(event.keyCode);
		}
	}
});


var RichDiv = new Component({
	extend: HTMLDivElement,
	implement: RichTextInterface,
	template: new Template('<div></div>'),
	register: 'div[component=rich-text]',
	
	constructor: function() {
		RichTextInterface.call(this);
	}
});


var RichText = new Component({
	extend: HTMLDivElement,
	implement: RichTextInterface,
	template: new Template('<rich-text></rich-text>'),
	register: 'rich-text'
});
