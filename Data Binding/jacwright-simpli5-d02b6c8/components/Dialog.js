
var Dialog;

(function() {

var modals = 0;

Dialog = new Component({
	extend: Component,
	template: new Template('<dialog>',
			'<header>{this.title}</header>',
			'<section>',
				'<message>{this.message}</message>',
				'<buttons><button class="close">Ok</button></buttons>',
			'</section>',
		'</dialog>'),
	
	constructor: function(title, message, noClose, notModal) {
		this.title = title;
		this.message = message;
		this.modal = !notModal;
		var btns = this.findAll('.close');
		if (noClose) btns.remove();
		else {
			btns.on('click', this.close.boundTo(this));
			document.on('keydown', keyPress.boundTo(this));
		}
	},
	
	open: function() {
		if (this.modal) {
			this.modal = toElement('<modal></modal>');
			document.body.appendChild(this.modal);
		}
		document.body.appendChild(this);
		this.lastActive = document.activeElement;
		this.lastActive.blur();
		var btn = this.find('button');
		if (btn) btn.focus();
		this.dispatchEvent(new CustomEvent('open'));
	},
	
	close: function() {
		if (this.modal) {
			document.body.removeChild(this.modal);
			this.modal = true;
		}
		document.un('keydown', keyPress.boundTo(this));
		document.body.removeChild(this);
		this.lastActive.focus();
		delete this.lastActive;
		this.dispatchEvent(new CustomEvent('close'));
	}
});

// private functions
function keyPress(event) {
	if (event.keyCode == 27) {//esc
		this.close();
	}
}

})();
