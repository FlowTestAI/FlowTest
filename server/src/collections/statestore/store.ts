/**
 * In memory store to keep track of collection tree for each collection.
 * Collection tree tracks the full list of files, directories and their children 
 * under this collection so that UI can render the most updated information.
 */

export class InMemoryStateStore {

    private state = {
        collections: []
    };

    public createCollection(collection: any) {
        const collectionIds = this.state.collections.map((c) => c.id);
  
        if (!collectionIds.includes(collection.uid)) {
          this.state.collections.push(collection);
          console.log(`[InMemoryStore] collection tree ${JSON.stringify(collection)} initialized`)
        }
    }

    public removeCollection(collectionId: string) {
        const collection = this.state.collections.find(c => c.id === collectionId)
        this.state.collections = this.state.collections.filter((c) => c.id !== collectionId);
        console.log(`[InMemoryStore] collection tree ${JSON.stringify(collection)} removed`)
    }
}
