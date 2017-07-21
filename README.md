
SearchAreaControl
=================
SearchAreaControl is a complete jQuery plugin that let's you **display**, **search** and **select** multiple items of a tree data structure.

Dependencies
------------
In order to start using SearchAreaControl you have to include **jQuery** first.

Installation
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

###The available options are listed bellow###

####data####
Provides the data that are going to be displayed.
> Type: `array`
> Deafult: An empty array

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

####multiSelect####
Set to false if you want to be able to select only one item at time
> Type: `boolean`
> Default: `true`

####columns####
Set the number of columns that the data will be rendered.
> Type:`number`
> Default: 2
