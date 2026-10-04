export default function escapeRegex(textInputToEscape) {
  if (typeof textInputToEscape !== 'string') {
    return '';
  }
  return textInputToEscape.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
