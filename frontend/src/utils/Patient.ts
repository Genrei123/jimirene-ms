import Patient from "../types/Patient";

export const createEmptyPatient = (): Patient => ({
  clientID: 0,
  patientID: "",
  imagePath: "",
  lastName: "",
  givenName: "",
  middleName: "",
  sex: "",
  address: "",
  age: 0,
  birthday: "",
  religion: "",
  occupation: "",
  contactNumber: "",
  status: "",
  spouse: {
    spouseName: "",
    spouseBirthday: "",
    spouseReligion: "",
    spouseOccupation: "",
    spouseContactNumber: "",
    spouseAge: 0,
  },
  pregnancy: {
    gravida: 0,
    para: 0,
    term: 0,
    pre_term: 0,
    abortion: 0,
    living: 0,
    LMP: "",
    edc: "",
    IT_date: "",
    menarche: "",
  },
  consultation: {
    consultation_date: "", // Corrected from `consultation_date`
    AOG: 0,
    BP: 0,
    weight: 0,
    FH: 0,
    FHT: 0,
    remarks: "",
  },
  medicalHistory: {
    smoking: false,
    allergies: "",
    drugIntake: false,
    bleedingAnemia: false,
    diabetesCongenitalAnomalies: false,
    previousCSection: false,
    consecutiveMiscarriages: false, // Corrected from `consectuivemiscarriage`
    postPartumHemorrhage: false,
    forcepDelivery: false,
    hypertension: false,
  },
  branch: {
    branchID: 1,
  }
});
