# README #

SearchAreaControl is a complete client side control for selecting multiple items

### Usage ###

The simplest initialization:
```javascript
$('#myElement').searchAreaControl();
```

Initialize passing an options object:
```javascript
var options = {
	multiSelect: false
}
$('#myElement').searchAreaControl(options);
```

### Methods ###

There is a number of methods that you can use to perform various actions.

You can call a method like this:
````javascript
$('#myElement').searchAreaControl('methodName'[,arguments]);
````

####getData####
Call **getData** to get the current datasource object.