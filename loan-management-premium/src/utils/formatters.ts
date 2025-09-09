export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dateObj);
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");
  
  // Format as Indian phone number
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
}

export function formatFormNumber(number: string): string {
  // Format as LMS-YYYY-MM-DD-XXXX
  if (number.length === 16 && number.startsWith("LMS")) {
    return `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7, 9)}-${number.slice(9, 11)}-${number.slice(11)}`;
  }
  return number;
}

// Convert number to words (for loan amount)
export function numberToWords(amount: number): string {
  if (amount === 0) return "Zero";

  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertThreeDigit(num: number): string {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    let result = "";

    if (hundred > 0) {
      result += ones[hundred] + " Hundred";
      if (remainder > 0) result += " ";
    }

    if (remainder >= 10 && remainder < 20) {
      result += teens[remainder - 10];
    } else {
      const ten = Math.floor(remainder / 10);
      const one = remainder % 10;
      if (ten > 0) result += tens[ten];
      if (one > 0) {
        if (ten > 0) result += " ";
        result += ones[one];
      }
    }

    return result;
  }

  // Indian numbering system
  const crore = Math.floor(amount / 10000000);
  amount %= 10000000;
  const lakh = Math.floor(amount / 100000);
  amount %= 100000;
  const thousand = Math.floor(amount / 1000);
  const remainder = amount % 1000;

  let result = "";

  if (crore > 0) {
    result += convertThreeDigit(crore) + " Crore ";
  }
  if (lakh > 0) {
    result += convertThreeDigit(lakh) + " Lakh ";
  }
  if (thousand > 0) {
    result += convertThreeDigit(thousand) + " Thousand ";
  }
  if (remainder > 0) {
    result += convertThreeDigit(remainder);
  }

  return result.trim() + " Rupees Only";
}