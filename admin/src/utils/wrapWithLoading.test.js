import expect, { createSpy } from 'expect';
import wrapWithLoading from './wrapWithLoading';

describe('wrapWithLoading', () => {
    const effects = {
        setLoading: createSpy().andReturn(Promise.resolve()),
    };

    const cb = createSpy().andReturn(Promise.resolve());

    it('calls effects.setLoading with true', () => {
        return wrapWithLoading(cb)(effects).then(() => {
            expect(effects.setLoading).toHaveBeenCalledWith(true);
        });
    });

    it('calls cb with effects and all args', () => {
        return wrapWithLoading(cb)(effects, 'foo', 'bar').then(() => {
            expect(cb).toHaveBeenCalledWith(effects, 'foo', 'bar');
        });
    });

    it('calls effects.setLoading with false', () => {
        return wrapWithLoading(cb)(effects).then(() => {
            expect(effects.setLoading).toHaveBeenCalledWith(false);
        });
    });
});
