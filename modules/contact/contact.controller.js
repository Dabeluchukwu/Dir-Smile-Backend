const {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact: deleteContactService,  // ← Rename the import
} = require('./contact.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');

const submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, projectType, message } = req.body;
  
  if (!name || !email || !projectType || !message) {
    return res.status(400).json(new ApiResponse(400, null, 'Please provide all required fields'));
  }
  
  const contact = await createContact({ name, email, phone, projectType, message });
  res.status(201).json(new ApiResponse(201, contact, 'Message sent successfully'));
});

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json(new ApiResponse(200, contacts, 'Contacts retrieved successfully'));
});

const getContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contact = await getContactById(id);
  res.status(200).json(new ApiResponse(200, contact, 'Contact retrieved successfully'));
});

const updateContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isRead } = req.body;
  
  if (isRead === undefined) {
    return res.status(400).json(new ApiResponse(400, null, 'Please provide isRead status'));
  }
  
  const contact = await updateContactStatus(id, isRead);
  res.status(200).json(new ApiResponse(200, contact, 'Contact updated successfully'));
});

const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteContactService(id);  // ← Use the renamed import
  res.status(200).json(new ApiResponse(200, null, 'Contact deleted successfully'));
});

module.exports = {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
};