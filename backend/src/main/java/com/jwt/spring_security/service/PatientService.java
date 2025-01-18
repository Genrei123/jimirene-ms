package com.jwt.spring_security.service;

import com.jwt.spring_security.DTO.*;
import com.jwt.spring_security.model.*;
import com.jwt.spring_security.repo.PatientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatientService {
    @Autowired
    private PatientRepo patientRepo;

    public boolean deleteByPatientID(Long id) {
        if (patientRepo.existsById(id)) {
            patientRepo.deleteById(id);
            return true;
        }
        return false;
    }


    public Patient findById(Long patientId) {
        return patientRepo.findById(patientId).orElse(null);
    }

    public Long addPatient(PatientDTO patientDTO) {
        // Map Patient fields
        Patient patient = new Patient();
        patient.setPatientID(patientDTO.getPatientID());
        patient.setImagePath(patientDTO.getImagePath());
        patient.setLastName(patientDTO.getLastName());
        patient.setGivenName(patientDTO.getGivenName());
        patient.setMiddleName(patientDTO.getMiddleName());
        patient.setSex(patientDTO.getSex());
        patient.setAddress(patientDTO.getAddress());
        patient.setAge(patientDTO.getAge());
        patient.setBirthday(patientDTO.getBirthday());
        patient.setReligion(patientDTO.getReligion());
        patient.setOccupation(patientDTO.getOccupation());
        patient.setBranch(patientDTO.getBranch());
        patient.setContactNumber(patientDTO.getContactNumber());


        // Map Spouse if provided
        if (patientDTO.getSpouse() != null) {
            Spouse spouse = new Spouse();
            SpouseDTO spouseDTO = patientDTO.getSpouse();
            spouse.setSpouse_name(spouseDTO.getSpouseName());
            spouse.setSpouse_birthday(spouseDTO.getSpouseBirthday());
            spouse.setSpouse_religion(spouseDTO.getSpouseReligion());
            spouse.setSpouse_occupation(spouseDTO.getSpouseOccupation());
            spouse.setSpouse_contact_number(spouseDTO.getSpouseContactNumber());
            spouse.setSpouse_age(spouseDTO.getSpouseAge());
            spouse.setPatient(patient);
            patient.setSpouse(spouse);
        }

        // Map Pregnancy if provided
        if (patientDTO.getPregnancy() != null) {
            Pregnancy pregnancy = new Pregnancy();
            PregnancyDTO pregnancyDTO = patientDTO.getPregnancy();
            pregnancy.setGravida(pregnancyDTO.getGravida());
            pregnancy.setPara(pregnancyDTO.getPara());
            pregnancy.setTerm(pregnancyDTO.getTerm());
            pregnancy.setPre_term(pregnancyDTO.getPreTerm());
            pregnancy.setAbortion(pregnancyDTO.getAbortion());
            pregnancy.setLiving(pregnancyDTO.getLiving());
            pregnancy.setLMP(pregnancyDTO.getLMP());
            pregnancy.setEDC(pregnancyDTO.getEDC());
            pregnancy.setIT_date(pregnancyDTO.getITDate());
            pregnancy.setMenarche(pregnancyDTO.getMenarche());
            pregnancy.setPatient(patient);
            patient.setPregnancy(pregnancy);
        }

        // Map Consultation if provided
        if (patientDTO.getConsultation() != null) {
            Consultation consultation = new Consultation();
            ConsultationDTO consultationDTO = patientDTO.getConsultation();
            consultation.setConsultation_date(consultationDTO.getConsultationDate());
            consultation.setAOG(consultationDTO.getAOG());
            consultation.setBP(consultationDTO.getBP());
            consultation.setWeight(consultationDTO.getWeight());
            consultation.setFH(consultationDTO.getFH());
            consultation.setFHT(consultationDTO.getFHT());
            consultation.setRemarks(consultationDTO.getRemarks());
            consultation.setPatient(patient);
            patient.setConsultation(consultation);
        }

        // Map Medical History if provided
        if (patientDTO.getMedicalHistory() != null) {
            MedicalHistory medicalHistory = new MedicalHistory();
            MedicalHistoryDTO medicalHistoryDTO = patientDTO.getMedicalHistory();

            // Set the patient reference
            medicalHistory.setPatient(patient);

            // Map fields from DTO to entity
            medicalHistory.setSmoking(medicalHistoryDTO.isSmoking());
            medicalHistory.setAllergies(medicalHistoryDTO.getAllergies());
            medicalHistory.setDrug_intake(medicalHistoryDTO.isDrugIntake());
            medicalHistory.setBleeding_anemia(medicalHistoryDTO.isBleedingAnemia());
            medicalHistory.setDiabetes_congenital_anomalies(medicalHistoryDTO.isDiabetesCongenitalAnomalies());
            medicalHistory.setPrevious_C_section(medicalHistoryDTO.isPreviousCSection());
            medicalHistory.setConsectuive_miscarriages(medicalHistoryDTO.isConsecutiveMiscarriages());
            medicalHistory.setPost_partum_hemorrhage(medicalHistoryDTO.isPostPartumHemorrhage());
            medicalHistory.setForcep_delivery(medicalHistoryDTO.isForcepDelivery());
            medicalHistory.setHypertension(medicalHistoryDTO.isHypertension());

            // Associate medical history with patient
            patient.setMedicalHistory(medicalHistory);
        }

        // Save the patient entity (cascades will handle related entities)
        Patient savedPatient = patientRepo.save(patient);

        // Return the clientID of the saved patient
        return savedPatient.getClientID();
    }
}