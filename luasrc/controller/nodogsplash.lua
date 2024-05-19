
module("luci.controller.nodogsplash", package.seeall)

function index()
	if not nixio.fs.access("/usr/bin/nodogsplash") then
		return
	end
	
	entry({"admin", "services", "nodogsplash"}, cbi("nodogsplash"), _("NoDogSplash"),20).dependent = true
end
