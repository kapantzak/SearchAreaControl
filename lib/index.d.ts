// Type definitions for SearchAreaControl plugin
// Project: SearchAreaControl
// Definitions by: John Kapantzakis <https://github.com/kapantzak>

/// <reference types="jquery"/>

export interface SearchAreaControl {    
    version: string;
}

export as namespace SAC;

export interface IOptions {
    modalHeader?: IModalHeader,
    data?: IData[],
    multiSelect?: boolean,
    columns?: number,
    selectionByAttribute?: string,
    selectedNodes?: string[],
    locales?: string,
    localeData?: any,
    searchBox?: ISearchBox,
    popupDimensions?: IPopupDimensionsCollection,
    mainButton?: IMainButton,
    popupButtons?: IPopupButtonsCollection
}

export interface IModalHeader {
    text?: string,
    className?: string,
    visible?: boolean
}

export interface IData {
    code?: string,
    name: string,
    attributes?: IDataAttributes,
    children?: IData[]
}

export interface IDataAttributes {
    [key: string]: any
}

export interface ISearchBox {
    enabled?: boolean,
    minCharactersSearch?: number,
    searchBoxClass?: string,
    searchBoxPlaceholder?: string,
    showSelectedItemsBox?: boolean,
    selectedItemsLabelVisible?: boolean,
    selectedItemsLabelText?: string,
    hideNotFound?: boolean,
    searchType?: ISearchTypeCollection        
}

export interface ISearchTypeCollection {
    startsWith?: ISearchType,
    existsIn?: ISearchType,
    regExp?: ISearchType
}

export interface ISearchType {
    text?: string,
    selected?: boolean
}

export interface IPopupDimensionsCollection {
    [key: string]: IPopupDimensions
}

export interface IPopupDimensions {
    width?: string,
    left?: string,
    marginLeft?: string
}

export interface IMainButton {
    defaultText?: string,
    defaultNoneText?: string,
    defaultAllText?: string,
    showAllText?: boolean,
    maxSelectedViewText?: number
}

export interface IPopupButtonsCollection {
    selectAll?: IPopupButton,
    diselectAll?: IPopupButton,
    invertSelection?: IPopupButton,
    close?: IPopupButton
}

export interface IPopupButton {
    text?: string,
    className?: string,
    visible?: boolean,
    callback?: any
}

export interface ISelectedNodesObject {
    selectedAll: boolean,
    selectedNodes: ISelectedNodes[]
}

export interface ISelectedNodes {
    text: string,
    attributes: INodeAttributes
}

export interface INodeAttributes {
    [key: string]: any
}

declare global {
    interface JQuery {

        /**
         * Get the control's datasource object (array)
         */
        searchAreaControl(method: 'getData'): IData[];

        /**
         * Provide a collection of attributes (selectionByAttribute) to be selected, or set allSelected to true to select all available items. Provide an optional byAttribute parameter to indicate the attribute to select. If not provided, the plugin will try to search selectionByAttribute option value.
         */
        searchAreaControl(method: 'setSelectedNodes', allSelected: boolean, collection: Array<any>, byAttribute?: string): void;

        /**
         * Clear selected items.
         */
        searchAreaControl(method: 'clearSelection'): void;

        /**
         * Get an object of type ISelectedNodesObject
         */
        searchAreaControl(method: 'getSelectedNodes'): ISelectedNodesObject;

        /**
         * Get an array of specific attribute values of the selected items. If attributeName is not provided, the plugin will try to search selected node by selectionByAttribute option
         */
        searchAreaControl(method: 'getSelectedByAttribute', attributeName?: string): Array<any>;

        /**
         * Set disabled nodes specifying a collection of node attribute values (by default selectionByAttribute attribute). Set diselectDisabled to true if you want to diselect the nodes to be disabled. Provide an optional byAttribute parameter to indicate the attribute to select. If not provided, the plugin will try to search selectionByAttribute option value.
         */
        searchAreaControl(method: 'setDisabledNodes', collection: Array<any>, diselectDisabled: boolean, byAttribute?: string): void;

        /**
         * Enable all nodes
         */
        searchAreaControl(method: 'enableAllNodes'): void;

        /**
         * Disable all nodes
         */
        searchAreaControl(method: 'disableAllNodes'): void;

        /**
         * Get disabled state of main button
         */
        searchAreaControl(method: 'getDisabled'): boolean;

        /**
         * Toggle main button disabled state
         */
        searchAreaControl(method: 'setDisabled', disable: boolean): void;

        /**
         * Get the popup jQuery object
         */
        searchAreaControl(method: 'getPopup'): JQuery;

        /**
         * Update the datasource
         */
        searchAreaControl(method: 'updateDatasource', data: IData[]): void;

        /**
         * Set new locale and re-init plugin
         */
        searchAreaControl(method: 'setLocale', locale: string): void;

        /**
         * Destroy the plugin instance
         */
        searchAreaControl(method: 'destroy'): void;

        /**
         * Generic method function
         */
        searchAreaControl(method?: IOptions | string, arg1?: any, arg2?: any, arg3?: any): void;
    }

    interface JQueryStatic {
        SearchAreaControl: SearchAreaControl;
    }
}