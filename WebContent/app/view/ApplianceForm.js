/*
 * File: app/view/ApplianceForm.js
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

Ext.define('C.view.ApplianceForm', {
	extend: 'Ext.form.Panel',

	height: 442,
	width: 586,
	layout: {
		type: 'auto'
	},
	bodyPadding: 10,
	closable: true,
	title: 'My Form',

	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			items: [
				{
					xtype: 'container',
					width: 577,
					autoScroll: true,
					layout: {
						align: 'middle',
						type: 'hbox'
					},
					items: [
						{
							xtype: 'fieldset',
							height: 309,
							padding: '10px',
							width: 280,
							title: 'Properties',
							items: [
								{
									xtype: 'textfield',
									width: 246,
									name: 'name',
									fieldLabel: 'Name'
								},
								{
									xtype: 'textfield',
									width: 246,
									name: 'type',
									fieldLabel: 'Type'
								},
								{
									xtype: 'textareafield',
									width: 246,
									name: 'description',
									fieldLabel: 'Description'
								},
								{
									xtype: 'combobox',
									width: 246,
									name: 'energy_class',
									fieldLabel: 'Energy Class',
									displayField: 'energy_class',
									queryMode: 'local',
									store: 'EnergyClassStore',
									valueField: 'energy_class'
								},
								{
									xtype: 'numberfield',
									width: 186,
									name: 'standy_consumption',
									fieldLabel: 'Stand By',
									decimalPrecision: 1
								},
								{
									xtype: 'checkboxfield',
									name: 'base',
									fieldLabel: 'Base',
									boxLabel: ''
								},
								{
									xtype: 'checkboxfield',
									name: 'shiftable',
									fieldLabel: 'Shiftable',
									boxLabel: ''
								},
								{
									xtype: 'checkboxfield',
									name: 'controllable',
									fieldLabel: 'Controllable',
									boxLabel: ''
								}
							]
						},
						{
							xtype: 'fieldset',
							margins: '0 0 0 10px',
							height: 309,
							width: 271,
							title: 'ConsumptionModel',
							items: [
								{
									xtype: 'textfield',
									margin: '10px 0',
									width: 246,
									name: 'consmod_name',
									fieldLabel: 'Name'
								},
								{
									xtype: 'textareafield',
									margin: '10px 0',
									width: 246,
									name: 'consmod_description',
									fieldLabel: 'Description'
								},
								{
									xtype: 'textareafield',
									height: 103,
									width: 242,
									name: 'expression',
									readOnly: false,
									fieldLabel: 'Expression',
									allowBlank: false
								}
							]
						}
					]
				},
				{
					xtype: 'button',
					margin: '10px 250px',
					width: 70,
					autoWidth: false,
					text: 'Update',
					listeners: {
						click: {
							fn: me.onButtonClick2,
							scope: me
						}
					}
				}
			]
		});

		me.callParent(arguments);
	},

	onButtonClick2: function(button, e, options) {
		var gridIds = [];
		var myForm = this.getForm();
		var record = myForm.getRecord(),
		values = myForm.getFieldValues();


		myForm.updateRecord();
		var expression = myForm.getFieldValues().expression;
		var model = JSON.parse(myForm.getFieldValues().expression);
		var name = myForm.getFieldValues().consmod_name;
		var description = myForm.getFieldValues().consmod_description;
		consmod_record = record.c.store.getRange()[0];
		if (consmod_record) {
			consmod_record.set({model: model, 'name': name, 'description': description});
		}
		else {
			var currentModel = record.c.store.getProxy().getModel();
			record.c.store.insert(0, 
			new currentModel({
				'app_id' : record.get('_id'), 
				model: model, 
				'description': description, 
				'name': name
			})
			);
		}

		//record.save();
	}

});