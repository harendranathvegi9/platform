/*
 * File: app/view/SimulationParamsForm.js
 *
 * This file was generated by Sencha Architect version 2.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.1.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.1.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('C.view.SimulationParamsForm', {
	extend: 'Ext.form.Panel',

	padding: 5,
	width: 431,
	layout: {
		type: 'auto'
	},
	bodyPadding: 10,
	closable: false,
	title: 'My Form',

	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			items: [
				{
					xtype: 'container',
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
											fn: me.onTextfieldChange1111,
											scope: me
										}
									}
								},
								{
									xtype: 'textfield',
									width: 246,
									name: 'locationInfo',
									fieldLabel: 'Location'
								},
								{
									xtype: 'numberfield',
									hidden: true,
									width: 246,
									name: 'numberOfDays',
									readOnly: false,
									fieldLabel: 'Duration',
									allowDecimals: false
								},
								{
									xtype: 'numberfield',
									hidden: false,
									width: 246,
									name: 'mcruns',
									readOnly: false,
									value: 1,
									fieldLabel: 'Monte Carlo Runs',
									allowDecimals: false,
									maxValue: 100,
									minValue: 1
								},
								{
									xtype: 'datefield',
									width: 246,
									name: 'dateStarted',
									readOnly: false,
									fieldLabel: 'Date Started',
									allowBlank: false
								},
								{
									xtype: 'datefield',
									width: 246,
									name: 'dateEnds',
									readOnly: false,
									fieldLabel: 'Date Ends'
								},
								{
									xtype: 'textareafield',
									width: 246,
									name: 'description',
									fieldLabel: 'Notes'
								},
								{
									xtype: 'container',
									margin: '20px 0',
									layout: {
										align: 'middle',
										pack: 'center',
										type: 'hbox'
									},
									items: [
										{
											xtype: 'button',
											itemId: 'btn',
											width: 70,
											text: 'Update',
											listeners: {
												click: {
													fn: me.onButtonClick2,
													scope: me
												}
											}
										},
										{
											xtype: 'button',
											margins: '0 0 0 10px',
											width: 70,
											text: 'Run',
											listeners: {
												click: {
													fn: me.onButtonClick21,
													scope: me
												}
											}
										}
									]
								}
							]
						}
					]
				}
			]
		});

		me.callParent(arguments);
	},

	onTextfieldChange1111: function(field, newValue, oldValue, options) {
		this.setTitle(newValue);
		this.form.getRecord().node.set({'name':newValue});
	},

	onButtonClick2: function(button, e, options) {
		var myForm = this.getForm();
		var record = myForm.getRecord();
		var values = myForm.getValues();

		var calendar = {};
		var duration = 0;

		var dateStarted = myForm.getFieldValues().dateStarted;
		if (dateStarted) {
			var day = dateStarted.getDate();
			var month = dateStarted.getMonth()+1;
			var year = dateStarted.getFullYear();
			var weekdayNumb = dateStarted.getDay( );
			var weekday = '';
			switch (weekdayNumb) {
				case 0: weekday = 'Sunday';break;
				case 1: weekday = 'Monday';break;
				case 2: weekday = 'Tuesday';break;
				case 3: weekday = 'Wednesday';break;
				case 4: weekday = 'Thursday';break;
				case 5: weekday = 'Friday';break;
				case 6: weekday = 'Saturday';break;
			}
			calendar = {'year':year, 'month': month, 'weekday': weekday, 'dayOfMonth':day};
			var dateEnds = myForm.getFieldValues().dateEnds;
			if (dateEnds) {
				var one_day = 1000*60*60*24;
				duration = (dateEnds.getTime() - dateStarted.getTime()) / one_day;
				if (duration < 0) {
					Ext.MessageBox.show({
						title:'Invalid simulation end date', 
						msg: 'The date that simulation ends cannot be </br>before the one it starts!', 
						icon: Ext.MessageBox.ERROR
					});
					return false;
				}
			}
		}

		if (myForm.isValid()) {
			record.set({
				'name': values.name,
				'description': values.description,
				'locationInfo': values.locationInfo,
				'mcruns':values.mcruns,
				'calendar': calendar, 
				'numberOfDays': duration
			});

			this.dirtyForm = false;

			//clear dirty record
			record.node.commit();
		}
	},

	onButtonClick21: function(button, e, options) {
		var project_node = this.getForm().getRecord().node.parentNode.parentNode.parentNode.parentNode;
		if (! (project_node.lastChild.c) ) project_node.lastChild.expand();
		var run_store = project_node.lastChild.c.store;
		run_store.insert(0, new C.model.Run({smp_id : this.getForm().getRecord().node.get('id')}));
	}

});