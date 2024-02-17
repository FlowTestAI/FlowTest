import { InMemoryStateStore } from "../src/collections/statestore/store"

describe("State store", () => {
    it("should correctly add and delete directory in the collection tree", () => {
        const store = new InMemoryStateStore()

        const collectionObj = {
            version: '1',
            id: "1",
            name: "collection",
            pathname: "/parent/collection",
            items: [],
            enviroments: []
        };

        // create collection
        store.createCollection(collectionObj)
        let collection = store.getAllCollection()[0]
        expect(collection).toEqual(collectionObj)

        // Create a new folder inside collection
        let directory = {
            name: "test-suite-1",
            pathname: "/parent/collection/test-suite-1"
        };
        store.addDirectory(directory, collectionObj.id)
        
        collection = store.getAllCollection()[0]
        expect(collection.items[0].name).toEqual(directory.name)
        expect(collection.items[0].pathname).toEqual(directory.pathname)

        directory = {
            name: "test-suite-3",
            pathname: "/parent/collection/test-suite-1/test-suite-2/test-suite-3"
        };
        store.addDirectory(directory, collectionObj.id)
        expect(collection.items[0].items[0].name).toEqual("test-suite-2")
        expect(collection.items[0].items[0].pathname).toEqual("/parent/collection/test-suite-1/test-suite-2")

        expect(collection.items[0].items[0].items[0].name).toEqual(directory.name)
        expect(collection.items[0].items[0].items[0].pathname).toEqual(directory.pathname)

        directory = {
            name: "test-suite-2",
            pathname: "/parent/collection/test-suite-1/test-suite-2"
        };
        store.unlinkDirectory(directory, collectionObj.id)
        expect(collection.items[0].items).toEqual([])

        directory = {
            name: "collection",
            pathname: "/parent/collection"
        };
        store.unlinkDirectory(directory, collectionObj.id)
        expect(store.getAllCollection()).toEqual([])
    })

    it("should correctly add/delete/change file in the collection tree", () => {
        const store = new InMemoryStateStore()

        const collectionObj = {
            version: '1',
            id: "1",
            name: "collection",
            pathname: "/parent/collection",
            items: [],
            enviroments: []
        };

        // create collection
        store.createCollection(collectionObj)

        let directory = {
            name: "test-suite-3",
            pathname: "/parent/collection/test-suite-1/test-suite-2/test-suite-3"
        };
        store.addDirectory(directory, collectionObj.id)
        store.addFile({
            name: "test1.flow",
            pathname: "/parent/collection/test-suite-1/test1.flow"
        }, collectionObj.id)

        store.addFile({
            name: "test2.flow",
            pathname: "/parent/collection/test-suite-1/test-suite-2/test2.flow"
        }, collectionObj.id)


        store.addFile({
            name: "test3.flow",
            pathname: "/parent/collection/test-suite-1/test-suite-2/test-suite-3/test3.flow"
        }, collectionObj.id)

        const collection = store.getCollection(collectionObj.id);
        const file1ModifiedTime = collection.items[0].items[1].modifiedAt
        expect(collection.items[0].items[1].name).toEqual("test1.flow")
        expect(collection.items[0].items[1].pathname).toEqual("/parent/collection/test-suite-1/test1.flow")

        expect(collection.items[0].items[0].items[1].name).toEqual("test2.flow")
        expect(collection.items[0].items[0].items[1].pathname).toEqual("/parent/collection/test-suite-1/test-suite-2/test2.flow")

        expect(collection.items[0].items[0].items[0].items[0].name).toEqual("test3.flow")
        expect(collection.items[0].items[0].items[0].items[0].pathname).toEqual("/parent/collection/test-suite-1/test-suite-2/test-suite-3/test3.flow")

        store.changeFile({
            name: "test1.flow",
            pathname: "/parent/collection/test-suite-1/test1.flow"
        }, collectionObj.id)
        expect(collection.items[0].items[1].modifiedAt > file1ModifiedTime).toEqual(true)

        store.unlinkFile({
            name: "test1.flow",
            pathname: "/parent/collection/test-suite-1/test1.flow"
        }, collectionObj.id)
        expect(collection.items[0].items[1]).toEqual(undefined);

        directory = {
            name: "collection",
            pathname: "/parent/collection"
        };
        store.unlinkDirectory(directory, collectionObj.id)
        expect(store.getAllCollection()).toEqual([])
    })
})