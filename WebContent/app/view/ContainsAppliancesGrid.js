/*
 * File: app/view/ContainsAppliancesGrid.js
 *
 * This file was generated by Sencha Architect version 2.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.0.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('C.view.ContainsAppliancesGrid', {
	extend: 'Ext.grid.Panel',

	minHeight: 20,
	width: 516,
	title: 'Contains Appliances',
	forceFit: true,
	store: 'ActmodAppliances',

	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			viewConfig: {
				plugins: [
					Ext.create('Ext.grid.plugin.DragDrop', {
						ptype: 'gridviewdragdrop',
						ddGroup: 'ddGlobal',
						enableDrag: false
					})
				],
				listeners: {
					beforedrop: {
						fn: me.onGriddragdroppluginBeforeDrop,
						scope: me
					},
					drop: {
						fn: me.onGriddragdroppluginDrop,
						scope: me
					}
				}
			},
			columns: [
				{
					xtype: 'gridcolumn',
					dataIndex: '_id',
					text: '_id'
				},
				{
					xtype: 'gridcolumn',
					dataIndex: 'name',
					text: 'Name',
					editor: {
						xtype: 'textfield'
					}
				},
				{
					xtype: 'gridcolumn',
					dataIndex: 'description',
					text: 'Description',
					editor: {
						xtype: 'textfield'
					}
				},
				{
					xtype: 'gridcolumn',
					dataIndex: 'energy_class',
					text: 'Energy_class'
				},
				{
					xtype: 'numbercolumn',
					dataIndex: 'standy_consumption',
					text: 'Standy_consumption',
					editor: {
						xtype: 'textfield'
					}
				},
				{
					xtype: 'booleancolumn',
					dataIndex: 'controllable',
					text: 'Controllable'
				},
				{
					xtype: 'booleancolumn',
					dataIndex: 'shiftable',
					text: 'Shiftable'
				},
				{
					xtype: 'gridcolumn',
					dataIndex: 'inst_id',
					text: 'Inst_id'
				}
			],
			selModel: Ext.create('Ext.selection.RowModel', {

			}),
			dockedItems: [
				{
					xtype: 'toolbar',
					dock: 'top',
					width: 508,
					items: [
						{
							xtype: 'button',
							text: 'Delete',
							listeners: {
								click: {
									fn: me.onButtonClick1,
									scope: me
								}
							}
						}
					]
				}
			]
		});

		me.callParent(arguments);
	},

	onGriddragdroppluginBeforeDrop: function(node, data, overModel, dropPosition, dropFunction, options) {
		console.info('Before drop.', this, node, data, overModel, dropPosition, dropFunction, options);
		/* NOTE
		Returning false to this event signals that the drop gesture was invalid, and if the drag proxy will
		animate back to the point from which the drag began.
		Returning 0 To this event signals that the data transfer operation should not take place, but that
		the gesture was valid, and that the repair operation should not take place.
		*/


		if('C.model.'+data.records[0].get('nodeType')==this.store.model.modelName){
			var record = data.records[0];
			var index = Ext.getStore(record.raw.nodeStoreId).findExact('_id', record.raw.nodeId);
			var node = Ext.getStore(record.raw.nodeStoreId).getAt(index);

			console.log(node);
			data.copy = true;
			this.store.add({
				'_id': node.get('_id'),
				'inst_id': node.get('inst_id'),
				'name': node.get('name'),
				'description': node.get('description'),
				'energy_class': node.get('energy_class'),
				'standy_consumption': node.get('standy_consumption'),
				'controllable': node.get('controllable'),
				'shiftable': node.get('shiftable')
			});
			dropFunction.cancelDrop();
			return 0;
		}
		return false;


	},

	onGriddragdroppluginDrop: function(node, data, overModel, dropPosition, options) {
		return false;
	},

	onButtonClick1: function(button, e, options) {
		console.info('Delete clicked.', this, button, e, options);

		var selection = this.getView().getSelectionModel().getSelection();
		if (selection) {
			this.store.remove(selection);	
		}
	}

});