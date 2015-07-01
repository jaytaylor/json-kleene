#!/usr/bin/env bash
set -e

##
# @author Jay Taylor [@jtaylor]
#
# @date 2015-07-01
#
# @description Generates JSON from tables contained in any index.html files
#     under mirrors/*.  Also creates a sitemap.json file in each mirrors root directory.
#

cd "$(dirname "$0")"


find mirrors -name index.html | xargs \
    -P$(nproc 2>/dev/null || sysctl hw.ncpu | cut -d' ' -f2) \
    -n1 \
    -IX \
    bash -c 'f="X" && echo "processing ${f} .." && ./tables-to-json.js --skip-empty --strip=button --output="$(echo "${f}" | sed "s/\.html$/.json/")"  < "${f}"'


# Create index.json
cd mirrors

for d in $(find . -type d -mindepth 1 -maxdepth 1); do
    echo "generating sitemap.json for ${d}"
    cd "${d}"
    echo "$( \
        echo '{' \
        && find . -mindepth 2 -wholename '*.json' | sed 's/\(\.\/\)\(.*\)/    "\2",/' | sed '$s/,$//' \
        && echo '}' \
    )" > 'sitemap.json'
    cd -
done

