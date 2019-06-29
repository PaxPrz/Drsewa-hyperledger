#!/bin/bash
composer identity issue -c admin@drsewa -u $2 -a "resource:com.pax.drsewa.Doctor#$1" -f $2.card
sleep 1
composer card import -f $2.card
sleep 1
composer-rest-server -c $2@drsewa -n never -u true -w true -p $3