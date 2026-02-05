import { validateProductName, validateStock, validateDescription } from './validation'

describe('상품명 검증', () => {
  test('비어있으면 에러', () => {
    expect(validateProductName('')).toBe('상품명은 필수입니다')
  })

  test('공백만 있으면 에러', () => {
    expect(validateProductName('   ')).toBe('상품명은 필수입니다')
  })

  test('50자 초과하면 에러', () => {
    const longName = 'a'.repeat(51)
    expect(validateProductName(longName)).toBe('상품명은 50자 이하여야 합니다')
  })

  test('정상 입력이면 통과', () => {
    expect(validateProductName('정상 상품명')).toBe('')
  })
})

describe('재고 검증', () => {
  test('음수면 에러', () => {
    expect(validateStock(-1)).toBe('재고는 0 이상이어야 합니다')
  })

  test('소수면 에러', () => {
    expect(validateStock(1.5)).toBe('재고는 정수여야 합니다')
  })

  test('0이면 통과', () => {
    expect(validateStock(0)).toBe('')
  })

  test('양수면 통과', () => {
    expect(validateStock(10)).toBe('')
  })
})

describe('설명 검증', () => {
  test('비어있으면 에러', () => {
    expect(validateDescription('')).toBe('설명은 필수입니다')
  })

  test('정상 입력이면 통과', () => {
    expect(validateDescription('상품 설명')).toBe('')
  })
})