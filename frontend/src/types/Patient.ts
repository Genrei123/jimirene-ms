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
    spouseName: string;
    spouseBirthday: string;
    spouseReligion: string;
    spouseOccupation: string;
    spouseContactNumber: string;
    spouseAge: number;
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
    IT_date: string;
    menarche: string;
  };

  consultation: {
    consultation_date: string; // Corrected from `consultation_date`
    AOG: number;
    BP: number;
    weight: number;
    FH: number;
    FHT: number;
    remarks: string;
  };

  medicalHistory: {
    smoking: boolean;
    allergies: string;
    drugIntake: boolean;
    bleedingAnemia: boolean;
    diabetesCongenitalAnomalies: boolean;
    previousCSection: boolean;
    consecutiveMiscarriages: boolean; // Corrected from `consectuivemiscarriage`
    postPartumHemorrhage: boolean;
    forcepDelivery: boolean;
    hypertension: boolean;
  };

  branch: {
    branchID: number;
  };
}





