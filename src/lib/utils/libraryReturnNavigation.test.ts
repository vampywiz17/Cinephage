import { describe, expect, it } from 'vitest';

import {
	getLibraryNavigationContext,
	isSafeStoredLibraryReturn,
	shouldRestoreStoredLibraryReturn
} from './libraryReturnNavigation';

describe('library return navigation', () => {
	it('recognizes Movies and TV list/detail routes independently', () => {
		expect(getLibraryNavigationContext('/library/movies')).toEqual({
			section: 'movies',
			kind: 'list',
			listPath: '/library/movies'
		});
		expect(getLibraryNavigationContext('/library/movie/movie-id')).toEqual({
			section: 'movies',
			kind: 'detail',
			listPath: '/library/movies'
		});
		expect(getLibraryNavigationContext('/library/tv')).toEqual({
			section: 'tv',
			kind: 'list',
			listPath: '/library/tv'
		});
		expect(getLibraryNavigationContext('/library/tv/series-id')).toEqual({
			section: 'tv',
			kind: 'detail',
			listPath: '/library/tv'
		});
	});

	it('accepts complete filtered TV URLs', () => {
		expect(
			isSafeStoredLibraryReturn(
				'/library/tv?library=anime&status=continuing&progress=missing&sort=year-desc&q=voyager',
				'/library/tv'
			)
		).toBe(true);
	});

	it('accepts complete filtered Movies URLs', () => {
		expect(
			isSafeStoredLibraryReturn(
				'/library/movies?library=anime&fileStatus=missingFile&resolution=2160p&sort=added-desc&q=alien',
				'/library/movies'
			)
		).toBe(true);
	});

	it('restores TV detail back to the stored TV list state', () => {
		expect(
			shouldRestoreStoredLibraryReturn(
				'/library/tv/series-id',
				'/library/tv',
				'/library/tv?status=ended&resolution=1080p&sort=size-desc&q=trek'
			)
		).toBe(true);
	});

	it('does not cross Movies and TV return states', () => {
		expect(
			shouldRestoreStoredLibraryReturn(
				'/library/tv/series-id',
				'/library/tv',
				'/library/movies?fileStatus=missingFile'
			)
		).toBe(false);
	});

	it('rejects external return targets', () => {
		expect(isSafeStoredLibraryReturn('https://example.com/library/tv', '/library/tv')).toBe(false);
		expect(isSafeStoredLibraryReturn('//example.com/library/tv', '/library/tv')).toBe(false);
	});
});
