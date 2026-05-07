import { visit } from 'unist-util-visit';

/**
 * Remark plugin to transform [[slug]] wiki-links into markdown links.
 * Only processes text nodes outside code blocks.
 */
export function remarkWikiLinks(options = {}) {
  const base = options.base ?? '';

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
        nodes.push({
          type: 'link',
          url: `${base}/notes/${slug}`,
          title: null,
          children: [{ type: 'text', value: slug }],
          data: { hProperties: { class: 'wiki-link' } },
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
