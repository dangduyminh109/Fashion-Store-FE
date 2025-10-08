export default interface Category {
  id: number;
  name: string;
  slug: string;
  status: boolean;
  image: string;
  parentId: number;
  parentName: string;
  isDeleted: boolean;
}
