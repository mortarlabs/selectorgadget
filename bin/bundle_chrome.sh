#!/usr/bin/env sh

cp build/selectorgadget_combined.css chrome/combined.css
cat chrome/header.js build/selectorgadget_combined.min.js chrome/footer.js > chrome/combined.js
rm -f extension.zip
zip -r extension.zip chrome
s3cmd put --no-check-md5 --cf-invalidate --acl-public -M --no-mime-magic extension.zip s3://saversage-selector-gadget

