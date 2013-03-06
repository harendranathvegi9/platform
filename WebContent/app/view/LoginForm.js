/*
 * File: app/view/LoginForm.js
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

Ext.define('C.view.LoginForm', {
	extend: 'Ext.form.Panel',

	frame: true,
	margin: '50 0 0 100',
	width: 300,
	layout: {
		align: 'center',
		pack: 'center',
		type: 'vbox'
	},
	bodyPadding: '30 10',
	title: 'Please login',
	titleCollapse: false,

	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			items: [
				{
					xtype: 'textfield',
					width: 250,
					name: 'username',
					fieldLabel: 'Username',
					allowBlank: false
				},
				{
					xtype: 'textfield',
					width: 250,
					inputType: 'password',
					name: 'password',
					fieldLabel: 'Password',
					allowBlank: false,
					minLength: 4,
					regexText: 'Password should have at least length 6, and contain one capital letter and a number'
				},
				{
					xtype: 'button',
					formBind: false,
					margin: '20 0 0 0',
					padding: '5 0',
					width: 93,
					text: 'Submit',
					listeners: {
						click: {
							fn: me.onButtonClick,
							scope: me
						}
					}
				}
			],
			listeners: {
				beforerender: {
					fn: me.onLoginFormBeforeRender,
					scope: me
				}
			}
		});

		me.callParent(arguments);
	},

	onButtonClick: function(button, e, options) {
		var loginForm = Ext.getCmp('LoginForm').getForm();
		var values = loginForm.getValues();

		if (loginForm.isValid()) {

			C.auth = 'Basic ' + Ext.util.base64.encode(values.username + ':' + values.password);
			Ext.util.Cookies.set('auth', C.auth);

			Ext.Ajax.request({
				scope : this,
				method : 'GET', 
				url : '/cassandra/api/prj',
				success : function(response, options) {
					var response_obj = JSON.parse(response.responseText);

					//this is only a temporaral solution, to make it work
					//TODO: Change this when status codes from server are fixed
					if (!response_obj.errors) {
						var treePanel = new C.view.MyTreePanel({id: 'uiNavigationTreePanel'});
						var tabPanel =  new C.view.MyTabPanel({id: 'MainTabPanel'});

						treePanel.doLayout();
						Ext.getCmp('west_panel').add(treePanel);

						tabPanel.doLayout();
						Ext.getCmp('center_panel').removeAll();
						Ext.getCmp('center_panel').layout = 'fit';
						Ext.getCmp('center_panel').add(tabPanel);
					}
					else {
						Ext.MessageBox.show({
							title:'Error', 
							msg: JSON.stringify(response_obj.errors), 
							icon: Ext.MessageBox.ERROR, 
							buttons: Ext.MessageBox.OK
						}); 
					}
				}
			});


		}
	},

	onLoginFormBeforeRender: function(abstractcomponent, options) {
		/*if (C.dbname) {
		var treePanel = new C.view.MyTreePanel({id: 'uiNavigationTreePanel'});
		var tabPanel =  new C.view.MyTabPanel({id: 'MainTabPanel'});

		treePanel.doLayout();
		this.getComponent('west_panel').add(treePanel);

		tabPanel.doLayout();
		this.getComponent('center_panel').removeAll();
		this.getComponent('center_panel').layout = 'fit';
		this.getComponent('center_panel').add(tabPanel);
		}*/
	}

});