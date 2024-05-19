# Copyright (C) 2023 Douglas Orend
#
# This is free software, licensed under the BSD 2-Clause License
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI support for nodogsplash
LUCI_DEPENDS:=+nodogsplash
LUCI_PKGARCH:=all
PKG_NAME:=luci-app-nodogsplash
PKG_VERSION:=1.0
PKG_RELEASE:=1

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
