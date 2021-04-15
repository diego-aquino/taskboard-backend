import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export function paginateQuery(query, page, elementsPerPage) {
  const skippedElements = (page - 1) * elementsPerPage;

  return query.skip(skippedElements).limit(elementsPerPage);
}

export function isValidObjectId(id) {
  if (!ObjectId.isValid(id)) return false;

  const objectId = ObjectId(id);
  return objectId.toString() === id;
}
