# Copyright (C) 2023 Douglas Orend
#
# This is free software, licensed under the BSD 2-Clause License
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI support for nodogsplash
LUCI_DEPENDS:=+nodogsplash +luci-base
LUCI_PKGARCH:=all
PKG_NAME:=luci-app-nodogsplash
PKG_VERSION:=2.0.1
PKG_RELEASE:=2
PKG_MAINTAINER:=Douglas Orend <doug.orend2@gmail.com>

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
