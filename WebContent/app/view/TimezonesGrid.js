/*
 * File: app/view/TimezonesGrid.js
 *
 * This file was generated by Sencha Architect version 2.2.2.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('C.view.TimezonesGrid', {
	extend: 'Ext.grid.Panel',

	margin: '10 0 0 0',
	maxHeight: 400,
	autoScroll: true,
	title: 'Timezones',
	forceFit: true,
	store: 'TimezonesStore',

	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			viewConfig: {
				minHeight: 70
			},
			dockedItems: [
				{
					xtype: 'toolbar',
					dock: 'top',
					width: 508,
					items: [
						{
							xtype: 'button',
							text: 'New',
							listeners: {
								click: {
									fn: me.onButtonClick212,
									scope: me
								}
							}
						},
						{
							xtype: 'button',
							text: 'Delete',
							listeners: {
								click: {
									fn: me.onButtonClick1212,
									scope: me
								}
							}
						}
					]
				}
			],
			plugins: [
				Ext.create('Ext.grid.plugin.RowEditing', {
					clicksToMoveEditor: 1,
					listeners: {
						edit: {
							fn: me.onRowEditingEdit,
							scope: me
						}
					}
				})
			],
			columns: [
				{
					xtype: 'gridcolumn',
					dataIndex: 'starttime',
					text: 'Starttime',
					editor: {
						xtype: 'timefield',
						invalidText: '{0} is not a valid time. </br> (i.e. 24:56)',
						format: 'H:i'
					}
				},
				{
					xtype: 'gridcolumn',
					dataIndex: 'endtime',
					text: 'Endtime',
					editor: {
						xtype: 'timefield',
						invalidText: '{0} is not a valid time. </br> (i.e. 24:56)',
						format: 'H:i'
					}
				},
				{
					xtype: 'numbercolumn',
					dataIndex: 'price',
					text: 'Price',
					format: '0,000.0000',
					editor: {
						xtype: 'numberfield',
						decimalPrecision: 4
					}
				}
			]
		});

		me.callParent(arguments);
	},

	onButtonClick212: function(button, e, eOpts) {

		this.store.insert(0, {starttime:"", endtime:"", price : 0});
		this.plugins[0].startEdit(0, 0);




	},

	onButtonClick1212: function(button, e, eOpts) {
		console.info('Delete clicked.', this, button, e, eOpts);

		var selections = this.getView().getSelectionModel().getSelection();
		this.store.remove(selections);

	},

	onRowEditingEdit: function(editor, context, eOpts) {
		if (context.newValues.starttime !== context.originalValues.starttime && new Date(context.newValues.starttime) !== "Invalid Date")
		context.record.set("starttime", Ext.Date.format(new Date(context.newValues.starttime), "H:i"));
		if (context.newValues.endtime !== context.originalValues.endtime && new Date(context.newValues.endtime) !== "Invalid Date")
		context.record.set("endtime", Ext.Date.format(new Date(context.newValues.endtime), "H:i"));
	}

});