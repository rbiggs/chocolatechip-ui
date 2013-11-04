#ChocolateChip - A Compact JavaScript Framework for Mobile Web Apps

###ChocolateChip-UI has been acquired by [Sourcebits Inc](http://www.sourcebits.com).

##ChocolateChip-UI

ChocolateChip-UI is a framework for making mobile Web apps. It has three components: semantic HTML5 markup, CSS and JavaScript. To successfully make an app with ChocolateChip-UI you'll need at least moderate experience working with JavaScript. This is so you can use templates, make Ajax requests and handle callbacks for user interaction. If this is beyond your current skills, consider getting someone with Web development experience to help you.

ChocolateChip-UI has its own JavaScript library, ChocolateChip, for DOM manipulation, Ajax requests, etc. It is very similar to jQuery. It was built specifically to enable the creation of ChocolateChip-UI. It is optimized for mobile devices. That means it's small and focused. It's much smaller than jQuery and loads quickly. But, it you prefer to use jQuery, ChocolateChip-UI is completely compatible with it. Just change the link for chocolatechip.js to jQuery. Then you can use jQuery coding patterns and plugins with your ChocolateChip-UI apps. Be aware that ChocolateChip-UI expects jQuery 2.0.3 or later.

Please visit [ChocolateChip-UI's Website](http://chocolatechip-ui.com) for documentation and tutorials. This project includes examples for iOS, Android and Windows Phone 8 to help you get going.

##Building 

ChocolateChip-UI uses Gruntjs to build. This is a Node package, so you'll first need to have [Node installed](http://http://nodejs.org). After installing Nodejs, or if you already have it installed, on Mac OS X or Linux use the terminal to cd to the directory. If you're on Windows, you can use the Node command prompt to do this. Once you are in the folder, run the following command in your terminal: **npm install -g grunt-cli**. If you're on Linux or Mac OS X, you'll need to run the command with **sudo** to avoid installation errors: **sudo npm install -g grunt-cli**. Enter your password when it requests. After this, run the following command in the terminal: 

**npm install && grunt** 

This will install all the dependencies for the Grunt build proces and then run the Grunt build script. This will create the following folders: **chui**, **data**, **demo**, **examples-android**, **examples-ios**, **examples-win**, **images** and **node\_modules**. You do not need **node\_modules** in your final project. The node modules are there to enable the build process with Gruntjs. **Data** and **images** are used by the examples and demo files. All you really need is what's in the **chui** folder. If you want to create a custom build, then just run **npm install**, then any of the custom build patterns listed below.

If you're going to use jQuery instead of ChocolateChipJS, then don't bother including ChocolateChipJS in your project and instead include jQuery however you want. Use version 2.0.3 or later.

If your development stack supports LESS, you can grab the LESS files in the **src/themes** folder to use directly. The LESS files have all their color values at the top of each file as LESS variables. This makes it easy for you to modify the color scheme of the themes. After modifying the LESS, you can regenerate new CSS as follows:


    // Run LESS on the iOS theme:
    grunt less:ios concat:ios cssmin:ios

    // Run LESS on the Android theme:
    grunt less:android concat:android cssmin:android

    // Run LESS on the Windows theme:
    grunt less:win concat:win cssmin:win

    // Runn LESS on all three themes:
    grunt less concat:android concat:ios concat:win cssmin


If you've modified ChocolateChipJS or ChUIJS to address a bug or add a feature, you can run JSHint against these files as follows:

    // Run JSHint on ChocolateChipJS:
    grunt: jshint:chocolatechip

    // Run JSHint on ChUIJS:
    grunt jshint:chui

    // Run JSHint on both:
    grunt jshint
    
##Custom Builds

You can create custom builds of ChocolateChip-UI for just the platform you're interested in. Here are some examples of the command-line options (You need to have run **npm install** in the directory first):

    // Build everything:
    grunt

    // Build only ChocolateChipJS:
    grunt chocolatechipjs 

    // Build only ChUIJS:
    grunt chuijs 

    // Build ChUIJS (without ChocolateChipJS) with all three themes:
    grunt chui

    // Build Android theme with ChocolateChipJS:
    grunt android 

    // iOS theme with ChocolateChipJS:
    grunt ios 

    // Windows Phone 8 theme with ChocolateChipJS:
    grunt windows 

    // Build ChocolateChip-UI without ChocolateChipJS (use with jQuery):
    grunt chui_android 

    // Build ChocolateChip-UI without ChocolateChipJS (use with jQuery):
    grunt chui_ios 

    // Build ChocolateChip-UI without ChocolateChipJS (use with jQuery):
    grunt chui_win 

    // Android examples with ChocolateChipJS:
    grunt android_examples 

    // iOS examples with ChocolateChipJS:
    grunt ios_examples 

    // Windows Phone 8 examples with ChocolateChipJS:
    grunt win_examples 

    // Android examples for use with jQuery:
    grunt android_examples_chui 

    // iOS examples for use with jQuery:
    grunt ios_examples_chui 

    // Windows Phone 8 examples for use with jQuery:
    grunt win_examples_chui 

##Test

ChocolateChip uses QUnit for tests. To run the tests, you first have to build the framework running **grunt** in the command line. Grunt does not run the tests automatically. You can run each test by opening the html files in the test folder in a browser.

###Note

You do not need Nodejs to use ChocolateChip-UI. Nodejs is only used to build the framework and examples from the source files.