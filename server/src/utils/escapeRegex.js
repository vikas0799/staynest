/**
 * Escapes regex special characters in a user-provided string so that the
 * string is treated as a literal sequence of characters when passed to
 * `new RegExp(...)`.
 *
 * Characters escaped: \ ^ $ . * + ? ( ) [ ] { } |
 *
 * @param {string} str - Raw user input.
 * @returns {string} String safe for embedding in a RegExp pattern.
 */
const escapeRegex = (str) => str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');

export default escapeRegex;
