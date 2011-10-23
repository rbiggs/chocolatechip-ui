#WAML&mdash;Web App Markup Language

       pO\     
      6  /\
        /OO\
       /OOOO\
     /OOOOOOOO\
    ((OOOOOOOO))
     \:~=++=~:/ 
    
    ChocolateChip-UI: A framework for mobile Web app development.
    WAML: Web App Markup Language
    
    Copyright 2011 Robert Biggs: www.choclatechip-ui.com
    License: BSD
    Version 1.0


&nbsp;

WAML introduces a set of new tags for defining and enabling the controls and functionality for creating we  apps. These are a superset of tags for use in and HTML5 document. Browsers will therefore use the HTML5 parsing engine to render the tags. All WAML tags must be well-formed, like XML. Mal-formed markup will cause noticeable rendering problems in the browser. 

Because WAML is really uses basic HTML5, you can use other HTML5 features, such as cache manifest, session storage, local storage, client-side sql database storage, and standalone mode on a mobile device. Since these are all well-documented on the Web, we will not attempt to explain how to use these with your Web app.

Because WAML is a superset of tags added on top of HTML5, it will not pass a W3C code validation test. This merely means that the validator does not know about the WAML tags and therefore does not
how to judge their correctness. Although a validator will not know about WAML tags, browsers all handle unknown markup tags consistently. They will render them as inline tags. Therefore ChocolateChip-UI supplies CSS styles to instruct browsers how to render WAML. Since Web apps are meant for installing on a mobile device's home screen, validating code for the Web is not necessary. Installed mobile Web apps will not be crawled by search bots, etc.

ChocolateChip-UI also uses another technique with some of the HTML tags it uses. Besides the regular DOM which a browser exposes for access through CSS and JavaScript, there is also a hidden or shadow DOM which browsers do not expose. For example, elements such as uibutton, select and input have child elements that cannot be accessed by JavaScript and do not appear in the DOM. They're there as the shadow DOM. ChocolateChip takes a sledge hammer to the shadow DOM by directly placing new child elements in the uibutton tag. Technically, according to specs, the uibutton tag has no child elements. But because of the shadow DOM, you can give a uibutton a child element and the browser will render it without a problem. You just need to override it's default look using *-webkit-appearance="none".* It would only depend on your styling of it to look good. Following this course, ChocolateChip provides new tags and old tags used in new ways as well as custom attributes to make the creation of controls for Web apps straightforward and intuitive.

Because a WAML document is just HTML5, it uses the html file extension. A WAML document expects the following basic document structure with links to ChocolateChip.js ChUI.js and ChUI.css. The links for favicon, startup image, etc. would need to be created for your app. Please note the the meta tag for viewport does not have a device-width value. Do not set this but instead use the viewport meta tag as displayed below. Also, if you want to use a cache manifest, you'd need to create one and change the value in the html tag to match the name of your manifest. Note, a cache manifest always has a file tile of ".manifest" and the server where you app resides needs to support this mime-type. Do an online search for "cache manifest" if you need to learn more about this feature of HTML5.
    
    <!DOCTYPE html>
    <html lang="en" manifest="cache.manifest">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <link rel="apple-touch-startup-image" href="startup.png">
        <link rel="apple-touch-icon" href="touchicon.png"/>
        <link rel="shortcut icon" href="favicon.ico">
        <title>Untitled</title>
        <link rel="stylesheet" href="chui.css">
        <style type="text/css">
            /* Custom styles for you application go here */
        </style>
        <script src="chocolatechip.js" type="text/javascript"></script>
        <script src="chui.js" type="text/javascript">
            // Custom JavaScript for your application goes here.
        </script>
    </head>
    <body>
        <app>
            <!-- Your application markup in here -->    
        </app>
    </body>
    </html>

&nbsp;

##Overriding default styles

You can override the styles of any control defined in WAML and ChocolateChip-UI by creating a new class and overriding the default values in ChUI.css, or by taking the selector and attributes from ChUI.css and overriding them in directly in a style declaration in the head of your WAML document. You can also take advantage of a technique which ChocolateChip-UI provides for creating custom tints for controls. Please refer to the documentation for ChUI.css for more information about how to modify a control's style.


&nbsp;

##WAML block and box elements:

WAML introduces the following elements for building Web apps: app, view, subview, section, navbar, toolbar, tabbar, tableview, tablecell, celltitle, cellsubtitle, celldetail, tableheader, tablefooter, popover, popup, picker, screencover, actionsheet, stack, panel, scrollpanel.



&nbsp;

##WAML inline and inline-box elements:

WAML introduces the following elements: uibutton, segmentedcontrol, icon, slider, switchcontrol, thumb, thumbprop, checkmark, deletedisclosure.


&nbsp;

<a name="app"></a>

##Tag: app

This is the root of all WAML documents. It is the first child of the body tag. It serves as the root of the ChocolateChip Web app. This tag has only one kind of child element: a view tag.

**See Also:**

