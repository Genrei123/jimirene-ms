export default interface Patient {
  clientID: number;
  patientID: string;
  imagePath: string;
  lastName: string;
  givenName: string;
  middleName: string;
  sex: string;
  address: string;
  age: number;
  birthday: string;
  religion: string;
  occupation: string;
  contactNumber: string;
  status: string;
  spouse: {
    spouse_name: string,
    spouse_birthday: string,
    spouse_religion: string,
    spouse_occupation: string,
    spouse_contact_number: string,
    spouse_age: number,
  };

  pregnancy: {
    gravida: number;
    para: number;
    term: number;
    pre_term: number;
    abortion: number;
    living: number;
    LMP: string;
    edc: string;
    tt_date: string;
    menarche: string;
  };

  consultation: {
    consultation_date: string; // Corrected from `consultation_date`
    aog: number;
    bp: number;
    weight: number;
    fh: number;
    fht: number;
    remarks: string;
  };

  medicalHistory: {
    
    smoking: boolean;
    allergies: string;
    drug_intake: boolean;
    bleeding_anemia: boolean;
    diabetes_congenital_anomalies: boolean;
    previous_C_section: boolean;
    consecutive_miscarriages: boolean; // Corrected from `consectuivemiscarriage`
    post_partum_hemorrhage: boolean;
    forcep_delivery: boolean;
    hypertension: boolean;
  };

  branch: {
    branchID: number;
  };
}





