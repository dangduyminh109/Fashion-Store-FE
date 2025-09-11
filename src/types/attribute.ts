import type AttributeValue from "./attributeValue";

export default interface Attribute {
  id: number;
  name: string;
  attributeDisplayType: string;
  listAttributeValue: AttributeValue[];
}
