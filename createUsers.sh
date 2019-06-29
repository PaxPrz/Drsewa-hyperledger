#!/bin/bash
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "com.pax.drsewa.CreateDoctor", "emailId": "doctor@email.com", "name": "Dr. Bishwas", "year": 1990, "month": 10, "date": 20, "gender": "MALE", "specialities": ["Ortho", "Surgeon", "Gastritis"], "education": ["MBBS", "MD"], "description": "I am from Kathmandu. I studied from USA. Contact: 9841363636", "hospitals": ["Bir Hospital", "Sahid Gangalal"], "rate": 100 }' 'http://localhost:3000/api/CreateDoctor'
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "com.pax.drsewa.CreatePatient", "emailId": "patient@email.com", "name": "Sita Devi", "year": 2001, "month": 2, "date": 11, "gender": "FEMALE" }' 'http://localhost:3000/api/CreatePatient'
sleep 1
composer identity issue -c admin@drsewa -u doctor -a "resource:com.pax.drsewa.Doctor#doctor@email.com" -f doctor.card
composer identity issue -c admin@drsewa -u patient -a "resource:com.pax.drsewa.Patient#patient@email.com" -f patient.card
sleep 1
composer card import -f doctor.card
composer card import -f patient.card