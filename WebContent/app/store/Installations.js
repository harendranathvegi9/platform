/*
 * File: app/store/Installations.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
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

Ext.define('C.store.Installations', {
	extend: 'Ext.data.Store',
	requires: [
		'C.model.Installation'
	],

	constructor: function(cfg) {
		var me = this;
		cfg = cfg || {};
		me.callParent([Ext.apply({
			autoLoad: false,
			autoSync: true,
			storeId: 'MyJsonStore2',
			model: 'C.model.Installation',
			clearOnPageLoad: false,
			remoteFilter: true,
			proxy: {
				type: 'rest',
				url: '/cassandra/api/inst',
				reader: {
					type: 'json',
					root: 'data',
					totalProperty: 'size'
				},
				writer: {
					type: 'json'
				}
			},
			listeners: {
				load: {
					fn: me.onJsonstoreLoad,
					scope: me
				},
				datachanged: {
					fn: me.onJsonstoreDataChangeD,
					scope: me
				},
				update: {
					fn: me.onJsonstoreUpdate,
					scope: me
				},
				add: {
					fn: me.onJsonstoreAdd,
					scope: me
				}
			}
		}, cfg)]);
	},

	onJsonstoreLoad: function(store, records, successful, operation, options) {
		if(store.navigationNode){
			Ext.each(records, function(record, index){
				var node = store.navigationNode.appendChild({
					id: record.data._id,
					name: record.data.name,
					nodeType: 'Installation',
					nodeId: record.data._id,
					nodeStoreId: store.storeId,
					expanded: false,
					leaf: false,
					expandable: true,
					fakeChildren: true,
					draggable: true
				});
				record.node = node;
			});
		}else{
			console.info('Store is not bound to a navigation node. Nothing to render there.');
		}
	},

	onJsonstoreDataChangeD: function(abstractstore, options) {
		console.info('Installations data changed.', abstractstore, options);
		var store = abstractstore;
		//x = Ext.getCmp('uiNavigationTreePanel');
		/*Ext.each(store.data.items, function(record){
		xr = record; 
		var nodeExisting = Ext.getCmp('uiNavigationTreePanel').store.tree.getNodeById(record.data._id);
		console.info('Scenario record.', record, nodeExisting);
		if(!nodeExisting){
		console.info('Node does not exist. Creating it.');
		abstractstore.navigationNode.appendChild({
		id: record.data._id,
		name: record.data.name,
		nodeType: 'Scenario',
		nodeId: record.data._id,
		nodeStoreId: store.storeId,
		expanded: false,
		leaf: false,
		expandable: true,
		fakeChildren: true,
		draggable: false
		});
		}
		});*/
		//abstractstore.navigationNode.childNodes
	},

	onJsonstoreUpdate: function(abstractstore, record, operation, options) {
		console.info('Installation data updated.', abstractstore, record, operation, options);
		if(record.node){
			if(operation=='edit'){
				Ext.each(options, function(k){
					record.node.set(k, record.get(k));
					//Ext.getCmp('uiNavigationTreePanel').getStore().getNodeById(record.get('_id')).set(k, record.get(k));
				});
			}
		}else{
			console.info('Record is not bound to a node. Skipping.');
		}
	},

	onJsonstoreAdd: function(store, records, index, options) {
		console.info('Installation added.', store, records, index, options);
		Ext.each(records, function(record){
			//	var nodeExisting = Ext.getCmp('uiNavigationTreePanel').store.tree.getNodeById(record.data._id);
			//	console.info('Scenario record.', record, nodeExisting);
			//	if(!nodeExisting){
			console.info('++ Node does not exist. Creating it.',record);

			var node = store.navigationNode.appendChild({
				id: record.data._id,
				name: record.data.name,
				nodeType: 'Installation',
				nodeId: record.data._id,
				nodeStoreId: store.storeId,
				expanded: false,
				leaf: false,
				expandable: true,
				fakeChildren: true,
				draggable: false
			});
			record.node = node;

			//	}
		});
	}

});