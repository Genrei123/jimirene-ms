import React, { useState, useEffect } from 'react';
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Sidebar from "../../components/Sidebar";
import Pagination from "@mui/material/Pagination";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "./inventory.css";
import axiosInstance from '../../config/axiosConfig'; // Adjust path as necessary
import { validateAddItem, validateEditItem, validateDeleteItem, ValidationErrors } from './InventoryValidation';



interface InventoryItem {
  itemID: number;
  item_name: string; // Changed from 'name' to 'item_name'
  item_quantity: number; // Changed from 'quantity' to 'item_quantity'
  item_stock: number; // Changed from 'itemStock' to 'item_stock'
  item_price: number; // Changed from 'price' to 'item_price'
  manufacture_date: string; // Changed from 'manufacturedDate' to 'manufacture_date'
  exp_date: string; // Changed from 'expirationDate' to 'exp_date'
  status: string;
  branch: {branch_name: string, branchID: number}; // Changed from 'branch' to 'branch_name'
  branchID: number; // Add this line for branchID
  statusColor?: string; // Optional, for frontend display purposes
}


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxHeight: '80vh', // Limit modal height
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "In Stock":
      return "green";
    case "Out of Stock":
      return "red";
    case "Low Stock":
      return "gold";
    case "Expired":
      return "red";
    case "Expiring":
      return "orange";
    default:
      return "gray";
  }
};

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [branches, setBranches] = useState<InventoryItem['branch'][]>([]);  // Use branch type from InventoryItem
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false); // Add Item modal state
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({}); // State for validation errors
  const [newItems, setNewItems] = useState<InventoryItem[]>([{
    itemID: 1,
    item_name: "",
    item_quantity: 0,
    item_stock: 0,
    item_price: 0,
    manufacture_date: "",
    exp_date: "",
    branch: {branch_name: "", branchID: 0},  // Default value for branch
    branchID: 0,
    status: "In Stock",  // Default value for status
  }]);

  // Fetching data when the component mounts
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await axiosInstance.get('/items');
        console.log('Fetched inventory data:', response.data); // Log the response data
        
        const fetchedItems = response.data.map((item: any) => ({
          itemID: item.itemID,                
          item_name: item.item_name,           
          item_quantity: item.item_quantity,
          item_stock: item.item_stock,   
          item_price: item.item_price,         
          manufacture_date: item.manufacture_date,  
          exp_date: item.exp_date,  
          branch: {branch_name: item.branch.branch_name},          
          status: item.status || 'In Stock', 
        }));
        
        console.log('Mapped items:', fetchedItems); // Log the mapped items
        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };
    
    fetchInventoryData();
    
  }, []);


  // Pagination and filtering logic


  const itemsPerPage = 10;
  const filteredItems = items.filter((item) =>
    item.item_name && item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const displayedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };


  // For the INSIDE of TABLE

  const handleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  //DELETE


  const handleDelete = async () => {
    try {
      // Step 1: Confirm before deletion
      const isConfirmed = validateDeleteItem(); // Ask for user confirmation
      if (!isConfirmed) {
        console.log('Deletion canceled by user.');
        return;
      }
  
      // Step 2: Proceed with the delete request
      await axiosInstance.delete('/deleteItems', {
        data: selectedItems, // Pass selected items as the request body
      });
  
      // Step 3: Update the frontend state after successful deletion
      setItems((prev) => prev.filter((item) => !selectedItems.includes(item.itemID)));
      setSelectedItems([]);
  
      // Step 4: Notify the user of successful deletion
      window.alert("Selected items have been successfully deleted.");
    } catch (error) {
      console.error('Error deleting items:', error);
      window.alert("An error occurred while deleting items. Please try again.");
    }
  };
  
  
  
  // Edit Part

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches'); // API endpoint for branches
        setBranches(response.data); // Assuming response contains branch data
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };
    fetchBranches();
  }, []);

  

  const handleEdit = (id: number) => {
    const itemToEdit = items.find((item) => item.itemID === id);
    if (itemToEdit) {
      // Initialize branch if not already set
      const itemWithBranch = {
        ...itemToEdit,
        branch: itemToEdit.branch || { branchID: 0, branch_name: "No branch" }
      };
      setEditingItem(itemWithBranch);
      setIsModalOpen(true);
    }
  };
  
  
  const handleEditSubmit = async () => {
    if (editingItem) {
      console.log("Editing Item: ", editingItem); // Debugging step
      const errors = validateEditItem(editingItem);
  
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        console.log("Validation errors:", errors);
        return;
      }
  
      try {
        const updatedItem = {
          ...editingItem,
          branch: {
            branchID: editingItem.branch.branchID,
            branch_name: editingItem.branch.branch_name,
          },
          statusColor: getStatusColor(editingItem.status),
        };
  
        console.log('Updated Item:', updatedItem); // Log the updated item
  
        const response = await axiosInstance.put(`/updateItems/${updatedItem.itemID}`, updatedItem);
        console.log('Response from Backend:', response);
  
        if (response.status === 200) {
          const updatedItemData = response.data;
  
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.itemID === updatedItemData.itemID ? updatedItemData : item
            )
          );
  
          alert("Item successfully updated!");
          handleModalClose();
        } else {
          alert("Failed to update the item. Please try again.");
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to update the item. Please try again.');
      }
    }
  };
  
  
  
  

  // Handle branch selection from dropdown
  const handleEditChange = (field: keyof InventoryItem | "reset", value?: any) => {
    if (field === "reset" && value) {
      // Reset fields but keep previous branch if not changed
      setEditingItem((prevState) => prevState ? {
        ...value,
        branch: prevState.branch || value.branch,  // Retain previous branch if not edited
      } : null);
      return;
    }
  
    if (field === "branch" && value) {
      // Find selected branch based on branchID
      const selectedBranch = branches.find((branch) => branch.branchID === parseInt(value));
      if (selectedBranch) {
        setEditingItem((prevState) => prevState ? {
          ...prevState,
          branch: {
            branchID: selectedBranch.branchID,  // Ensure branchID is correctly updated
            branch_name: selectedBranch.branch_name, // Update branch_name
          }
        } : null);
      }
      return;
    }
  
    // Update other fields without affecting branch
    setEditingItem((prevState) => prevState ? { ...prevState, [field]: value } : null);
  };
  

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  
  // Add Item Modal functions
  const handleAddModalOpen = () => setIsAddModalOpen(true);
  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setNewItems([
      {
        itemID: items.length + 1,
        item_name: "",
        item_quantity: 0,
        item_stock: 0,
        item_price: 0,
        manufacture_date: "",
        exp_date: "",
        branch: {branch_name: "", branchID: 0},  // Default value for branch
        branchID: 0,
        status: "In Stock",  // Default value for status
      },
    ]);
  };

  const handleAddItemChange = (
    index: number,
    field: keyof InventoryItem,
    value: string | number
  ) => {
    setNewItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
  
      // Update status color whenever the status changes
      if (field === "status") {
        updatedItems[index].statusColor = getStatusColor(updatedItems[index].status);
      }
  
      return updatedItems;
    });
  };

  const handleAddMoreItem = () => {
    setNewItems((prevItems) => [
      ...prevItems,
      {
        itemID: items.length + prevItems.length + 1, // Incrementing the ID for each new item
        item_name: "",  // matching the property name with the database field
        item_quantity: 0,
        item_stock: 0,
        item_price: 0,
        manufacture_date: "",
        exp_date: "",
        branchID: 0,
        branch: {branch_name : "", branchID: 0},  // matching the property name with the database field
        status: "In Stock",  // Default value for status
      },
    ]);
  };
  
  const handleAddItemSubmit = async () => {
    // Step 1: Validate each item
    let allErrors: ValidationErrors = {};
  
    // Validate each item in newItems array
    for (const item of newItems) {
      const itemErrors = validateAddItem(item);  // Assuming validateAddItem function is available
      if (Object.keys(itemErrors).length > 0) {
        allErrors = { ...allErrors, [item.itemID]: itemErrors }; // Accumulate errors by itemID
      }
    }
  
    // Step 2: If there are validation errors, update the validationErrors state and stop the process
    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors); // Update state with validation errors
      console.log("Validation errors:", allErrors); // Optionally log errors or display them
      return; // Stop further submission if there are validation errors
    }
  
    try {
      if (newItems.length === 1) {
        const formattedItem = {
          item_name: newItems[0].item_name,
          item_quantity: newItems[0].item_quantity,
          item_stock: newItems[0].item_stock,
          item_price: newItems[0].item_price,
          manufacture_date: newItems[0].manufacture_date,
          exp_date: newItems[0].exp_date,
          branch: {
            branchID: newItems[0].branchID, // Ensure branchID is passed for the first item
          },
          status: newItems[0].status,
        };
  
        console.log("Formatted Item for submission:", formattedItem);
  
        const response = await axiosInstance.post('/addItem', formattedItem);
        const addedItem = response.data;
        setItems((prev) => [...prev, addedItem]);
      } else {
        // Get the branchID from the first item
        const branchID = newItems[0].branchID;
  
        // Apply branchID from the first item to all items in newItems
        const formattedItems = newItems.map((item) => ({
          item_name: item.item_name,
          item_quantity: item.item_quantity,
          item_stock: item.item_stock,
          item_price: item.item_price,
          manufacture_date: item.manufacture_date,
          exp_date: item.exp_date,
          branch: {
            branchID: branchID, // Apply the branchID from the first item to all others
          },
          status: item.status,
        }));
  
        console.log("Formatted Items for submission:", formattedItems);
  
        const response = await axiosInstance.post('/addItems', formattedItems);
        const addedItems = response.data;
        setItems((prev) => [...prev, ...addedItems]);
      }
  
      handleAddModalClose(); // Close the modal after adding items
      alert("Items successfully added!"); // Show confirmation after successful submission
    } catch (e) {
      console.error('Error adding items:', e);
      alert('Failed to add items. Please try again.');
    }
  };
  



  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <div className="inventory-container p-8 h-full overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Inventory Overview</h1>
          <div className="search-bar mb-6 flex gap-4">
            <input
              type="text"
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search for a product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={selectedItems.length === 0}
            >
              Delete Selected
            </button>
            <button
              onClick={handleAddModalOpen}
              className="bg-green-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Add Item
            </button>
          </div>

          <TableContainer component={Paper} className="shadow-md rounded-lg overflow-hidden">
  <Table className="inventory-table" aria-label="customized table">
    <TableHead>
      <TableRow>
        <StyledTableCell padding="checkbox">
          <Checkbox
            indeterminate={selectedItems.length > 0 && selectedItems.length < items.length}
            checked={items.length > 0 && selectedItems.length === items.length}
            onChange={(e) =>
              setSelectedItems(
                e.target.checked ? items.map((item) => item.itemID) : []
              )
            }
          />
        </StyledTableCell>
        <StyledTableCell>Medicine</StyledTableCell>
        <StyledTableCell align="right">Quantity</StyledTableCell>
        <StyledTableCell align="right">Item Stock</StyledTableCell>
        <StyledTableCell align="right">Price (₱/pc)</StyledTableCell>
        <StyledTableCell align="right">Manufactured Date</StyledTableCell>
        <StyledTableCell align="right">Expiration Date</StyledTableCell>
        <StyledTableCell align="right">Branch</StyledTableCell>
        <StyledTableCell align="right">Status</StyledTableCell>
      </TableRow>
    </TableHead>
    
        <TableBody>
      {displayedItems.map((item) => (
        <StyledTableRow key={`item-${item.itemID}`}>
          <StyledTableCell padding="checkbox">
            <Checkbox
              checked={selectedItems.includes(item.itemID)}
              onChange={() => handleSelect(item.itemID)}
            />
          </StyledTableCell>

          <StyledTableCell>{item.item_name}</StyledTableCell>
          <StyledTableCell align="right">{item.item_quantity}</StyledTableCell>
          <StyledTableCell align="right">{item.item_stock}</StyledTableCell>
          <StyledTableCell align="right">{item.item_price}</StyledTableCell>

          <StyledTableCell align="right">{item.manufacture_date}</StyledTableCell>
          <StyledTableCell align="right">{item.exp_date}</StyledTableCell>

          <StyledTableCell align="right">{item.branch.branch_name}</StyledTableCell>

          <StyledTableCell align="right" style={{ color: getStatusColor(item.status) }}>
          {item.status}
          </StyledTableCell>
        </StyledTableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

  
          <div className="mt-6 flex justify-between items-center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
            />
                        <button
              onClick={() => handleEdit(selectedItems[0])}
              className="bg-yellow-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={selectedItems.length !== 1}
            >
              Edit Selected
            </button>
          </div>
          
        </div>
      </div>

      {/* Add Item Modal */}
      <Modal
  open={isAddModalOpen}
  onClose={handleAddModalClose}
  aria-labelledby="add-item-modal"
  aria-describedby="modal-to-add-inventory-item"
>
  <Box sx={modalStyle}>
    <h2 className="text-2xl font-bold mb-4">Add New Items</h2>
    <div className="overflow-y-auto max-h-[60vh]">
      {newItems.map((item, index) => (
        <div key={index}>
          <h3 className="text-xl font-semibold mb-4">Item {index + 1}</h3>
          <label className="block mb-2 font-semibold">Name:</label>
          <input
            type="text"
            value={item.item_name}
            onChange={(e) => handleAddItemChange(index, "item_name", e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-md shadow-sm mb-4"
          />
          <label className="block mb-2 font-semibold">Quantity:</label>
          <input
            type="number"
            value={item.item_quantity}
            onChange={(e) => handleAddItemChange(index, "item_quantity", Number(e.target.value))}
            className="border border-gray-300 p-2 w-full rounded-md shadow-sm mb-4"
          />
          <label className="block mb-2 font-semibold">Remaining Stock:</label>
          <input
            type="number"
            value={item.item_stock}
            onChange={(e) => handleAddItemChange(index, "item_stock", Number(e.target.value))}
            className="border border-gray-300 p-2 w-full rounded-md shadow-sm mb-4"/>
          <label className="block mb-2 font-semibold">Price:</label>
          <input
            type="number"
            value={item.item_price}
            onChange={(e) => handleAddItemChange(index, "item_price", Number(e.target.value))}
            className="border border-gray-300 p-2 w-full rounded-md shadow-sm mb-4"
          />
          <label className="block mb-2 font-semibold">Manufactured Date:</label>
          <input
            type="date"
            value={item.manufacture_date}
            onChange={(e) => handleAddItemChange(index, "manufacture_date", e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-md shadow-sm mb-4"
          />
          <label className="block mb-2 font-semibold">Expiration Date:</label>
          <input
            type="date"
            value={item.exp_date}
            onChange={(e) => handleAddItemChange(index, "exp_date", e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-md shadow-sm mb-4"
          />
          
          {/* Conditional rendering for branch input */}
          {index === 0 && (
            <>
              <label className="block mb-2 font-semibold">Branch:</label>
              <select
                value={item.branchID}
                onChange={(e) => handleAddItemChange(index, "branchID", e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-md shadow-sm mb-4"
              >
                <option value="">Select a branch</option>
                {branches.map((branch) => (
                  <option key={branch.branchID} value={branch.branchID}>
                    {branch.branch_name}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      ))}
    </div>
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={handleAddMoreItem}
        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
      >
        Add Another Item
      </button>
      <button
        onClick={handleAddItemSubmit}
        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
      >
        Add Items
      </button>
    </div>
  </Box>
</Modal>

        
{/* Edit Item Modal */}
<Modal
  open={isModalOpen}
  onClose={handleModalClose}
  aria-labelledby="edit-item-modal"
  aria-describedby="modal-to-edit-inventory-item"
>
  <Box sx={{ ...modalStyle, maxHeight: '80vh', overflow: 'hidden' }}>
    <h2 className="text-2xl font-bold mb-4">Edit Item</h2>

    {editingItem && (
      <div className="overflow-y-auto max-h-[60vh] pr-4 mb-4">
        <p className="mb-4">
          Editing: <span className="font-semibold">{editingItem.item_name}</span>
        </p>

        {/* Item Name */}
        <label className="block mb-2 font-semibold">Item Name:</label>
        <input
          type="text"
          value={editingItem.item_name}
          onChange={(e) => handleEditChange("item_name", e.target.value)}
          className="border border-gray-300 p-2 w-full rounded-md shadow-sm mb-4"
        />
        {validationErrors.item_name && (
          <p className="text-red-500 text-sm">{validationErrors.item_name}</p>
        )}

        {/* Item Quantity */}
        <label className="block mb-2 font-semibold">Item Quantity:</label>
        <input
          type="number"
          value={editingItem.item_quantity}
          onChange={(e) => handleEditChange("item_quantity", e.target.value)}
          className="border border-gray-300 p-2 w-full rounded-md shadow-sm mb-4"
        />
        {validationErrors.item_quantity && (
          <p className="text-red-500 text-sm">{validationErrors.item_quantity}</p>
        )}

        {/* Remaining Stock */}
        <label className="block mb-2 font-semibold">Remaining Stock:</label>
        <input
          type="number"
          value={editingItem.item_stock}
          onChange={(e) => handleEditChange("item_stock", e.target.value)}
          className="border border-gray-300 p-2 w-full rounded-md shadow-sm mb-4"/>

        {/* Item Price */}
        <label className="block mb-2 font-semibold">Item Price:</label>
        <input
          type="number"
          value={editingItem.item_price}
          onChange={(e) => handleEditChange("item_price", e.target.value)}
          className="border border-gray-300 p-2 w-full rounded-md shadow-sm mb-4"
        />
        {validationErrors.item_price && (
          <p className="text-red-500 text-sm">{validationErrors.item_price}</p>
        )}

        {/* Manufacture Date */}
        <label className="block mb-2 font-semibold">Manufacture Date:</label>
        <input
          type="date"
          value={editingItem.manufacture_date}
          onChange={(e) => handleEditChange("manufacture_date", e.target.value)}
          className="border border-gray-300 p-2 w-full rounded-md shadow-sm mb-4"
        />
        {validationErrors.manufacture_date && (
          <p className="text-red-500 text-sm">{validationErrors.manufacture_date}</p>
        )}

        {/* Expiration Date */}
        <label className="block mb-2 font-semibold">Expiration Date:</label>
        <input
          type="date"
          value={editingItem.exp_date}
          onChange={(e) => handleEditChange("exp_date", e.target.value)}
          className="border border-gray-300 p-2 w-full rounded-md shadow-sm mb-4"
        />
        {validationErrors.exp_date && (
          <p className="text-red-500 text-sm">{validationErrors.exp_date}</p>
        )}

        {/* Branch transfer */}
        <label className="block mb-2 font-semibold">Transfer to Branch:</label>
        <select
          value={editingItem.branch?.branchID || ""} // Default to empty string if branchID is undefined
          onChange={(e) => handleEditChange("branch", e.target.value)}
          className="border border-gray-300 p-2 w-full rounded-md shadow-sm mb-4"
        >
        <option value="" disabled>Select a Branch</option>
        {branches.map((branch) => (
          <option key={branch.branchID} value={branch.branchID}>
            {branch.branch_name}
          </option>
        ))}
        </select>
        {validationErrors.branch && (
          <p className="text-red-500 text-sm">{validationErrors.branch}</p>
        )}

        {/* Status selection */}
      </div>
    )}

    {editingItem && (
      <div className="flex justify-end mt-4 space-x-4">
        <button
          onClick={() => {
            handleEditChange("reset", editingItem);
            handleModalClose();
          }}
          className="bg-gray-300 text-black px-6 py-2 rounded-md shadow-sm hover:bg-gray-400"
        >
          Cancel Changes
        </button>

        <button
          onClick={handleEditSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    )}
  </Box>
</Modal>

    </div>
  );
};

export default Inventory;
