// Type definitions for SearchAreaControl plugin
// Project: SearchAreaControl
// Definitions by: John Kapantzakis <https://github.com/kapantzak>

declare namespace SAC {

    interface IOptions {
        modallHeader?: IModalHeader,
        data?: IData[],
        multiSelect?: boolean,
        columns?: number,
        selectionByAttribute?: string,
        searchBox?: ISearchBox
    }

    interface IModalHeader {
        text?: string,
        className?: string,
        visible?: boolean
    }

    interface IData {
        code?: string,
        name: string,
        attributes?: IDataAttributes,
        children?: IData[]
    }

    interface IDataAttributes {
        [key: string]: any
    }

    interface ISearchBox {
        enabled?: boolean,
        minCharactersSearch?: number,
        searchBoxClass?: string,
        searchBoxPlaceholder?: string,
        showSelectedItemsBox?: boolean,
        selectedItemsLabelVisible?: boolean,
        selectedItemsLabelText?: string,
        hideNotFound?: boolean,
        searchType?: ISearchTypeCollection,
        popupDimensions?: IPopupDimensionsCollection,
        mainButton?: IMainButton,
        popupButtons?: IPopupButtonsCollection
    }

    interface ISearchTypeCollection {
        startsWith?: ISearchType,
        existsIn?: ISearchType
    }

    interface ISearchType {
        text?: string,
        selected?: boolean
    }

    interface IPopupDimensionsCollection {
        [key: string]: IPopupDimensions
    }

    interface IPopupDimensions {
        width?: string,
        left?: string,
        marginLeft?: string
    }

    interface IMainButton {
        defaultText?: string,
        defaultNoneText?: string,
        defaultAllText?: string,
        showAllText?: boolean,
        maxSelectedViewText?: number
    }

    interface IPopupButtonsCollection {
        selectAll?: IPopupButton,
        diselectAll?: IPopupButton,
        invertSelection?: IPopupButton,
        close?: IPopupButton
    }

    interface IPopupButton {
        text?: string,
        className?: string,
        visible?: boolean,
        callback?: any
    }

}