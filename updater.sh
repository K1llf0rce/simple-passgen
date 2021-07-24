#!/usr/bin/env bash

#This script updates simple-passgen

#check if run as root
if [ "$EUID" -ne 0 ]; then
  echo "This scripts makes modifications in /var/www/"
  echo "Please run it as root!"
  exit
fi

#Ask for run confimramtion
echo "This script will update simple-passgen!"
sleep 1
read -p "Proceed? (Y|n)" answerProceed

if [ "$answerProceed" == 'y' ] || [ -z "$answerProceed" ]; then
    clear
elif [ "$answerProceed" == 'n' ]; then
    clear
    echo "Exiting..."
    exit 0
else
    clear
    echo "Unsure, Exiting..."
    exit 0
fi

#remove all files that start with index
echo "Removing existing simple-passgen files..."
sleep 1
rm /var/www/indexSPG.html
rm -rf /var/www/simplepassgen/
echo "done"

#copy files
clear
echo "Copying new files..."
sleep 1
cp indexSPG.html /var/www/
cp -r simplepassgen/ /var/www/
echo "done"

#exit
echo "simple-passgen was successfully updated!"
exit 0



