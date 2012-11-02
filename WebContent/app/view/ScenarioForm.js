/*
 * File: app/view/ScenarioForm.js
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

Ext.define('C.view.ScenarioForm', {
	extend: 'Ext.form.Panel',

	height: 713,
	autoScroll: true,
	layout: {
		type: 'hbox'
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
					itemId: 'dataContainer',
					maxWidth: 500,
					autoScroll: true,
					layout: {
						type: 'anchor'
					},
					items: [
						{
							xtype: 'fieldset',
							padding: '10px',
							width: 400,
							title: 'Properties',
							items: [
								{
									xtype: 'textfield',
									width: 246,
									name: 'name',
									fieldLabel: 'Name',
									listeners: {
										change: {
											fn: me.onTextfieldChange1,
											scope: me
										}
									}
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
									name: 'setup',
									readOnly: false,
									fieldLabel: 'Setup',
									allowBlank: false,
									displayField: 'setup',
									forceSelection: true,
									queryMode: 'local',
									store: 'SetupStore',
									valueField: 'setup'
								},
								{
									xtype: 'button',
									margin: '10px 0 0 185px',
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
						}
					]
				},
				{
					xtype: 'container',
					itemId: 'pieChartContainer',
					margin: '0 0 0 20px',
					minHeight: 500,
					layout: {
						align: 'center',
						padding: '10px',
						type: 'vbox'
					},
					items: [
						{
							xtype: 'label',
							style: 'font-size:20px;font-weight:bold;',
							text: 'Charts'
						},
						{
							xtype: 'label',
							flex: 1,
							width: 162,
							text: 'Pie Chart 1: Person Types'
						},
						{
							xtype: 'label',
							flex: 1,
							width: 162,
							text: 'Pie Chart 2: Appliance Types'
						}
					]
				}
			]
		});

		me.callParent(arguments);
	},

	onTextfieldChange1: function(field, newValue, oldValue, options) {
		this.setTitle(newValue);
	},

	onButtonClick2: function(button, e, options) {
		var myForm = this.getForm();
		var record = myForm.getRecord();
		//	updatedRecord = record.store.getProxy().getModel().create();
		//var errors = updatedRecord.validate(); //validate the object
		//if (errors.isValid()) { //if the object is valid, then save the data to the model associated with the form.
		myForm.updateRecord();
		//	myForm.findField('setup').readOnly = true;
		//}
		//else {
		//	myForm.markInvalid(errors);
		//}
		console.info(record);
		//record.save();
	}

});