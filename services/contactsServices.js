import { Contact } from '../models/Contact.js';

export const listContacts = async () => {
  const contacts = await Contact.findAll();
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await Contact.findByPk(id);
  return contact;
};

export const addContact = async ({ name, email, phone, favorite = false }) => {
  const newContact = await Contact.create({ name, email, phone, favorite });
  return newContact;
};

export const removeContact = async (id) => {
  const contact = await Contact.findByPk(id);
  if (!contact) {
    return null;
  }

  await contact.destroy();
  return contact;
};

export const updateContact = async (id, data) => {
  const [updatedCount, [updatedContact]] = await Contact.update(data, {
    where: { id },
    returning: true,
  });

  if (!updatedCount) {
    return null;
  }

  return updatedContact;
};

export const updateStatusContact = async (id, favorite) => {
  const [updatedCount, [updatedContact]] = await Contact.update(
    { favorite },
    {
      where: { id },
      returning: true,
    }
  );

  if (!updatedCount) {
    return null;
  }

  return updatedContact;
};
