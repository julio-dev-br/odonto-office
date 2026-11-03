/**
 * Funções utilitárias puras para formatação reativa em tempo real.
 */

export const maskCPF = (value: string): string => {
  return value
    .replace(/\D/g, '') 
    .replace(/(\d{3})(\d)/, '$1.$2') 
    .replace(/(\d{3})(\d)/, '$1.$2') 
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2') 
    .substring(0, 14); 
};


export const maskPhone = (value: string): string => {
  return value
    .replace(/\D/g, '') 
    .replace(/^(\d{2})(\d)/g, '($1) $2') 
    .replace(/(\d{5})(\d)/, '$1-$2') 
    .substring(0, 15); 
};

export const maskCurrency = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  if (!cleanValue) return 'R$ 0,00';
  
  const result = Array.from(cleanValue, Number).reduce((acc, digit) => acc * 10 + digit, 0);
  return 'R$ ' + (result / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const parseCurrencyToNumber = (value: string): number => {
  const cleanValue = value.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.');
  return Number(cleanValue) || 0;
};
