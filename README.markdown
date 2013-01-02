#ChocolateChip - A Compact JavaScript Framework for Mobile Webkit

##ChocolateChip-UI (Universal)

This version of ChocolateChip-UI has been refactored to work with three different JavaScript libraries: ChocolateChip.js, jQuery or Zepto. It uses an abstraction layer to make switching out a library easy. Please note that although ChocolateChip-UI internally does not care which of the three libraries you use, the code you write for your app needs to conform to the coding standards and feature sets of the library you choose to work with. Also note that if you choose, say jQuery as your library, you would not want to include the assets of the other libraries in your project. Of course that goes for icons as well. Don't include them all, just the ones you actually use.

It also now supports two separate themes: one for iOS and one for Android. Examine the examples for each platform to see how to use them.

ChocolateChip-UI is a mobile Web app framework using HTML5, WAML, CSS and JavaScript. It's based on the ChocolateChip JavaScript library.

The premise is simple. Use specially defined markup for clarity and conciseness to construct your app. ChocolateChip-UI's CSS and JavaScript will imbue the app with styling and basic functionality. Using simple one-liners you can active handed coded markup into sophisticated controls. Or with simple initialization routines you can create controls dynamically.

ChocolateChip-UI takes advantage of HTML5, CSS3 and ECMAScript5 to deliver a consistent, focused, easy to use and compact framework for creating mobile apps rivaling native iOS apps. At the same time care was taken to make sure every aspect of it was as transparent and easy to customize as possible so that you can more easily create the mobile Web app you desire.


Pleases visit [ChocolateChip-UI's Website](http://chocolatechip-ui.com) to access tutorials and documentation on how to best utilize it for your purposes. The download here also provides you with snippets and examples to help you get going right away.

## Building a Custom Version

ChocolateChip-UI now has a Python build script which you can use to create a customized project. It consists of two files: build.py and config.py. You run it in the terminal from the build file's position in the ChocolateChip directory. First open config.py in your text editor and change the configuration to suit your purposes. Then drap and drop the build.py file to the terminal app and hit return. It will parse the config.py file and build you a project based on that. You can configure  a path for the build, a project name, which OS to support, which JavaScript library to use, when to include an images directory and whether to include icons and which ones. Now that ChocolateChip-UI supports so many options, using the build script will simplify creating a target project based on your needs.