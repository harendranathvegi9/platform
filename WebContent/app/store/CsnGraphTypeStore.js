/*
 * File: app/store/CsnGraphTypeStore.js
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

Ext.define('C.store.CsnGraphTypeStore', {
	extend: 'Ext.data.Store',

	constructor: function(cfg) {
		var me = this;
		cfg = cfg || {};
		me.callParent([Ext.apply({
			autoLoad: false,
			storeId: 'CsnGraphTypeStore',
			data: [
				{
					graphTypeName: 'Installation Type',
					graphTypeTag: 'InstallationType'
				},
				{
					graphTypeName: 'Person Type',
					graphTypeTag: 'PersonType'
				},
				{
					graphTypeName: 'TransformerID',
					graphTypeTag: 'TransformerID'
				},
				{
					graphTypeName: 'Person Type',
					graphTypeTag: 'PersonType'
				},
				{
					graphTypeName: 'Topological Distance',
					graphTypeTag: 'TopologicalDistance'
				},
				{
					graphTypeName: 'Location',
					graphTypeTag: 'Location'
				},
				{
					graphTypeName: 'Social Distance',
					graphTypeTag: 'SocialDistance'
				},
				{
					graphTypeName: 'Total Energy Consumption',
					graphTypeTag: 'TotalEnergyConsumption'
				},
				{
					graphTypeName: 'Max Hourly Energy Consumption',
					graphTypeTag: 'MaxHourlyEnergyConsumption'
				},
				{
					graphTypeName: 'Min Hourly Energy Consumption',
					graphTypeTag: 'MinHourlyEnergyConsumption'
				},
				{
					graphTypeName: 'Average Active Power Per Hour',
					graphTypeTag: 'AverageActivePowerPerHour'
				},
				{
					graphTypeName: 'Average Reactive Power Per Hour',
					graphTypeTag: 'AverageReactivePowerPerHour'
				},
				{
					graphTypeName: 'Max Active Power Per Hour',
					graphTypeTag: 'MaxActivePowerPerHour'
				},
				{
					graphTypeName: 'Max Reactive Power Per Hour',
					graphTypeTag: 'MaxReactivePowerPerHour'
				},
				{
					graphTypeName: 'Min Active Power Per Hour',
					graphTypeTag: 'MinActivePowerPerHour'
				},
				{
					graphTypeName: 'Min Reactive Power Per Hour',
					graphTypeTag: 'MinReactivePowerPerHour'
				}
			],
			fields: [
				{
					name: 'graphTypeName',
					type: 'string'
				},
				{
					name: 'graphTypeTag',
					type: 'string'
				}
			]
		}, cfg)]);
	}
});