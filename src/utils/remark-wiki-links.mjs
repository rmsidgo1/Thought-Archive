import { visit } from 'unist-util-visit';

/**
 * Remark plugin to transform [[slug]] wiki-links into markdown links.
 * Marks links to non-existent slugs with class 'wiki-link--broken'.
 */
export function remarkWikiLinks(options = {}) {
  const base = options.base ?? '';
  const existingSlugs = options.existingSlugs ?? null; // Set<string> | null

  return function (tree) {
    visit(tree, 'text', function (node, index, parent) {
      if (
        !parent ||
        parent.type === 'code' ||
        parent.type === 'inlineCode'
      ) {
        return;
      }

      const value = node.value;
      const regex = /\[\[([^\]]+)\]\]/g;

      if (!regex.test(value)) return;
      regex.lastIndex = 0;

      const nodes = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(value)) !== null) {
        if (match.index > lastIndex) {
          nodes.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }

        const slug = match[1].trim();
        const broken = existingSlugs !== null && !existingSlugs.has(slug);

        nodes.push({
          type: 'link',
          url: `${base}/notes/${slug}`,
          title: broken ? `'${slug}' 노트를 찾을 수 없습니다` : null,
          children: [{ type: 'text', value: slug }],
          data: {
            hProperties: {
              class: broken ? 'wiki-link wiki-link--broken' : 'wiki-link',
              ...(broken && { 'aria-label': `존재하지 않는 노트: ${slug}` }),
            },
          },
        });

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < value.length) {
        nodes.push({ type: 'text', value: value.slice(lastIndex) });
      }

      if (nodes.length > 0) {
        parent.children.splice(index, 1, ...nodes);
        return index + nodes.length;
      }
    });
  };
}
