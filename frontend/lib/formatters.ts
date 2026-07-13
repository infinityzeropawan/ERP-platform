/**
 * Format a number as Indian Currency (INR)
 * @param amount Number to format
 * @returns Formatted string (e.g. ₹1,23,456.00)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format large KPI numbers with abbreviations (e.g., 12.4L, 2.3Cr)
 * @param amount Number to format
 * @returns Abbreviated string
 */
export const formatKpiCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return \`₹\${(amount / 10000000).toFixed(1)}Cr\`;
  }
  if (amount >= 100000) {
    return \`₹\${(amount / 100000).toFixed(1)}L\`;
  }
  if (amount >= 1000) {
    return \`₹\${(amount / 1000).toFixed(1)}K\`;
  }
  return \`₹\${amount.toFixed(0)}\`;
};

/**
 * Format a decimal to a percentage (1 decimal place)
 * @param value Decimal value (e.g. 0.125)
 * @returns Formatted string (e.g. 12.5%)
 */
export const formatPercentage = (value: number): string => {
  return \`\${(value * 100).toFixed(1)}%\`;
};

/**
 * Mask sensitive data like phone numbers
 * @param phone Raw phone number (e.g. 9876543210)
 * @returns Masked string (e.g. 98****3210)
 */
export const maskPhoneNumber = (phone: string): string => {
  if (!phone || phone.length < 10) return phone;
  return \`\${phone.slice(0, 2)}****\${phone.slice(-4)}\`;
};

/**
 * Mask sensitive data like emails
 * @param email Raw email address (e.g. john.doe@example.com)
 * @returns Masked email (e.g. j***@example.com)
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 1) return email;
  return \`\${local.slice(0, 1)}***@\${domain}\`;
};
