import type CategoryTree from "~/types/categoryTree";

export default function flattenCategory(tree: CategoryTree[], level = 0): CategoryTree[] {
  const list: CategoryTree[] = [];
  for (const item of tree) {
    const cloned: CategoryTree = {
      id: item.id,
      slug: item.slug,
      name: `${"-- ".repeat(level)}${item.name}`,
    };

    list.push(cloned);

    if (item.children && item.children.length > 0) {
      list.push(...flattenCategory(item.children, level + 1));
    }
  }
  return list;
}
