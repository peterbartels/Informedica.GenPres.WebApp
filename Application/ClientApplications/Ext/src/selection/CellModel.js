/*
This file is part of Ext JS 4.2

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

Pre-release code in the Ext repository is intended for development purposes only and will
not always be stable. 

Use of pre-release code is permitted with your application at your own risk under standard
Ext license terms. Public redistribution is prohibited.

For early licensing, please contact us at licensing@sencha.com

Build date: 2013-02-13 19:36:35 (686c47f8f04c589246d9f000f87d2d6392c82af5)
*/
/**
 *
 */
Ext.define('Ext.selection.CellModel', {
    extend: 'Ext.selection.Model',
    alias: 'selection.cellmodel',
    requires: ['Ext.util.KeyNav'],

    isCellModel: true,

    /**
     * @cfg {Boolean} enableKeyNav
     * Turns on/off keyboard navigation within the grid.
     */
    enableKeyNav: true,

    /**
     * @cfg {Boolean} preventWrap
     * Set this configuration to true to prevent wrapping around of selection as
     * a user navigates to the first or last column.
     */
    preventWrap: false,

    // private property to use when firing a deselect when no old selection exists.
    noSelection: {
        row: -1,
        column: -1
    },

    constructor: function() {
        this.addEvents(
            /**
             * @event deselect
             * Fired after a cell is deselected
             * @param {Ext.selection.CellModel} this
             * @param {Ext.data.Model} record The record of the deselected cell
             * @param {Number} row The row index deselected
             * @param {Number} column The column index deselected
             */
            'deselect',

            /**
             * @event select
             * Fired after a cell is selected
             * @param {Ext.selection.CellModel} this
             * @param {Ext.data.Model} record The record of the selected cell
             * @param {Number} row The row index selected
             * @param {Number} column The column index selected
             */
            'select'
        );
        this.callParent(arguments);
    },

    bindComponent: function(view) {
        var me = this,
            grid = view.ownerCt;
        me.primaryView = view;
        me.views = me.views || [];
        me.views.push(view);
        me.bindStore(view.getStore(), true);

        view.on({
            cellmousedown: me.onMouseDown,
            refresh: me.onViewRefresh,
            scope: me
        });
        if (grid.optimizedColumnMove !== false) {
            grid.on('columnmove', me.onColumnMove, me);
        }

        if (me.enableKeyNav) {
            me.initKeyNav(view);
        }
    },

    initKeyNav: function(view) {
        var me = this;

        if (!view.rendered) {
            view.on('render', Ext.Function.bind(me.initKeyNav, me, [view], 0), me, {single: true});
            return;
        }

        view.el.set({
            tabIndex: -1
        });

        // view.el has tabIndex -1 to allow for
        // keyboard events to be passed to it.
        me.keyNav = new Ext.util.KeyNav({
            target: view.el,
            ignoreInputFields: true,
            up: me.onKeyUp,
            down: me.onKeyDown,
            right: me.onKeyRight,
            left: me.onKeyLeft,
            tab: me.onKeyTab,
            scope: me
        });
    },

    getHeaderCt: function() {
        var selection = this.getCurrentPosition(),
            view = selection ? selection.view : this.primaryView;

        return view.headerCt;
    },

    onKeyUp: function(e, t) {
        this.doMove('up', e);
    },

    onKeyDown: function(e, t) {
        this.doMove('down', e);
    },

    onKeyLeft: function(e, t) {
        this.doMove('left', e);
    },

    onKeyRight: function(e, t) {
        this.doMove('right', e);
    },
    
    doMove: function(direction, e){
        this.keyNavigation = true;
        this.move(direction, e);
        this.keyNavigation = false;
    },

    move: function(dir, e) {
        var me = this,
            pos = me.getCurrentPosition(),
            newPos;

        if (pos) {
            // Calculate the new row and column position
            newPos = pos.view.walkCells(pos, dir, e, me.preventWrap);
            // If walk was successful, select new Position
            if (newPos) {
                newPos.view = pos.view;
                return me.setCurrentPosition(newPos);
            }
        }
        // <debug>
        // Enforce code correctness in unbuilt source.
        return null;
        // </debug>
    },

    /**
     * Returns the current position in the format {row: row, column: column}
     */
    getCurrentPosition: function() {
        // If it's during a select, return nextSelection since we buffer
        // the real selection until after the event fires
        return this.selecting ? this.nextSelection : this.selection;
    },

    /**
     * Sets the current position
     * @param {Object} position The position to set.
     */
    setCurrentPosition: function(pos) {
        var me = this,
            last = me.selection;

        // onSelectChange uses lastSelection and nextSelection
        me.lastSelection = last;
        if (last) {
            // If the position is the same, jump out & don't fire the event
            if (pos && (pos.row === last.row && pos.column === last.column && pos.view === last.view)) {
                pos = null;
            } else {
                me.onCellDeselect(me.selection);
            }
        }

        if (pos) {
            me.nextSelection = new me.Selection(me);
            me.nextSelection.setPosition(pos);
            // set this flag here so we know to use nextSelection
            // if the node is updated during a select
            me.selecting = true;
            me.onCellSelect(me.nextSelection);
            me.selecting = false;
            // Deselect triggered by new selection will kill the selection property, so restore it here.
            return (me.selection = me.nextSelection);
        }
        // <debug>
        // Enforce code correctness in unbuilt source.
        return null;
        // </debug>
    },

    isCellSelected: function(view, row, column) {
        var me = this,
            testPos,
            pos = me.getCurrentPosition();

        if (pos && pos.view === view) {
            testPos = new this.Selection(me);
            testPos.setPosition({
                view: view,
                row: row,
                column: column
            });
            return (testPos.record === pos.record) && (testPos.columnHeader === pos.columnHeader);
        }
    },

    // Keep selection model in consistent state upon record deletion.
    onStoreRemove: function(store, records, indexes) {
        var me = this,
            pos = me.getCurrentPosition(),
            i, length = records.length,
            index, shuffleCount = 0;

        me.callParent(arguments);
        if (pos) {
            // All deletions are after the selection - do nothing
            if (indexes[0] > pos.row) {
                return;
            }

            for (i = 0; i < length; i++) {
                index = indexes[i];
                
                // Deleted a row that was before the selected row, selection will be bumped up by one
                if (index < pos.row) {
                    shuffleCount++;
                }
                // We've gone past the selection.
                else {
                    break;
                }
            }

            // Deletions were before the selection - bump it up
            if (shuffleCount) {
                pos.setRow(pos.row - shuffleCount);
            }
        }
    },

    /**
     * Set the current position based on where the user clicks.
     * @private
     */
    onMouseDown: function(view, cell, cellIndex, record, row, recordIndex, e) {

        // Record index will be -1 if the clicked record is a metadata record and not selectable
        if (recordIndex !== -1) {
            this.setCurrentPosition({
                view: view,
                row: row,
                column: cellIndex
            });
        }
    },

    // notify the view that the cell has been selected to update the ui
    // appropriately and bring the cell into focus
    onCellSelect: function(position, supressEvent) {
        if (position && position.row !== undefined && position.row > -1) {
            this.doSelect(position.record, /*keepExisting*/false, supressEvent);
        }
    },

    // notify view that the cell has been deselected to update the ui
    // appropriately
    onCellDeselect: function(position, supressEvent) {
        if (position && position.row !== undefined) {
            this.doDeselect(position.record, supressEvent);
        }
    },

    onSelectChange: function(record, isSelected, suppressEvent, commitFn) {
        var me = this,
            pos,
            eventName,
            view;

        if (isSelected) {
            pos = me.nextSelection;
            eventName = 'select';
        } else {
            pos = me.lastSelection || me.noSelection;
            eventName = 'deselect';
        }

        // CellModel may be shared between two sides of a Lockable.
        // The position must include a reference to the view in which the selection is current.
        // Ensure we use the view specifiied by the position.
        view = pos.view || me.primaryView;

        if ((suppressEvent || me.fireEvent('before' + eventName, me, record, pos.row, pos.column)) !== false &&
                commitFn() !== false) {

            if (isSelected) {
                view.onCellSelect(pos);
                view.onCellFocus(pos);
            } else {
                view.onCellDeselect(pos);
                delete me.selection;
            }

            if (!suppressEvent) {
                me.fireEvent(eventName, me, record, pos.row, pos.column);
            }
        }
    },

    // Tab key from the View's KeyNav, *not* from an editor.
    onKeyTab: function(e, t) {
        var me = this,
            pos = me.getCurrentPosition(),
            editingPlugin;

        if (pos) {
            editingPlugin = pos.view.editingPlugin;
            // If we were in editing mode, but just focused on a non-editable cell, behave as if we tabbed off an editable field
            if (editingPlugin && me.wasEditing) {
                me.onEditorTab(editingPlugin, e)
            } else {
                me.move(e.shiftKey ? 'left' : 'right', e);
            }
        }
    },

    onEditorTab: function(editingPlugin, e) {
        var me = this,
            direction = e.shiftKey ? 'left' : 'right',
            position  = me.move(direction, e);

        // Navigation had somewhere to go.... not hit the buffers.
        if (position) {
            // If we were able to begin editing clear the wasEditing flag. It gets set during navigation off an active edit.
            if (editingPlugin.startEdit(position.row, position.column)) {
                me.wasEditing = false;
            }
            // If we could not continue editing...
            // Set a flag that we should go back into editing mode upon next onKeyTab call
            else {
                me.wasEditing = true;
                if (!position.columnHeader.dataIndex) {
                    me.onEditorTab(editingPlugin, e);
                }
            }
        }
    },

    refresh: function() {
        var pos = this.getCurrentPosition(),
            selRowIdx;

        // Synchronize the current position's row with the row of the last selected record.
        if (pos && (selRowIdx = this.store.indexOf(this.selected.last())) !== -1) {
            pos.row = selRowIdx;
        }
    },

    /**
     * @private
     * When grid uses {@link Ext.panel.Table#optimizedColumnMove optimizedColumnMove} (the default), this is added as a
     * {@link Ext.panel.Table#columnmove columnmove} handler to correctly maintain the
     * selected column using the same column header.
     * 
     * If optimizedColumnMove === false, (which some grid Features set) then the view is refreshed,
     * so this is not added as a handler because the selected column.
     */
    onColumnMove: function(headerCt, header, fromIdx, toIdx) {
        var grid = headerCt.up('tablepanel');
        if (grid) {
            this.onViewRefresh(grid.view);
        }
    },
    
    onUpdate: function(record) {
        var me = this,
            pos;
            
        if (me.isSelected(record)) {
            pos = me.selecting ? me.nextSelection : me.selection; 
            me.view.onCellSelect(pos);
        }
    },

    onViewRefresh: function(view) {
        var me = this,
            pos = me.getCurrentPosition(),
            headerCt = view.headerCt,
            record, columnHeader;

        // Re-establish selection of the same cell coordinate.
        // DO NOT fire events because the selected 
        if (pos && pos.view === view) {
            record = pos.record;
            columnHeader = pos.columnHeader;

            // After a refresh, recreate the selection using the same record and grid column as before
            if (!columnHeader.isDescendantOf(headerCt)) {
                // column header is not a child of the header container
                // this happens when the grid is reconfigured with new columns
                // make a best effor to select something by matching on id, then text, then dataIndex
                columnHeader = headerCt.queryById(columnHeader.id) || 
                               headerCt.down('[text="' + columnHeader.text + '"]') ||
                               headerCt.down('[dataIndex="' + columnHeader.dataIndex + '"]');
            }

            // If we have a columnHeader (either the column header that already exists in
            // the headerCt, or a suitable match that was found after reconfiguration)
            // AND the record still exists in the store (or a record matching the id of
            // the previously selected record) We are ok to go ahead and set the selection
            if (columnHeader && (view.store.indexOfId(record.getId()) !== -1)) {
                me.setCurrentPosition({
                    row: record,
                    column: columnHeader,
                    view: view
                });
            }
        }
    },

    selectByPosition: function(position) {
        this.setCurrentPosition(position);
    }
}, function() {
    
    // Encapsulate a single selection position.
    // Maintains { row: n, column: n, record: r, columnHeader: c}
    var Selection = this.prototype.Selection = function(model) {
        this.model = model;
        this.view = model.primaryView;
    };
    // Selection row/record & column/columnHeader
    Selection.prototype.setPosition = function(row, col) {
        var me = this;

        // We were passed {row: 1, column: 2, view: myView}
        if (arguments.length === 1) {
            
            // SelectionModel is shared between both sides of a locking grid.
            // It can be positioned on either view.
            if (row.view) {
                me.view = row.view;
            }
            col = row.column;
            row = row.row;
        }

        me.setRow(row);
        me.setColumn(col);
        return me;
    };

    Selection.prototype.setRow = function(row) {
        var me = this;
        if (row !== undefined) {
            // Row index passed
            if (typeof row === 'number') {
                me.row = Math.max(Math.min(row, me.view.store.getCount() - 1), 0);
                me.record = me.view.store.getAt(row);
            }
            // row is a Record
            else if (row.isModel) {
                me.record = row;
                me.row = me.view.indexOf(row);
            }
            // row is a grid row
            else if (row.tagName) {
                me.record = me.view.getRecord(row);
                me.row = me.view.indexOf(me.record);
            }
        }
    };

    Selection.prototype.setColumn = function(col) {
        var me = this;
        if (col !== undefined) {
            // column index passed
            if (typeof col === 'number') {
                me.column = col;
                me.columnHeader = me.view.getHeaderAtIndex(col);
            }
            // column Header passed
            else if (col.isHeader) {
                me.columnHeader = col;
                me.column = col.getIndex();
            }
        }
    };
});