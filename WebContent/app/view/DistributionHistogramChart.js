/*
 * File: app/view/DistributionHistogramChart.js
 *
 * This file was generated by Sencha Architect version 2.2.2.
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

Ext.define('C.view.DistributionHistogramChart', {
	extend: 'Ext.chart.Chart',

	height: 250,
	margin: '5 0 10 -10',
	style: 'background:#fff',
	width: 230,
	shadow: false,
	animate: true,
	insetPadding: 5,
	store: 'DistributionValues',
	theme: 'Sky',

	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			axes: [
				{
					type: 'Numeric',
					fields: [
						'x'
					],
					minimum: 0,
					position: 'bottom'
				},
				{
					type: 'Numeric',
					fields: [
						'y'
					],
					grid: {
						odd: {
							opacity: 1,
							fill: '#ddd',
							stroke: '#bbb',
							'stroke-width': 0.5
						}
					},
					position: 'left',
					decimals: 5,
					minimum: 0
				}
			],
			series: [
				{
					type: 'column',
					highlight: {
						size: 7,
						radius: 7
					},
					tips: {
						trackMouse: true,
						width: 160,
						height: 60,
						renderer: function(storeItem, item) {
							this.setTitle( 'Probability Density(%) : ' + storeItem.get('y')+'%'+ '<br />' +  'time : ' 
										  + storeItem.get('x') + ' min') ;
						}
					},
					xField: 'x',
					yField: [
						'y'
					]
				}
			],
			legend: {

			},
			listeners: {
				render: {
					fn: me.onChartRender,
					scope: me
				},
				afterrender: {
					fn: me.onChartAfterRender,
					single: false,
					scope: me
				}
			}
		});

		me.callParent(arguments);
	},

	onChartRender: function(component, eOpts) {
		if (this.getBubbleParent().componentCls != 'x-window') {
			this.on('click', function() {
				var bigMe = new C.view.DistributionHistogramChart({ 
					store: this.store,
					width: 680,
					height: 400,
					margin: 15
				});
				bigMe.axes.items[0].title = this.store.xAxisTitle;
				bigMe.axes.items[1].title = 'Probability ';
				bigMe.width = 680;
				bigMe.height = 400;
				var chartWindow = new Ext.Window({
					items  : bigMe,
					title  : 'Distribution Chart'
				}); 
				chartWindow.show();
			});
		}
	},

	onChartAfterRender: function(component, eOpts) {
		/*component.store.on('load',function(store, records){
		var y_axis = component.axes.getRange()[1];
		y_axis.maximum = store.max('y') + store.max('y')/10;

		try {
		component.redraw();
		}
		catch(e) {}
		});*/
	}

});