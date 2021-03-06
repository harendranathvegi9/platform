/*
 * File: app/model/Pricing.js
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

Ext.define('C.model.Pricing', {
	extend: 'Ext.data.Model',

	idProperty: '_id',

	fields: [
		{
			name: '_id',
			persist: false
		},
		{
			name: 'prj_id'
		},
		{
			name: 'name',
			type: 'string'
		},
		{
			defaultValue: 'ScalarEnergyPricing',
			name: 'type',
			type: 'string'
		},
		{
			name: 'description',
			type: 'string'
		},
		{
			name: 'fixedCharge',
			type: 'float'
		},
		{
			name: 'billingCycle',
			type: 'int'
		},
		{
			name: 'contractedCapacity',
			type: 'float'
		},
		{
			name: 'energyPrice',
			type: 'float'
		},
		{
			mapping: 'energyPrice',
			name: 'energyPrice2',
			persist: false,
			type: 'float'
		},
		{
			name: 'powerPrice',
			type: 'float'
		},
		{
			mapping: 'powerPrice',
			name: 'powerPrice2',
			persist: false,
			type: 'float'
		},
		{
			name: 'fixedCost',
			type: 'float'
		},
		{
			name: 'contractedEnergy',
			type: 'float'
		},
		{
			name: 'additionalCost',
			type: 'float'
		},
		{
			name: 'onekw24',
			persist: false,
			type: 'float'
		},
		{
			defaultValue: [
				
			],
			name: 'levels'
		},
		{
			defaultValue: [
				
			],
			name: 'timezones'
		},
		{
			defaultValue: [
				
			],
			name: 'offpeak'
		},
		{
			name: 'offpeakPrice',
			type: 'float'
		}
	]
});