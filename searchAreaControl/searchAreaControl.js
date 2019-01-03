; (function ($, window, document, undefined) {

    var pluginName = 'searchAreaControl';

    function Plugin(element, options) {
        this.el = element;
        this.$el = $(element);   
        this.opt = $.extend(true, {}, $.fn[pluginName].defaults, options);
        this.locales = $.extend(true, {}, $.fn[pluginName].locales, this.opt.localeData);
        this.rootClassName = 'elem-searchAreaControl';
        this.popupID = null;
        this.init();

        // Trigger 'searchareacontrol.afterinit' event
        var thisEl = this.$el;
        setTimeout(function() {
            thisEl.trigger('searchareacontrol.afterinit', [{ element: this.$el }]);
        },10);
    }

    Plugin.prototype = {

        init: function () {
            var $that = this;

            this.$el.trigger('searchareacontrol.beforeinit', [{ element: this.$el }]);

            this.$el.html(this._localize(this.opt.mainButton.defaultText));
            this._setData_DataSource(this.opt.data);

            // Add root class
            this.$el.addClass(this.rootClassName);

            // Add main button class name, if provided
            var mainButtonClassName = this.opt.mainButton.className;
            if (mainButtonClassName.length > 0) {
                this.$el.addClass(mainButtonClassName);
            }

            this.$el.trigger('searchareacontrol.beforebuildpopup', [{ element: this.$el }]);
            this._buildPopup(pluginName);

            this.$el.trigger('searchareacontrol.beforeinitsearcharea', [{ element: this.$el }]);
            this._initSearchArea();
            
            this.$el.on('click', function () {
                $that.$el.trigger('searchareacontrol.popup.beforeshow', [{ element: $that.$el }]);
                $that._togglePopup(true);
            });
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

        /**
         * Store selected nodes object on popup show
         */
        _setData_SelectedNodesOnPopupShow: function (data) {
            $.data(this, pluginName + '_selectedNodesOnPopupShow', data);
        },

        /**
         * Get the selected nodes object when the popup was opened
         */
        _getData_SelectedNodesOnPopupShow: function () {
            var data = $.data(this, pluginName + '_selectedNodesOnPopupShow');
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
                    
                    // Update selected nodes on popup show object
                    var selectedNodes = this._getSelectedNodes();
                    this._setData_SelectedNodesOnPopupShow(selectedNodes);

                    // Check for highlighted nodes on popup show
                    this._checkForHighlightedNodes();

                    // Remove Bootstrap's custom event listener
                    $(document).off('focusin.modal');

                    this.$el.trigger('searchareacontrol.popup.shown', [{ element: this.$el, popup: popup }]);
                } else {
                    overlay.hide();
                    popup.removeClass('sac-popup-visible');
                    this.$el.trigger('searchareacontrol.popup.hidden', [{ element: this.$el, popup: popup }]);
                }
            }
        },

        /**
         * Initialize searchArea functionality
         */
        _initSearchArea: function () {
            if (this.opt.modalHeader.visible === true) {
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
                var headerOpt = this.opt.modalHeader;
                var headerMarkup = '<div class="sac-header-holder ' + headerOpt.className + '"><h1 class="sac-header-h1">' + this._localize(headerOpt.text) + '</h1></div>';
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
                opt_startsWith.innerHTML = this._localize(comboOpts.startsWith.text);

                var opt_existsIn = document.createElement('option');
                opt_existsIn.setAttribute('value', '1');
                opt_existsIn.innerHTML = this._localize(comboOpts.existsIn.text);

                var opt_regExp = document.createElement('option');
                opt_regExp.setAttribute('value', '2');
                opt_regExp.innerHTML = this._localize(comboOpts.regExp.text);

                if (comboOpts.existsIn.selected === true) {
                    opt_existsIn.setAttribute('selected', 'selected');
                } else if (comboOpts.regExp.selected === true) {
                    opt_regExp.setAttribute('selected', 'selected');
                } else {
                    opt_startsWith.setAttribute('selected', 'selected');
                }

                combo.appendChild(opt_startsWith);
                combo.appendChild(opt_existsIn);
                combo.appendChild(opt_regExp);
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
                    var numSpan = $('<span class="sac-custom-numSpan"></span>');
                    var numSpanTxt = $('<span class="sac-custom-numSpan-txt">' + this._localize(this.opt.searchBox.selectedItemsLabelText) + '</span>');
                    var numSpanNum = $('<span class="sac-custom-numSpan-num">0</span>');
                    if (this.opt.searchBox.selectedItemsLabelVisible === true) {                        
                        numSpan.append(numSpanTxt);
                    }                    
                    numSpan.append(numSpanNum);                    
                    $(searchBoxHolder).append(numSpan);
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
                var collapseClass = (this.opt.collapseNodes === true) ? 'sac-nodes-collapse' : 'sac-nodes-fixed';
                colsHolder.className = 'sac-cols-holder ' + collapseClass;

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
                var nodeExpanded = node.nodeExpanded;
                var nodeSelected = node.nodeSelected;
                var children = node.children;

                var li = document.createElement('li');                
                var arrow = $('<span class="toggleNodeCollapse"><i class="fa fa-caret-right"></i><i class="fa fa-caret-down"></i></span>');
                var liSpan = document.createElement('span');
                
                if ($that.opt.collapseNodes === true && ($that.opt.allNodesExpanded === false || nodeExpanded === false)) {
                    li.className = 'sac-node-collapsed';
                }                

                // Set li's name
                if (name) {
                    var liName = (code) ? code + '.' + name : name;
                    liSpan.innerHTML = liName;
                }
                // Set li's attributes
                var itemSelected = false;
                if (attributes) {
                    for (var key in attributes) {
                        if (key == $that.opt.selectionByAttribute && ($that.opt.allNodesSelected === true || $that.opt.selectedNodes.indexOf(attributes[key]) !== -1)) {
                            itemSelected = true;
                        }
                        liSpan.setAttribute(key, attributes[key]);
                    }
                }
                var selClass = (itemSelected === true || nodeSelected === true) ? 'sac-node-selected' : '';
                liSpan.className = 'sac-node-name sac-noselect ' + selClass;

                if (children && Array.isArray(children) && children.length > 0 && $that.opt.collapseNodes === true) {
                    li.appendChild(arrow[0]);    
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

            var btnArr = [];
            for (var btn in buttons) {
                if (buttons[btn].visible === true) {
                    var thisBtn = buttons[btn];
                    var btnObj = {
                        text: thisBtn.text,
                        className: thisBtn.className,
                        visible: thisBtn.visible,
                        callback: thisBtn.callback,
                        index: thisBtn.index,
                        key: btn
                    };    
                    btnArr.push(btnObj);
                }
            }

            var indexArr = btnArr.map(function(b) { return b.index; });
            indexArr.sort();

            for (var i in indexArr) {
                var btnKey = btnArr.filter(function(b) { return b.index === indexArr[i]; })[0].key;  
                var btnObj = buttons[btnKey];
                $footer.append($that._getDefaultButton(btnKey, btnObj));
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
                popup.find('.sac-ul')
                    .not('.sac-ul-top')
                    .children('li')
                    .find('.sac-node-name')
                    .on('click', function () {                        
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
                    popup.find('.sac-ul.sac-ul-top')
                        .children('li')
                        .children('.sac-node-name')                        
                        .on('click', function () {                            
                            var that = $(this);
                            var par = that.closest('li');
                            var parChildren = par.find('.sac-node-name').not(that).not('.sac-node-disabled');
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

                // Node collapse
                if (this.opt.collapseNodes === true) {
                    popup.find('.toggleNodeCollapse').on('click', function() {
                        $(this).closest('li').toggleClass('sac-node-collapsed');
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
                if (valLen > 0) {
                    popup.addClass('sac-searching');
                    if ($that.opt.searchBox.hideNotFound === true) {
                        popup.addClass('sac-searching-hide-not-found');
                    }

                    var valWithoutAccents = $that._removeAccents(val);
                    var regExp = new RegExp(valWithoutAccents);
                    if (searchType == '0') {
                        var regVal = '^' + valWithoutAccents;
                        regExp = new RegExp(regVal, 'i');
                    } else if (searchType == '1') {
                        regExp = new RegExp(valWithoutAccents, 'i');
                    }
                    popup.find('.sac-node-name').each(function () {
                        var elem = $(this);
                        var textWithoutAccents = $that._removeAccents(elem.text());
                        var elemFound = regExp.test(textWithoutAccents);
                        if (elemFound) {
                            var fItem = elem.closest('li');
                            fItem.addClass('sac-found-item');
                            $that._foundParentNodes(elem);
                        }
                    });
                } else {
                    popup.removeClass('sac-searching sac-searching-hide-not-found');
                }
                $that._checkForHighlightedNodes();
            }
        },

        _removeAccents: function(str) {
            if (str && str.length > 0) {
                var accents    = 'ΆάΈέΉήΊίΌόΎύΏώΪϊΫϋΐΰÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
                var accentsOut = "ΑαΕεΗηΙιΟοΥυΩωΙιΥυιυAAAAAAaaaaaaOOOOOOOooooooEEEEeeeeoCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
                str = str.split('');
                var strLen = str.length;
                var i, x;
                for (i = 0; i < strLen; i++) {
                    if ((x = accents.indexOf(str[i])) != -1) {
                    str[i] = accentsOut[x];
                    }
                }
                return str.join('');
            }
            return str;
        },

        /**
         * Check for hightlighted nodes and toogle button's visibility
         */
        _checkForHighlightedNodes: function() {
            var nodes = this._getHighlightedNodes();
            this._toggleSelectHighlightedButtonVisibility(nodes !== null && nodes.length > 0);
        },

        /**
         * Toogle select highlighted button visibility
         */
        _toggleSelectHighlightedButtonVisibility: function(show) {
            var $that = this;
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                var btn = popup.find('.sac-btn-popup-selectHighlighted');
                if (show === true) {
                    btn.show();
                } else {
                    btn.hide();
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
                var btnClass = 'sac-btn-popup-' + key;
                button = $('<button id="btn_' + this.popupID + '_' + key + '" class="' + btn.className + ' ' + btnClass + '" type="button">' + $that._localize(btn.text) + '</button>');
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
                            $that._applySelection();
                            break;
                        case 'close':
                            $that._closePopup();
                            break;
                        case 'cancel':
                            $that._resetSelection();
                            $that._closePopup();
                            break;
                        case 'selectHighlighted':
                            $that._selectHighlighted();
                            $that._applySelection();
                            break;
                    }
                    if (btn.callback && typeof btn.callback === 'function') {
                        btn.callback();
                    }
                    $that.$el.trigger('searchareacontrol.button.click', [{ element: $that.$el, buttonKey: key }]);
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
            var allNodes = this._getAllNodes();
            if (popup && popup.length > 0 && allNodes !== null) {                
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
            var selectedAll = (allNodes !== null) ? allNodes.length === selectedNodes.length : false;
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
            this.$el.trigger('searchareacontrol.selectedNodesChanged', [{ element: this.$el, selectedNodes: selectedNodes }]);
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
            var mainBtnText = this._localize(this.opt.mainButton.defaultText);
            if (selectedNodes && Array.isArray(selectedNodes) && selectedNodes.length > 0) {
                if (selectedNodes.length <= this.opt.mainButton.maxSelectedViewText) {
                    mainBtnText = selectedNodes.map(function (node) {
                        return node.text;
                    }).join(', ');
                } else {
                    mainBtnText += ' (' + selectedNodes.length + ')';
                }
                if (this.opt.mainButton.showAllText === true && selNodesData.selectedAll === true) {
                    mainBtnText = this._localize(this.opt.mainButton.defaultAllText) + ' ' + mainBtnText;
                }
            } else {
                mainBtnText += ' (' + this._localize(this.opt.mainButton.defaultNoneText) + ')';
            }
            this.$el.html(mainBtnText);
        },

        /**
         * Select all nodes
         */
        _selectAll: function () {
            var nodes = this._getAllNodes();
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0 && nodes !== null) {
                if (this.opt.multiSelect === true) {
                    nodes.not('.sac-node-disabled').addClass('sac-node-selected');
                }
            }
        },

        /**
         * Select highlighted nodes
         */
        _selectHighlighted: function() {
            var nodes = this._getHighlightedNodes();
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0 && nodes !== null) {
                if (this.opt.multiSelect === true) {
                    nodes.not('.sac-node-disabled').addClass('sac-node-selected');
                }
            }
        },

        /**
         * Diselect all nodes
         */
        _diselectAll: function () {
            var nodes = this._getAllNodes();
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0 && nodes !== null) {
                nodes.removeClass('sac-node-selected');                
            }
        },

        /**
         * Invert selection
         */
        _invertSelection: function () {
            var nodes = this._getAllNodes();
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                if (this.opt.multiSelect === true && nodes !== null) {
                    nodes.not('.sac-node-disabled').toggleClass('sac-node-selected');
                } else {
                    console.warn('Unable to perform invertion due to multiSelect option set to false');
                }
            }
        },

        /**
         * Enable all nodes
         */
        _enableAll: function () {
            var nodes = this._getAllNodes();
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0 && nodes !== null) {
                nodes.removeClass('sac-node-disabled');                
            }
        },

        /**
         * Disable all nodes
         */
        _disableAll: function () {
            var nodes = this._getAllNodes();
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0 && nodes !== null) {
                nodes.addClass('sac-node-disabled');                
            }
        },

        /**
         * Get all nodes
         */
        _getAllNodes: function () {
            var nodes = null;
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                nodes = popup.find('.sac-ul').not('.sac-ul-top').children('li').find('.sac-node-name');
            }
            return nodes;
        },

        /**
         * Get highlighted nodes
         */
        _getHighlightedNodes: function () {
            var nodes = null;
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                nodes = popup.find('.sac-ul').not('.sac-ul-top').children('li').filter('.sac-found-item').find('.sac-node-name');
            }
            return nodes;
        },

        /**
         * Close popup
         */
        _closePopup: function () {     
            this.$el.trigger('searchareacontrol.popup.beforehide', [{ element: this.$el }]);       
            this._togglePopup(false);
        },

        /**
         * Reset selected nodes (Set selection of nodes that were selected when the popup opened)
         */
        _resetSelection: function () {
            var selectedNodesOnPopupShow = this._getData_SelectedNodesOnPopupShow();
            this._diselectAll();
            var allSelected = selectedNodesOnPopupShow.selectedAll;
            var nodes = selectedNodesOnPopupShow.selectedNodes;
            if (allSelected === true) {
                this._selectAll();
            } else if (nodes.length > 0) {
                var popup = $('#' + this.popupID);
                for (var n in nodes) {
                    var thisNode = nodes[n];
                    popup.find('.sac-node-name').filter('[' + this.opt.selectionByAttribute + '="' + thisNode.attributes[this.opt.selectionByAttribute] + '"]').addClass('sac-node-selected');
                }
            }
            this._applySelection();
        },

        /**
         * Localize key
         */
        _localize: function (key) {
            var locale = this.opt.locales;
            return (this.locales.hasOwnProperty(locale)) ? ((this.locales[locale].hasOwnProperty(key)) ? this.locales[locale][key] : key) : key;
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
         * @param {boolean} allSelected
         * @param {array} collection
         * @param {string} byAttribute Optional selection by attribute (If not provided, 'selectionByAttribute' option will be selected)
         */
        setSelectedNodes: function (allSelected, collection, byAttribute) {
            var popup = $('#' + this.popupID);
            var selectByAttribute = (byAttribute) ? byAttribute : this.opt.selectionByAttribute;
            var allNodes = this._getAllNodes();
            if (popup && popup.length > 0 && allNodes !== null) {                
                if (allSelected === true) {
                    allNodes.addClass('sac-node-selected');
                } else if (collection && Array.isArray(collection) && collection.length > 0) {
                    // Reset selections
                    this._diselectAll();
                    for (var item in collection) {
                        allNodes
                            .filter('[' + selectByAttribute + '="' + collection[item] + '"]')
                            .addClass('sac-node-selected');
                    }
                }
                this._applySelection();
            }
        },

        /**
         * Set disabled nodes
         * @param {array} collection
         * @param {boolean} diselectDisabled Diselect nodes to be disabled (if they are selected)
         * @param {string} byAttribute Optional selection by attribute (If not provided, 'selectionByAttribute' option will be selected)
         */
        setDisabledNodes: function (collection, diselectDisabled, byAttribute) {
            var popup = $('#' + this.popupID);
            var selectByAttribute = (byAttribute) ? byAttribute : this.opt.selectionByAttribute;
            var allNodes = this._getAllNodes();
            if (popup && popup.length > 0 && allNodes !== null) {                
                if (collection && Array.isArray(collection) && collection.length > 0) {
                    // Enable all
                    this._enableAll();
                    for (var item in collection) {
                        var nodesToDisable = allNodes.filter('[' + selectByAttribute + '="' + collection[item] + '"]');
                        if (diselectDisabled === true) {
                            nodesToDisable.removeClass('sac-node-selected');
                        }
                        nodesToDisable.addClass('sac-node-disabled');
                    }
                }
                this._applySelection();
            }
        },

        /**
         * Enable all nodes
         */
        enableAllNodes: function () {
            this._enableAll();
        },

        /**
         * Disable all nodes
         */
        disableAllNodes: function () {
            this._disableAll();
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
            var $that = this;
            return this._getData_SelectedNodes().selectedNodes.map(function (node) {
                var attrSelector = (attributeName) ? attributeName : $that.opt.selectionByAttribute;
                return node.attributes[attrSelector];
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
         * Return popup element if exists
         */
        getPopup: function () {
            var popup = $('#' + this.popupID);
            return (popup && popup.length > 0) ? popup : null;
        },

        /**
         * Update datasource (options and memory)
         */
        updateDatasource: function (data) {
            this.opt.data = data;
            this._setData_DataSource(data);
            var popup = $('#' + this.popupID);
            if (popup && popup.length > 0) {
                popup.empty();
                this.$el.trigger('searchareacontrol.beforeinitsearcharea', [{ element: this.$el }]);
                this._initSearchArea();
            }
        },

        /**
         * Set new locale and re-init plugin
         */
        setLocale: function (locale) {
            if (locale && typeof locale === 'string' && locale.length > 0) {
                this.destroy();
                this.opt.locales = locale;
                this.init();
            }
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
        'setDisabledNodes',
        'enableAllNodes',
        'disableAllNodes',
        'setLocale',
        'destroy'
    ];

    /**
     * Public methods (getters)
     */
    $.fn[pluginName].getters = [
        'getSelectedNodes',
        'getDisabled',
        'getSelectedByAttribute',
        'getPopup'
    ];

    $.fn[pluginName].locales = {
        en: {
            'Search': 'Search',
            'Selected items': 'Selected items',
            'Starts with': 'Starts with',
            'Exists in': 'Exists in',
            'Regular expression': 'Regular expression',
            'Items': 'Items',
            'None': 'None',
            'All': 'All',
            'Select all': 'Select all',
            'Diselect all': 'Diselect all',
            'Invert selection': 'Invert selection',
            'Close': 'Close',
            'Cancel': 'Cancel',
            'Select highlighted': 'Select highlighted'
        },
        el: {
            'Search': 'Αναζήτηση',
            'Selected items': 'Επιλεγμένα αντικείμενα',
            'Starts with': 'Ξεκινά με',
            'Exists in': 'Περιέχει',
            'Regular expression': 'Κανονική έκφραση',
            'Items': 'Αντικείμενα',
            'None': 'Κανένα',
            'All': 'Όλα',
            'Select all': 'Επιλογή όλων',
            'Diselect all': 'Αποεπιλογή όλων',
            'Invert selection': 'Αντιστροφή επιλογής',
            'Close': 'Κλείσιμο',
            'Cancel': 'Άκυρο',
            'Select highlighted': 'Επιλογή επισημασμένων'
        },
	    ptbr: {
            'Search': 'Busca',
            'Selected items': 'Itens Selecionados',
            'Starts with': 'Começa com',
            'Exists in': 'Existe em',
            'Regular expression': 'Expressão regular',
            'Items': 'Itens',
            'None': 'Nenhum',
            'All': 'Tudo',
            'Select all': 'Selecionar tudo',
            'Diselect all': 'Deselecionar Tudo',
            'Invert selection': 'Inverter Seleção',
            'Close': 'Fechar',
            'Cancel': 'Cancelar',
            'Select highlighted': 'Selecionar destacado'
        }
    };

    $.fn[pluginName].defaults = {
        modalHeader: {
            text: 'Search',
            className: '',
            visible: true
        },
        data: [],
        multiSelect: true,
        collapseNodes: false,
        allNodesExpanded: true,
        columns: 2,
        selectionByAttribute: 'data-id',
        allNodesSelected: false,
        selectedNodes: [],
        locales: 'en',
        localeData: null,
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
                },
                regExp: {
                    text: 'Regular expression',
                    selected: false
                }
            }
        },
        popupDimensions: {
            '768': {
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
            className: '',
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
                callback: null,
                index: 0
            },
            diselectAll: {
                text: 'Diselect all',
                className: 'btn btn-default',
                visible: true,
                callback: null,
                index: 1
            },
            invertSelection: {
                text: 'Invert selection',
                className: 'btn btn-default',
                visible: true,
                callback: null,
                index: 2
            },
            close: {
                text: 'Close',
                className: 'btn btn-default',
                visible: true,
                callback: null,
                index: 3
            },
            cancel: {
                text: 'Cancel',
                className: 'btn btn-default',
                visible: false,
                callback: null,
                index: 4
            },
            selectHighlighted: {
                text: 'Select highlighted',
                className: 'btn btn-default',
                visible: false,
                callback: null,
                index: 5
            }
        }
    }

})(jQuery, window, document);
