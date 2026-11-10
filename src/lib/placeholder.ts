// Shared rules for placeholder content, so every component treats it the same way.

/** Text in [square brackets] is a placeholder: it shows dashed until someone writes the real thing. */
export const isPlaceholderText = (text: string) => /^\[.*\]$/.test(text.trim());

/** Strip the brackets for display. */
export const placeholderLabel = (text: string) => text.trim().replace(/^\[|\]$/g, '');

/** A WhatsApp link with a pre-filled message, or '' while the number is missing. */
export const whatsappUrl = (number: string, message: string) => {
  const digits = number.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : '';
};
