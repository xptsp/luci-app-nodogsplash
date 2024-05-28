'use strict';
'require dom';
'require fs';
'require poll';
'require ui';
'require view';

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

	render: function(logdata) {
		var loglines = logdata.trim().split(/\n/);

		return E([], [
			E('h2', {}, [_('NoDogSplash Status')]),
			E('div', { 'id': 'content_syslog' }, [
				E('textarea', {
					'id': 'syslog',
					'readonly': 'readonly',
					'wrap': 'off',
					'rows': loglines.length + 1
				}, [ loglines.join('\n') ])
			])
		]);
	},

	handleSave: null,
	handleSaveApply: null,
	handleReset: null
});
