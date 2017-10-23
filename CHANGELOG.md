# Change Log

## [Unreleased]

## [v1.4.2] - 2017-10-23

### Fixed
- Typescript declaration file
- Search box selected nodes span

## [v1.4.1] - 2017-10-23

### Fixed
- Typescript declaration file

## [v1.4.0] - 2017-10-22

### Added
- Typescript declaration file
- `searchareacontrol.selectedNodesChanged` event

### Changed
- `getSelectedByAttribute` method's parameter gets **optional**
- README (Added NPM section and new event)

## [v1.3.6] - 2017-10-09

### Fixed
- Corrected type error
 
## [v1.3.5] - 2017-10-09

### Fixed
- IE11 Error in 'strict mode': *Assignment to read-only properties is not allowed in strict mode* for `classList` change (=> .style.cssText) 

## [v1.3.4] - 2017-08-29

### Added
- getPopup() method: Returns the jQuery object instance of the specific popup element
- setDisabledNodes(collection, diselectDisabled, byAttribute): Disables specified nodes
- enableAllNodes(): Enables all nodes
- disableAllNodes(): Disbales all nodes

### Changed
- setSelectedNodes(allSelected, collection, byAttribute): New optional parameter `byAttribute`
- Removed 'group' property from plugin data format

## [v1.3.3] - 2017-08-25

### Fixed
- updateDatasource() method: Updates datasource and rebuilds popup

## [v1.3.2] - 2017-08-03

### Added
- CHANGELOG file
- Custom events

### Changed
- README (Added events section)

## [v1.3.1] - 2017-08-02

### Changed
- Options: popupDimensions object (multiple window width breakpoints)

## [v1.3.0] - 2017-08-01

### Added
- Test page (test.html)

### Fixed
- Mixed data for multiple plugin instances


[Unreleased]: https://github.com/kapantzak/SearchAreaControl/compare/master...develop
[v1.4.2]: https://github.com/kapantzak/SearchAreaControl/compare/v1.4.1...v1.4.2
[v1.4.1]: https://github.com/kapantzak/SearchAreaControl/compare/v1.4.0...v1.4.1
[v1.4.0]: https://github.com/kapantzak/SearchAreaControl/compare/v1.3.6...v1.4.0
[v1.3.6]: https://github.com/kapantzak/SearchAreaControl/compare/v1.3.5...v1.3.6
[v1.3.5]: https://github.com/kapantzak/SearchAreaControl/compare/v1.3.4...v1.3.5
[v1.3.4]: https://github.com/kapantzak/SearchAreaControl/compare/v1.3.3...v1.3.4
[v1.3.3]: https://github.com/kapantzak/SearchAreaControl/compare/v1.3.2...v1.3.3
[v1.3.2]: https://github.com/kapantzak/SearchAreaControl/compare/v1.3.1...v1.3.2
[v1.3.1]: https://github.com/kapantzak/SearchAreaControl/compare/v1.3.0...v1.3.1
[v1.3.0]: https://github.com/kapantzak/SearchAreaControl/compare/v1.2.2...v1.3.0