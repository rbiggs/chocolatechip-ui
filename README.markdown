#ChocolateChip - A Compact JavaScript Framework for Mobile Web Apps

##ChocolateChip-UI

ChocolateChip-UI is a framework for creating pinned Web apps or hybrid apps using the latest HTML5 technologies. ChocolateChip-UI can run on three different JavaScript libraries: ChocolateChip.js, jQuery or Zepto. The choice is yours to make. It uses an abstraction layer to enable switching out a library easy. Please note that you will need to write your client side code appropriate for the library you have chosen.

It also supports two themes: one for iOS and one for Android. Examine the examples for each platform to see how to use them. This enables you to write one code base to deploy to two operating systems.

ChocolateChip-UI takes advantage of HTML5, CSS3 and ECMAScript5 to deliver a consistent, focused, easy to use and compact framework for creating mobile apps rivaling native iOS  and Android apps. At the same we have tried to make it easy to customize so that you can create amazing mobile Web apps.

Please visit [ChocolateChip-UI's Website](http://chocolatechip-ui.com) for tutorials and documentation. The project includes examples to help you get going.

## Building a Custom Project with ChocolateChip-UI

ChocolateChip-UI now has a Python build script which you can use to create a customized project. It consists of two files: build.py and config.py. You run it in the terminal from the build file's position in the ChocolateChip directory. First open config.py in your text editor and change the configuration to suit your purposes. Then drap and drop the build.py file to the terminal app and hit return. It will parse the config.py file and build you a project based on that. You can configure  a path for the build, a project name, which OS to support, which JavaScript library to use, when to include an images directory and whether to include icons and which ones. If you set the flag 'minified' to True, the build script will produce a project with minified files for you. Now that ChocolateChip-UI supports so many options, using the build script will simplify creating a target project based on your needs.

## ChocolateChip-UI with Zepto

In order to work properly with Zepto, you need to create a custom build with the data module that reproduces jQuery's data method, otherwise scrollpanels and other controls will not be able to store and retrieve data properly. The default build of Zepto only has an HTML5 data method that will not be able to store objects. See [Zepto: Building](https://github.com/madrobby/zepto) for more details about custom builds.
