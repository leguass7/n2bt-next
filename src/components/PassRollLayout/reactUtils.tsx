import React, { isValidElement } from 'react'

export const isElement = (element: any) => isValidElement(element)

export const isCompositeTypeElement = (element: any) => {
  return isElement(element) && typeof element.type === 'function'
}

export function filterChildrenElements(children: any, compare: any) {
  const isElementCompare = (obj: any) => {
    if (Array.isArray(compare)) {
      return obj && isCompositeTypeElement(obj) && compare.indexOf(obj.type) >= 0
    }
    return obj && isCompositeTypeElement(obj) && obj.type === compare
  }

  const elements = React.Children.toArray(children)
  return elements.filter(isElementCompare)
}
