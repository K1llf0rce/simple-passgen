#!/usr/bin/env bash

# check if run as root
if [ "$EUID" -ne 0 ]; then 
  echo "Please run as root!"
  exit
fi

# ask for run confimramtion
echo "spg-installer"
echo "Files in /var/www/ will be altered!"
sleep 1
read -p "Proceed? (Y|n)" answerProceed

if [ "$answerProceed" == 'y' ] || [ -z "$answerProceed" ]; then
    clear
else
    clear
    exit 0
fi

# do our stuff
rm /var/www/index*.html
cp index.html /var/www/
cp -r src/ /var/www/

# and exit
echo "simple-passgen was successfully installed!"
exit 0
