export type LibrarySection = 'movies' | 'tv';

export interface LibraryNavigationContext {
	section: LibrarySection;
	kind: 'list' | 'detail';
	listPath: '/library/movies' | '/library/tv';
}

const MOVIES_LIST = '/library/movies' as const;
const TV_LIST = '/library/tv' as const;

export function getLibraryNavigationContext(pathname: string): LibraryNavigationContext | null {
	if (pathname === MOVIES_LIST) {
		return { section: 'movies', kind: 'list', listPath: MOVIES_LIST };
	}
	if (/^\/library\/movie\/[^/]+$/.test(pathname)) {
		return { section: 'movies', kind: 'detail', listPath: MOVIES_LIST };
	}
	if (pathname === TV_LIST) {
		return { section: 'tv', kind: 'list', listPath: TV_LIST };
	}
	if (/^\/library\/tv\/[^/]+$/.test(pathname)) {
		return { section: 'tv', kind: 'detail', listPath: TV_LIST };
	}
	return null;
}

export function isSafeStoredLibraryReturn(
	value: string | null,
	listPath: LibraryNavigationContext['listPath']
): value is string {
	if (!value || !value.startsWith('/') || value.startsWith('//')) return false;

	try {
		const url = new URL(value, 'http://cinephage.local');
		return url.origin === 'http://cinephage.local' && url.pathname === listPath;
	} catch {
		return false;
	}
}

export function shouldRestoreStoredLibraryReturn(
	fromPathname: string,
	toPathname: string,
	storedReturn: string | null
): storedReturn is string {
	const from = getLibraryNavigationContext(fromPathname);
	const to = getLibraryNavigationContext(toPathname);

	if (!from || !to) return false;
	if (from.kind !== 'detail' || to.kind !== 'list') return false;
	if (from.section !== to.section) return false;

	return isSafeStoredLibraryReturn(storedReturn, to.listPath);
}
