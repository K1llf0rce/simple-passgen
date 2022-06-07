#!/usr/bin/env bash

#check if run as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run it as root!"
  exit
fi

# ask for run confimramtion
echo "spg-updater"
echo "Files in /var/www/ will be altered!"
sleep 1
read -p "Proceed? (Y|n)" answerProceed

if [ "$answerProceed" == 'y' ] || [ -z "$answerProceed" ]; then
    clear
else
    clear
    exit 0
fi

# get newest files first
git pull

# do the other stuff
rm /var/www/index.html
rm -rf /var/www/simplepassgen/
cp index.html /var/www/
cp -r simplepassgen/ /var/www/

#exit
echo "simple-passgen was successfully updated!"
exit 0
