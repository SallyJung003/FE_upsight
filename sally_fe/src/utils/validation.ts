export const validateProductName = (name: string): string => {
  if (!name || name.trim() === '') {
    return '상품명은 필수입니다'
  }
  if (name.length > 50) {
    return '상품명은 50자 이하여야 합니다'
  }
  return ''
}

export const validateStock = (stock: number): string => {
  if (stock < 0) {
    return '재고는 0 이상이어야 합니다'
  }
  if (!Number.isInteger(stock)) {
    return '재고는 정수여야 합니다'
  }
  return ''
}

export const validateDescription = (description: string): string => {
  if (!description || description.trim() === '') {
    return '설명은 필수입니다'
  }
  return ''
}