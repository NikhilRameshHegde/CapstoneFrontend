export class Category {
    id: string;
    name: string;
    description: string;
    productIds: string[] = [];
  
    constructor(id: string, name: string, description: string, productIds: string[] = []) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.productIds = productIds;
    }
  }
  