import { visit } from 'unist-util-visit';

/**
 * Remark plugin to transform Obsidian-style callouts into styled divs.
 *
 * Syntax:
 *   > [!insight]
 *   > 내용
 *
 * Supported types: insight, tip, note, problem, warning, important, success, question
 */
export function remarkCallouts() {
  return function (tree) {
    visit(tree, 'blockquote', (node) => {
      const firstPara = node.children[0];
      if (!firstPara || firstPara.type !== 'paragraph') return;

      const firstChild = firstPara.children[0];
      if (!firstChild || firstChild.type !== 'text') return;

      const match = firstChild.value.match(/^\[!([\w-]+)\][ ]*/);
      if (!match) return;

      const type = match[1].toLowerCase();

      // blockquote → div 으로 변환
      node.data = node.data ?? {};
      node.data.hName = 'div';
      node.data.hProperties = {
        class: `callout callout-${type}`,
        'data-callout': type,
      };

      // [!type] 마커 제거
      const remaining = firstChild.value.slice(match[0].length).trimStart();
      if (remaining) {
        firstChild.value = remaining;
      } else {
        firstPara.children.splice(0, 1);
        if (firstPara.children.length === 0) {
          node.children.splice(0, 1);
        }
      }
    });
  };
}
