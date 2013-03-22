/*
 * File: app/view/DynamicGrid.js
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

Ext.define('C.view.DynamicGrid', {
	extend: 'Ext.grid.Panel',

	minHeight: 250,
	padding: 5,
	autoScroll: true,
	closable: false,
	title: 'My Grid Panel',
	columnLines: false,
	forceFit: true,
	store: 'Scenarios',

	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			viewConfig: {
				loadingText: 'loading..',
				plugins: [
					Ext.create('Ext.grid.plugin.DragDrop', {
						ptype: 'gridviewdragdrop',
						ddGroup: 'ddGlobal'
					})
				],
				listeners: {
					beforedrop: {
						fn: me.onGriddragdroppluginBeforeDrop,
						scope: me
					}
				}
			},
			columns: [
				{
					xtype: 'gridcolumn',
					dataIndex: '_id',
					text: '_id'
				}
			],
			plugins: [
				Ext.create('Ext.grid.plugin.RowEditing', {
					ptype: 'rowediting'
				})
			],
			selModel: Ext.create('Ext.selection.RowModel', {
				mode: 'MULTI'
			}),
			dockedItems: [
				{
					xtype: 'toolbar',
					dock: 'top',
					width: 508,
					items: [
						{
							xtype: 'button',
							text: 'New',
							listeners: {
								click: {
									fn: me.onButtonClick,
									scope: me
								},
								beforerender: {
									fn: me.onButtonBeforeRender,
									scope: me
								}
							}
						},
						{
							xtype: 'button',
							text: 'Delete',
							listeners: {
								click: {
									fn: me.onButtonClick1,
									scope: me
								}
							}
						},
						{
							xtype: 'button',
							text: 'Edit',
							listeners: {
								click: {
									fn: me.onButtonClick11,
									scope: me
								},
								beforerender: {
									fn: me.onButtonBeforeRender1,
									scope: me
								}
							}
						},
						{
							xtype: 'button',
							hidden: true,
							text: 'Compare',
							listeners: {
								click: {
									fn: me.onButtonClick111,
									scope: me
								},
								beforerender: {
									fn: me.onButtonBeforeRender2,
									scope: me
								}
							}
						}
					]
				}
			],
			listeners: {
				itemdblclick: {
					fn: me.onGridpanelItemDblClick,
					scope: me
				},
				beforerender: {
					fn: me.onGridpanelBeforeRender,
					scope: me
				},
				afterrender: {
					fn: me.onGridpanelAfterRender,
					scope: me
				}
			},
			tools: [
				{
					xtype: 'tool',
					type: 'unpin',
					listeners: {
						click: {
							fn: me.onToolClick,
							scope: me
						}
					}
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
		var record = (data.records[0].node) ? data.records[0].node : data.records[0];

		if('C.model.'+record.get('nodeType')==this.store.model.modelName){
			dropFunction.cancelDrop();
			var index = Ext.getStore(record.get('nodeStoreId')).findExact('_id',record.get('id'));
			var node = Ext.getStore(record.get('nodeStoreId')).getAt(index);
			var parent_id = (this.store.navigationNode.get('nodeType') == 'ProjectsCollection')?'':this.store.navigationNode.parentNode.get('id');
			parent_idKey = '';
			switch(record.get('nodeType')){
				case 'Scenario': parent_idKey = 'project_id'; break;
				case 'SimulationParam': parent_idKey = 'scn_id'; break;
				case 'Installation': parent_idKey = 'scenario_id'; break;
				case 'Pricing': parent_idKey = 'scn_id'; break;
				case 'Demographic': parent_idKey = 'scn_id'; break;
				case 'Person': parent_idKey = 'inst_id'; break;
				case 'Appliance': parent_idKey = 'inst_id'; break;
				case 'Activity': parent_idKey = 'pers_id'; break;
				case 'ActivityModel': parent_idKey = 'act_id'; break;
				default: return false;
			}

			if ( (!Ext.EventObject.shiftKey || record.get('nodeType') == 'Demographic' || record.get('nodeType') == 'SimulationParam' || record.get('nodeType') == 'Pricing') && (record.get('nodeType') != 'Appliance' && record.get('nodeType') != 'ActivityModel') ){

				//Ext.sliding_box.msg('Drag and Drop info', 'By holding <b>Shift</b> key pressed while copying a node </br> all its childred will be copied as well');

				var dataToAdd = JSON.parse(JSON.stringify(node.data));
				delete dataToAdd._id;
				dataToAdd[parent_idKey] = parent_id;
				this.store.add(dataToAdd);
			} 
			else {
				data.copy = true;
				var targetID = '';
				var meID = '';
				switch(record.get('nodeType')){
					case 'Scenario': targetID = 'toPrjID'; meID = 'scnID'; parent_idKey = 'prj_id'; break;
					case 'Installation': targetID = 'toScnID'; meID = 'instID'; parent_idKey = 'scn_id'; break;
					case 'Person': targetID = 'toInstID'; meID = 'persID'; break;
					case 'Activity': targetID = 'toPersID'; meID = 'actID'; break;
					case 'ActivityModel': targetID = 'toActID'; meID = 'actmodID'; break;
					case 'Appliance': targetID = 'toInstID'; meID = 'appID'; break;
					default: return false;
				}

				Ext.Ajax.request({
					url: '/cassandra/api/copy?'+meID+'='+node.get('_id')+'&'+targetID+'='+parent_id,
					method: 'POST',
					scope: this,
					success: function(response, options) {	
						response = JSON.parse(response.responseText);
						var params = {};
						params[parent_idKey] = parent_id;
						this.store.navigationNode.removeAll();
						this.store.load( {params : params });
						Ext.sliding_box.msg('Success', JSON.stringify(response.message));
					}
				});
				return 0;
			}
		}
		return false;
	},

	onButtonClick: function(button, e, options) {
		console.info('Add clicked.', this, button, e, options);

		var parent_id = (this.store.navigationNode.get('nodeType') == 'ProjectsCollection')?'':this.store.navigationNode.parentNode.get('id');
		var inputArray = {};
		switch(this.store.navigationNode.get('nodeType')){
			case 'ProjectsCollection': inputArray = {};break;
			case 'ScenariosCollection': inputArray = {'project_id' : parent_id};break;
			case 'InstallationsCollection': inputArray = {'scenario_id' : parent_id}; break;
			case 'PricingSchemesCollection': inputArray = {'scn_id' : parent_id}; break;
			case 'DemographicsCollection': inputArray = {'scn_id' : parent_id}; break;
			case 'SimulationParamsCollection': 
			var calendar = C.app.getCalendar( new Date());
			inputArray = {'scn_id' : parent_id, calendar: calendar}; 
			break;
			case 'PersonsCollection': inputArray = {'inst_id' : parent_id}; break;
			case 'AppliancesCollection': inputArray = {'inst_id': parent_id}; break;
			case 'ActivitiesCollection': inputArray = {'pers_id': parent_id}; break;
			case 'ActivityModelsCollection': inputArray = {'act_id' : parent_id}; break;
			default: return false;
		}
		var currentModel = this.store.getProxy().getModel();
		var cur_record = new currentModel(inputArray);

		this.store.insert(0, cur_record);

		/*this.store.on('update', function(abstractstore, records, operation) {
		if (operation == 'commit') {
		var record = this.getAt(0);
		C.app.createForm(record.node);
		}
		});
		*/

		//this.plugins[0].startEdit(0, 0);




	},

	onButtonBeforeRender: function(abstractcomponent, options) {
		if (this.store.model.getName() == "C.model.Run")
		abstractcomponent.hide();
	},

	onButtonClick1: function(button, e, options) {
		console.info('Delete clicked.', this, button, e, options);

		var tabs = Ext.getCmp('MainTabPanel');
		var selections = this.getView().getSelectionModel().getSelection();

		if (selections) {

			//check if there are open tabs with selections and if yes, close them
			Ext.each(selections, function(selection, index) {
				var node = selection.node;
				var pathToMe =  node.get('nodeType')+':'+node.getPath();
				Ext.each (tabs.items.items, function(item, index) {
					if (item.pathToMe == pathToMe) {
						item.close();
						return false;
					}
				});
			});

			this.store.remove(selections);
		}
	},

	onButtonClick11: function(button, e, options) {
		console.info('Edit clicked.', this, button, e, options);

		var selections = this.getView().getSelectionModel().getSelection();
		if (selections) {
			Ext.each(selections, function(index){
				C.app.createForm(index.node);
			});
		}
	},

	onButtonBeforeRender1: function(abstractcomponent, options) {
		if (this.store.model.getName() == "C.model.Run")
		abstractcomponent.hide();
	},

	onButtonClick111: function(button, e, options) {
		console.info('cOMPARE clicked.', this, button, e, options);

		var selections = this.getView().getSelectionModel().getSelection();
		if (selections.length < 2) {
			Ext.MessageBox.show({title:'Error', msg: 'You need to choose 2 or more runs to compare', icon: Ext.MessageBox.ERROR, buttons: Ext.MessageBox.OK});
			return false;
		}

		var chartWindow = new Ext.Window({
			title  : 'Compare runs and KPIs',
			width : 850,
			height : 650,
			autoScroll : true
		}); 


		Ext.each(selections, function(selection, index) {
			var sel_id = selection.get('_id');
			var compPanel = new C.view.ComparePanel({title : 'Total Consumption Active Power for run: ' + selection.get('_id')});

			myResultsStore = new C.store.Results();
			myResultsStore.proxy.headers = {'dbname': sel_id};
			myResultsChart = new C.view.ResultsLineChart({width: 400, height: 300, store: myResultsStore});
			var myMask = new Ext.LoadMask(myResultsChart, { msg: 'Please wait...', store: myResultsStore});
			myResultsStore.load();
			compPanel.add(myResultsChart);

			var kpiStore = new C.store.Kpis();
			kpiStore.proxy.headers = {'dbname': sel_id};
			kpiStore.load();
			var grid = Ext.getCmp('uiNavigationTreePanel').getCustomGrid(kpiStore);
			grid.width = 400;
			grid.closable = false;
			grid.setTitle("KPIs");
			grid.query("tool")[0].hide();
			compPanel.add(grid);

			chartWindow.add(compPanel);
		});


		chartWindow.show();
	},

	onButtonBeforeRender2: function(abstractcomponent, options) {
		if (this.store.model.getName() == "C.model.Run")
		abstractcomponent.show();
	},

	onGridpanelItemDblClick: function(tablepanel, record, item, index, e, options) {
		if (record.node)
		C.app.createForm(record.node);
	},

	onToolClick: function(tool, e, options) {

		var gridWindow = new Ext.Window({
			title : this.header.title,
			items : this,
			layout: 'fit',
			tools: [
			{
				xtype: 'tool',
				type: 'pin',
				listeners: {
					'click': 
					function(tool, e, options) {
						var gridWindow = this.getBubbleParent().getBubbleParent();
						var gridPanel = gridWindow.query("grid")[0];
						var tabPanel = Ext.getCmp('MainTabPanel');
						tabPanel.add(gridPanel);
						tabPanel.setActiveTab(gridPanel);
						tabPanel.getActiveTab().header.show();

						gridWindow.close();

					}	
				}
			}
			]
		}); 
		gridWindow.show();
		if (this.hidden) this.show();
		this.header.hide();

		/*tool.hide();
		this.query("tool")[1].show();*/



		/*
		var gridWindow = new Ext.Window({
		items : this

		}); 
		gridWindow.show();
		tool.hide();
		this.query("tool")[1].show();
		*/
	},

	onGridpanelBeforeRender: function(abstractcomponent, options) {
		console.info(abstractcomponent);
		if (!abstractcomponent.tab) {
			abstractcomponent.setHeight(250);
			abstractcomponent.margin = '0 0 10px 0';
		}
		if (abstractcomponent.store.model.getName() == "C.model.Kpi")
		abstractcomponent.down('toolbar').hide();
	},

	onGridpanelAfterRender: function(abstractcomponent, options) {
		/*abstractcomponent.addDocked(new Ext.toolbar.Paging( {store : abstractcomponent.store, dock: 'bottom'} ));*/
	}

});