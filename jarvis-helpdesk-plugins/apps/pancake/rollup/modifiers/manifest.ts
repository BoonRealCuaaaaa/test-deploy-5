// [rollup/modifiers/manifest.ts](rollup/modifiers/manifest.ts)
const JS_INDENT = 2;

export function changeLocation(content: string, filename: string) {
  const manifest = JSON.parse(content) as Record<string, any>;

  if (manifest.web_accessible_resources) {
    const mergedResources = manifest.web_accessible_resources.reduce(
      (acc: any[], curr: any) => {
        const existing = acc.find(
          (item: any) =>
            JSON.stringify(item.matches) === JSON.stringify(curr.matches) &&
            item.use_dynamic_url === curr.use_dynamic_url
        );
        if (existing) {
          existing.resources = Array.from(
            new Set([...existing.resources, ...curr.resources])
          );
        } else {
          acc.push(curr);
        }
        return acc;
      },
      []
    );
    manifest.web_accessible_resources = mergedResources;
  }

  const manifestOutput = {
    _warning: `AUTOMATICALLY GENERATED FROM $/src/${filename} - DO NOT MODIFY THIS FILE DIRECTLY`,
    ...manifest,
  };

  return JSON.stringify(manifestOutput, null, JS_INDENT);
}
