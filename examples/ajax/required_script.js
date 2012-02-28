// Example of a required script.

function outputMessage(elem, msg) {
    elem.html(msg);
}

var title = 'A silly title';

function outputCellTitle(elem, title) {
	elem.html(title);
}

var dataObj = {
	title : 'A title goes here',
	content : 'This is content residing in the dataObj imported from the "required_script.js" file.'
}

var guys = [
	'Joe', 'Howard', 'Sam', 'Bob', 'Charlie'
];