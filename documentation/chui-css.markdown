#ChUI.css
    
       pO\     
      6  /\
        /OO\
       /OOOO\
     /OOOOOOOO\
    ((OOOOOOOO))
     \:~=++=~:/ 
    
    ChocolateChip-UI: A framework for mobile Web app development.
    ChUI.css: Good looks do impress
    
    Copyright 2011 Robert Biggs: www.choclatechip-ui.com
    License: BSD
    Version 1.0


&nbsp;
    
##Block Elements:

These are new elements provided by WAML -- Web App Markup Language. Since WAML is a supper set of tags for use in and HTML5 document, we need to tell the browser how to display them. By default browsers display unknown tags as inline elemtns. ChocolateChip-UI initially sets them to block: app, view, subview, section, navbar, toolbar, tabbar, tableview, tablecell, celltitle, cellsubtitle, celldetail, tableheader, tablefooter, popover, popup, picker, screencover, actionsheet, stack, panel, scrollpanel.



Some of these may later be given a display value of -webkit-box or even -webki-inline-box depending on how their content needs to be displayed. They also have box-sizing set to border-box, which means theat padding and borders will not affect their height or width. These elements all have their font values set to: normal 18px Helvetica, Sans-serif.

**See Also:**

&nbsp;
    
##Tag: app

This tag is the root of all WAML documents. It is the first child of the body tag. It has its overflow property set so that horizontal overflow is hidden and vertical overflow is auto. This is to prevent navigation of views to the left or right from causing scrolling.


&nbsp;
    
##Tab: view 

This tag has its display property set to -webkit-box and its -webkit-box-orient set to vertical. It has the following transition definition -webkit-transition: all 0.25s  ease-in-out. The tag is also positioned absolutely with its top, right, bottom and left are set to 0. This causes the view to stretch to the edges of the available screen space, minus any browser chrome when in the mobile browser. It also has its overflow set to hidden. Allow any overflow will be hidden, ChocolateChip-UI uses other descendant tags, CSS and JavaScript to allow scrolling of the hidden content.

**Properties:**

- ui-navigation-status=traversed: translates the view 100% to the left so that it is out of view.
- ui-navigation-status=current: translates the view into view.
- ui-navigation-status=upcoming: translates the view 100% to the right so that it is out of view.

