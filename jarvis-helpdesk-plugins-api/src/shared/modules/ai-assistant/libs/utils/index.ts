import showdown from 'showdown';

export const extractTagValues = (input: string, tagName: string): string[] => {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'g');
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(input)) !== null) {
    matches.push(match[1].trim());
  }
  return matches;
};

export const markdownToHtml = (markdown: string): string => {
  const finalAnswer = markdown.trim();
  const converter: showdown.Converter = new showdown.Converter({ simplifiedAutoLink: true }) as string;
  let html: string = converter.makeHtml(finalAnswer) as string;
  html = html.replace(/<li><p>/g, '<li>').replace(/<\/p><\/li>/g, '</li>');
  return html;
};

export const joinItems = (items: string[], prefix = '-'): string => {
  if (prefix === 'asc') {
    return items.map((item, index) => `${index + 1}. ${item}\n`).join('');
  }
  return items.map((item) => `\n${prefix} ${item}`).join('');
};
