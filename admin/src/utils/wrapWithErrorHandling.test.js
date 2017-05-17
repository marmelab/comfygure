import expect, { createSpy } from 'expect';
import wrapWithErrorHandling from './wrapWithErrorHandling';

describe('wrapWithErrorHandling', () => {
    const effects = {
        setError: createSpy().andReturn(Promise.resolve()),
    };

    it('calls cb with effects and all args', () => {
        const cb = createSpy();

        wrapWithErrorHandling(cb)(effects, 'foo', 'bar');

        expect(cb).toHaveBeenCalledWith(effects, 'foo', 'bar');
    });

    it('calls effects.setError with error.message with inner function throwing an error', () => {
        return wrapWithErrorHandling(() => {
            throw new Error('foo');
        })(effects).then(() => {
            expect(effects.setError).toHaveBeenCalledWith('foo');
        });
    });

    it('calls effects.setError with error.message with inner promise throwing an error', () => {
        return wrapWithErrorHandling(
            () =>
                new Promise(() => {
                    throw new Error('foo');
                }),
        )(effects).then(() => {
            expect(effects.setError).toHaveBeenCalledWith('foo');
        });
    });
});
