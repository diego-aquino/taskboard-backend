export function paginateQuery(query, page, elementsPerPage) {
  const skippedElements = (page - 1) * elementsPerPage;

  return query.skip(skippedElements).limit(elementsPerPage);
}
