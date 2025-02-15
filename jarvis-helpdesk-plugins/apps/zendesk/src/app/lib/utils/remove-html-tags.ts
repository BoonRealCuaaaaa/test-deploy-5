export function removeHtmlTags(input: string): string {
  return input
    .replace(/<\/?[^>]+(>|$)/g, ' ') // Replace HTML tags with spaces
    .replace(/&nbsp;/gi, ' ') // Replace &nbsp; with spaces
    .replace(/&[^;\s]+;/g, '') // Remove other HTML entities
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim();
}
