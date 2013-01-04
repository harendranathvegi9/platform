/*
 * File: app/view/RelationsGrid.js
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

Ext.define('C.view.RelationsGrid', {
	extend: 'Ext.grid.Panel',

	frame: false,
	margin: '10px 0',
	maxHeight: 300,
	minHeight: 20,
	autoScroll: false,
	forceFit: true,
	hideHeaders: false,
	store: 'ActmodAppliances',
	columnLines: false,

	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			viewConfig: {
				autoShow: false,
				hidden: false,
				minHeight: 50,
				autoScroll: false,
				loadingText: 'loading..',
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
					hidden: true,
					dataIndex: '_id',
					text: '_id'
				},
				{
					xtype: 'gridcolumn',
					dataIndex: 'name',
					text: 'name'
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
							itemId: 'btn',
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
			var index = Ext.getStore(record.raw.nodeStoreId).findExact('_id', record.get('id'));
			var node = Ext.getStore(record.raw.nodeStoreId).getAt(index);

			data.copy = true;

			var dataToAdd = node.data;
			//delete dataToAdd['_id'];
			var parent_id = node.node.parentNode.get('parentId');
			switch( node.node.parentNode.get('nodeType')){
				case 'ScenariosCollection': dataToAdd.project_id = parent_id; break;
				case 'InstallationsCollection': dataToAdd.scenario_id = parent_id; break;
				case 'PersonsCollection': dataToAdd.inst_id = parent_id; break;
				case 'AppliancesCollection': dataToAdd.inst_id = parent_id; break;
				case 'ActivitiesCollection': dataToAdd.pers_id = parent_id; break;
				case 'ActivityModelsCollection': dataToAdd.act_id = parent_id; break;
				case 'DistributionsCollection': dataToAdd.actmod_id = parent_id; break;
				case 'ConsumptionModelsCollection': dataToAdd.app_id = parent_id; break;
				default: return false;
			}

			this.store.add(dataToAdd);
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