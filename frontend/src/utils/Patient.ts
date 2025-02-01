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
    spouse_name: "",
    spouse_birthday: "",
    spouse_religion: "",
    spouse_occupation: "",
    spouse_contact_number: "",
    spouse_age: 0,
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
    tt_date: "",
    menarche: "",
  },
  consultation: {
    consultation_date: "", // Corrected from `consultation_date`
    aog: 0,
    bp: 0,
    weight: 0,
    fh: 0,
    fht: 0,
    remarks: "",
  },
  medicalHistory: {
    smoking: false,
    allergies: "",
    drug_intake: false,
    bleeding_anemia: false,
    diabetes_congenital_anomalies: false,
    previous_C_section: false,
    consecutive_miscarriages: false, // Corrected from `consectuivemiscarriage`
    post_partum_hemorrhage: false,
    forcep_delivery: false,
    hypertension: false,
  },
  branch: {
    branchID: 1,
  }
});
