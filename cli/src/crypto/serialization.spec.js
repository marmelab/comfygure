const { serialize, unserialize } = require('./serialization');

describe('Serialization', () => {
    it('should keep the value of the serialized entry', () => {
        const entry = 'entry';
        const unserializedEntry = unserialize(serialize(entry));
        expect(unserializedEntry).toEqual(entry);
    });

    it('should keep the type of the serialized entry', () => {
        const entry = false;
        expect(typeof entry).toEqual('boolean');

        const serializedEntry = serialize(entry);
        expect(typeof serializedEntry).toEqual('string');

        const unseriazedEntry = unserialize(serializedEntry);
        expect(typeof unseriazedEntry).toEqual('boolean');
    });

    it('should keep `null` intact', () => {
        const entry = null;
        const unserializedEntry = unserialize(serialize(entry));
        expect(unserializedEntry).toEqual(entry);
    });
});
