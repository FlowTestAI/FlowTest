export default class CollectionTree {  
    /**
     * Constructor
     */
    constructor(rootNode, id) {
        this.id = id
        this.root = rootNode;
  
        this.prepareNode(this.root);
    }
  
    /**
     * Prepare the given node
     */
    prepareNode(node) {
      if (!node.children) return;
  
      this.reorderChildren(node);
  
      // set children directories
      node.directories = node.children.filter(child => child.isDirectory);
  
      // set children files
      node.files = node.children.filter(child => !child.isDirectory);
    }

    /**
     * Reorder node children by child name
     */
    reorderChildren(node) {
        node.children?.sort((a, b) => {
            if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) return 1;
            if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) return -1;
            return 0;
        });
    }
}