
SearchAreaControl
=================
SearchAreaControl is a complete jQuery plugin that let's you **display**, **search** and **select** multiple items of a tree data structure.

Dependencies
------------
In order to start using SearchAreaControl you have to include **jQuery** first.

Installation
------------
Include the `.css` and `.js` file and you're ready to use it!

**CSS**

    <link rel="stylesheet" href="path-to-plugin-folder/css/sac-style.css" />
    
**jQuery**

    <script src="path-to-plugin-folder/searchAreaControl.js"></script>

Initialization
------------
All you need to do in order to initialize the SearchAreaControl plugin is a simple HTML element (button, span, div or anything):

**HTML**

    <button id="myButton" type="button" />

**jQuery**

    $('#myButton').searchAreaControl();

Options
-------
You can pass a variety of options in order to customize the behaviour and appearance of the control like this:

    $('#myButton').searchAreaControl({
		multiSelect: false
    });

#### The available options are listed bellow

### data
Provides the data that are going to be displayed.
> - Type: `array`
> - Deafult: An empty array

You have to pass an array of objects that have those properties.

    {
		code: null,
		group: null,
		name: 'Item name',
		attributes: {
			'data-id': 1
		},
		children: [{...}]
	}

### multiSelect
Set to false if you want to be able to select only one item at time
> - Type: `boolean`
> - Default: `true`

### columns
Set the number of columns that the data will be rendered.
> - Type:`number`
> - Default: `2`

### selectionByAttribute
Set the attribute that you want to select upon. The plugin will search for this attribute to match with the provided search string to filter all the items of the `data` array.
> - Type:`string`
> - Deafult: `'data-id'`

### modallHeader.text
The text that is going to be displayed in the modal header.
> - Type:`string`
> - Deafult: `'Search'`

### modallHeader.className
An optional custom class name for the modal header element.
> - Type:`string`
> - Deafult: `empty string`

### modallHeader.visible
Show or hide the modal header element.
> - Type:`boolean`
> - Deafult: `true`

### searchBox.enabled
Enable or disable the seacrbox functionality.
> - Type:`boolean`
> - Deafult: `true`

### searchBox.minCharactersSearch
Set the minimum characters typed in the searchbox without start searching for matches.
> - Type:`number`
> - Deafult: `2`

### searchBox.searchBoxClass
An optional custom class name for the searchbox element.
> - Type:`string`
> - Deafult: `empty string`

### searchBox.searchBoxPlaceholder
The placeholder to be displayed in the searchbox.
> - Type:`string`
> - Deafult: `empty string`

### searchBox.showSelectedItemsBox
Show the number of selected items. 
> - Type:`boolean`
> - Deafult: `true`

### searchBox.selectedItemsLabelVisible
Show or hide the selected items number element.  
> - Type:`boolean`
> - Deafult: `true`

### searchBox.selectedItemsLabelText
Set the label text to be displayed before the selected items number. (You have to set `searchBox.selectedItemsLabelVisible` to `true`)
> - Type:`string`
> - Deafult: `'Selected items'`

### searchBox.hideNotFound
If `true`, the items that do not match the searching criteria are going to be hidden.  
> - Type:`boolean`
> - Deafult: `true`

### searchBox.searchType
This option receives an object with two properties, `startsWith` and `existsIn`. These are the two different options that the user can select to perform the search functionality.

If `startsWith` is selected, the plugin will try to find only those items that their description **starts with** the search term.

If `existsIn` is selected, the plugin will try to find any item that it's description **contains** the search term.

Both of these options accept an object with two properties, `text` and `selected`.

This is the **default object** the plugin will use unless user provides anything different.

    searchType: {
	    startsWith: {
            text: 'Starts with',
            selected: false
        },
        existsIn: {
            text: 'Exists in',
            selected: true
        }
    }


#### searchBox.searchType.startsWith
This property sets the text and selected state of the `starts with` filter option

##### searchBox.searchType.startsWith.text
Set the text of the `startsWith` option.
> - Type: `string`,
> - Default: `'Starts with'`

##### searchBox.searchType.startsWith.selected
If `true`, this option is loaded as the selected option.
> - Type: `boolean`,
> - Default: `false`

#### searchBox.searchType.existsIn
This property sets the text and selected state of the `exists in` filter option

##### searchBox.searchType.existsIn.text
Set the text of the `existsIn` option.
> - Type: `string`,
> - Default: `'Exists in'`

##### searchBox.searchType.existsIn.selected
If `true`, this option is loaded as the selected option.
> - Type: `boolean`,
> - Default: `true`

### popupDimensions
This option sets the modal element dimensions and accepts an object with the following properties:

#### popupDimensions.width
Set the modal width. Provide a valid css value.
> - Type: `string`
> - Default: `700px`

#### popupDimensions.left
Set the modal `left` css rule. Provide a valid css value.
> - Type: `string`
> - Default: `50%`

#### popupDimensions.marginLeft
Set the modal `margin-left` css rule. Provide a valid css value.
> - Type: `string`
> - Default: `-350px`

### mainButton
Control the main button behaviour by providing an object with the following properties:

#### mainButton.defaultText
Set the default button text.
> - Type: `string`
> - Default: `'Items'`

#### mainButton.defaultNoneText
Set the default button text to be displayed when no item is selected.
> - Type: `string`
> - Default: `'None'`

#### mainButton.defaultAllText
Set the default button text to be displayed when all items are selected.
> - Type: `string`
> - Default: `'All'`

#### mainButton.showAllText
If `true`, show the `defaultAllText` if all items are selected.
> - Type: `boolean`
> - Default: `true`

#### mainButton.maxSelectedViewText
Each time the user selects an item, the plugin updates main button's text with the selected items descriptions. Set the maximum number of selected items you want to display as text.
> - Type: `number`
> - Default: `1`
