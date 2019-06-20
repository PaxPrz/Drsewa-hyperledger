/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

 /**
  * Checks is doctor is allowed by report's patient or not
  * @param {com.pax.drsewa.Doctor} doctor 
  * @param {com.pax.drsewa.Report} report
  * @return {boolean}
  */
function isDoctorAllowed(doctor, report){
    return report.patient.allowedDr.includes(doctor.emailId);
}

/**
 * CreatePatient
 * @param {com.pax.drsewa.CreatePatient} detail
 * @transaction
 */
async function createPatient(detail){
    var ns = "com.pax.drsewa";
    var factory = getFactory();
    var newPatient = factory.newResource(ns, "Patient", detail.emailId);
    newPatient.name = detail.name;
  	var dob = factory.newConcept(ns, "Date");
    dob.year = detail.year;
    dob.month = detail.month;
    dob.date = detail.date;
  	newPatient.dob = dob;
    newPatient.gender = detail.gender;
  	newPatient.balance = 0.0;
    newPatient.allowedDr = [];
    newPatient.reports = [];
	/*
    var newBalance = factory.newResource(ns, "Balance", detail.emailId);
    newBalance.person = newPatient;
    var balanceRegistry = await getAssetRegistry(ns+'.Balance');
    await balanceRegistry.add(newBalance);
    newPatient.balance = newBalance;
	*/
    var patientRegistry = await getParticipantRegistry(ns+".Patient");
    await patientRegistry.add(newPatient);    
}

/**
 * CreateDoctor
 * @param {com.pax.drsewa.CreateDoctor} detail
 * @transaction
 */
async function createDoctor(detail){
    var ns = "com.pax.drsewa";
    var factory = getFactory();
    var newDoctor = factory.newResource(ns, "Doctor", detail.emailId);
    newDoctor.name = detail.name;
  	var dob = factory.newConcept(ns, "Date");
    dob.year = detail.year;
    dob.month = detail.month;
    dob.date = detail.date;
  	newDoctor.dob = dob;
    newDoctor.gender = detail.gender;
  	newDoctor.balance = 0.0;
    newDoctor.patients = [];
    newDoctor.specialities = detail.specialities;
    newDoctor.education = detail.education;
    newDoctor.description = detail.description;
    newDoctor.hospitals = detail.hospitals;
    newDoctor.rate = detail.rate;
	/*
    var newBalance = factory.newResource(ns, "Balance", detail.emailId);
    newBalance.person = newDoctor;
    var balanceRegistry = await getAssetRegistry(ns+'.Balance');
    await balanceRegistry.add(newBalance);
    newDoctor.balance = newBalance;
	*/
    var doctorRegistry = await getParticipantRegistry(ns+'.Doctor');
    await doctorRegistry.add(newDoctor);
}

/**
 * rechargeBalance
 * @param {com.pax.drsewa.RechargeBalance} detail
 * @transaction
 */
async function RechargeBalance(detail){
  	var ns = "com.pax.drsewa";
    if(detail.rechargeCard == 12345678){
      	var thisPerson = getCurrentParticipant();
        thisPerson.balance += 1000;
      	var patientRegistry = await getParticipantRegistry(ns+'.Patient');
    	await patientRegistry.update(thisPerson);
    }else{
        throw new Error("Recharge card Invalid");
    }
}

/**
* Make Appointment
* @param {com.pax.drsewa.MakeAppointment} detail
* @transaction
*/
async function makeAppointment(detail){
	var ns = "com.pax.drsewa";
  	var factory = getFactory();
  	var patient = getCurrentParticipant();
  	var today = new Date();
	var appId = (today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+"/"+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
  	var factory = getFactory();
  	var newAppointment = factory.newResource(ns, "Appointment", appId);
  	newAppointment.patient = patient;
  	newAppointment.doctor = factory.newRelationship(ns, "Doctor", detail.doctorEmailId);
  	newAppointment.valid = false;
  	newAppointment.problems = detail.problems;
  	var date = factory.newConcept(ns, "Date");
  	date.year = detail.year;
  	date.month = detail.month;
  	date.date = detail.date;
  	newAppointment.date = date;
  	var time = factory.newConcept(ns, "Time");
  	time.hr = detail.hr;
  	time.min = detail.min;
  	newAppointment.time = time;
  
  	patient.allowedDr.push(detail.doctorEmailId);
  	await getParticipantRegistry(ns+'.Patient').update(patient);
  
  	var appointmentRegistry = await getAssetRegistry(ns+'.Appointment');
  	await appointmentRegistry.add(newAppointment);
}

/**
* Validate Appointment
* @param {com.pax.drsewa.ValidateAppointment} detail
* @transaction
*/
async function validateAppointment(detail){
	var ns = "com.pax.drsewa";
  	var appointmentRegistry = await getAssetRegistry(ns+'.Appointment');
  	var appointment = await appointmentRegistry.get(detail.appointmentId);
  	if(detail.changeDateTime){
      	var date = factory.newConcept(ns, "Date");
  		date.year = detail.year;
  		date.month = detail.month;
  		date.date = detail.date;
  		appointment.date = date;
        var time = factory.newConcept(ns, "Time");
        time.hr = detail.hr;
        time.min = detail.min;
        appointment.time = time;
    }
  	appointment.valid = true;
  	await appointmentRegistry.update(appointment);
}