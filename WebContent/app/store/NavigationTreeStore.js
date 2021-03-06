/*
 * File: app/store/NavigationTreeStore.js
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

Ext.define('C.store.NavigationTreeStore', {
	extend: 'Ext.data.TreeStore',

	constructor: function(cfg) {
		var me = this;
		cfg = cfg || {};
		me.callParent([Ext.apply({
			autoLoad: false,
			storeId: 'NavigationTreeStore',
			root: {id:'root',name:'Projects',nodeType:'ProjectsCollection',expanded:true,leaf:false,children:[], allowDrag: false, allowDrop: false },
			proxy: {
				type: 'memory'
			},
			fields: [
				{
					name: 'name'
				},
				{
					name: 'description'
				},
				{
					name: 'nodeType'
				},
				{
					name: 'node_id'
				},
				{
					name: 'nodeId'
				},
				{
					name: 'nodeStoreId'
				},
				{
					name: 'page'
				},
				{
					defaultValue: true,
					name: 'clickable',
					type: 'boolean'
				},
				{
					name: 'fakeChildren',
					type: 'boolean'
				}
			]
		}, cfg)]);
	}
});