#!/usr/bin/python
import sys, os, shutil, string, config
global path
global name
global OS
global lib
global libScript

#---------------------------------
# Check for values assigned in config.py:
#---------------------------------
if "path" in config.opts:
	path = config.opts['path']
else:
	path = os.path.dirname(os.getcwd())

if "name" in config.opts:
	name = config.opts['name']
else:
	name = 'myApp'
	
if "os" in config.opts:
	OS = config.opts['os'].lower()
else:
	OS = 'ios'

if 'lib' in config.opts:
	lib = config.opts['lib']
	if lib == 'jquery':
		lib = lib + '-1.8.3.js'
	else:
		lib = lib + '.js'
else:
	lib = 'chocolatechip.js'

#---------------------------------
# Create script tag for library to be used:
#---------------------------------
def determineLib(lib):
	global libScript
	if lib == 'chocolatechip.js':
		libScript = '\t<script type="text/javascript" src="libs/' + lib + '"></script>\n'
	elif lib == 'jquery-1.8.3.js':
		libScript = '\t<script type="text/javascript" src="libs/' + lib + '"></script>\n'
	elif lib == 'zepto.js':
		libScript = '\t<script type="text/javascript" src="libs/' + lib + '"></script>\n'
	print 'The libScript is: ' + libScript
		
determineLib(lib)

#---------------------------------
# Template for base app file:
#---------------------------------
app = '<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="utf-8">\n\t<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n\t<meta name="apple-mobile-web-app-capable" content="yes">\n\t<title>' + name + '</title>\n\t<link rel="stylesheet" href="chui/chui.' + OS + '.css">\n' + libScript + '\t<script type="text/javascript" src="chui/iscroll.js"></script>\n\t<script type="text/javascript" src="chui/chui.' + OS + '.js"></script>\n\t<style type="text/css">\n\t\t\n\t</style>\n\t<script type="text/javascript">\n\t\t$(function() {\n\t\t\t\n\t\t});\n\t</script>\n</head>\n<body>\n<app ui-background-style="striped">\n\t<view id="main" ui-navigation-status="current">\n\t\t<navbar>\n\t\t\t<h1>' + name + '</h1>\n\t\t</navbar>\n\t\t<subview ui-associations="withNavBar">\n\t\t\t<scrollpanel>\n\t\t\t\t\n\t\t\t</scrollpanel>\n\t\t</subview>\n\t</view>\n</app>\n</body>\n</html>'

#---------------------------------
# Create directory with custom name:
#---------------------------------
os.mkdir(path + name);

#---------------------------------
# Create directory for the chosen library:
#---------------------------------
os.mkdir(path + name + '/libs')
shutil.copyfile('libs/' + lib, path + name + '/libs/' + lib)

#---------------------------------
# Create directory for ChUI files:
#---------------------------------
os.mkdir(path + name + '/chui')

#---------------------------------
# Copy ChUI files to new folder:
#---------------------------------
shutil.copyfile('chui/chui.' + OS + '.css', path + name + '/chui/chui.' + OS + '.css')
shutil.copyfile('chui/chui.' + OS + '.desktop.css', path + name + '/chui/chui.' + OS + '.desktop.css')
shutil.copyfile('chui/chui.' + OS + '.js', path + name + '/chui/chui.' + OS + '.js')
shutil.copyfile('chui/iscroll.js', path + name + '/chui/iscroll.js')

#---------------------------------
# Write base app file to folder:
#---------------------------------
html = open(path + name + '/index.html', 'w')
html.write(app);
html.close()

#---------------------------------
# If images flag is set to True, 
# create images folder:
#---------------------------------
if config.opts['images'] != False:
	os.mkdir(path + name + '/images')

#---------------------------------
# If icons flag is set to True, create 
# icons directory and copy icons to it:
#---------------------------------
if type(config.opts['icons']) is bool:
	if config.opts['icons'] == True:
		shutil.copytree('icons/', path + name + '/icons/')

#---------------------------------		
# If the icons are a list, copy the 
# list items to the new folder:
#---------------------------------
elif type(config.opts['icons']) is list:
	os.mkdir(path + name + '/icons/')
	for item in config.opts['icons']:
		shutil.copyfile('icons/' + item + '.svg', path + name + '/icons/' + item + '.svg')