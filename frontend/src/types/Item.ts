// Define the Item interface matching your backend model
export interface Item {
    itemID?: number;
    itemName: string;
    itemQuantity: number;
    itemPrice: number;
    manufactureDate: string; // Assuming these are formatted as 'yyyy-MM-dd'
    expDate: string; // Assuming these are formatted as 'yyyy-MM-dd'
    status: string;
    branch: {
      branchID: number; // Include the branchID for association
    };
  }