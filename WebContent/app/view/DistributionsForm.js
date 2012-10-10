/*
 * File: app/view/DistributionsForm.js
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

Ext.define('C.view.DistributionsForm', {
	extend: 'Ext.form.Panel',

	height: 388,
	width: 555,
	layout: {
		align: 'center',
		pack: 'center',
		type: 'vbox'
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
					height: 159,
					width: 533,
					layout: {
						align: 'middle',
						pack: 'center',
						type: 'hbox'
					},
					items: [
						{
							xtype: 'container',
							flex: 1,
							padding: '10px',
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
								}
							]
						},
						{
							xtype: 'container',
							flex: 0,
							padding: '10px',
							width: 266,
							items: [
								{
									xtype: 'textfield',
									width: 246,
									name: 'distrType',
									fieldLabel: 'Distribution type'
								},
								{
									xtype: 'textareafield',
									width: 246,
									name: 'valuesArray',
									fieldLabel: 'values'
								}
							]
						}
					]
				},
				{
					xtype: 'button',
					flex: 1,
					margin: '10px 0 0 120px',
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
		var parameters = [];
		var arrayOfInt = [];
		var myForm = this.getForm();
		var record = myForm.getRecord(),
		values = myForm.getFieldValues();
		console.info(record, this.query('grid')[0].store.data);
		var gridData = this.query('grid')[0].store.data;

		Ext.each(gridData.items, function(index){
			parameters.push(index.data);

		});

		console.info(parameters,'parameters');
		record.set('parameters', parameters);

		Ext.each(values.valuesArray.split(","), function(index){

			arrayOfInt.push(parseInt(index));
		});

		record.set('values', arrayOfInt);
		//record.setDirty();
		myForm.updateRecord();
		//record.save();
	}

});