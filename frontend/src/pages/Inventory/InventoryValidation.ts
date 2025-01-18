// Validation Errors Interface
export interface ValidationErrors {
    [key: string]: string;
  }
  
  // Helper function to determine item status based on quantity and expiration date
  const getStatus = (item: any): string => {
    const currentDate = new Date();
    const expDate = new Date(item.exp_date);
    const threeMonthsBeforeExpiration = new Date(expDate.setMonth(expDate.getMonth() - 3));
  
    // Check quantity first for status determination
    if (item.item_quantity === 0) {
      return "Out of Stock";
    } else if (item.item_quantity < 20) {
      return "Low Stock";
    } else if (item.item_quantity >= 20) {
      return "In Stock";
    }
  
    // Check expiration date
    if (expDate < currentDate) {
      return "Expired";
    } else if (threeMonthsBeforeExpiration <= currentDate) {
      return "Expiring";
    }
  
    return "In Stock"; // Default status
  };
  
  // Add Item Validation
  export const validateAddItem = (item: any): ValidationErrors => {
    const errors: ValidationErrors = {};
  
    // Item Name
    if (!item.item_name || item.item_name.trim() === "") {
      errors.item_name = "Item name must not be empty.";
    }
  
    // Quantity
    if (!Number.isInteger(item.item_quantity) || item.item_quantity < 0) {
      errors.item_quantity = "Quantity must be a non-negative integer.";
    }
  
    // Manufacture Date
    if (!item.manufacture_date || new Date(item.manufacture_date) > new Date(item.exp_date)) {
      errors.manufacture_date = "Manufacture date cannot be in the future relative to the expiration date.";
    }
  
    // Expiration Date
    if (!item.exp_date || new Date(item.exp_date) <= new Date(item.manufacture_date)) {
      errors.exp_date = "Expiration date must be after the manufacture date.";
    }
  
    // Separate alerts for reminder and errors
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors)
        .map((error) => `- ${error}`)
        .join("\n");
  
      // Show error message
      window.alert(`❌ Error ❌\nPlease fix the following errors:\n\n${errorMessages}`);
    }
  
    // Reminder if price is 0
    if (item.item_price === 0) {
      window.alert(`⚠️ Reminder ⚠️\nYou have set the price to 0. Are you sure?`);
    }
  
    // Automatically set status
    item.status = getStatus(item); // Set the status based on quantity and expiration date
  
    return errors;
  };
  
  // Edit Item Validation
  export const validateEditItem = (item: any): ValidationErrors => {
    const errors: ValidationErrors = {};
  
    // Item Name
    if (!item.item_name || item.item_name.trim() === "") {
      errors.item_name = "Item name must not be empty.";
    }
  
    // Quantity
    const itemQuantity = parseInt(item.item_quantity, 10); // Ensure it's parsed as an integer
    if (isNaN(itemQuantity) || itemQuantity < 0) {
      errors.item_quantity = "Quantity must be a non-negative integer.";
    }
  
    // Price Validation
    const itemPrice = parseInt(item.item_price, 10);
    if (isNaN(itemPrice) || itemPrice < 0) {
      errors.item_price = "Price must be a non-negative integer.";
    } else if (itemPrice === 0) {
      // Directly set error if price is 0
      errors.item_price = "Price cannot be 0 unless confirmed.";
    }

  
    // Manufacture Date: Ensure it's not in the future
    const manufactureDate = new Date(item.manufacture_date);
    if (!item.manufacture_date || manufactureDate > new Date()) {
      errors.manufacture_date = "Manufacture date cannot be in the future.";
    }
  
    // Expiration Date: Ensure it's after Manufacture Date
    const expirationDate = new Date(item.exp_date);
    if (!item.exp_date || expirationDate <= manufactureDate) {
      errors.exp_date = "Expiration date must be after the manufacture date.";
    }
  
    // Separate alerts for reminder and errors
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors)
        .map((error) => `- ${error}`)
        .join("\n");
  
      // Show error message
      window.alert(`❌ Error ❌\nPlease fix the following errors:\n\n${errorMessages}`);
    }
  
    // Automatically set status
    item.status = getStatus(item); // Set the status based on quantity and expiration date
  
    return errors;
  };
  
  // Delete Item Validation (Confirmation)
  export const validateDeleteItem = (): boolean => {
    return window.confirm("Are you sure you want to delete this item?");
  };
  