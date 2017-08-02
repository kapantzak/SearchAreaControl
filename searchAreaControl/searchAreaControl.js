; (function ($, window, document, undefined) {

    var pluginName = 'searchAreaControl';

    function Plugin(element, options) {
        this.el = element;
        this.$el = $(element);   
        this.opt = $.extend(true, {}, $.fn[pluginName].defaults, options);
        this.rootClassName = 'elem-searchAreaControl';
        this.popupID = null;
        this.init();
    }

    Plugin.prototype = {

        init: function () {
            var $that = this;

            $(document).trigger('searchareacontrol.beforeinit', [{ element: this.$el }]);

            this.$el.html(this.opt.mainButton.defaultText);
            this._setData_DataSource(this.opt.data);

            // Add class
            this.$el.addClass(this.rootClassName);

            $(document).trigger('searchareacontrol.beforebuildpopup', [{ element: this.$el }]);
            this._buildPopup(pluginName);

            $(document).trigger('searchareacontrol.beforeinitsearcharea', [{ element: this.$el }]);
            this._initSearchArea();
            
            this.$el.on('click', function () {
                $that._togglePopup(true);
            });

            $(document).trigger('searchareacontrol.afterinit', [{ element: this.$el }]);
        },

        /**
         * Build popup overlay and popup HTML markup
         */
        _buildPopup: function (pluginName) {
            var thisPopupID = (this.popupID !== null) ? this.popupID : this._getNewPopupID(pluginName);
            var dimensions = this._getPopupDimensions();
            var popup = $('<div id="' + thisPopupID + '_overlay" class="sac-popup-overlay" style="display:none;"><div id="' + thisPopupID + '" class="sac-popup" style="' + dimensions + '"></div></div>');
            $('body').append(popup);
        },

        /**
         * Get popup dimensions
         */
        _getPopupDimensions: function () {
            var w = $(window).width();
            var dimensions = this.opt.popupDimensions;
            var dimensionsObj = dimensions.max;
            for (var d in dimensions) {
                if (!isNaN(d) && w < parseInt(d)) {
                    dimensionsObj = dimensions[d];
                }
            }
            var style = 'width:' + dimensionsObj.width + ';';
            style += 'left:' + dimensionsObj.left + ';';
            style += 'margin-left:' + dimensionsObj.marginLeft + ';';
            return style;            
        },

        /**
         * Recalculate and update popup dimensions
         */
        _updatePopupDimensions: function() {
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                var dimensions = this._getPopupDimensions();
                popup.attr('style',dimensions);
            }
        },

        /**
         * Get unique popup id
         */
        _getNewPopupID: function (pluginName) {
            var thisPopupID = pluginName + '_Popup_' + ($('body').find('.' + this.rootClassName).length + 1);
            this.popupID = thisPopupID;
            return this.popupID;
        },

        // Data: DataSource ----------------------------------------------------------------- //

        /**
         * Store datasource in memory
         */
        _setData_DataSource: function (data) {
            $.data(this, pluginName + '_data', data);
        },

        /**
         * Get stored datasource
         */
        _getData_DataSource: function () {
            var data = $.data(this, pluginName + '_data');
            return (data) ? data : null;
        },

        // Data: SelectedNodes -------------------------------------------------------------- //

        /**
         * Store selected nodes object in memory
         */
        _setData_SelectedNodes: function (data) {
            $.data(this, pluginName + '_selectedNodes', data);
        },

        /**
         * Get stored selected nodes object
         */
        _getData_SelectedNodes: function () {
            var data = $.data(this, pluginName + '_selectedNodes');
            return (data) ? data : null;
        },

        // SEARCH AREA (start) ============================================================== //

        /**
         * Toggle popup visibility state
         */
        _togglePopup: function (show) {
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                var overlay = popup.closest('.sac-popup-overlay');
                if (show === true) {
                    this._updatePopupDimensions();
                    overlay.show();
                    popup.addClass('sac-popup-visible');
                    this._setSearchBoxDimensions();
                    $(document).trigger('searchareacontrol.popup.shown', [{ element: this.$el, popup: popup }]);
                } else {
                    overlay.hide();
                    popup.removeClass('sac-popup-visible');
                    $(document).trigger('searchareacontrol.popup.hidden', [{ element: this.$el, popup: popup }]);
                }
            }
        },

        /**
         * Initialize searchArea functionality
         */
        _initSearchArea: function () {
            if (this.opt.modallHeader.visible === true) {
                this._buildHeader();
            }
            if (this.opt.searchBox.enabled === true) {
                this._buildSearchBox();
                this._addSearchBoxEventListeners();
            }
            this._buildContent();
            this._buildPopupButtons();
            this._addEventListeners();
            this._applySelection();
        },

        /**
         * Build modal header
         */
        _buildHeader: function () {
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                var headerOpt = this.opt.modallHeader;
                var headerMarkup = '<div class="sac-header-holder ' + headerOpt.className + '"><h1 class="sac-header-h1">' + headerOpt.text + '</h1></div>';
                var header = $(headerMarkup);
                popup.append(header);
            }
        },

        /**
        *   Build searchBox and searchBox holder and append to popup 
        */
        _buildSearchBox: function () {
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {

                var searchBoxHolder = document.createElement('div');
                searchBoxHolder.className = 'sac-input-holder';

                // Search type
                var comboOpts = this.opt.searchBox.searchType;
                var combo = document.createElement('select');
                combo.className = 'sac-seacrh-combo-type';
                var opt_startsWith = document.createElement('option');
                opt_startsWith.setAttribute('value', '0');
                opt_startsWith.innerHTML = comboOpts.startsWith.text;
                var opt_existsIn = document.createElement('option');
                opt_existsIn.setAttribute('value', '1');
                opt_existsIn.innerHTML = comboOpts.existsIn.text;
                if (comboOpts.existsIn.selected === true) {
                    opt_existsIn.setAttribute('selected', 'selected');
                } else {
                    opt_startsWith.setAttribute('selected', 'selected');
                }
                combo.appendChild(opt_startsWith);
                combo.appendChild(opt_existsIn);
                searchBoxHolder.appendChild(combo);

                // Search box
                var searchBox = document.createElement('input');
                searchBox.type = 'text';
                searchBox.name = 'searchInput';
                var hiddenNumClass = (this.opt.searchBox.showSelectedItemsBox === true) ? '' : ' sac-input-elem-last ';
                searchBox.className = 'sac-input-elem ' + hiddenNumClass + this.opt.searchBox.searchBoxClass;
                searchBox.setAttribute('placeholder', this.opt.searchBox.searchBoxPlaceholder);
                searchBoxHolder.appendChild(searchBox);

                // Selected nodes num
                if (this.opt.searchBox.showSelectedItemsBox) {
                    var numSpan = document.createElement('span');
                    var numSpanTxt = document.createElement('span');
                    var numSpanNum = document.createElement('span');
                    numSpan.classList = 'sac-custom-numSpan';
                    numSpanTxt.classList = 'sac-custom-numSpan-txt';
                    numSpanNum.classList = 'sac-custom-numSpan-num';
                    numSpanTxt.innerHTML = this.opt.searchBox.selectedItemsLabelText;
                    numSpanNum.innerHTML = 0;
                    if (this.opt.searchBox.selectedItemsLabelVisible === true) {
                        numSpan.appendChild(numSpanTxt);
                    }
                    numSpan.appendChild(numSpanNum);
                    searchBoxHolder.appendChild(numSpan);
                }

                popup.append($(searchBoxHolder));
            }
        },

        _setSearchBoxDimensions: function () {
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                var inputHolder = popup.find('.sac-input-holder');
                var inputHolder_w = inputHolder.outerWidth();
                var searchTypeCombo = popup.find('.sac-seacrh-combo-type');
                var searchTypeCombo_w = searchTypeCombo.outerWidth();
                var selectedNum = popup.find('.sac-custom-numSpan');
                var selectedNum_w = selectedNum.outerWidth();
                var searchInput = popup.find('.sac-input-elem');
                var searchInput_w = inputHolder_w - (searchTypeCombo_w + selectedNum_w) - 2;
                searchInput.css('width', searchInput_w + 'px');
            }
        },

        /**
        *   Build content
        */
        _buildContent: function () {
            var $that = this;
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {

                // Split data array to the number of columns parts
                var dataLen = this.opt.data.length;
                var optCols = this.opt.columns;
                var addition = (dataLen % optCols > 0) ? 1 : 0;
                var chunk = parseInt(dataLen / optCols) + addition;

                var colsHolder = document.createElement('div');
                colsHolder.className = 'sac-cols-holder';

                var i, counter;
                for (i = 0, counter = 1; i < dataLen; i += chunk, counter++) {

                    var dataPart = this.opt.data.slice(i, i + chunk);
                    var colDivWidth = 100 / this.opt.columns;
                    var colDivStyle = 'width:' + colDivWidth + '%';

                    if (dataPart.length > 0) {
                        // Create column div
                        var col = document.createElement('div');
                        col.setAttribute('id', 'sa_col_' + counter);
                        col.setAttribute('style', colDivStyle);
                        col.className = 'sac-column-div sac-pull-left';

                        // Create the top level ul
                        var ul = document.createElement('ul');
                        ul.className = 'sac-ul sac-ul-top';

                        // Append children
                        $.each(dataPart, function (i, node) {
                            var child = $that._getListItem({
                                opt: this.opt,
                                node: node
                            });
                            // Append children to top level ul
                            ul.appendChild(child);
                        });

                        col.appendChild(ul);
                        colsHolder.appendChild(col);
                    }

                }

                popup.append($(colsHolder));
            }
        },

        /**
         * Get list item
         * @param {object} obj Node object
         */
        _getListItem: function (obj) {
            var $that = this;
            if (obj) {
                var opt = obj.opt;
                var node = obj.node;

                var code = node.code;
                var name = node.name;
                var attributes = node.attributes;
                var children = node.children;

                var li = document.createElement('li');
                var liSpan = document.createElement('span');
                liSpan.className = 'sac-node-name sac-noselect';

                // Set li's name
                if (name) {
                    var liName = (code) ? code + '.' + name : name;
                    liSpan.innerHTML = liName;
                }
                // Set li's attributes
                if (attributes) {
                    for (var key in attributes) {
                        liSpan.setAttribute(key, attributes[key]);
                    }
                }
                li.appendChild(liSpan);

                // Get children
                if (children) {
                    // Create ul
                    var c_ul = document.createElement('ul');
                    c_ul.className = 'sac-ul';

                    // Append children
                    $.each(children, function (i, childObj) {
                        var childItem = $that._getListItem({
                            opt: opt,
                            node: childObj
                        });
                        c_ul.appendChild(childItem);
                        li.appendChild(c_ul);
                    });
                }
                return li;
            }
        },

        /**
         * Build popup buttons
         */
        _buildPopupButtons: function () {
            var $that = this;
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                var footer = $('<div class="sac-footer"></div>');
                popup.append(footer);

                var buttons = this.opt.popupButtons;
                var $footer = popup.find('.sac-footer');

                this._appendDefaultButtons($footer);
            }
        },

        /**
         * Append default buttons in footer
         * @param {object} $footer jQuery footer object
         */
        _appendDefaultButtons: function ($footer) {
            var $that = this;
            var buttons = this.opt.popupButtons;
            for (var btn in buttons) {
                if (buttons[btn].visible === true) {
                    $footer.append($that._getDefaultButton(btn, buttons[btn]));
                }
            }
        },

        /**
         * Add event listeners on nodes
         */
        _addEventListeners: function () {
            var $that = this;
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {

                // Node
                popup.find('.sac-ul').not('.sac-ul-top').children('li').find('.sac-node-name').on('click', function () {
                    var thisNode = $(this);
                    if (!thisNode.hasClass('sac-node-disabled')) {
                        if ($that.opt.multiSelect === false) {
                            popup.find('.sac-node-name').not(this).removeClass('sac-node-selected');
                        }
                        thisNode.toggleClass('sac-node-selected');
                        $that._applySelection();
                    }
                });

                // Node parent
                if (this.opt.multiSelect === true) {
                    popup.find('.sac-ul.sac-ul-top').children('li').children('.sac-node-name').on('click', function () {
                        var that = $(this);
                        var par = that.closest('li');
                        var parChildren = par.find('.sac-node-name').not(that);
                        var parSelectedChildren = parChildren.filter('.sac-node-selected');
                        var parChildrenNum = parChildren.length;
                        var parSelectedChildrenNum = parSelectedChildren.length;
                        if (parChildrenNum === parSelectedChildrenNum) {
                            parChildren.removeClass('sac-node-selected');
                        } else {
                            parChildren.addClass('sac-node-selected');
                        }
                        $that._applySelection();
                    });
                }
            }
        },

        /**
         * Add event listeners on search input
         */
        _addSearchBoxEventListeners: function () {
            var $that = this;
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {

                var input = popup.find('.sac-input-elem');

                // Search type combo
                popup.find('.sac-seacrh-combo-type').on('change', function () {
                    $that._searchNodes(input.val());
                });

                // Search box input
                input.on('input', function () {
                    var inp = $(this);
                    var val = inp.val();
                    $that._searchNodes(val);
                });
            }
        },

        /**
         * Perform search for given value
         * @param {string} val Value to search for
         */
        _searchNodes: function (val) {
            var $that = this;
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                var searchType = popup.find('.sac-seacrh-combo-type').val();

                // Reset classes
                popup.find('li').removeClass('sac-found-category sac-found-item');
                popup.find('.sac-node-name').removeClass('sac-found-item');

                var valLen = val.length;
                if (valLen >= $that.opt.searchBox.minCharactersSearch) {
                    popup.addClass('sac-searching');
                    if ($that.opt.searchBox.hideNotFound === true) {
                        popup.addClass('sac-searching-hide-not-found');
                    }

                    // Check for index
                    popup.find('.sac-node-name').each(function () {
                        var elem = $(this);
                        var elemIndex = elem.text().toLowerCase().indexOf(val.toLowerCase());
                        //var elemFound = elemIndex != -1;
                        var elemFound = (searchType == '0') ? elemIndex === 0 : elemIndex != -1;
                        if (elemFound) {
                            var fItem = elem.closest('li');
                            fItem.addClass('sac-found-item');
                            $that._foundParentNodes(elem);
                        }
                    });
                } else {
                    popup.removeClass('sac-searching sac-searching-hide-not-found');
                }
            }
        },

        /**
         * Find parent nodes and indicate as found items
         * @param {object} elem jQuery node object
         */
        _foundParentNodes: function (elem) {
            var $that = this;
            if (elem) {
                var parUl = elem.closest('ul');
                if (parUl.hasClass('sac-ul-top')) {
                    elem.closest('li').addClass('sac-found-category');
                }
                var parNode = parUl.closest('li');
                parNode.addClass('sac-found-category');
                var upperParent = parNode.closest('ul').closest('li');
                if (upperParent && upperParent.length > 0) {
                    $that._foundParentNodes(parNode);
                }
            }
        },

        /**
         * Get button from options
         * @param {string} key Button name
         * @param {object} btn Options button object
         */
        _getDefaultButton: function (key, btn) {
            var $that = this;
            var hiddenOnSingleSelection = ['selectAll', 'diselectAll', 'invertSelection'];
            var button = null;

            if (this.opt.multiSelect === true || (this.opt.multiSelect === false && hiddenOnSingleSelection.indexOf(key) === -1)) {
                button = $('<button id="btn_' + this.popupID + '_' + key + '" class="' + btn.className + '" type="button">' + btn.text + '</button>');
                button.on('click', function () {
                    switch (key) {
                        case 'selectAll':
                            $that._selectAll();
                            $that._applySelection();
                            break;
                        case 'diselectAll':
                            $that._diselectAll();
                            $that._applySelection();
                            break;
                        case 'invertSelection':
                            $that._invertSelection()
                            $that._applySelection();;
                            break;
                        case 'close':
                            $that._closePopup();
                            break;
                    }
                    if (btn.callback && typeof btn.callback === 'function') {
                        btn.callback();
                    }
                    $(document).trigger('searchareacontrol.button.click', [{ element: $that.$el, buttonKey: key }]);
                });
            }
            return button;
        },

        /**
         * Get an array of selected nodes
         */
        _getSelectedNodes: function () {
            var selectedNodes = [];
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                var allNodes = popup.find('.sac-ul').not('.sac-ul-top').children('li').find('.sac-node-name');
                allNodes.filter('.sac-node-selected').each(function () {
                    var node = $(this);
                    var attributes = {};
                    Array.prototype.slice.call(node[0].attributes).forEach(function (item) {
                        attributes[item.name] = item.value;
                    });
                    selectedNodes.push({
                        text: node.text(),
                        attributes: attributes
                    });
                });
            }
            var selectedAll = allNodes.length === selectedNodes.length
            return {
                selectedAll: selectedAll,
                selectedNodes: selectedNodes
            }
        },

        /**
         * Get selected nodes and store data
         */
        _applySelection: function () {
            var selectedNodes = this._getSelectedNodes();
            this._setData_SelectedNodes(selectedNodes);
            this._updateMainButton();
            if (this.opt.searchBox.showSelectedItemsBox === true) {
                this._updateSelectedItemsNum();
            }
        },

        /**
         * Update selected items number (if visible)
         */
        _updateSelectedItemsNum: function () {
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                var numSpan = popup.find('.sac-custom-numSpan-num');
                var selectedNodes = this._getData_SelectedNodes();
                var num = 0;
                if (selectedNodes && selectedNodes.hasOwnProperty('selectedNodes')) {
                    num = (Array.isArray(selectedNodes.selectedNodes)) ? selectedNodes.selectedNodes.length : 0;
                }
                numSpan.html(num);
            }
        },

        /**
         * Update main button text
         */
        _updateMainButton: function () {
            var selNodesData = this._getData_SelectedNodes();
            var selectedNodes = (selNodesData.hasOwnProperty('selectedNodes')) ? selNodesData.selectedNodes : [];
            var mainBtnText = this.opt.mainButton.defaultText;
            if (selectedNodes && Array.isArray(selectedNodes) && selectedNodes.length > 0) {
                if (selectedNodes.length <= this.opt.mainButton.maxSelectedViewText) {
                    mainBtnText = selectedNodes.map(function (node) {
                        return node.text;
                    }).join(', ');
                } else {
                    mainBtnText += ' (' + selectedNodes.length + ')';
                }
                if (this.opt.mainButton.showAllText === true && selNodesData.selectedAll === true) {
                    mainBtnText = this.opt.mainButton.defaultAllText + ' ' + mainBtnText;
                }
            } else {
                mainBtnText += ' (' + this.opt.mainButton.defaultNoneText + ')';
            }
            this.$el.html(mainBtnText);
        },

        /**
         * Select all nodes
         */
        _selectAll: function () {
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                if (this.opt.multiSelect === true) {
                    popup.find('.sac-ul').not('.sac-ul-top').children('li').find('.sac-node-name').addClass('sac-node-selected');
                } else {
                    console.warn('Unable to perform diselection due to multiSelect option set to false');
                }
            }
        },

        /**
         * Diselect all nodes
         */
        _diselectAll: function () {
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                popup.find('.sac-ul').not('.sac-ul-top').children('li').find('.sac-node-name').removeClass('sac-node-selected');                
            }
        },

        /**
         * Invert selection
         */
        _invertSelection: function () {
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                if (this.opt.multiSelect === true) {
                    popup.find('.sac-ul').not('.sac-ul-top').children('li').find('.sac-node-name').toggleClass('sac-node-selected');
                } else {
                    console.warn('Unable to perform invertion due to multiSelect option set to false');
                }
            }
        },

        /**
         * Close popup
         */
        _closePopup: function () {
            this._togglePopup(false);
        },

        // SEARCH AREA (end) ================================================================ //

        // PUBLIC METHODS (start) =========================================================== //

        /**
         * Get datasource
         */
        getData: function () {
            return this._getData_DataSource();
        },

        /**
         * Set selected nodes
         */
        setSelectedNodes: function (allSelected, collection) {
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                var allNodes = popup.find('.sac-ul').not('.sac-ul-top').children('li').find('.sac-node-name');
                if (allSelected === true) {
                    allNodes.addClass('sac-node-selected');
                } else if (collection && Array.isArray(collection) && collection.length > 0) {
                    // Reset selections
                    this._diselectAll();
                    for (var item in collection) {
                        allNodes.filter('[' + this.opt.selectionByAttribute + '="' + collection[item] + '"]').addClass('sac-node-selected');
                    }
                }
                this._applySelection();
            }
        },

        /**
         * Clear selected nodes
         */
        clearSelection: function () {
            this._diselectAll();
            this._applySelection();
        },

        /**
         * Get stored selected nodes
         */
        getSelectedNodes: function () {
            return this._getData_SelectedNodes();
        },

        /**
         * Get an array of specific attribute values of the selected nodes
         */
        getSelectedByAttribute: function (attributeName) {
            return this._getData_SelectedNodes().selectedNodes.map(function (node) {
                return node.attributes[attributeName];
            });
        },

        /**
         * Get disabled state of main button
         */
        getDisabled: function () {            
            return this.$el.is(':disabled');
        },

        /**
         * Toggle main button disabled state
         */
        setDisabled: function (disable) {
            this.$el.prop('disabled', disable);
        },

        /**
         * Update datasource (options and memory)
         */
        updateDatasource: function (data) {
            this.opt.data = data;
            this._setData_DataSource(data);
        },

        /**
         * Destroy the plugin
         */
        destroy: function () {
            // Remove button text
            this.$el.empty();
            // Remove stored data
            this.$el.removeData().removeClass(this.rootClassName);
            // Remove popup
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                popup.closest('.sac-popup-overlay').remove();
            }
        }

        // PUBLIC METHODS (end) ============================================================= //

    }

    $.fn[pluginName] = function (options) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            // New plugin instance with chainability
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            if ((Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].methods) != -1) || $.inArray(options, $.fn[pluginName].getters) != -1) {
                // Return method result (no chainability)
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Return element (chainability)
                return this.each(function () {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    }
                });
            }
        }
    }

    /**
     * Set array of accepted public methods
     */
    $.fn[pluginName].methods = [
        'getData',
        'setSelectedNodes',
        'clearSelection',
        'setDisabled',
        'updateDatasource',
        'destroy'
    ];

    /**
     * Public methods (getters)
     */
    $.fn[pluginName].getters = [
        'getSelectedNodes',
        'getDisabled',
        'getSelectedByAttribute'
    ];

    $.fn[pluginName].defaults = {
        modallHeader: {
            text: 'Search',
            className: '',
            visible: true
        },
        data: [],
        multiSelect: true,
        columns: 2,
        selectionByAttribute: 'data-id',
        searchBox: {
            enabled: true,
            minCharactersSearch: 2,
            searchBoxClass: '',
            searchBoxPlaceholder: '',
            showSelectedItemsBox: true,
            selectedItemsLabelVisible: true,
            selectedItemsLabelText: 'Selected items',
            hideNotFound: true,
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
        },
        popupDimensions: {
            768: {
                width: '95%',
                left: '2.5%',
                marginLeft: '0'
            },
            'max': {
                width: '700px',
                left: '50%',
                marginLeft: '-350px'
            }            
        },
        mainButton: {
            defaultText: 'Items',
            defaultNoneText: 'None',
            defaultAllText: 'All',
            showAllText: true,
            maxSelectedViewText: 1
        },
        popupButtons: {
            selectAll: {
                text: 'Select all',
                className: 'btn btn-success',
                visible: true,
                callback: null
            },
            diselectAll: {
                text: 'Diselect all',
                className: 'btn btn-default',
                visible: true,
                callback: null
            },
            invertSelection: {
                text: 'Invert selection',
                className: 'btn btn-default',
                visible: true,
                callback: null
            },
            close: {
                text: 'Close',
                className: 'btn btn-default',
                visible: true,
                callback: null
            }
        }
    }

})(jQuery, window, document);