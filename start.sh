#!/bin/bash
rm *.card
composer network install -c PeerAdmin@hlfv1 -a ./dists/drsewa@0.0.9.bna
composer network start -c PeerAdmin@hlfv1 -n drsewa -V 0.0.9 -A admin -S adminpw -f networkAdmin.card
sleep 1
composer card import -f networkAdmin.card
sleep 1
composer-rest-server -c admin@drsewa -n never -u true -w true