A view can also have a *ui-background-style* set to "striped". This produces a pattern of vertical stripes on the background of the view. This is created with CSS3 gradients. If you want to produce a different background, perhaps just a solid color, or a gradient with different colors or different thickness of stripes, you can override the default definition by putting your own definition right in a style tag in the head of your app's document. The default colors for the *ui-background-style* attribute are:

    background: #cbd2d8;
    background-image: 
        -webkit-gradient(linear, left top, right top, 
            from(#c5ccd4), 
            color-stop(0.75, #c5ccd4), 
            color-stop(0.75, transparent), 
            to(transparent)); 
    -webkit-background-size: 5px 100%;
    background-size: 5px 100%;

To cancel the CSS gradient you would redefine the background-image property to *background-image: none*. To change the thickness of the stripes you would need to change the value of the background-size from 5 pixels to whatever size you want. Note that there are two definitions for background size. This is because the latest version of Webkit has dropped the need to use the -webkit prefix for that property. To support older versions of Webkit you still need to include background-size with the -webkit prefix. To change the colors of the gradient you can modify the colors individual until you find the combination that you like.

&nbsp;
    
##Tag: subview

This tag serves as the container for chunks of data presented in a view through with the app offers some type of navigation or paging without leaving the current view. It will often have a scroll panel as its first child, but if you know that its content will never exceed the limitations of the mobile device's viewport, you can output your content directly to the subview. That said, it is very unlikely that you would need or want to consider doing this.

When you need to include a navbar or toolbar with a subview, you need to inform ChocolateChip-UI about this relationship so that it can adjust the dimensions of the subview to fit with the toolbars and at the same time resize fluidly when there is an orientation change. The posible values that can be defined on a subview are as follows:

- ui-associations="withNavBar"
- ui-associations="withTopToolBar""
- ui-associations="withNavBar withBottomToolBar"
- ui-associations="withTopToolBar withBottomToolBar"

If the view does not have the default striped patter, you may want to apply that to the subview. This is done by giving the subview the attribute: *ui-background-style*. You may want to try out some other type of gradient pattern. There are quite a view possibilities. You can learn more about CSS3 gradients from [this blog post](#http://css3wizardry.com/2010/08/19/css3-gradients-and-patterns/). **Note:** you only need implement Webkit style gradients for a Web app since it is the dominant platform for mobile Web apps.


&nbsp;
    
##Tag: scrollpanel

This tag has its height set to auto with a min-height of 100%. This means the scrollpanel will vertically fill its container and expand vertically to hold more content. It has 45 pixels of bottom padding to account for vertical scrolling implemented by ChocolateChip-UI. If you were using a view without any subviews, you could put the scrollpanel as the first child of the view to providing scrolling of content inside the view. This might be the case where the view has no navbar or toolbar so that you have the entire viewport for presenting data and therefore need to have the entire view capable of scrolling.

&nbsp;
    
##Attribute: box sizing

ChocolateChip-UI provides various box sizing properties for implement various possible layouts. For these properties to have any effect, the container must have its display property set to "-webkit-box" or "-webkit-inline-box".

- [ui-box](#ui_box)
- [ui-box-direction](#ui_box_direction)
- [ui-box-pack](#ui_box_pack)
- [ui-box-align](#ui_box_align)
- [ui-box-flex](#ui_box_flex)


<a name="ui_box"></a>

**Ui-box:**

This attribute affects the stacking behavior of a containers child nodes. When the value is "vertical", the child elements are stacked one on top of the other. When it is "horizontal" they are stacked one next to the other like books on a bookshelf.

- ui-box="horizontal"
- ui-box="vertical"

<a name="ui_box_direction"></a>

**Ui-box-direction:**

Depending on the box orientation, this property controls the direction of a container's child elements. When the ui-box value is "vertical" the child elements are displayed in reverse order, with the last element appearing at the top of the container and the first child element appearing at the bottom. When the container has a ui-box value of horizontal, the first child element is on the right and the last child element is on the left. **Note:** this does not affect the actual physical location of the child nodes, just their visual presentation.

- ui-box-direction="normal"
- ui-box-direction="reverse"

<a name="ui_box_pack"></a>

**Ui-box-pack:**

This property defines how child elements are packed inside a container. The default is "start", which means in the case of *ui-box="vetical"*, the start from the top of the container and work their way down. In the case of *ui-box="horizontal* they start from the left and pack out towards the right.

Other packing orders are end, center and justify. If the packing order is end, for a vertical orientation the elements will stack up from the bottom. For a box with horizontal alignment, the boxes will stack from the right. A packing order of center means that for vertical orientation the child elements will be centered vertical with any left over space displayed equally at the top and bottom. For horizontal orientation a packing order of center means the elements are centered horizontally with left over space equally divided on the left and right. A packing order of justified means that any available space is spread equally between the child elements, for vertical orientation this is vertical spacing, and for horizontal orientation this is horizontal spacing.

- ui-box-pack="start"
- ui-box-pack="end"
- ui-box-pack="center"
- ui-box-pack="justify"


<a name="ui_box_align"></a>

**Ui-box-align:**

This attribute affect the alignment of child elements in a container. The default is stretch. This stretches the dimensions of the child elements to fill the parent box. If the alignment is start, for horizontal orientation the elements are aligned to the top of the parent. If the orientation is vertical, they are aligned to the left of the parent. An alignment of end will align elements with horizontal alignment to the bottom of the parent. With vertical orientation they will be aligned to the right of the parent. An alignment of center will align horizontal elements along the horizontal center of the parent and for vertical orientation it will center them along the vertical center of the parent. There is also an alignment of baseline, but this is only for horizontal orientation. It aligns the elements along their horizontal baseline.

- ui-box-align="stretch"
- ui-box-align="center"
- ui-box-align="start"
- ui-box-align="end"


<a name="ui_box_flex"></a>

**Ui-box-flex:**

This attribute affects the flexibility of the child elements of a container. It can have any value from 0 to 10. When it has a value of 0 it has no effect. The flex property tells the browser how to deal with the dimensions of the container's child elements. If you have three child elements and they don’t fill their parent, giving one of the a value of flex:1 will cause that element to take up all the left over space. If you gave one element flex: 1 and another one flex: 2, the available space would be divided up such that the element with flex: 1 would get one third of the available space and the element with flex: 2 would get two thirds of the available space. Of course the element with no flex value would default to whatever its width is.

- ui-box-flex=0
- ui-box-flex=1
- ui-box-flex=2
- ui-box-flex=3, etc.


&nbsp;
    
##Tag: uibutton

This tag has a number of default CSS definitions. The default uibutton styles are what is used when a uibutton is placed in a navbar or toolbar. If you want, you can override these styles with a new style defined in a style tag in the head of your document. I strongly recommend that you use a custom class for this purpose, such as in the code below:

    <uibutton class="mySpecialButtonStyle">
        <label>Activate</label>
    </uibutton>

    <style type="text/css">
        uibutton.mySpecialButtonStyle {
            -webkit-appearance: none;
            -webkit-box-shadow: none;
            border: solid 1px #666;
            display: block
            -webkit-border-radius: 10px;
            background-image: 
                -webkit-gradient(linear, left top, left bottom, 
                    from(yellow), 
                    to(orange)); 
            color: red;
        }
        uibutton.mySpecialButtonStyle:hover {
            color: blue;
            background-image: 
                -webkit-gradient(linear, left top, left bottom, 
                    from(orange), 
                    to(yellow)); 
        }
    </style>
    &nbsp;
    
##Tag icon

UIButtons can have icons. These are implemented by putting an icon tag inside the uibutton. You can use any image you want for an icon. Be aware that it must be the right dimensions to fit in a uibutton. ChococlateChip-UI provides a number or icons ready for use. These are all vector-based SVG images and are therefore resolution independent. You do not have to worry about higher screen resolutions. They always look crisp no matter how high a device's screen resolution is. 

There are three ways in which you can display an icon in a uibutton. It can be displayed an image. In this case the image will appear in all its original colors. This is a great choice when the icon you wish to display is photographic in quality. It can be display as a solid color icon. This would be the default color of the icon. These are always an outline with a solid color filling them. Normally you would want to style an icon with an image mask and use that to reveal the background color of the icon. Because the icon image is acting as a mask, the background color will only appear where the darkest part of the image is, leaving the other parts transparent. 

When a uibutton has *ui-kind="icon"* the rest of the uibutton is transparent and only the icon is visible. This type of uibutton is typically used in a toolbar. When a uibutton has this style, it gets a circular glow when the user clicks or touches it.

Sometimes you may not want to hide the uibutton's style but have it visible with just and icon inside it. You can do this by using *ui-implements="icon"*. In such a case the uibutton would not have a label inside it.

The markup below will display just the download icon with a yellow color. If we use an rgba color with the transparency bit set, the icon will appear as transparent as the color's transparency bit setting just as if you had set transparency on the uibutton itself. You could also set a CSS3 gradient as the background, which can produce some interesting effects. Although the example below is of kind icon, you can use the image mask with background colors for an icon in any type of uibutton. Feel free to create special classes for icons in the head of your document.

    <uibutton ui-kind="icon">
        <icon style="-webkit-mask-image: url(icons/download.svg); background-color: yellow"></icon>
    </uibutton>

**Icon alignment**

When using icons in uibuttons you can designate their place in relation to the uibutton's label. By default all icons are aligned to the left of the uibutton label. Using *ui-bar-align* on a uibutton, you can position the icon above, to the right or below the uibutton's label. The values for this are: "top", "right" and "bottom".

**Rounded rectangle uibuttons**

These are a very prevalent type of uibutton used through iOS apps. They have a white background, rounded corners and a simple 1 pixel border around them. This type of uibutton is indicate by adding *ui-kind="rounded-rectangle"* to a uibutton. You can added a class and then create your own variation of this, such as change the background color, font color or border color or thickness, by adding a class to this selector in your document's head:

    <style type="text/css">
        uibutton[ui-kind="rounded-rectangle"].myUniqueStyle {
            background-color: #ff00ff;
            color: #00ff00;
            border: solid 2px #0000ff;
        }
    </style>

**Action uibuttons**

When uibuttons have *ui-kind="action"* they display as large, colorful uibuttons that are easy for the user to touch and which offer the user important actions to take. These are usually used in popups, actionsheets and popovers. By default they collapse to their content but you can make them stretch to fill the available space by giving them a class of "stretch". The default color for an action uibutton is gray. Other possible colors are *implements="done"* (blue), *implements="delete"* (red), *implements="cancel"* (black), *class="green"* (green), *class="gold"* (gold). If you want an action uibutton with some other color scheme, just create a new class like the one for green or gold and add it to your document's head. Search for *[ui-kind=action].green* in ChUI.css.


To best way to change the color of any uibutton is to use ChocolateChip-UI's [custom tint technique](#custom_tints).


&nbsp;
    
##Tag: segmentedcontrol

The segmented control is just a container for a set of two or more uibuttons which implement a set of actions or page through a set of subviews. By default the styles for the segmented control will rounded the left corners of the first uibutton and the right corners of the last uibutton. The segmented control's uibuttons are joined together into one contiguous unit. The minimal number of uibuttons  would be two. You probably don't want to have more than four uibuttons or it will become very cramped and hard for the user to determine what he or she needs to accomplish with the control. By default the uibuttons in a segmented control collapse to fit their content. When placing a segmented control outside of a toolbar bar, such as within a view or subview, you can make it stretch to the available with by giving it a class of "stretch". When a segmented controls is placed in a navbar or toolbar, its uibuttons use the default style of all toolbar uibuttons. When a segmented control is placed in a view or subview, its uibuttons have a completely different style. You can override either style in the head of your document. Just search for segmented control in ChUI.css, add a class to the controls styles and create your own styles. 


To best way to change the color of a segmentedcontrol's uibuttons is to use ChocolateChip-UI's [custom tint technique](#custom_tints).

&nbsp;
    
<a name="navbar"></a>

##Tag: navbar

The navbar uses *ui-bar-align* to define where uibuttons or segmented controls are placed in it.

To best way to change the color of a navbar is to use ChocolateChip-UI's [custom tint technique](#custom_tints).

&nbsp;
    
<a name="toolbar"></a>

##Tag: toolbar

By default toolbars implement box packing as justified so that all icons and uibuttons are evenly distributed across the bar.

To best way to change the color of a toolbar is to use ChocolateChip-UI's [custom tint technique](#custom_tints).

&nbsp;
    
##Tag: tableview

The tableview and its related descendant tags have a large number of pre-defined styles to implement different layout types. Please refer to the documentation for WAML to see what layout options are there. If you have a layout need not supplied by these, trying creating a custom class style on the tableview tag or tablecell tag in your document's head. You may need to examine the styles for tableview elements carefully in ChUI.css, as these are very complex. You may need to override values for celltitle, cellsubtitle, celldetail, etc. to achieve the layout you desire. The layouts which ChocolateChip-UI provides are based on the basic type described by Apple in the Mobile Human Interface Guidelines.

**Tablecell indicators**

You can customize the appearance of tablecell indicators as well.

- [disclosure indicator](#disclosure)
- [detail-disclosure indicator](#detail_disclosure)
- [add indicator](#add_indicator)
- [delete indicator](#delete_indicator)

<a name="disclosure"></a>

**disclosure indicator**

The disclosure indicator is implemented using the CSS *:after* pseudo element selector, which output the "›" character after the tablecell. This is given a display value of "block" and positioned to the right. Search for the term "disclosure" in ChUI.css. You can change the default color, the hover and touched color, the font size, etc. As a matter of fact you could change the character to something else, whatever you want. Please be aware that changing the standard appearance of this indicator too much may confuse uses as to its purpose and intent, as it is a well-know and establish affordance to indicating drilldown navigation.


<a name="detail_disclosure"></a>

**detail-disclosure indicator**

Like the disclosure indicatore, the detail-disclosure indicator is created on a tablecell using the *:after* pseudo element selector. It also output the "›". This content is given a display value of "block" and positioned to the right. Because it is defined as a block element, we are able to treat the content as if it were a real tag, giving it borders and border radius values. Search for "detail-disclosure" in ChUI.css to find the styles. Things you could change are the font color, which affects the "›", the background gradient and the border color, or perhaps the border radius to create a more squared look. 

<a name="add_indicator"></a>

**add indicator**

Like the detail-disclosure, the add indicator is created in the same way, using "+" for its content. You can modify the same attribute values as the detail-disclosure to achieve the look you want.

<a name="delete_indicator"></a>

**delete indicator**

The delete indicator is created dynamically by ChocolateChip-UI using the $.UIDeleteTableCell method on a tableview. Search for *deletedisclosure* in ChUI.css. The delete disclosure has two state, the default or unselected state and the selected state. This is already a well-established affordance for indicating deletion. However, if you want for need to override it's appearance in someway to fit you app's look or implementation, redefine new styles like the ones in ChUI.css directly in your document's head.

**a totally new indicator**

Using the techniques described above, you can also create a totally new type of indicator for you tablecells. Use the *ui-implements* attribute with the name for you new indicator. Define the new indicator's styles in the documents head.

**tablecell order**

You can indicate how ChocolateChip-UI treats the order of items in a tablecell by using the *ui-tablecell-order* attribute. If you do not use this attribute, cellsubtitles get placed on the right. If you prefer to have them stack vertically, which is what you would do if you also wanted tablecells to display a celldetail, you would need to give the table a value of *ui-tablecell-order="stacked"*. 

You can also have ChocolateChip-UI center your celltitles and details from the center of the cells using *ui-tablecell-order="centered"*. In this mode the celltitles will be smaller and bluish while the cellsubtitles will be larger and black. You would use this type of layout where you want to emphasis the cellsubtitles over the celltites.

**Titled tableview**

If you need to create a tableview with titled sections, like playlists or alphabetical lists, you can do so by just giving the tableview a property of *ui-kind="titled-list"*. Then use tableheader tags for the section titles. ChocolateChip-UI will automatically style them to resemble standard titled lists. If you want to change the color scheme, just search for *ui-kind="titled-list"* in chui.css, copy the related styles to your app's local stylesheet and adjust the colors to your liking.


&nbsp;
    
##Control: switchcontrol

ChocolateChip-UI uses CSS to style and animate the components constituting the switch control. Simply search for switch control in ChUI.css to find the styles that affect this control. You can easily change the color of the font. Or you may want to create a new "on" color. The default is the standard blue. ChocolateChip provides another option for an orange colored on state which Apple sometimes uses for actions that will cause an important event. ChocolateChip-UI.s element.UICreateSwitchControl method allows you to pass a custom class as an argument durring creation of a switch control. Notice the addition of a custom class on the switch control's markup:

    <switchcontrol class="off myCustomColor" ui-implements="attention" id="breakfastSwtich">
        <label ui-implements="on">ON</label>
        <thumb>
            <thumbprop></thumbprop>
        </thumb>
        <label ui-implements="off">OFF</label>
        <input type="checkbox" value="So, what's the first course?">
    </switchcontrol>
    
To change the "on" color of the switch control using that class we could do the following in our document's head tag (Note: the colors below are just to illustrate the technique, choose your colors wisely):

    <style type="text/css"
        switchcontrol.myCustomColor > label[ui-implements=on] {
            border: solid 1px green;
            background-image: 
                -webkit-gradient(linear, left top, left bottom, 
                    from(#005e2f), 
                    color-stop(.5, #00a050));
        }    
    </style>

You might also want to change the font colors. This is very easily done using the following selectors with the above custom class:

    switchcontrol.myCustomColor > label[ui-implements=on] {
        color: red;
    }
    switchcontrol.myCustomColor > label[ui-implements=off] {
        color: purple;
    }

**Note:** When using a switch control make sure that its parent container has positioning set to either relative or absolute. This is because ChocolateChip-UI uses absolute positioning to place the switch control on the right side of its container. If the container does not have some type of positioning, the switch control will appear placed somewhere towards the top right of the document. Of course, if you know the container already has positioning, you don't need to bother setting it. Tablecells already have positioning set.

&nbsp;
    
##Control: actionsheet

The action sheet search as the container for various action uibuttons. This slides up from the bottom of the screen. It's appearance and animation are all implemented with CSS. The default color for the action sheet is bluish, but you can also opt for a blackish color by passing the control a color option during setup. To indicate which of the two colors to use, you pass in an argument for color in the options: *color : "blue"* or *color : "black"*. Please refer to ChUI.js documentation for how to create an action sheet control.

You can override the default colors of the action sheet by placing new styles for the its default styles in your document's head. Search for action sheet in ChUI.css to find its default styles. Some of the possible styles you could modify are illustrated below:

<head>
...

<style type="text/css">
    /* This will create a yellow to red gradient on the actionsheet: */
    actionsheet {
        background-image:
        -webkit-gradient(linear, left top, left bottom,
            from(#000),
            color-stop(0.5, #000),
            color-stop(0.5, rgba(255,255,255,.6)),
            to(rgba(255,255,255,.6))),
        -webkit-gradient(linear, left top, left bottom,
            from(rgba(255,255,255,.5)),
            color-stop(0.9, rgba(255,255,255,.15)),
            to(rgba(255,255,255,.015))),
        -webkit-gradient(linear, left top, left bottom,
            from(rgba(255,255,0,0.85)),
            to(rgba(225,0,0,0.85)));
    }
</style>
</head>

When modifying CSS gradients remember that the first gradient defined will be topmost and the last will be bottommost. 



&nbsp;
    
##Control: popup

Although the popup parts are created dynamically by JavaScript by envoking the $.UIPopUp method. Please refer to the ChUI.js and WAML documentation for the popup control for more details on how it is created and used. You can find the default styles for the popup control by searching for "popup" in ChUI.css.

You can override the default styles for the popup by defining them in your document's head:

    popup {
        /* Modify these values for the popup's border: */
        border: solid 1px #72767b;
        /* Modify these values to change the appearance of the
        linear gradient on the background of the popup: */
        background-image: 
            -webkit-gradient(linear, left top, left bottom,
                from(rgba(0,15,70,0.5)),
                to(rgba(0,0,70,0.5)));
    }
    
    popup > panel {
        /* Modify these values for the popup's inner border: */
        border: solid 2px #e6e7ed;
        /* modify these values to change the appearance of the 
        semi-circular arch behind the popup title: */
        background-image: 
           -webkit-gradient(radial, 50% -1180, 150, 50% -280, 1400,
               color-stop(0, rgba(143,150,171, 1)),
               color-stop(0.48, rgba(143,150,171, 1)),
               color-stop(0.499, rgba(75,88,120, .6)),
               color-stop(0.5, rgba(75,88,120,0)));
        color: #fff;
    }




&nbsp;
    
##Control: activity indicator

The activity indicate is a canvas background image created dynamically by JavaScipt, so it is not stylable by CSS. You can, however, customize the look of it by passing the $.UIActivityIndicator method appropriate values. Please refer to the $.UIActivityIndicator method in the ChUI.js documentation.

&nbsp;
    
##Control: progress bar

The progress bar is used to show that something is happening, such as data being loaded by an Ajax call. Although you can create a progress bar by simply inserting a progressbar tag in your app, in most situations you'll want to do so dynamically using ChocolateChip-UI's Element.UIProgressBar() method. You can pass this method several parameters to define the width, the animation speed and a class with which you can define a custom background color. In fact, the color that you see as the stripes of the progress bar is nothing but a background color showing through transparent parts of the bar. To change the progress bar's default bluish background to green, you could do the following:

progressbar.green {
    background-color: green;
}
$("view#main > subview").UIProgressBar({className: "green"});

&nbsp;
    
##Control: slider

The slider is a simple control consisting of a track with a thumb. The visual complexity of the slider's track is implemented with CSS gradients. As the thumb is dragged, ChocolateChip-UI's JavaScript methods keep track of the position of the thumb and resize the blue gradient to match the thumb's position. The blue progress track is not a separate element but just a second gradient stacked over the underlying base gradient of the slider. 

**Note:** For the slider to work properly you need to output the width you desire for the slider directly on it using an inline style setting, such as: *style="width: 186px;"*. This allows you to give each slider a different width depending on your needs. ChocolateChip-UI's methods will query this assigned width and use it for dragging the thumb and updating the slider's progress track.  

The slider's thumb has a child element called thumbprop. This exists purely for stylistic purposes to create more realistic, beveled appearances. Please refer to the documentation for the slider in ChUI.js and WAML for information on how to set up and use a slider.

There are two possible looks for the slider. The default is a plastic look. By giving the slider a class of *media-player* it takes on a metallic look. You can modify the following properties in your document's head tag to override the default styles, or you could create a new class:

    slider.myNewSliderStyle {
        background-image: 
            /* The first gradient defined here is the blue progress track.
            Modify its color values to change it to another color: */
            -webkit-gradient(linear, left top ,left bottom,
               from(#0a3a86),
               color-stop(.5, #4c8de7),
               color-stop(.95, #6babf5),
               to(#0a3a86)),
            /* This gradient defines the default background of the slider track.
            Modify its color values to change the appearance of the overall track. */
            -webkit-gradient(linear, left top ,left bottom,
                from(#bbbbbb),
                color-stop(.5, #f0f0f0),
                color-stop(.5, #fff));
    }
    slider.myNewSliderStyle > thumb {
        /* Whatever syles you want here.
        You can redefine the default gradient
        or cancel it by setting background-image to none. */
    }
    slider.myNewSliderStyle > thumb > thumbprop {
        /* Whatever styles you want here. */
    }
    

&nbsp;
    
##Tab Bar

ChocolateChip-UI provides a tab bar for enabling toggling between different subviews in the same view. This mimics the tab bar control on iOS. Because of the limited space on a mobile handset in portrait mode, you should put more than 5 tabs in a tab bar. Tabs are just uibuttons with a *ui-implements* value of "tab". The tab has an icon and a label that gets displayed below the icon. Below is a typical tab bar:

    <tabbar ui-selected-tab="0">
        <uibutton implements="tab" class="selected">
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
    </tabbar>


&nbsp;
    
##Expander

The expander control provides a way to collapse and expand a vertical section of an app. To create an expander you just need to put an expander tag with a panel tag inside of it. You put your content inside that panel. ChocolateChip-UI will find that expander tag at launch time and add the functionality for you automatically. It also creates the header for the expander. This consists of a header tag with a label. ChococlateChip-UI styles the label and creates the circular expander button using before and after pseudo-elements. If you need to change the default colors of the expander control to match your app's theme, it isn't that hard. Here are the pieces to work with:

This defines the border along the top of the expander, the height is 8px:

expander > header {
    background-image: 
        -webkit-gradient(linear, left top, left bottom,
            from(#92a1bf),
            color-stop(0.8, #546993),
            color-stop(0.8, #a7babe),
            to(#a7babe));
    background-size: 100% 8px;
} 

These are the color styles for the label:

    expander > header > label {
        background-color: #a8b1c3;
        color: #fff;
        border: solid 2px #fff;
    }

This defines the colors for the base of the circular widget button:
    expander > header:before {
        border: solid 2px rgba(154,189,219,0.8);
        background-color: #556a97;
        -webkit-box-shadow: 
            0 3px 4px rgba(0,0,0,0.25),  
            0 -1px 4px rgba(0,0,0,0.25);
        background-image: 
            -webkit-gradient(linear, left top, left bottom, 
                from(#ddd), 
                to(#556a97));
    } 

This value defines the color of the arrow icon on the expander widget:

    expander > header:after {
        background-color: #fff;
    } 

This defines the colors for the expanded 
    expander.ui-status-expanded > header {
        background-image: 
            -webkit-gradient(linear, left top, left bottom,
                from(#92a1bf),
                color-stop(0.8, #546993),
                color-stop(0.8, rgba(0,0,0,0.1)),
                to(rgba(0,0,0,0.15)));
    }

This defines the background color of the expander's panel when it is opened. The gradient defines the border along the bottom of the expanded panel:

    expander.ui-status-expanded > panel {
        background-color: rgba(0,0,0,0.1);
        background-image: 
            -webkit-gradient(linear, left top, left bottom,
                from(#92a1bf),
                color-stop(0.8, #546993),
                color-stop(0.8, #a7babe),
                to(#a7babe));
    } 

This defines the background of the circular expander button in its open state:

    expander.ui-status-expanded > header:before {
        background-image: 
            -webkit-gradient(linear, left top, left bottom, 
                from(#ddd), 
                to(#182743));
    }

This defines the background color of the label with the expander is expanded:

    expander.ui-status-expanded > header > label {
        background-color: #7a89a4;
    }



&nbsp;

##UIPaging: a paging control

ChocolateChip-UI provides a type of stack that implements horizontal paging with dots below it to indicate how many pages/panels there are and which on is current. 



$nbsp;


##Spinner





&nbsp;

<a name="custom_tints"></a>
    
##Custom tints

ChocolateChip-UI enables you to create custom tints for many of its controls. The technique is very straightforward a easy to implement. You simply put a class of *ui-custom-tint" on the object you want to give a custom tint, then the base color in an inline style definition. Here's an example of a uibutton:

    <uibutton ui-icon-align="right" class="ui-custom-tint" style="background-color: #6f8000">
        <icon style="-webkit-mask-image: url(icons/cog.svg)"></icon>
        <label>Add to Favorites</label>
    </uibutton>

What ChocolateChip-UI does when it see the class *ui-custom-tint* is it switches out the default background gradient with a special, translucent one. This transparent gradient consists of color values to create shades over a background color. The background color to shows through the transparent gradient. This uses the same background color to also implement the hover/touched states. 

Using this technique you can style uibuttons in toolbars, uibuttons in segmented controls, actions uibuttons, navbars and toolbars. Below are examples of a toolbar and a segmentedcontrol with custom tints:

**Toolbar and UIButtons with Custom Tint:**

    <toolbar class="ui-custom-tint" style="background-color: rgba(255,192,0,.5);">
        <uibutton ui-implements="done" class="ui-custom-tint" style="background-color: #008040">
            <icon style="-webkit-mask-image: url(icons/attachement.png);"></icon>
            <label>Save</label>
        </uibutton>
        <uibutton class="ui-custom-tint" style="background-color: #5a3fff">
            <label>Click3</label>
        </uibutton>
        <uibutton class="ui-custom-tint">
            <label>Save</label>
        </uibutton>
    </toolbar>

When styling "back" and "next" uibuttons for use in a navbar, be aware that you also need to define the same custom tint for these uibuttons' pointer tag using CSS (Put the CSS in your app's head tag stylesheet):
    
    uibutton[style="background-color: #ff5614"].before {
        background-color: #ff5614;
    }
    
    <uibutton ui-implements="back" class="ui-custom-tint" style="background-color: #ff5614" ui-bar-align="left">
        <label>Back</label>
    </uibutton>

**Segmentedcontrol with Custom Tint:**

    <segmentedcontrol>
        <uibutton class="ui-custom-tint" style="background-color: #ffaf7f">
            <icon style="-webkit-mask-image: url(icons/chart.svg); background-color: #401800;"></icon>
            <label>Canada</label>
        </uibutton>
        <uibutton ui-icon-align="right" class="ui-custom-tint" style="background-color: #ffaf7f">
            <icon style="-webkit-mask-image: url(icons/chart.svg);  background-color: #401800;"></icon>
            <label>USA</label>
        </uibutton>
        <uibutton ui-icon-align="right" class="disabled ui-custom-tint" style="background-color: #ffaf7f">
            <icon style="-webkit-mask-image: url(icons/cog.svg); background-color: #401800;"></icon>
            <label>Mexico</label>
        </uibutton>
    </segmentedcontrol>

**Action UIButtons with Custom Tint:**

    <uibutton ui-kind="action" ui-implements="default" class="stretch ui-custom-tint" style="background-color: #8fc060">
        <icon style="-webkit-mask-image: url(icons/location_pin.svg);"></icon>
        <label>Set Value</label>
    </uibutton>
    <uibutton ui-kind="action" ui-implements="default" class="stretch ui-custom-tint" style="background-color: #ff6666">
        <icon style="-webkit-mask-image: url(icons/location_pin.svg);"></icon>
        <label>Set Value</label>
    </uibutton>


&nbsp;
    
##Custom background gradients

ChocolateChip-UI offers the attribute *ui-background-style="striped"* as a way to put the standard grayish/bluish vertical stripes on a view or subview. ChocolateChip-UI also gives you other background gradient options for containers. These are all transparent grayscale gradient patterns. This means you can add whatever background color to a container along with any of these attributes and you can create customized styles.

- ui-background-style="vertical-striped"
- ui-background-style="horizontal-striped"
- ui-background-style="slanted-left"
- ui-background-style="slanted-right"
- ui-background-style="vertical-striped-equal"
- ui-background-style="horizontal-striped-equal"
- ui-background-style="slanted-left-equal"
- ui-background-style="slanted-right-equal"
- ui-background-style="squared"
- ui-background-style="checkered"
- ui-background-style="chess"
- ui-background-style="speckled"
- ui-background-style="argyle"
- ui-background-style="intersect"
- ui-background-style="linen"

Here is what the gradients look like with a white background color:

![Transparent Background Gradients](../screenshots/Background-Gradients.png)

To use these you would do something as in these examples:

**Examples:**

<view ui-background-style="slanted-left" style="background-color: #fff5b6"></view>
<view ui-background-style="checkered" style="background-color: #d4e0ff"></view>
<view ui-background-style="speckled" style="background-color: #ffe0cb"></view>

**Note:** When using these patterns with a background color, keep it subtle. Using a loud color will distract from the data you are trying to present and make it hard for the user to accomplish tasks.


If you want, you can redefine or create new custom gradients to use as the background of a view or subview based on the above gradients. Just look for them in ChUI.css. Make a copy and experiment with different background image sizes or even change the black used for the gradient patters to another color so that it gets overlayed and composited with the underlying background color.  Because these patterns are created with CSS, they are resolution independent and can be scaled however you like. Have fun.

The attribute *ui-background-style="striped"* to put the standard vertical striped background on a view or subview. You can modify this in your document's head using a new class like this:

    view[ui-background-style=vertical-striped] {
        background-image: 
            -webkit-gradient(linear, left top, right top, 
                from(rgba(0,0,0,0.1)), 
                color-stop(0.75, rgba(0,0,0,0.1)), 
                color-stop(0.75, transparent), 
                to(transparent)); 
        -webkit-background-size: 5px 100%;
        background-size: 5px 100%;
    }        

You could  modify the color stops and the background size of gradients to create interesting patters. I've written a blog post about [how to create CSS3 gradients](#http://css3wizardry.com/2010/08/19/css3-gradients-and-patterns/) which you can reference for insights into how to create your own gradients.