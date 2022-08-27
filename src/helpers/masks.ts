export const masks = {
  phone(value: string) {
    value = value
      .replace(/\D/g, '')
      .replace(/(.{11})(.)/g, '$1')
      .replace(/^(\d\d)(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')

    return value
  },
  cpf(value: string) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  },
  cnpj(value: string) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
      .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5')
      .replace(/(-\d{2})\d+?$/, '$1')
  }
}
