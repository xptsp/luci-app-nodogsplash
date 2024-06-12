'use strict';
'require form';
'require ui';
'require view';
'require uci';
'require fs';

// Project code format is tabs, not spaces
return view.extend({
	block_mechanism: '',
	allow_list: [],
	block_list: [],
	trust_list: [],

	load: function () {
		return Promise.all([
			uci.load('nodogsplash')
		]).then(function(stat) {
			return fs.exec_direct("/usr/bin/ndsctl", [ 'json' ]).catch(function(err) {
				ui.addNotification(null, E('p', {}, _( err.message )));
				return '';
			});
		});
	},

	render_client: function(mac, trusted, allowed, blocked, client = []) {
		return E('tr', { 'class': 'tr' }, [
			E('td', { 'class': 'td left', 'style': 'width: 50%;' }, [
				E('span', { style: 'font-size:medium;' }, mac),
				E('span', {}, client.ip != null ? ' (' + client.ip + ')' : ''),
				E('ul', { style: "margin-left: 20px" }, [
					E('li', { style: "list-style-type: circle;" }, [
						E('span', { style: "font-weight:bold;" }, _("Client Status") + ": "),
						E('span', {}, client.state != null ? _(client.state) : _('Disconnected'))
					]),
					client.state != null ? E('li', { style: "list-style-type: circle;" }, [
						E('span', { style: "font-weight:bold;" }, _("Active Since") + ": "),
						E('span', {}, new Date(client.active * 1000)),
					]) : E('span', {})
				]),
			]),
			E('td', { 'class': 'diag-action', 'style': 'width: 50%; vertical-align: top;' }, [
				E('button', {
					'class': 'cbi-button cbi-button-action',
					'click': ui.createHandlerFn(this, !trusted ? 'Trust_MAC' : 'Untrust_MAC')
				}, [ !trusted ? _('Trust MAC')  : _("Untrust MAC")]),
				E('button', {
					'class': 'cbi-button cbi-button-action' + (this.block_mechanism ? ' hidden' : ''),
					'click': ui.createHandlerFn(this, !blocked ? 'Block_MAC' : 'Unblock_MAC')
				}, [ !blocked ? _('Block MAC')  : _("Unblock MAC")]),
				E('button', {
					'class': 'cbi-button cbi-button-action' + (!this.block_mechanism ? ' hidden' : ''),
					'click': ui.createHandlerFn(this, !allowed ? 'Allow_MAC' : 'Unallow_MAC')
				}, [ !allowed ? _('Allow MAC')  : _("UnAllow MAC")]),
			])
		]);
	},

	render_list: function(table, list) {
		var mac, i, client;
		for (let i in list) {
			// Render the client data:
			client = list[i];
			mac = client.mac != null ? client.mac : client;
			table.appendChild( this.render_client( mac.toLowerCase(), this.trust_list.includes(mac), this.allow_list.includes(mac), this.block_list.includes(mac), client ) );

			// Remove the client from each of the mac lists:
			this.trust_list = this.trust_list.filter( check => check != mac );
			this.allow_list = this.allow_list.filter( check => check != mac );
			this.block_list = this.block_list.filter( check => check != mac );
		}
		return table;
	},

	lowercase_list: function(table) {
		for (var i=0; i < table.length; i++)
			table[i] = table[i].toLowerCase();
		return table;
	},

	render: function(data) {
		var m, s, o;
		var sections = uci.sections('nodogsplash');
		this.allow_list = this.lowercase_list( sections[0].allowedmac != null ? sections[0].allowedmac : [] );
		this.block_list = this.lowercase_list( sections[0].blockedmac != null ? sections[0].blockedmac : [] );
		this.trust_list = this.lowercase_list( sections[0].trustedmac != null ? sections[0].trustedmac : [] );
		this.block_mechanism = sections[0].macmechanism == 'block';

		// Process the current clients first, creating table for use later:
		var table = E('table', { 'class': 'table' });
		data = JSON.parse(data);
		this.render_list( table, data.clients );

		// Process the trusted, allowed and blocked MAC address lists:
		this.render_list( table, this.trust_list );
		this.render_list( table, this.allow_list );
		this.render_list( table, this.block_list );

		// Actually render the page:
		m = new form.Map('nodogsplash');
		s = m.section(form.TypedSection, 'nodogsplash', _('MAC Mechanism'));
		s.anonymous = true;
		
		o = s.option(form.ListValue, 'macmechanism', _("MAC Access Mechanism"), _("MAC addresses that are / are not allowed to access the splash page"));
		o.value('block', _("Block MACs"));
		o.value('allow', _("Allow MACs"));
		o.default = 'block';
		o.rmempty = false;
		o.editable = false;
		
		s = m.section(form.TypedSection, 'nodogsplash', _('Clients'));
		s.anonymous = true;
		var ClientTable = form.DummyValue.extend({
			renderWidget: function(section_id, option_index, cfgvalue) {
				return table;
			}
		});
		o = s.option(ClientTable);
		
		return m.render();
	}
});
