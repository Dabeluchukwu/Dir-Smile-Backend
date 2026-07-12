const Contact = require('./contact.model');
const { sendEmail } = require('../../config/email');
const ApiError = require('../../utils/ApiError');

const getProjectTypeLabel = (type) => {
  const labels = {
    'film-production': 'Film Production',
    'directing': 'Directing',
    'cinematography': 'Cinematography',
    'editing': 'Editing',
    'wedding-event': 'Wedding / Event',
    'live-streaming': 'Live Streaming',
    'media-consulting': 'Media Consulting',
    'other': 'Other',
  };
  return labels[type] || type;
};

const createContact = async (contactData) => {
  const contact = await Contact.create(contactData);
  
  // Send email notification
  try {
    const subject = `New Contact Form Submission from ${contact.name}`;
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
      <p><strong>Project Type:</strong> ${getProjectTypeLabel(contact.projectType)}</p>
      <p><strong>Message:</strong></p>
      <p>${contact.message}</p>
      <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
    `;
    
    await sendEmail(process.env.ADMIN_EMAIL, subject, html);
  } catch (error) {
    console.error('Failed to send email notification:', error);
    // Don't throw - we still want to save the contact
  }
  
  return contact;
};

const getAllContacts = async () => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  return contacts;
};

const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  if (!contact) {
    throw new ApiError(404, 'Contact not found');
  }
  return contact;
};

const updateContactStatus = async (id, isRead) => {
  // FIX: Replace { new: true } with { returnDocument: 'after' }
  const contact = await Contact.findByIdAndUpdate(
    id,
    { isRead },
    { 
      returnDocument: 'after',  // This replaces 'new: true'
      runValidators: true 
    }
  );
  
  if (!contact) {
    throw new ApiError(404, 'Contact not found');
  }
  
  return contact;
};

const deleteContact = async (id) => {
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) {
    throw new ApiError(404, 'Contact not found');
  }
  return contact;
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
};