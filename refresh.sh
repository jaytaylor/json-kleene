#!/usr/bin/env bash
set -e

##
# @author Jay Taylor [@jtaylor]
#
# @date 2015-07-01
#
# @description Updates mirror of cloud-images.ubuntu.com.
#

cd "$(dirname "$0")"

test -e mirrors || mkdir mirrors
cd mirrors


site='https://cloud-images.ubuntu.com/'

wget \
    -e robots=off \
    --mirror \
    --convert-links \
    --adjust-extension \
    --page-requisites \
    --no-parent \
    --backup-converted \
    --header='Accept: text/html' \
    --user-agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:21.0) Gecko/20100101 Firefox/69.0' \
    --no-verbose \
    --tries=10 \
    --retry-connrefused \
    --continue \
    --max-redirect=10 \
    --reject=.tar,.gz,.zip,.img,.ova,.box,*.vmdk,-floppy,-vmlinuz-generic,-vmlinuz-lpae,vmlinuz-virtual,initrd-xen,vmlinuz-xen,vmlinuz-ec2,vmlinuz-omap \
    --referer="${site}" "${site}"

./generate.sh