[view](#view)

[subview](#subview)



&nbsp;

<a name="view"></a>

##Tag: view

This tag is always a child of the app tag. An app tag can have any number of views. A view holds one screen of content. During navigation of views, these are to the left or right of the screen and positioned into view with animation. This is handled by changing the value of their ui-navigation-status property. When this attribute has a value of "traversed", it is translated off screen to the left. When this has a value of "current", it is translated into view. When it has a value of "upcoming" it is translated off screen to the right.

A view can have any number of possible children, such as a navbar, toolbars, subviews, tableviews, stacks, etc. In most cases you will want to include a subview with a scrollpanel to allow for scrolling of content when it overflows the viewport.

You can designate a vertical styling of a view by giving it the following attribute: *ui-background-style="striped"*.

**See Also:**

[app](#app)

[subview](#subview)


&nbsp;

<a name="subview"></a>

##Tag: subview

This tag is usually a child of a view. A view could have any number of subviews. These allow you to have various chunks of data in one view through which you can toggle or navigate without leaving the current view. Normally a subview will have a scrollpanel as its first child to allow scrolling of its content.

Usually a subview will inhabit a view with a navbar a toolbar or both. A navbar is always the topmost element in a view. A toolbar could be eight at the top or at the bottom of the screen. In order to fit these possible combinations, ChocolateChip provides the ui-associations attribute for the subview to indicate whether it is with a navbar or toolbar. The usage is as follows.

**Ui-associations:**

- ui-associations="withNavBar"
- ui-associations="withTopToolBar""
- ui-associations="withNavBar withBottomToolBar"
- ui-associations="withTopToolBar withBottomToolBar"


A subew can by styled with vertical stipes like a viw with the following attribute: ui-background-style="striped".

**See Also:**

[app](#app)

[view](#view)



&nbsp;

##Box properties:

ChocolateChip-UI provides a number of box attributes to enable designating different box properties on an element. You can combine some of the box properties to achieve the desired layout effects.

<a name="ui_box"></a>

**Ui-box:**

- ui-box="horizontal"
- ui-box="vertical"

<a name="ui_box_direction"></a>

**Ui-box-direction:**

- ui-box-direction="normal"
- ui-box-direction="reverse"

<a name="ui_box_pack"></a>

**Ui-box-pack:**

- ui-box-pack="start"
- ui-box-pack="end"
- ui-box-pack="center"
- ui-box-pack="justify"


<a name="ui_box_align"></a>

**Ui-box-align:**

- ui-box-align="stretch"
- ui-box-align="center"
- ui-box-align="start"
- ui-box-align="end"


<a name="ui_box_flex"></a>

**Ui-box-flex:**

There is also the box-flex attribure. It can have any value from 0 to 10. When it has a value of 0 it has no effect.

- ui-box-flex=0
- ui-box-flex=1
- ui-box-flex=2
- ui-box-flex=3, etc.


<a name="ui_box_sizing"></a>

**Ui-box-sizing:**

There is also box sizing, which affects how the browser renders the dimensions of an element.

- ui-box-sizing="content" The width and height define the content minus the padding and border width.
- ui-box-sizing="border" The width and height include the padding and border width.



&nbsp;

<a name="stack"></a>

##Tag: stack (Paging Control)

A container for hold elements. This element uses and attribute *"ui-kind"* to indicate whether its elements are stacked vertically or horizontally:

- ui-kind="vertical"
- ui-kind="horizontal"

A stack can also used to create a paging control. This is done by giving the stack he attribute *stack ui-implements="paging"* and putting a panel tag inside of it. It bit of nesting is necessary to create the structures to enable the horizontal paging behavior. A stack contains the pnaels that will be paged. Because of the limited horizontal space in portrait mode in a handheld device it is only possible to have up to 17 pagable panels. If you need more then you should use the segmented paging control. See tutorials for how to implement it. ChocolateChip-UI automatically creates a stack underneath it with dots to indicate navigable panels based on the number of panels in your structure. All you have to do to implement the paging control is to use the right markup structure, ChocolateChip-UI will initialize it for you automatically. Here's the structure of a typical paging control:

    <stack ui-implements="paging">
        <panel>
            <stack>
                <panel>
                    <h4>Panel 1</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.</p>
                </panel>
                <panel>
                    <h4>Panel 2</h4>
                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
                </panel>
                <panel>
                    <h4>Panel 3</h4>
                    <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.</p>
                </panel>
                <panel>
                    <h4>Panel 4</h4>
                    <p> Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem.</p>
                </panel>
            </stack>
        </panel>
    </stack>


&nbsp;

<a name="uibutton"></a>

##Tag: uibutton

In WAML the uibutton tag is a WAML replacement for the HTML uibutton input to avoid conflicts with that tag's inherent styles, properties and behaviors. The uibutton can have child nodes. These can be a label or icon.

By default a uibutton tag has a particular appearance and dimensions suited for use in navbars and toolbars. You can indicate different uses of a uibutton with the ui-implements attribute. Possible values for the attribute are:

<a name="ui_implements"></a>

**Ui-implements:**

- ui-implements="done" The uibutton gets a bluish tint to stand out.
- ui-implements="delete" The uibutton has a reddish background color
- ui-implements="back" The uibutton has a left pointer.
- ui-implements="next" The uibutton has a right pointer.
- ui-implements="icon" The uibutton has no label, it only displays a icon.
- ui-implements="cancel" The uibutton is styled as a Cancel uibutton.

**See Also:**

[navigation uibuttons](#navigation_uibuttons)

[icon style uibutton](#icon_style_uibutton)

[rounded rectangle uibutton](#ui_kind_rounded_rectangle)

[action uibutton](#ui_kind_action)


You can also indicate a completely different type of uibutton from the navbar/toolbar variety by giving a uibutton a *"ui-kind"* attribute. Here are the possible values:


&nbsp;

<a name="ui_kind"></a>

**Ui-kind:**

- [ui-kind="icon"](#icon_style_uibutton) The uibutton frame and background are hidden, revealing only the icon. This type is used in navbars and toolbars.
- [ui-kind="action"](#ui_kind_action) This is a larger uibutton type usually used in action sheet or popups and popovers.
- [ui-kind="rounded-rectangle"](#ui_kind_rounded_rectangle) This is the very common uibutton with a simple and plain border and white background.


When outputting an icon in a uibutton, you can indicate the alignment of the icon in relation to the uibuttons label. By default an icon is aligned to the left of the label. You can change that with the ui-icon-align attribute:

&nbsp;

<a name="ui_icon_align"></a>

**Ui-icon-align:**

- ui-icon-align="right"
- ui-icon-align="top"
- ui-icon-align="bottom"

You can indicate the placement of a uibutton or segmented control in a navbar or toolbar with the *ui-bar-align attribute*:

&nbsp;

<a name="ui_bar_align"></a>

**Ui-bar-align:**

- ui-bar-align="left"
- ui-bar-align="center"
- ui-bar-align="right"

**See Also:**

[navbar](#navbar)

[toolbar](#toolbar)


&nbsp;

<a name="icon_style_uibutton"></a>

**Icon style uibutton:**

To display an icon in a uibutton you use an icon tag with an inline style indicating what the background image is:

**Example:**

    <uibutton>
        <icon style="background-image: url(icons/add.svg)">
        <label>Add</label>
    </uibutton>


When using icons in a uibutton, you can designate whether the icon is simply display in its original color or to use it as a mask. When using as a mask, the icon's background colors are revealed in the icon. Using background gradients on an icon with a image mask can create interesting effects. To accomplish this, instead of putting a background image on the icon, you put a *-webkit-mask image* value in its inline style definition, as illustrated below.

**Example:**

    <uibutton>
        <icon style="-webkit-mask-image: url(icons/add.svg)">
        <label>Add</label>
    </uibutton>


By default the background color used by the mask is white. If you want to change this, you can output a different background color in the icon's inline style by hand or by JavaScript. Using an rgba color value with transparency set will cause the color masked icon to appear in that color. Setting the transparency to 0 will cause no icon to show.

**Example:**

    <uibutton>
        <icon style="-webkit-mask-image: url(icons/add.svg); background-color: #ff0000">
        <label>Add</label>
    </uibutton>


**See Also:**

[ui-kind](#ui_kind)



&nbsp;

<a name="ui_kind_rounded_rectangle"></a>

**Rounded rectangle uibuttons:**

Rounded rectangle uibuttons are used in views and subview to indicate a direct action that the user can accomplish. These uibuttons are very simple: white background with a simple gray border around them. Like other uibuttons, the can have just a label, or a label and an icon. You can change the default look to draw importance by giving the rounded rectangle uibutton by giving it a *ui-implements* a value of "". By default these uibuttons have their display set to inline-box so that they collapse to fit their content. However you can override that by giving them a class of "stretch" which will make them stretch to fill the available horizontal space, stacking on top of each other in the case of multiple uibuttons.

**See Also:**

[ui-kind](#ui_kind)


&nbsp;

<a name="ui_kind_action"></a>

**Action uibuttons:**

uibuttons with the attribute *ui-kind* set to "action" can also have the the class "stretch" which will cause them to stretch to the available width of their container. You can also set all action uibuttons to stretch by putting the *ui-contains="action-uibuttons"* attribute on the element that contains the action uibuttons. This is typically the case with action uibuttons in an action sheet, or with rounded rectangle uibuttons in a subview where they stack on top of each other. You would want to do this where the labels for these uibuttons is more than one word.

uibuttons of kind action have a default gray color. You can change that just like uibuttons in toolbars by giving them a *ui-implements* value. A value of "default" will make a blue action uibutton, "delete" will produce a red action uibutton and "cancel" will produce a charcoal color. You can also give them any of the following classes for other possible colors: "green" or "gold".

**Example:**

    <uibutton ui-kind="action" class="stretch">
        <label>Set Value</label>
    </uibutton>
    
    <uibutton ui-kind="action" ui-implements="cancel" class="stretch">
        <label>Cancel</label>
    </uibutton>
    
    <uibutton ui-kind="action" ui-implements="delete" class="stretch">
        <label>Delete</label>
    </uibutton>
    
    <uibutton ui-kind="action" class="green stretch" style="height: 80px;">
        <label>Green</label>
    </uibutton>
    
    <uibutton ui-kind="action" class="gold stretch" style="height: 100px;">
        <label>Gold</label>
    </uibutton>
        
    <uibutton ui-kind="action" ui-implements="done" class="stretch">
        <label>Save</label>
    </uibutton>

**See Also:**

[ui-implements](#ui_implements)

[ui-kind](#ui_kind)


&nbsp;
    
<a name="navigation_uibuttons"></a>

**Navigation uibuttons:**

These are produced by giving a uibutton an appropriate *ui-implements* value of either "back" or "next". You could also designmate it's placement in the navbar with a *ui-bar-align* value of "left", "center" or "right".

**Example:**

    <uibutton ui-implements="back" ui-bar-align="left">
        <label>Back</label>
    </uibutton>
    
    <uibutton ui-implements="next" ui-bar-align="right">
        <label>Next</label>
    </uibutton>

**See Also:**

[navbar](#navbar)

[ui-bar-align](#ui_bar_align)

[ui-implements](#ui_implements)



&nbsp;

##Tag: segmentedcontrol

This tag is actually just a container for a set of two or more uibuttons. A segmented control keeps the uibuttons joined together at their ends and handles automatic toggling of their selected states. It also provides automatic rounding of the two end uibuttons.

A segmented control can be placed in a navbar or toolbar. In such cases you can give it a *ui-bar-align* attribute of "left", "center" or "right". If you are instead inserting the segmented control into a subview or other container, you can allow it to collapse to fit its content or make it stretch to fill the available horizontal space by giving it a class of "stretch".

The uibuttons of a segmented control can accept all the attributes and icon/label techniques of other uibuttons, such as *ui-implements*, *ui-kind*, etc.

**See Also:**

[ui-implements](#ui_implements)

[ui-kind](#ui_kind)

[ui-icon-align](#ui_icon_align)

[ui-bar-align](#ui_bar_align)


&nbsp;

<a name="navbar"></a>

##Tag: navbar

A navbar is visually identical to a toolbar. The difference is in what they are used for. The navbar, as the name implies, is usually used for navigation of views or subviews. It will also often have a title indicating to the user what view is current. The navbar handles placement of uibuttons in combination with a uibuttons [*ui-bar-align* attribute](#ui_bar_align). ChocolateChip-UI implements a feature for automatically assessing the space taken up by uibuttons or segmented controls in a navibar and reduces the width of the title while terminating it with an ellipsis when there is not enough space for the full length of the title. This is accomplished by the $.UIAdjustToolBarTitle method of ChUI.js (See ChUI.js documentation). It is possible to have a navbar with only a title when that is all that you need to show. The navbar title is held by an h1 tag inside of it. Simply give the h1 tag the string you wish the navbar to display.

**Example:**

    <navbar>
        <h1>Action uibuttons in a View</h1>
    </navbar>
        
    <navbar>
        <uibutton ui-implements="back" ui-bar-align="left">
            <label>Back</label>
        </uibutton>
        <h1>Home</h1>
        <uibutton ui-implements="next" ui-bar-align="right">
            <label>Next</label>
        </uibutton>
    </navbar>
    
    <navbar>
        <uibutton ui-bar-align="left" ui-implements="delete">
            <label>Delete</label>
        </uibutton>
        <h1>uibuttons</h1>
        <uibutton ui-icon-align="right">
            <label>Edit</label>
        </uibutton>
    </navbar>



**See Also:**

[ui-bar-align](#ui_bar_align)



&nbsp;

<a name="toolbar"></a>

##Tag: toolbar

A toolbar, like a navbar, is for holding uibuttons. It, however, is never used for navigation purposes. It instead serves to present the user various uibuttons for accomplishing tasks. A toolbar is therefore task-based. By default all uibuttons in a toolbar a aligned evenly across it using box-packing justified. If you want to override this behavior you can put an appropriate [*ui-box-packing*](#ui_box_pack) attribute value on it. See the examples below. Toolbar uibuttons are often displayed as just icons using the [*ui-kind*](#ui_kind) attribute set to "icon", but you could also use a regular uibutton with *ui-implements="icon"* to display a normal toolbar uibutton with just and icon.

**Example:**

    <toolbar>
        <uibutton ui-implements="icon">
            <icon style="background-image: url(icons/logo.png);"></icon>
        </uibutton>
        <uibutton ui-kind="icon">
            <icon style="-webkit-mask-image: url(icons/download.svg); background-color: yellow"></icon>
        </uibutton>
        <uibutton ui-kind="icon">
            <icon style="-webkit-mask-image: url(icons/add.svg);"></icon>
        </uibutton>
        <uibutton class="disabled">
            <label>Add to Favorites</label>
        </uibutton>
    </toolbar>



**See Also:**

[ui-bar-align](#ui_bar_align)

[ui-box-pack](#ui_box_pack)


&nbsp;

<a name="tabbar"></a>

##Tag: tabbar

The tabbar is an implementation of the iOS tab bar for toggling a corresponding set of subviews. It contains a series of tabs. These tabs are uibuttons with a *ui-implements* value of "tab". The uibuttons in the tabbar have the attribute *ui-implements="tab"*. The uibutton has an icon with an image mask set for the icon image to show and a label that gets displayed below the icon. Here's an example of a typical tabbar:

    <tabbar ui-selected-tab="0">
        <uibutton implements="tab">                
            <icon style="-webkit-mask-box-image: url(icons/refresh.svg);"></icon>
            <label>Refresh</label>         
        </uibutton>
        <uibutton implements="tab">                
            <icon style="-webkit-mask-box-image: url(icons/add.svg);"></icon>
            <label>Add</label>  
        </uibutton>
        <uibutton implements="tab">                
            <icon style="-webkit-mask-box-image: url(icons/info.svg);"></icon>
            <label>Info</label>   
        </uibutton>
        <uibutton implements="tab">                
            <icon style="-webkit-mask-box-image: url(icons/downloads.svg);"></icon>
            <label>Downloads</label>                
        </uibutton>
        <uibutton implements="tab">                
            <icon style="-webkit-mask-box-image: url(icons/top_rated.svg);"></icon>
            <label>Favorite</label>                
        </uibutton>
    </tabbar>


&nbsp;

<a name="tableview"></a>

##Tag: tableview

The tableview tag is a container element. Of all the tags in WAML, the tableview and its child elements are the most important because these are the primary means for presenting data in the app's interface. Most of your data will be presented to the user in some form of tableview.  The tableview is not the same as an HTML table. It is more like a type of list consisting of tablecells and possible a tableheader or tablefooter. Unlike list items, tablecells have several specialized and predefined child elements: celltitle, cellsubtitle, celldetail, celldatetime, cellcounter. When giving a tableview a tableheader, this tag should be the first child of the tableview before any tablecells. Similarly, to give a tableview a tablefooter, it should be the last child of the tableview after all tablecells.

By default a tableview expands to fill the full width of available screen space. This is called "edge-to-edge" style. If you want, you can change this to the type where the tableview is inset from all sides with a border and rounded corners. This is done by putting a *ui-kind="grouped" on the tableview. Incidentally, you could put this same attribute on any other container, such as an html ordered or unordered list (ol, ul) to give it that same look.

*Notice:* 

A table view is not the same as an HTML table. A tableview corresponds to a database table of data which would result in a list of output. If you need to display tabular data, you should look at using a regular HTML table. If you need to use a tabular table inside of a table view, put it in an empty tablecell tag and style it appropriately. Or you could put it in a celldetail and style it appropriately.

**See Also:**

[tableheader](#tableheader)

[tablefooter](#tablefooter)

[tablecell](#tablecell)

[celltitle](#celltitle)

[cellsubtitle](#cellsubtitle)

[celldetail](#celldetail)

[celldatetime](#celldatetime)

[cellcounter](#cellcounter)


&nbsp;

<a name="tableheader"></a>

##Tag: tableheader

A tableview can have a tableheader which presents some descriptive information about the tableview. This should be the first tag inside the tableview before any tablecell tags.

**See Also:**

[tableview](#tableview)

[tablefooter](#tablefooter)


&nbsp;

<a name="tablefooter"></a>

##Tag: tablefooter

A tableview can have a tablefooter for some summary information about the tableview. This should be the last child of the tableview after all the tablecells.

**See Also:**

[tableview](#tableview)

[tableheader](#tableheader)


&nbsp;

<a name="tablecell"></a>

##Tag: tablecell

This tag is the container for other possible elements:  celltitle, cellsubtitle, celldetail, celldatetime, cellcounter. A tablecell is always the child of a tableview and can have any number of siblings.

<a name="tablecell_indicators"></a>

**Tablecell indicators:**

Tablecells can display various types of disclosure indicators. These are all implemented by using the **ui-implements** attribute with appropriate values: "disclosure", "detail-disclosure", "add". You can give special emphasis to an detail disclosure or add indicator by giving it the class "green".

The disclosure indicator signals that touching it will navigate the user to a new view where there will be other possible options. In contrast, the detail-disclosure indicator signals that touching it that tablecell will navigate the user to a view will detail information about the item with that indicator. This is a common scenario for a list of songs where touching one song name will lead the user to a detail screen about it. The green version of the detail-disclosure is to add special emphasis to grab the user's attention. Whether you use a disclosure indicator or a detail-disclosure indicator, you need to put a href attribute pointing to the view that the indicator will navigate to. ChococlateChip-UI will automatically enabled the navigation when it sees that there is a tablecell with a href attribute.

The add indicator signals that it will enable adding another item. To enable such addition you will need to bind an event to that cell to implement what you want to happen. The green version serves to grab the user's attention to its presence on the screen. You can use a unique id on tablecells that you want to enable add items, or use advanced CSS3 selectors for the same purpose with ChocolateChip's $ and $$ methods.

There is also a delete disclosure, but this gets create dynamically on a tableview's cell when it is the target of ChocolateChip-UI's $.UIDeleteTableCell method. Please see $.UIDeleteTableCell in the ChUI.js documentation for more information.

**Example:**

    <tableview>
        <tablecell ui-implements="disclosure">
            <celltitle>Places</celltitle>
        </tablecell>
        <tablecell ui-implements="detail-disclosure">
            <celltitle>Animals.</celltitle>
        </tablecell>
        <tablecell ui-implements="detail-disclosure" class="green">
            <celltitle>Food</celltitle>
        </tablecell>
        <tablecell ui-implements="add">
            <celltitle>Ingredients</celltitle>
        </tablecell>
        <tablecell ui-implements="add" class="green">
            <celltitle>Medicine</celltitle>
        </tablecell>
    </tableview>
    
Another possible indicator is the action one which generates and ellipsis after the celltitle. This is used to indicate that touching the tablecell will initiate some type of action. Usually this will initiate some type of message response, such as displaying a popup, action sheet or some other contrivance for messaging. You would also need to bind and event to that tablecell to execute whatever you needed. You might do this by display a popup or by navigating to a special view for choosing what to add.

There are a number of different layouts for tablecells depending on what kind of data you need to display. Some of these are implemented at the tableview level and others at the tablecell level. 

**Tablecell layouts:**

The following layouts were derived from Apple's Mobile Human Interface Guidelines.

- [simple celltitle](#simple_celltitle)
- [celltitle with cellsubtitle](#celltitle_with_cellsubtitle)
- [celltitle, cellsubtitle and celldetail](#celltitle_cellsubtitle_and_celldetail)
- [tablecell items stacked vertically](#tablecell_items_stacked_vertically)
- [tablecell items centered](#tablecell_items_centered)
- [tablecell with an image](#tablecell_with_an_image)
- [tablecell with an icon](#tablecell_with_an_icon)
- [celltitle with uibutton or switchcontrol](#celltitle_with_uibutton_or_switchcontrol)
- [tablecell with celldatetime](#tablecell_with_celldatetime)
- [tablecell with cellcounter](#tablecell_with_cellcounter)

<a name="simple_celltitle"></a>

**simple celltitle**

By default, if you put a celltitle into a tablecell you'll get this layout type. The cell title is automatically left aligned.

<a name="celltitle_with_cellsubtitle"></a>

**celltitle with cellsubtitle**

If you include a cellsubtitle with a celltitle, the cellsubtitle will be right aligned automatically. This is the default layout for a celltitle and cellsubtitle. You can override this behavior by using the [vertically stacked tabecell layout](#tablecell_items_stacked_vertically) with the *ui-ui-tablecell-order="stacked"* attribute on the tableview tag. The cellsubtitle is style to be a smaller font size than the celltitle and with a bluish color to make it stand out.

<a name="celltitle_cellsubtitle_and_celldetail"></a>

**celltitle, cellsubtitle and celldetail**

To implemente the typical celltitle, cellsubtitle and a celldetail is a fairly common usage. You need to put *ui-ui-tablecell-order="stacked"* on the tableview tag.


<a name="tablecell_items_stacked_vertically"></a>

**tablecell items stacked vertically**

To make all the items in a tableview stack vertically, canceling the automatic float right of cellsubtitles, you can put *ui-ui-tablecell-order="stacked"* on the tableview tag.



<a name="tablecell_items_centered"></a>

**tablecell items centered**
This layout has the celltitle aligned right and the cellsubtitle aligned left so that they are somewhat centered on the screen. In this layout the celltitle has a smaller font size than the cellsubtitle and has a bluish color, like the cellsubtitle would be normally. And the cellsubtitle has a larger font and is black font color. This layout is used to emphasize the cellsubtitles over the celltitles. To implement this layout just put  *ui-ui-tablecell-order="centered"* on the tableview tag.


<a name="tablecell_with_an_image"></a>

**tablecell with an image**

Often you may need to output an image in your tablecells. The image will typically be on the left side of the tablecell with the celltitle, cellsubtitle and celldetail left aligned against it. You can implement this layout by putting *ui-ui-tablecell-order="stacked"* on the tableview tag and *ui-usage="image"* on each tablecell with where an image will be displayed.

<a name="tablecell_with_an_icon"></a>

**tablecell with an icon**

Sometimes you might want to show an application style icon in your tablecell. This is placed on the left like the image layout. Usually you would just have a cell title. Choosing one of these would launch some process. To achieve this layout put *ui-ui-tablecell-order="stacked"* on the tableview tag and *ui-usage="icon"* on the tablecell.


<a name="celltitle_with_uibutton_or_switchcontrol"></a>

**celltitle with uibutton or switchcontrol**

There is a type of layout with a celltitle and a uibutton or switchcontrol on the left side. To implement this just put a cell title, no need to stacking, and put *ui-implements="celltitle-with-uibutton"* on the tablecell. This will place the uibutton/switchcontrol on the left side of the tablecell.

<a name="tablecell_with_celldatetime"></a>

**tablecell with celldatetime**

If you need to output a date or time of any kind, use the celldatetime tag for this. Make sure that the celldatetime is the next tag after the celltitle. This is so that if there is also any type of indicator, such as disclosure, detial-disclosure or add, that the celldatetime tag aligns perfectly with all of them. After the celldatetime tag other tablecell tags can follow. **Please note**, the tableview should have *ui-ui-tablecell-order="stacked"*.


<a name="tablecell_with_cellcounter"></a>

**tablecell with cellcounter**

If you need to indicate some numerical value related to the cell, such as how many items will be available by touching it, or any other type of numerical data that you may need to display, you can do so by output that value in the cellcounter tag. This should be the tag right after the celltitle tag. Also, you would need to put *ui-ui-tablecell-order="stacked"* on the tableview.

**See Also:**

[tableview](#tableview)

[celltitle](#celltitle)

[cellsubtitle](#cellsubtitle)

[celldetail](#celldetail)

[celldatetime](#celldatetime)

[cellcounter](#cellcounter)



&nbsp;

<a name="celltitle"></a>

##Tag: celltitle

This is normally the largest most noticeable item in a tablecell. A tablecell will normally have at least a celltitle. When the tableview has *ui-ui-tablecell-order="centered"*, the cell title is rendered as if it where a cellsubtitle and the cellsubtitle is rendered as if it were a celltitle. This is to give more emphasis to the cellsutitle. By default, ChocolateChip-UI manages the width of all celltitles so that if there is not enough room for its text to fit it will be truncated with an ellipsis. You can see this during testing in a browser by pulling the window in to reduce the width until the celltitle's width is impacted. 

**See Also:**

[tableview](#tableview)

[tablecell](#tablecell)

[cellsubtitle](#cellsubtitle)

[celldetail](#celldetail)

[celldatetime](#celldatetime)

[cellcounter](#cellcounter)


&nbsp;

<a name="cellsubtitle"></a>

##Tag: cellsubtitle

By default all cellsubtitles get are a smaller font size than the celltitle and have a bluish color as well as aligned to the right. To override this alignment you can put *ui-ui-tablecell-order="stacked"* on the tableview tag. By default, ChocolateChip-UI manages the width of all cellsubtitles so that if there is not enough room for its text to fit it will be truncated with an ellipsis. You can see this during testing in a browser by pulling the window in to reduce the width until the celltitle's width is impacted. 

**See Also:**

[tableview](#tableview)

[tablecell](#tablecell)

[celltitle](#celltitle)

[celldetail](#celldetail)

[celldatetime](#celldatetime)

[cellcounter](#cellcounter)



&nbsp;

<a name="celldetail"></a>

##Tag: celldetail

This tag serves to hold a detail description, usually a paragraph of text. If needed you can insert more than one celldetail or even use it to hold some other content, such as a ranking control. The second celldetail with have six pixels of margin separating it from the one above it. When using a celldetail you'll need to use *ui-ui-tablecell-order="stacked"* on the tableview.

**See Also:**

[tableview](#tableview)

[tablecell](#tablecell)

[celltitle](#celltitle)

[cellsubtitle](#cellsubtitle)

[celldatetime](#celldatetime)

[cellcounter](#cellcounter)



&nbsp;

<a name="celldatetime"></a>

##Tag: celldatetime

The celldatetime tag is used for output any date or time data in a tablecell. Use it with *ui-ui-tablecell-order="stacked"* on the tableview. The celldatetime tag should be the tag immediately after the celltitle tag. It will then be positioned on the right side of the tablecell, leaving room for any type of tablecell indicator.

**See Also:**

[tableview](#tableview)

[tablecell](#tablecell)

[celltitle](#celltitle)

[cellsubtitle](#cellsubtitle)

[celldetail](#celldetail)

[cellcounter](#cellcounter)



&nbsp;

<a name="cellcounter"></a>

##Tag: cellcounter

A cellcounter is used for outputting any kind of numerical data related to the tablecell. It should be the first tag immediately after the celltitle tag. It gets positioned on the right side of the tablecell leaving enough room for any type of tablecell indicator.

**See Also:**

[tableview](#tableview)

[tablecell](#tablecell)

[celltitle](#celltitle)

[cellsubtitle](#cellsubtitle)

[celldetail](#celldetail)

[celldatetime](#celldatetime)


&nbsp;

##Tag: popup

This tag is the root of the popup control which ChocolateChip-UI provides for presenting the user with a modal dialog. This control has various parts that are all styled and managed directly by ChocolateChip-UI with parameters supplied by the developer. Please refer to popup in the ChUI.js documentation.

The structure of a popup controls is as follows:

    <popup ui-visible-state="hidden" style="top: 120px; left: 359px; ">
        <panel>
            <toolbar ui-placement="top">
                <h1>Attention Viewers!</h1></toolbar>
                <p>This is a message from the sponsors. Please be seated while we are getting ready. Thank you for your patience.</p>
            <toolbar ui-placement="bottom">
                <uibutton ui-kind="action" ui-implements="cancel">
                    <label>Skip</label>
                </uibutton>
                <uibutton ui-kind="action" ui-implements="continue">
                    <label>Stay for it</label>
                </uibutton>
            </toolbar>
        </panel>
    </popup>


&nbsp;

##Tag: mask

This tag is used to cover the screen of the viewport, hiding the content with a translucent cover and preventing any user interaction with it. It serves as the base over which some other type of user notification/interaction artifice will be presented, such as a popup, action sheet or popover. It gets created by Element.UIBlock and destroyed by Element.UIUnblock. You by default it's black with an opacity of 50%. You can control the opacity by passing Element.UIBlock and value. For example, if you wanted it to be translucent and unnoticeable but block the screen, pass Element.UIBlock a value of "0.01":

	$.main.UIBlock(".01");


&nbsp;

<a name="slider"></a>

##Tag: slider 

The slider tag is used for implementing a draggable value slider. At present ChocolateChip-UI provides only a horizontal slider. This does not yet offer ticks or steps. You will have to calculate the returned values using the methods and values with the $.UISlider and its related methods. For the slider to work properly you need to output the width you desire for the slider directly on it using an inline style setting, such as: *style="width: 186px;"*. This allows you to give each slider a different width depending on your needs. ChocolateChip-UI's methods will query this assigned width and use it for dragging the thumb and updating the slider's progress track.  Please refer to the documentation for slider and $.UISlider in ChUI.css and ChUI.js for more information.

**See Also:**

[thumb](#thumb)

[thumbprop](#thumbprop)



&nbsp;

<a name="thumb"></a>

##Tag: thumb

The thumb tag provides an affordance for dragging or switching depending on the control that uses it. Both the switchcontrol and the slider use thumb tags. A thumb tag always has a thumbprop tag as a child element.

**See Also:**

[slider](#slider)

[thumbprop](#thumbprop)

[switchcontrol](#switchcontrol)

<a name="thumbprop"></a>


&nbsp;

##Tag: thumbprop

This tag server merely as a prop for styling rendering on a thumb. Its used for adding great styling depth, such as inner border, shadows or gradients to create a more realistic thumb.

**See Also:**

[slider](#slider)

[thumb](#thumb)

[switchcontrol](#switchcontrol)



&nbsp;

<a name="switchcontrol"></a>

##Tag: switchcontrol

This this control is used to present the user with a single choice situation: on/off, true/false. The structure and its behavior is implemented by ChocolateChip-UI with input for the developer. It has a number of parts that ChocolateChip-UI styles and animates to give it the feel of a switch being flipped. Please refer to *switchcontrol* in the ChUI.js documentation. 

**Note:** When using a switch control make sure that its parent container has positioning set to either relative or absolute. This is because ChocolateChip-UI uses absolute positioning to place the switch control on the right side of its container. If the container does not have some type of positioning, the switchcontrol will appear placed somewhere towards the top right of the document. Of course, if you know the container already has positioning, you don't need to bother setting it. Tablecells already have positioning set.

The structure of a switchcontrol is as follows:

    <switchcontrol class="off" ui-implements="attention" id="breakfastSwtich">
        <label ui-implements="on">ON</label>
        <thumb>
            <thumbprop></thumbprop>
        </thumb>
        <label ui-implements="off">OFF</label>
        <input type="checkbox" value="So, what's the first course?">
    </switchcontrol>
    
If you want or need to, you can give your switch control a class that allows you to override the default "on" color with the color of your choice. Please refer to the documentation for ChUI.css and ChUI.js for more information.

**See Also:**

[thumb](#thumb)

[thumbprop](#thumbprop)



&nbsp;

<a name="splitview"></a>

##Tag: splitview

The splitview is a special layout type for tablets. This type of layout is not for use on mobile devices such as cellphones like the iPhone, Android, Blackberry or devices like the iPod Touch. The layout is optimized for a minimum screen size of 1024 x 768 pixels. It has two child elements: rootview and detailview. The root view is on the left side and provides n area for actionable items or navigation through list to drill down. The detailview show the result of a navigation drill down or the results of an action initiated in the rootview. The splitview layout has automatic readjustment or orientation change. This results in the rootview being hidden in portrait mode with a button in the upper left of the detailview with the same title as the rootview that will toggle the visibility of the rootview. When the device is returned to landscape mode, the rootview will automatically be visible by default.

[rootview](#rootview)

[detailview](#detailview)




&nbsp;

<a name="rootview"></a>

##Tag: rootview

The rootview is the area for navigation and drilldown allowing the user to get to the information to display in the detailview. It can also contain actionable list or uibuttons which offer the user ways to interact with the data in the detail view.

[splitview](#splitview)

[detailview](#detailview)




&nbsp;

<a name="detailview"></a>

##Tag: detailview

The detailview is the area in the splitview where a user is presented with the result of a navigation choice or action choice.

[splitview](#splitview)

[rootview](#rootview)



&nbsp;

##Tag: expander

The expander tag provides a way to collapse or expand a vertical section of your app. To create an expander you Put an expander tag with a panel tag into your document. The expander's panel will contain whatever content you wish to be able to hide and show. ChocolateChip-UI will take care of implementing the hiding and showing for you. Please see the tutorial on UIExpander for options on the expanded state and the expander's label titles. Here's what an expander looks like:

    <expander>
        <panel>
            <tableview ui-kind="grouped">
                <tablecell>
                    <celltitle>Breakfast</celltitle>
                </tablecell>
                <tablecell>
                    <celltitle>Lunch</celltitle>
                </tablecell>
                <tablecell>
                    <celltitle>Dinner</celltitle>
                </tablecell>
            </tableview>
        </panel>
    </expander>


&nbsp;

##Tag: progressbar

This tag creates an animated progress bar. The defaults are: height: 15px, width: 100px and has its margins set to 10px auto so that it centers in its container. Its background color controls the color of the stripes. The default is rgb(56,138,213). You can change the default color by adding a class to the progress bar and then defining a different background-color for the progress bar. In most cases you'll want to create and delete it with JavaScript. Please see the tutorial for UIProgressBar.

##Tag: spinner

This tag create a spinner for a set of data, which might be strings or integers. The structure of a spinner is so:

	<spinner id="days" data-range-value="Sun,Mon,Tue,Wed,Thu,Fri,Sat">
		<uibutton class="ui-custom-tint green disabled" ui-implements="icon">
			<icon></icon>
		</uibutton>
		<label ui-kind="spinner-label">Sun</label>
		<input type="text">
		<uibutton class="ui-custom-tint green" ui-implements="icon">
			<icon></icon>
		</uibutton>
	</spinner>
	
However, to make a spinner all you need to to is put a basic spinner tag in you document and initialize. You can put the spinner tag there by hand coding it, or by injecting it dynamically with JavaScript. You put the tag in your document with a unique identifier, such as an id or class, unless you simply intend to use a complex CSS3 selector to target the spinner. The tag should be like this:

	<spinner></spinner>

You would then init the spinner using the $.UISpinner method while passing in the arguments for the spinner. See the documentation on Chui.js and the Tutorial on spinners for more information about how to initialize a spinner.

##Tag: popover

This tag is used to create the typical iPad modal interface widget. You create a popover with $.UIPopover. Then you can fill it with the content you need by using Element.insert. You show and hide it with $.UIPopover.show and $.UIPopover.hide. A popover can contain navigational lists for your iPad app, an action list to toggle the visible contents in a splitview's detail pane, or action buttons or specialized tools to modify or interact with the content in the detail pane. By default, when the user touches anywhere outside the popover, it gets dispelled which doing anything. However, you can also dispel the popover when the user interacts with an action list, action button or other event.