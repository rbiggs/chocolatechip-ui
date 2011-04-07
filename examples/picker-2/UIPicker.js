const PICKERTRANSITIONHEIGHT = "239px";
$.extend($, {
	UISlotData : [],
	UICreatePicker : function(opts) {
		var picker;
		var that = this;
		picker = document.createElement('picker');
		picker.setAttribute("id", opts.id);
		picker.setAttribute("class", "ui-status-hidden");
		//picker.style.top = window.innerHeight + window.pageYOffset + 'px';
		//picker.style.top = window.innerHeight + 'px';	
		 var pickerContent= '<toolbar class="hbox">\
		<button ui-implements="cancel">\
			<buttoncontent>\
				<label>Cancel</label>\
			</buttoncontent>\
		</button>\
		<div class="flex1"></div>\
		<button ui-implements="done">\
			<buttoncontent>\
				<label>Done</label>\
			</buttoncontent>\
		</button>\
		</toolbar>\
		<slotswrapper><slots>';
		var tempSlot = "";
		var tempSlotItems = "";
		var tempSlotClasses = "";
		
		opts.slots.forEach(function(slot) {
			tempSlot += "<slot class='";
			for ( var i = 0, len = slot.length; i < len; i++) {
				if (slot[i].constructor === Array) {
			tempSlotItems = "<ul>";
					//console.log(slot[i].join(" "));
					slot[i].forEach(function(item) {
						tempSlotItems += "<li>" + item + "</li>";
					});
				} else {
					if (/default-slot/i.test(slot[i])) {
						console.log(slot[i].split("=")[1]);
					} else {
					// Slot classes
						if (typeof slot[i] === "string") {
							var styles = ' ';
							var stylesArray = [];
							stylesArray = slot[i].split(" ");
							stylesArray.forEach(function(item) {
								styles += "ui-" + item + " ";
							});
							//console.log(styles.trim());
							tempSlotClasses = styles.trim();
						}
					}
				}
			}
				tempSlot += tempSlotClasses + "'>" + tempSlotItems;
				tempSlot += "</ul></slot>";
			//console.log("The slots are: " + tempSlot);
		});
		pickerContent += tempSlot + '</slots></slotswrapper>\
		<pickerframe>\
			<div>\
				<div></div>\
			</div>\
		</pickerframe>';
		picker.innerHTML = pickerContent;
		return picker;
	},
	UIAddSlotsToPicker : function() {
	
	},
	UIInsertPicker : function (el, picker, opts) {
		$(el).insert(picker);
		//console.log("#" + opts.id + " button[ui_implements=cancel]");
		$("#" + opts.id + " button[ui-implements=cancel]").bind("click", function() {
			$("#" + opts.id).toggleClass("ui-status-hidden");
		});
		$("#" + opts.id + " button[ui-implements='done']").bind("click", function() {
			opts.callback.call(this, ("#" + opts.id));
			$("#" + opts.id).toggleClass("ui-status-hidden");
		});
	},
	UIPicker : function (el, opts) {
		var picker = $.UICreatePicker(opts);
		$.UIInsertPicker(el, picker, opts);
	},
	UIShowPicker : function(id) {
		//$.UIPicker(el, opts);
		var picker = $(id);
		picker.toggleClass("ui-status-hidden");
	}
});