
SearchAreaControl
=================
SearchAreaControl is a complete jQuery plugin that let's you **display**, **search** and **select** multiple items.

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

####The available options are listed bellow
| OptionName | Type | Default value | Description |
| :--------- | :--: | :-----------: | :---------- |
| **data**   | `array` | empty array | Provides the data that are going to be displayed |
| **multiSelect** | `boolean` | `true` | Set to false if you want to be able to select only one item at time |
