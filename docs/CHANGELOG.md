# Change Log

## [Unreleased]

## [v2.8.4] - 2020-09-03
### Fixed
- Prevent diselecting selected item after closing popup (when `multiSelect === false`)

## [v2.8.3] - 2019-05-31
### Changed
- Get popup id from new uuid

## [v2.8.2] - 2019-04-25
### Fixed
- Disable body scrolling when popup is visible (Fix)

## [v2.8.1] - 2019-04-24
### Fixed
- Fixed version number in `package.json`

## [v2.8.0] - 2019-04-24
### Added
- Added popup id to button (data-popupid)

### Fixed
- Disable body scrolling when popup is visible

## [v2.7.0] - 2019-03-12
### Added
- Russian language

## [v2.6.0] - 2019-01-03
### Added
- New option (`IOptions`) property `allNodesSelected`

## [v2.5.3] - 2018-11-16
### Changed
- Search method: **Ignore accents** on search

## [v2.5.2] - 2018-11-16
### Changed
- Search method: [Starts with] and [Exists in] are **case insensitive**

## [v2.5.1] - 2018-03-22
### Fixed
- Issue 68: Bootstrap modal ([https://github.com/kapantzak/SearchAreaControl/issues/68](https://github.com/kapantzak/SearchAreaControl/issues/68))
- Typescript declaration file `IData.nodeExpanded`

### Added
- New `IData` property `nodeSelected`

### Changed
- README (`IData` documentation)

## [v2.5.0] - 2018-03-20
### Added
- New popup button `Select highlighted`

### Changed
- (Typescript declaration file) Added new `selectHighlighted` property to the `IPopupButtonsCollection` interface
- README (`IPopupButton` documentation)

## [v2.4.1] - 2018-03-12
### Fixed
- Small viewport css

## [v2.4.0] - 2018-03-02
### Added
- Property `index` in `IPopupButton`

### Changed
- README (`IPopupButton` documentation)

## [v2.3.2] - 2018-02-08
### Changed
- css style (collapse / expand arrows)

## [v2.3.1] - 2018-02-08
### Fixed
- When `collapseNodes: true`, nodes with empty array still got an expand/collapse arrow

### Changed
- README: Changed `data` option markup

## [v2.3.0] - 2018-02-08
### Added
- New option `collapseNodes`
- New option `allNodesExpanded`

### Changed
- Added new property `nodeExpanded` to `IData` interface
- README: Added new options documentation and changed `data` option

## [v2.2.0] - 2018-02-01
### Added
- New option `mainButton.className` to provide custom class to main button
- New popup button `cancel` (Closes the popup without applying selection)

## [v2.1.3] - 2017-11-20
### Changed
- README (Contributing)

## [v2.1.2] - 2017-11-20
### Added
- CONTRIBUTING.md

### Changed
- README (table of contents / npm package version / languages supported by default)
- Moved CHANGELOG.md to `docs` folder

## [v2.1.1] - 2017-11-17

### Fixed
- Fixed Typescript declaration file: set `selectedNodes: string[],` option as optional `selectedNodes?: string[],` 

## [v2.1.0] - 2017-11-17

### Added
- Localization for portuguese-brazilian (`ptbr`)
- New option `selectedNodes` to pre-select one or more nodes

### Changed
- Event `searchareacontrol.afterinit` fires 10ms later

## [v2.0.0] - 2017-11-14

### Added
- Localization functionality (English (`en`) and Greek (`el`))

### BREAKING CHANGE
- Name of option `modallHeader` has changed to `modalHeader`

## [v1.6.0] - 2017-11-09

### Added

- Event `searchareacontrol.popup.beforeshow`
- Event `searchareacontrol.popup.beforehide`

## [v1.5.1] - 2017-11-04

### Changed
- README (Added documentation)

## [v1.5.0] - 2017-11-04

### Added
- Regular expression search

### Changed
- `searchareacontrol.selectedNodesChanged` event returns object with 3 properties (`element`, `selectedAll`, `selectedNodes`)

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
[v2.8.4]: https://github.com/kapantzak/SearchAreaControl/compare/v2.8.3...v2.8.4
[v2.8.3]: https://github.com/kapantzak/SearchAreaControl/compare/v2.8.2...v2.8.3
[v2.8.2]: https://github.com/kapantzak/SearchAreaControl/compare/v2.8.1...v2.8.2
[v2.8.1]: https://github.com/kapantzak/SearchAreaControl/compare/v2.8.0...v2.8.1
[v2.8.0]: https://github.com/kapantzak/SearchAreaControl/compare/v2.7.0...v2.8.0
[v2.7.0]: https://github.com/kapantzak/SearchAreaControl/compare/v2.6.0...v2.7.0
[v2.6.0]: https://github.com/kapantzak/SearchAreaControl/compare/v2.5.3...v2.6.0
[v2.5.3]: https://github.com/kapantzak/SearchAreaControl/compare/v2.5.2...v2.5.3
[v2.5.2]: https://github.com/kapantzak/SearchAreaControl/compare/v2.5.1...v2.5.2
[v2.5.1]: https://github.com/kapantzak/SearchAreaControl/compare/v2.5.0...v2.5.1
[v2.5.0]: https://github.com/kapantzak/SearchAreaControl/compare/v2.4.1...v2.5.0
[v2.4.1]: https://github.com/kapantzak/SearchAreaControl/compare/v2.4.0...v2.4.1
[v2.4.0]: https://github.com/kapantzak/SearchAreaControl/compare/v2.3.2...v2.4.0
[v2.3.2]: https://github.com/kapantzak/SearchAreaControl/compare/v2.3.1...v2.3.2
[v2.3.1]: https://github.com/kapantzak/SearchAreaControl/compare/v2.3.0...v2.3.1
[v2.3.0]: https://github.com/kapantzak/SearchAreaControl/compare/v2.2.0...v2.3.0
[v2.2.0]: https://github.com/kapantzak/SearchAreaControl/compare/v2.1.3...v2.2.0
[v2.1.3]: https://github.com/kapantzak/SearchAreaControl/compare/v2.1.2...v2.1.3
[v2.1.2]: https://github.com/kapantzak/SearchAreaControl/compare/v2.1.1...v2.1.2
[v2.1.1]: https://github.com/kapantzak/SearchAreaControl/compare/v2.1.0...v2.1.1
[v2.1.0]: https://github.com/kapantzak/SearchAreaControl/compare/v2.0.0...v2.1.0
[v2.0.0]: https://github.com/kapantzak/SearchAreaControl/compare/v1.6.0...v2.0.0
[v1.6.0]: https://github.com/kapantzak/SearchAreaControl/compare/v1.5.1...v1.6.0
[v1.5.1]: https://github.com/kapantzak/SearchAreaControl/compare/v1.5.0...v1.5.1
[v1.5.0]: https://github.com/kapantzak/SearchAreaControl/compare/v1.4.2...v1.5.0
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