const marketplaceKeys = [
  "name",
  "description",
  "short_description",
  "long_description",
  "installation_instructions",
  "parameters",
];

const JS_INDENT = 2;

export function extractMarketplaceTranslation(
  content: string,
  filename: string
) {
  const translations = JSON.parse(content) as Record<string, any>;

  // Trả về toàn bộ nội dung dịch mà không loại bỏ khóa
  translations._warning = `AUTOMATICALLY GENERATED FROM $/src/translations/${filename} - DO NOT MODIFY THIS FILE DIRECTLY`;

  return JSON.stringify(translations, null, JS_INDENT);
}
