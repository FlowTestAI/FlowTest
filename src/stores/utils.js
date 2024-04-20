import { OBJ_TYPES } from 'constants/Common';

export const findItemInCollectionTree = (item, collection) => {
  let flattenedItems = flattenItems(collection.items);

  return flattenedItems.find((i) => i.pathname === item.pathname && i.name === item.name);
};

export const findItemInCollectionByPathname = (collection, pathname) => {
  if (collection.pathname === pathname) {
    return collection;
  } else {
    const flattenedItems = flattenItems(collection.items);
    return flattenedItems.find((i) => i.pathname === pathname);
  }
};

export const deleteItemInCollectionByPathname = (pathname, collection) => {
  collection.items = collection.items.filter((i) => i.pathname !== pathname);

  let flattenedItems = flattenItems(collection.items);
  flattenedItems.forEach((i) => {
    if (i.items && i.items.length) {
      i.items = i.items.filter((i) => i.pathname !== pathname);
    }
  });
};

export const getAllFlowTests = (collection) => {
  if (collection) {
    let flattenedItems = flattenItems(collection.items);

    return flattenedItems.filter((i) => i.type === OBJ_TYPES.flowtest).map((i) => i.pathname);
  }
};

export const flattenItems = (items = []) => {
  const flattenedItems = [];

  const flatten = (itms, flattened) => {
    itms.forEach((i) => {
      flattened.push(i);

      if (i.items && i.items.length) {
        flatten(i.items, flattened);
      }
    });
  };

  flatten(items, flattenedItems);

  return flattenedItems;
};
