export default interface CategoryTree {
  id: number;
  name: string;
  slug: string;
  children?: CategoryTree[];
}
