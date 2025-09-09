import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function numberToWords(num: number): string {
  if (num === 0) return 'zero';

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

  const convertMillions = (num: number): string => {
    if (num >= 1000000) {
      return convertMillions(Math.floor(num / 1000000)) + ' million ' + convertThousands(num % 1000000);
    }
    return convertThousands(num);
  };

  const convertThousands = (num: number): string => {
    if (num >= 1000) {
      return convertHundreds(Math.floor(num / 1000)) + ' thousand ' + convertHundreds(num % 1000);
    }
    return convertHundreds(num);
  };

  const convertHundreds = (num: number): string => {
    if (num > 99) {
      const hundreds = ones[Math.floor(num / 100)] || '';
      const remainder = num % 100;
      if (remainder > 0) {
        return hundreds + ' hundred ' + convertTens(remainder);
      }
      return hundreds + ' hundred';
    }
    return convertTens(num);
  };

  const convertTens = (num: number): string => {
    if (num < 10) return ones[num] || '';
    if (num >= 10 && num < 20) return teens[num - 10] || '';
    const tensDigit = tens[Math.floor(num / 10)] || '';
    const onesDigit = ones[num % 10] || '';
    return (tensDigit + ' ' + onesDigit).trim();
  };

  return convertMillions(num).trim();
}