'use strict';
'require fs';
'require ui';
'require view';

var sep;

return view.extend({
	load: function() {
		return Promise.all([
			L.resolveDefault(fs.stat('/usr/bin/ndsctl'), null),
		]).then(function(stat) {
			var logger = stat[0] ? stat[0].path : null;
			
			return fs.exec_direct(logger, [ 'status' ]).catch(function(err) {
				ui.addNotification(null, E('p', {}, _( err.message )));
				return '';
			});
		});
	},

	render_table: function(output, start) {
		var lines = output.trim().split(/\n/);
		var arr, out, table, idx, data
		
        var table = E('table', { 'class': 'table', 'id': 'status' });
		if (lines.length == 1) {
			table.appendChild(E('tr', { 'class': 'tr' }, [
				E('td', { 'class': 'td left' }, _("ndsctl: nodogsplash probably not started (Error: Connection refused)"))
			]));
		} else {
        	for (var i = start; i < lines.length; i++) {
        		if (lines[i].substring(0,3) == "===") { 
        			sep = i + 1
        			break 
        		}
        		data = lines[i].split(":")
        		idx = data[0];
        		data.shift();
        		data = data.join(":").trim();
        		if (data.substring(0,7) == "http://" || data.substring(0,8) == "https://") {
        			data = E('a', { 'href': data, 'target': '_blank' }, data);
        		}
        		table.appendChild(E('tr', { 'class': 'tr' }, [
	                E('td', { 'class': 'td left', 'width': '33%' }, _(idx)),
            		E('td', { 'class': 'td left' }, data)
        		]));
	        }
	    }
	    return table;
	},

	render: function(output) {
        return E('div', { 'class': 'cbi-map', 'id': 'map' }, [
            E('div', { 'class': 'left' }, [
                E('h3', _('NoDogSplash Status')),
                this.render_table(output, 3)
            ]),
            E('div', { 'class': 'left' }, [
                E('h3', _('NoDogSplash Clients')),
                this.render_table(output, sep)
            ]),
            E('div', { 'class': 'left' }, [
                E('h3', _('Type of Clients')),
                this.render_table(output, sep)
            ]),
        ]);
	},

	handleSave: null,
	handleSaveApply: null,
	handleReset: null
});
