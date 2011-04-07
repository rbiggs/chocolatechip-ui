/**
 * 
 * Copyright (c) 2009 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 * 
 * Version 1.4 - Last updated: 2009.07.09
 * 
 * Refactored for use with ChocolateChip by Robert Biggs 2010
 * Eliminated dependency on external image sprites and resolved various bugs.
 * Refactored getSelectedValues method to not return any value for disabled slots.
 *
 */
const PICKERTRANSITIONHEIGHT = "239px";
var Picker = {
	cellHeight: 44,
	friction: 0.003,
	slotData: [],


	/**
	 *
	 * Event handler
	 *
	 */
	handleEvent: function (e) {
		if (e.type == 'touchstart') {
			this.lockScreen(e);
			if (e.currentTarget.id == 'sgwt-picker-cancel' || e.currentTarget.id == 'sgwt-picker-done') {
				this.tapDown(e);
			} else if (e.currentTarget.id == 'sgwt-picker-frame') {
				this.scrollStart(e);
			}
		} else if (e.type == 'touchmove') {
			this.lockScreen(e);
			
			if (e.currentTarget.id == 'sgwt-picker-cancel' || e.currentTarget.id == 'sgwt-picker-done') {
				this.tapCancel(e);
			} else if (e.currentTarget.id == 'sgwt-picker-frame') {
				this.scrollMove(e);
			}
		} else if (e.type == 'touchend') {
			if (e.currentTarget.id == 'sgwt-picker-cancel' || e.currentTarget.id == 'sgwt-picker-done') {
				this.tapUp(e);
			} else if (e.currentTarget.id == 'sgwt-picker-frame') {
				this.scrollEnd(e);
			}
		} else if (e.type == 'webkitTransitionEnd') {
			if (e.target.id == 'sgwt-picker-wrapper') {
				this.destroy();
			} else {
				this.backWithinBoundaries(e);
			}
		} else if (e.type == 'orientationchange') {
			this.onOrientationChange(e);
		} else if (e.type == 'scroll') {
			this.onScroll(e);
		}
	},


	/**
	 *
	 * Global events
	 *
	 */
	onOrientationChange: function (e) {
		window.scrollTo(0, 0);
		this.pickerWrapper.style.top = window.innerHeight + window.pageYOffset + 'px';
		this.calculateSlotsWidth();
	},
	
	onScroll: function (e) {
		this.pickerWrapper.style.top = window.innerHeight + window.pageYOffset + 'px';
	},

	lockScreen: function (e) {
		e.preventDefault();
		e.stopPropagation();
	},

	/**
	 *
	 * Initialization
	 *
	 */
	reset: function () {
		this.slotEl = [];

		this.activeSlot = null;
		
		this.pickerWrapper = undefined;
		this.pickerSlotWrapper = undefined;
		this.pickerSlots = undefined;
		this.pickerFrame = undefined;
	},

	calculateSlotsWidth: function () {
		var div = this.pickerSlots.getElementsByTagName('div');
		for (var i = 0; i < div.length; i += 1) {
			this.slotEl[i].slotWidth = div[i].offsetWidth;
		}
	},

	create: function () {
		
		var i, l, out, ul, div;
		
		// Initialize object variables
		this.reset();	

		// Create the Spinning Wheel main wrapper
		div = document.createElement('picker');
		div.id = 'sgwt-picker-wrapper';
		// Place the Picker down the actual viewing screen
		div.style.top = window.innerHeight + window.pageYOffset + 'px';	
		div.style.webkitTransitionProperty = '-webkit-transform';
		div.innerHTML = '<toolbar id="sgwt-toolbar" class="sgwt-toolbar sgwt-custom-tint hbox" style="background-color: #333;">\
		<uibutton id="sgwt-picker-cancel">\
			<label>Cancel</label>\
		</uibutton>\
		<div class="flex1"></div>\
		<uibutton id="sgwt-picker-done">\
			<label>Done</label>\
		</uibutton>\
		</toolbar><div id="sgwt-slots-wrapper"><div id="sgwt-slots"></div></div>\
		<div id="sgwt-picker-frame">\
		<div>\
			<div></div>\
		</div>\
	</div>';

		document.body.appendChild(div);
		
		// The Picker wrapper:
		this.pickerWrapper = div;
		// Slots visible area:
		this.pickerSlotWrapper = document.getElementById('sgwt-slots-wrapper');	
		// Pseudo table element (inner wrapper):
		this.pickerSlots = document.getElementById('sgwt-slots');
		// The scrolling controller:
		this.pickerFrame = document.getElementById('sgwt-picker-frame'); 

		// Create HTML slot elements
		for (l = 0; l < this.slotData.length; l += 1) {
			// Create the slot
			ul = document.createElement('ul');
			out = '';
			for (i in this.slotData[l].values) {
				out += '<li>' + this.slotData[l].values[i] + '<' + '/li>';
			}
			ul.innerHTML = out;
			
			// Create slot container:
			div = document.createElement('div'); 
			// Add styles to the container:
			div.className = this.slotData[l].style; 
			div.appendChild(ul);
	
			// Append the slot to the wrapper
			this.pickerSlots.appendChild(div);
			// Save the slot position inside the wrapper:
			ul.slotPosition = l;	
			ul.slotYPosition = 0;
			ul.slotWidth = 0;
			ul.slotMaxScroll = this.pickerSlotWrapper.clientHeight - ul.clientHeight;
			// Add default transition:
			ul.style.webkitTransitionTimingFunction = 'cubic-bezier(0, 0, 0.2, 1)';		
			// Save the slot for later use:
			this.slotEl.push(ul);	
			
			// Place the slot to its default position (if other than 0):
			if (this.slotData[l].defaultValue) {
				this.scrollToValue(l, this.slotData[l].defaultValue);	
			}
		}
		
		this.calculateSlotsWidth();
		
		// Global events
		// Prevent page scrolling:
		document.addEventListener('touchstart', this, false);		
		// Prevent page scrolling:
		document.addEventListener('touchmove', this, false);
		// Optimize Picker on orientation change:
		window.addEventListener('orientationchange', this, true);	
		// Reposition Picker on page scroll:
		window.addEventListener('scroll', this, true);				

		// Cancel/Done buttons events:
		document.getElementById('sgwt-picker-cancel').addEventListener('touchstart', this, false);
		document.getElementById('sgwt-picker-done').addEventListener('touchstart', this, false);

		// Add scrolling to the slots:
		this.pickerFrame.addEventListener('touchstart', this, false);
	},

	open: function () {
		this.create();

		this.pickerWrapper.style.webkitTransitionTimingFunction = 'ease-out';
		this.pickerWrapper.style.webkitTransitionDuration = '400ms';
		this.pickerWrapper.style.webkitTransform = 'translate3d(0, -' + PICKERTRANSITIONHEIGHT +', 0)';
	},
	
	/**
	 *
	 * Unload
	 *
	 */
	destroy: function () {
		this.pickerWrapper.removeEventListener('webkitTransitionEnd', this, false);

		this.pickerFrame.removeEventListener('touchstart', this, false);

		document.getElementById('sgwt-picker-cancel').removeEventListener('touchstart', this, false);
		document.getElementById('sgwt-picker-done').removeEventListener('touchstart', this, false);

		document.removeEventListener('touchstart', this, false);
		document.removeEventListener('touchmove', this, false);
		window.removeEventListener('orientationchange', this, true);
		window.removeEventListener('scroll', this, true);
		
		this.slotData = [];
		this.cancelAction = function () {
			return false;
		};
		
		this.cancelDone = function () {
			return true;
		};
		
		this.reset();
		
		document.body.removeChild(document.getElementById('sgwt-picker-wrapper'));
	},
	
	close: function () {
		this.pickerWrapper.style.webkitTransitionTimingFunction = 'ease-in';
		this.pickerWrapper.style.webkitTransitionDuration = '400ms';
		this.pickerWrapper.style.webkitTransform = 'translate3d(0, 0, 0)';
		this.pickerWrapper.addEventListener('webkitTransitionEnd', this, false);
	},

	/**
	 *
	 * Generic methods
	 *
	 */
	addSlot: function (values, style, defaultValue) {
		if (!!style) {
			style = style.split(' ');
			for (var i = 0; i < style.length; i += 1) {
				style[i] = 'sgwt-' + style[i];
			}
			style = style.join(' ');
		} else {
			style = '';
		}
		var obj = { 'values': values, 'style': style, 'defaultValue': defaultValue };
		this.slotData.push(obj);
	},

	getSelectedValues: function () {
		var index, count,
		    i, l,
			keys = [], values = [];

		for (i in this.slotEl) {
			if (!this.slotEl[i].parentNode.hasClass("sgwt-disabled")) {
				// Remove any residual animation:
				this.slotEl[i].removeEventListener('webkitTransitionEnd', this, false);
				this.slotEl[i].style.webkitTransitionDuration = '0';
	
				if (this.slotEl[i].slotYPosition > 0) {
					this.setPosition(i, 0);
				} else if (this.slotEl[i].slotYPosition < this.slotEl[i].slotMaxScroll) {
					this.setPosition(i, this.slotEl[i].slotMaxScroll);
				}
	
				index = -Math.round(this.slotEl[i].slotYPosition / this.cellHeight);
	
				count = 0;
				for (l in this.slotData[i].values) {
					if (count == index) {
						keys.push(l);
						values.push(this.slotData[i].values[l]);
						break;
					}
					count += 1;
				}
			}
		}

		return { 'keys': keys, 'values': values };
	},
	
	/**
	 *
	 * Rolling slots
	 *
	 */
	setPosition: function (slot, pos) {
		this.slotEl[slot].slotYPosition = pos;
		this.slotEl[slot].style.webkitTransform = 'translate3d(0, ' + pos + 'px, 0)';
	},
	
	scrollStart: function (e) {
		// Find the clicked slot:
		// Clicked position minus left offset (should be 11px):
		var xPos = e.targetTouches[0].clientX - this.pickerSlots.offsetLeft;	

		// Find tapped slot:
		var slot = 0;
		for (var i = 0; i < this.slotEl.length; i += 1) {
			slot += this.slotEl[i].slotWidth;
			
			if (xPos < slot) {
				this.activeSlot = i;
				break;
			}
		}

		// If slot is readonly do nothing:
		if (this.slotData[this.activeSlot].style.match('disabled')) {
			this.pickerFrame.removeEventListener('touchmove', this, false);
			this.pickerFrame.removeEventListener('touchend', this, false);
			return false;
		}
		// Remove transition event (if any):
		this.slotEl[this.activeSlot].removeEventListener('webkitTransitionEnd', this, false);	
		// Remove any residual transition:
		this.slotEl[this.activeSlot].style.webkitTransitionDuration = '0';		
		
		// Stop and hold slot position:
		var theTransform = window.getComputedStyle(this.slotEl[this.activeSlot]).webkitTransform;
		theTransform = new WebKitCSSMatrix(theTransform).m42;
		if (theTransform != this.slotEl[this.activeSlot].slotYPosition) {
			this.setPosition(this.activeSlot, theTransform);
		}
		
		this.startY = e.targetTouches[0].clientY;
		this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition;
		this.scrollStartTime = e.timeStamp;

		this.pickerFrame.addEventListener('touchmove', this, false);
		this.pickerFrame.addEventListener('touchend', this, false);
		
		return true;
	},

	scrollMove: function (e) {
		var topDelta = e.targetTouches[0].clientY - this.startY;

		if (this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
			topDelta /= 2;
		}
		
		this.setPosition(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition + topDelta);
		this.startY = e.targetTouches[0].clientY;

		// Prevent slingshot effect:
		if (e.timeStamp - this.scrollStartTime > 80) {
			this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition;
			this.scrollStartTime = e.timeStamp;
		}
	},
	
	scrollEnd: function (e) {
		this.pickerFrame.removeEventListener('touchmove', this, false);
		this.pickerFrame.removeEventListener('touchend', this, false);

		// If we are outside of the boundaries, let's go back to the sheepfold:
		if (this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
			this.scrollTo(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition > 0 ? 0 : this.slotEl[this.activeSlot].slotMaxScroll);
			return false;
		}

		// Lame formula to calculate a fake deceleration:
		var scrollDistance = this.slotEl[this.activeSlot].slotYPosition - this.scrollStartY;

		// The drag session was too short:
		if (scrollDistance < this.cellHeight / 1.5 && scrollDistance > -this.cellHeight / 1.5) {
			if (this.slotEl[this.activeSlot].slotYPosition % this.cellHeight) {
				this.scrollTo(this.activeSlot, Math.round(this.slotEl[this.activeSlot].slotYPosition / this.cellHeight) * this.cellHeight, '100ms');
			}
			return false;
		}

		var scrollDuration = e.timeStamp - this.scrollStartTime;

		var newDuration = (2 * scrollDistance / scrollDuration) / this.friction;
		var newScrollDistance = (this.friction / 2) * (newDuration * newDuration);
		
		if (newDuration < 0) {
			newDuration = -newDuration;
			newScrollDistance = -newScrollDistance;
		}

		var newPosition = this.slotEl[this.activeSlot].slotYPosition + newScrollDistance;

		if (newPosition > 0) {
			// Prevent the slot to be dragged outside the visible area (top margin):
			newPosition /= 2;
			newDuration /= 3;

			if (newPosition > this.pickerSlotWrapper.clientHeight / 4) {
				newPosition = this.pickerSlotWrapper.clientHeight / 4;
			}
		} else if (newPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
			// Prevent the slot to be dragged outside the visible area (bottom margin):
			newPosition = (newPosition - this.slotEl[this.activeSlot].slotMaxScroll) / 2 + this.slotEl[this.activeSlot].slotMaxScroll;
			newDuration /= 3;
			
			if (newPosition < this.slotEl[this.activeSlot].slotMaxScroll - this.pickerSlotWrapper.clientHeight / 4) {
				newPosition = this.slotEl[this.activeSlot].slotMaxScroll - this.pickerSlotWrapper.clientHeight / 4;
			}
		} else {
			newPosition = Math.round(newPosition / this.cellHeight) * this.cellHeight;
		}

		this.scrollTo(this.activeSlot, Math.round(newPosition), Math.round(newDuration) + 'ms');
 
		return true;
	},

	scrollTo: function (slotNum, dest, runtime) {
		this.slotEl[slotNum].style.webkitTransitionDuration = runtime ? runtime : '100ms';
		this.setPosition(slotNum, dest ? dest : 0);

		// If we are outside of the boundaries go back to the sheepfold:
		if (this.slotEl[slotNum].slotYPosition > 0 || this.slotEl[slotNum].slotYPosition < this.slotEl[slotNum].slotMaxScroll) {
			this.slotEl[slotNum].addEventListener('webkitTransitionEnd', this, false);
		}
	},
	
	scrollToValue: function (slot, value) {
		var yPos, count, i;

		this.slotEl[slot].removeEventListener('webkitTransitionEnd', this, false);
		this.slotEl[slot].style.webkitTransitionDuration = '0';
		
		count = 0;
		for (i in this.slotData[slot].values) {
			if (i == value) {
				yPos = count * this.cellHeight;
				this.setPosition(slot, yPos);
				break;
			}
			
			count -= 1;
		}
	},
	
	backWithinBoundaries: function (e) {
		e.target.removeEventListener('webkitTransitionEnd', this, false);

		this.scrollTo(e.target.slotPosition, e.target.slotYPosition > 0 ? 0 : e.target.slotMaxScroll, '150ms');
		return false;
	},

	/**
	 *
	 * Buttons
	 *
	 */
	tapDown: function (e) {
		e.currentTarget.addEventListener('touchmove', this, false);
		e.currentTarget.addEventListener('touchend', this, false);
		//e.currentTarget.addClass('touched');
	},

	tapCancel: function (e) {
		e.currentTarget.removeEventListener('touchmove', this, false);
		e.currentTarget.removeEventListener('touchend', this, false);
		//e.currentTarget.removeClass('touched');
	},
	
	tapUp: function (e) {
		this.tapCancel(e);

		if (e.currentTarget.id == 'sgwt-picker-cancel') {
			this.cancelAction();
		} else {
			this.doneAction();
		}
		//console.log("This is closing!");
		this.close();
	},
	
	setCancelAction: function (action) {
		if (!action || typeof action !== "function") {
			action = function() { return false; };
		}
		this.cancelAction = action;
	},

	setDoneAction: function (action) {
		if (!action || typeof action !== "function") {
			action = function() { return false; };
		}
		this.doneAction = action;
	},
	
	cancelAction: function () {
		return false;
	},

	cancelDone: function () {
		return true;
	}
};