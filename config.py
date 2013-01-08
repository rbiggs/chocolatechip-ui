#!/usr/bin/python

# Please read the instructions below and change this configuration to suit your needs.
opts = {
	'path': '/Users/tom/Desktop/', 
	'name': 'Bongo', 
	'os': 'android',
	'lib': 'jquery',
	'images': False,
	'icons': False
	'minified': False
}

# README
"""
You can modify the build to suit your needs. Change the path to match where you want your new build to be. If no path is provided, the build will be output in the main ChocolateChip-UI folder. The name is the name for the folder in which the project will be placed. If no name is provided it will default to "myApp". You can designate which OS you wish to target: "ios" or "android". If no OS is provided it will default to "ios". Next decide which JavaScript library you want to use. You have three choices: "chocolatechip", "jquery" or "zepto". By default, the value for images is set to False. If you set it to True, the build will create an images folder. Please note, when using a Python boolean value of True or False, the value should not be quoted and must be capitalized. Examine the examples below carefully. By default the icons property is set to False. If you set it to True, the build will create an icons folder and copy all current icons to it. If you only want a select number of icons, you can just pass in a list of icon names. The SVG file extension will be resolved during the build process. Below are several possible configuration options:
"""
"""
opts = {
	'path': '/Users/joe/Desktop/', 
	'name': 'HappyTimes', 
	'os': 'android',
	'lib': 'chocolatechip',
	'images': True,
	'icons': ['add','bag','cog']
}
"""
"""
opts = {
	'path': '/Users/brad/Documents/', 
	'name': 'TestRun', 
	'os': 'ios',
	'lib': 'jquery',
	'images': False,
	'icons': True
}
"""