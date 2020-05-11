export function setPreviousListItemToFocus(index, listItems) {
  if (index > 0) {
    return listItems[index - 1].id;
  } else {
    return setLastListItemToFocus(listItems);
  }
}
export function setNextListItemToFocus(index, listItems) {
  if (index < listItems.length - 1) {
    return listItems[index + 1].id;
  } else {
    return setFirstListItemToFocus(listItems);
  }
}
export function setLastListItemToFocus(listItems) {
  if (listItems.length > 1) {
    return listItems[listItems.length - 1].id;
  }
}
export function setFirstListItemToFocus(listItems) {
  if (listItems.length > 1) {
    return listItems[0].id;
  }
}
