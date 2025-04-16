import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact as updateContactService,
  updateStatusContact,
} from '../services/contactsServices.js';

import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts(req.user.id);
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) throw HttpError(404, 'Contact not found');
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await removeContact(id);
    if (!deleted) throw HttpError(404, 'Contact not found');
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await addContact({ ...req.body, owner: req.user.id });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await updateContactService(id, req.body);
    if (!updated) throw HttpError(404, 'Contact not found');
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const updateFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    if (favorite === undefined) {
      throw HttpError(400, "Body must have field favorite");
    }

    const updated = await updateStatusContact(id, favorite);

    if (!updated) {
      throw HttpError(404, "Contact not found");
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};
