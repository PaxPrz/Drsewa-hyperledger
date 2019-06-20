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
    newPatient.dob.year = detail.year;
    newPatient.dob.month = detail.month;
    newPatient.dob.date = detail.date;
    newPatient.gender = detail.gender;
    newPatient.allowedDr = [];
    newPatient.reports = [];

    var newBalance = factory.newResource(ns, "Balance", detail.emailId);
    newBalance.person = newPatient;
    var balanceRegistry = await getAssetRegistry(ns+'.Balance');
    await balanceRegistry.add(newBalance);

    newPatient.balance = newBalance;
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
    newDoctor.dob.year = detail.year;
    newDoctor.dob.month = detail.month;
    newDoctor.dob.date = detail.date;
    newDoctor.gender = detail.gender;
    newDoctor.patients = [];
    newDoctor.specialities = detail.specialities;
    newDoctor.education = detail.education;
    newDoctor.description = detail.description;
    newDoctor.hospitals = detail.hospitals;
    newDoctor.rate = detail.rate;

    var newBalance = factory.newResource(ns, "Balance", detail.emailId);
    newBalance.person = newDoctor;
    var balanceRegistry = await getAssetRegistry(ns+'.Balance');
    await balanceRegistry.add(newBalance);

    newDoctor.balance = newBalance;
    var doctorRegistry = await getParticipantRegistry(ns+'.Doctor');
    await doctorRegistry.add(newDoctor);
}

/**
 * rechargeBalance
 * @param {com.pax.drsewa.RechargeBalance} detail
 * @transaction
 */
async function RechargeBalance(detail){
    if(detail.rechargeCard == 12345678){
        detail.person.balance.amount += 1000;
    }else{
        throw new Error("Recharge card Invalid");
    }
}
