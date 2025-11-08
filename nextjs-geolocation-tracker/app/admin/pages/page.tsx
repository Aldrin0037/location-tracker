'use client';

import { useEffect, useMemo, useState } from 'react';
import Layout from '@/app/components/Layout';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import EmbedContent from '@/app/components/EmbedContent';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import type { Config, TrackingPage, PageContent } from '@/app/types';

type EditState = {
	selectedKey: string | null;
	localConfig: Config | null;
	isSaving: boolean;
	message: { type: 'success' | 'error'; text: string } | null;
	showPreviewUnlocked: boolean;
	search: string;
};

// Minimal provider-aware URL → embed URL transformer
function toEmbedUrl(rawUrl: string): { embedUrl: string | null; note?: string } {
	try {
		const url = new URL(rawUrl.trim());
		const host = url.hostname.replace(/^www\./, '');

		// YouTube
		if (host.includes('youtube.com') || host === 'youtu.be') {
			let id = '';
			if (host === 'youtu.be') {
				id = url.pathname.slice(1);
			} else if (url.pathname.startsWith('/watch')) {
				id = url.searchParams.get('v') || '';
			} else if (url.pathname.startsWith('/shorts/')) {
				id = url.pathname.split('/')[2] || '';
			} else if (url.pathname.startsWith('/embed/')) {
				id = url.pathname.split('/')[2] || '';
			}
			if (id) return { embedUrl: `https://www.youtube.com/embed/${id}` };
		}

		// Vimeo
		if (host.includes('vimeo.com')) {
			const parts = url.pathname.split('/').filter(Boolean);
			const id = parts.pop();
			if (id && /^\d+$/.test(id)) {
				return { embedUrl: `https://player.vimeo.com/video/${id}` };
			}
		}

		// Spotify
		if (host.includes('open.spotify.com')) {
			// Preserve path but ensure /embed prefix
			const path = url.pathname;
			return { embedUrl: `https://open.spotify.com/embed${path}` };
		}

		// Google Maps
		if (host.includes('google.com') && url.pathname.includes('/maps')) {
			// Direct maps URLs generally allow embedding
			return { embedUrl: rawUrl };
		}

		// Figma
		if (host.includes('figma.com')) {
			return { embedUrl: `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(rawUrl)}` };
		}

		// Generic fallback (may be blocked by X-Frame-Options)
		return {
			embedUrl: rawUrl,
			note: 'This site may restrict embedding. If it fails, try a provider-specific embed URL.'
		};
	} catch {
		return { embedUrl: null };
	}
}

export default function AdminPagesEditor() {
	const { isAuthenticated, isLoading: authLoading } = useAuth();
	const router = useRouter();
	const [state, setState] = useState<EditState>({
		selectedKey: null,
		localConfig: null,
		isSaving: false,
		message: null,
		showPreviewUnlocked: true,
		search: ''
	});

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/admin');
		}
	}, [authLoading, isAuthenticated, router]);

	useEffect(() => {
		if (isAuthenticated) loadConfig();
	}, [isAuthenticated]);

	const loadConfig = async () => {
		try {
			const res = await fetch('/api/admin/config');
			const data = await res.json();
			if (data.success && data.config) {
				setState((s) => ({
					...s,
					localConfig: data.config as Config,
					selectedKey: Object.keys((data.config as Config).trackingPages || {})[0] || null
				}));
			}
		} catch (e) {
			console.error('Failed to load config', e);
		}
	};

	const pagesEntries = useMemo(() => {
		const entries = state.localConfig ? Object.entries(state.localConfig.trackingPages || {}) : [];
		if (!state.search.trim()) return entries;
		const q = state.search.trim().toLowerCase();
		return entries.filter(([key, page]) => {
			return (
				key.toLowerCase().includes(q) ||
				page.title.toLowerCase().includes(q) ||
				page.url.toLowerCase().includes(q)
			);
		});
	}, [state.localConfig, state.search]);

	const selectedPage = useMemo<TrackingPage | null>(() => {
		if (!state.localConfig || !state.selectedKey) return null;
		return state.localConfig.trackingPages[state.selectedKey] ?? null;
	}, [state.localConfig, state.selectedKey]);

	const updateSelectedPage = (partial: Partial<TrackingPage>) => {
		if (!state.localConfig || !state.selectedKey) return;
		const next: Config = {
			...state.localConfig,
			trackingPages: {
				...state.localConfig.trackingPages,
				[state.selectedKey]: {
					...state.localConfig.trackingPages[state.selectedKey],
					...partial
				}
			}
		};
		setState((s) => ({ ...s, localConfig: next }));
	};

	const updateSelectedContent = (partial: Partial<PageContent>) => {
		if (!selectedPage) return;
		updateSelectedPage({ content: { ...selectedPage.content, ...partial } });
	};

	const addNewPage = () => {
		if (!state.localConfig) return;
		const baseKey = 'page';
		let i = 1;
		let newKey = `${baseKey}${i}`;
		while (state.localConfig.trackingPages[newKey]) {
			i += 1;
			newKey = `${baseKey}${i}`;
		}
		const newPage: TrackingPage = {
			enabled: true,
			url: `/${newKey}`,
			theme: 'default',
			title: `New Page ${i}`,
			subtitle: 'Describe this page',
			loadingText: 'Loading...',
			content: {
				type: 'embed',
				embedUrl: ''
			},
			embedCode: null
		};
		const next: Config = {
			...state.localConfig,
			trackingPages: {
				...state.localConfig.trackingPages,
				[newKey]: newPage
			}
		};
		setState((s) => ({ ...s, localConfig: next, selectedKey: newKey }));
	};

	const deleteSelectedPage = () => {
		if (!state.localConfig || !state.selectedKey) return;
		const key = state.selectedKey;
		// Do not allow deleting if it's the last page
		if (Object.keys(state.localConfig.trackingPages).length <= 1) {
			setState((s) => ({
				...s,
				message: { type: 'error', text: 'At least one page must remain.' }
			}));
			return;
		}
		const nextPages = { ...state.localConfig.trackingPages };
		delete nextPages[key];
		const first = Object.keys(nextPages)[0] || null;
		setState((s) => ({
			...s,
			localConfig: { ...state.localConfig!, trackingPages: nextPages },
			selectedKey: first
		}));
	};

	const saveConfig = async () => {
		if (!state.localConfig) return;
		setState((s) => ({ ...s, isSaving: true, message: null }));
		try {
			const res = await fetch('/api/admin/config', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ config: state.localConfig })
			});
			const data = await res.json();
			if (data.success) {
				setState((s) => ({
					...s,
					isSaving: false,
					message: { type: 'success', text: 'Configuration saved successfully!' }
				}));
			} else {
				setState((s) => ({
					...s,
					isSaving: false,
					message: { type: 'error', text: data.error || 'Failed to save configuration' }
				}));
			}
		} catch (e) {
			setState((s) => ({
				...s,
				isSaving: false,
				message: { type: 'error', text: 'Failed to save configuration' }
			}));
		}
		setTimeout(() => setState((s) => ({ ...s, message: null })), 3000);
	};

	const exportConfig = () => {
		if (!state.localConfig) return;
		const blob = new Blob([JSON.stringify(state.localConfig, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `page-config-${new Date().toISOString().split('T')[0]}.json`;
		link.click();
		URL.revokeObjectURL(url);
	};

	const importConfig = async (file: File) => {
		try {
			const text = await file.text();
			const parsed = JSON.parse(text) as Config;
			if (!parsed?.trackingPages) throw new Error('Invalid configuration file');
			setState((s) => ({
				...s,
				localConfig: parsed,
				selectedKey: Object.keys(parsed.trackingPages)[0] || null,
				message: { type: 'success', text: 'Configuration imported (not saved yet)' }
			}));
			setTimeout(() => setState((s) => ({ ...s, message: null })), 3000);
		} catch (e) {
			setState((s) => ({
				...s,
				message: { type: 'error', text: 'Failed to import configuration' }
			}));
			setTimeout(() => setState((s) => ({ ...s, message: null })), 3000);
		}
	};

	const renderContentEditor = () => {
		if (!selectedPage) return null;
		const content = selectedPage.content;

		if (content.type === 'photos') {
			const items = content.items || [];
			return (
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Photos</h3>
						<button
							className="btn-secondary"
							onClick={() =>
								updateSelectedContent({
									items: [
										...items,
										{ url: '', caption: 'New photo', description: 'Description' }
									]
								})
							}
						>
							➕ Add Photo
						</button>
					</div>
					{items.length === 0 && (
						<p className="text-sm text-gray-500 dark:text-gray-400">No photos yet</p>
					)}
					{items.map((item, idx) => (
						<div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
								<div className="md:col-span-2">
									<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
										Image URL
									</label>
									<input
										type="url"
										value={item.url}
										onChange={(e) => {
											const next = [...items];
											next[idx] = { ...next[idx], url: e.target.value };
											updateSelectedContent({ items: next });
										}}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
										placeholder="https://..."
									/>
								</div>
								<div className="">
									<div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
										{item.url ? (
											<img src={item.url} alt="" className="w-full h-full object-cover" />
										) : (
											<div className="h-full flex items-center justify-center text-gray-500 text-sm">
												Preview
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<div>
									<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
										Caption
									</label>
									<input
										type="text"
										value={item.caption}
										onChange={(e) => {
											const next = [...items];
											next[idx] = { ...next[idx], caption: e.target.value };
											updateSelectedContent({ items: next });
										}}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
									/>
								</div>
								<div>
									<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
										Description
									</label>
									<input
										type="text"
										value={item.description}
										onChange={(e) => {
											const next = [...items];
											next[idx] = { ...next[idx], description: e.target.value };
											updateSelectedContent({ items: next });
										}}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
									/>
								</div>
							</div>
							<div className="flex justify-end">
								<button
									className="text-red-600 hover:text-red-700 text-sm"
									onClick={() => {
										const next = items.filter((_, i) => i !== idx);
										updateSelectedContent({ items: next });
									}}
								>
									🗑️ Remove
								</button>
							</div>
						</div>
					))}
				</div>
			);
		}

		if (content.type === 'delivery') {
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tracking Number</label>
						<input
							type="text"
							value={content.trackingNumber || ''}
							onChange={(e) => updateSelectedContent({ trackingNumber: e.target.value })}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
						/>
					</div>
					<div>
						<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
						<input
							type="text"
							value={content.status || ''}
							onChange={(e) => updateSelectedContent({ status: e.target.value })}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
						/>
					</div>
					<div>
						<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Estimated Time</label>
						<input
							type="text"
							value={content.estimatedTime || ''}
							onChange={(e) => updateSelectedContent({ estimatedTime: e.target.value })}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
						/>
					</div>
					<div className="md:col-span-2">
						<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Message</label>
						<input
							type="text"
							value={content.message || ''}
							onChange={(e) => updateSelectedContent({ message: e.target.value })}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
						/>
					</div>
				</div>
			);
		}

		if (content.type === 'embed' || content.type === 'custom') {
			return (
				<div className="space-y-4">
					<div>
						<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
							Embed URL (YouTube, Vimeo, Spotify, Google Maps, Figma...)
						</label>
						<div className="flex gap-2">
							<input
								type="url"
								placeholder="https://..."
								value={content.embedUrl || ''}
								onChange={(e) => updateSelectedContent({ embedUrl: e.target.value })}
								className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
							/>
							<button
								className="btn-secondary whitespace-nowrap"
								onClick={() => {
									if (!content.embedUrl) return;
									const t = toEmbedUrl(content.embedUrl);
									if (t.embedUrl) {
										updateSelectedContent({ embedUrl: t.embedUrl });
										if (t.note) {
											setState((s) => ({
												...s,
												message: { type: 'success', text: t.note! }
											}));
											setTimeout(() => setState((s) => ({ ...s, message: null })), 3000);
										}
									}
								}}
							>
								↪ Convert
							</button>
						</div>
					</div>

					<div>
						<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
							Helper message (optional)
						</label>
						<input
							type="text"
							value={content.message || ''}
							onChange={(e) => updateSelectedContent({ message: e.target.value })}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
							placeholder="Short description to show below the embed"
						/>
					</div>

					<div className="rounded-lg overflow-hidden">
						<EmbedContent embedUrl={content.embedUrl} html={undefined} title={selectedPage.title} />
					</div>

					<div className="text-xs text-gray-500 dark:text-gray-400">
						Note: Some sites block iframes. If the preview stays blank, use a provider-specific embed URL.
					</div>
				</div>
			);
		}

		return <p className="text-sm text-gray-500 dark:text-gray-400">Content type not supported.</p>;
	};

	if (authLoading || !isAuthenticated) {
		return (
			<Layout>
				<LoadingSpinner />
			</Layout>
		);
	}

	if (!state.localConfig) {
		return (
			<Layout showNavigation={true}>
				<div className="max-w-6xl mx-auto">
					<header className="mb-8">
						<h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">📝 Pages</h1>
						<p className="text-gray-600 dark:text-gray-400">Create and edit your tracking pages content</p>
					</header>
					<LoadingSpinner text="Loading configuration..." />
				</div>
			</Layout>
		);
	}

	return (
		<Layout showNavigation={true}>
			<div className="max-w-7xl mx-auto">
				<header className="mb-6 flex items-center justify-between">
					<div>
						<h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">📝 Pages</h1>
						<p className="text-gray-600 dark:text-gray-400">Create and edit tracking pages content, themes, and embeds</p>
					</div>

					<div className="flex items-center gap-2">
						<input
							type="file"
							accept="application/json"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) importConfig(file);
								e.currentTarget.value = '';
							}}
							className="hidden"
							id="import-config-input"
						/>
						<label htmlFor="import-config-input" className="btn-secondary cursor-pointer">📥 Import</label>
						<button className="btn-secondary" onClick={exportConfig}>📤 Export</button>
						<button className="btn-primary" onClick={saveConfig} disabled={state.isSaving}>
							{state.isSaving ? '💾 Saving...' : '💾 Save'}
						</button>
					</div>
				</header>

				{state.message && (
					<div
						className={`mb-6 p-4 rounded-lg ${
							state.message.type === 'success'
								? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
								: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
						}`}
					>
						{state.message.text}
					</div>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left: list */}
					<div className="lg:col-span-1">
						<div className="card">
							<div className="flex items-center gap-2 mb-3">
								<input
									type="text"
									placeholder="Search pages..."
									value={state.search}
									onChange={(e) => setState((s) => ({ ...s, search: e.target.value }))}
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
								/>
								<button className="btn-secondary whitespace-nowrap" onClick={addNewPage}>➕ New</button>
							</div>
							<div className="divide-y divide-gray-200 dark:divide-gray-700">
								{pagesEntries.map(([key, page]) => {
									const active = key === state.selectedKey;
									return (
										<button
											key={key}
											onClick={() => setState((s) => ({ ...s, selectedKey: key }))}
											className={`w-full text-left p-3 rounded-lg transition-colors ${
												active
													? 'bg-amber-100 dark:bg-amber-900/30'
													: 'hover:bg-gray-50 dark:hover:bg-gray-800'
											}`}
										>
											<div className="flex items-center justify-between">
												<div>
													<div className="font-semibold text-gray-800 dark:text-gray-100">{page.title}</div>
													<div className="text-xs text-gray-500 dark:text-gray-400">{page.url} • {key}</div>
												</div>
												<div className="text-xs">
													{page.enabled ? <span className="text-green-600">Enabled</span> : <span className="text-gray-400">Disabled</span>}
												</div>
											</div>
										</button>
									);
								})}
								{pagesEntries.length === 0 && (
									<div className="text-sm text-gray-500 dark:text-gray-400 p-3">No pages found</div>
								)}
							</div>
						</div>
					</div>

					{/* Right: editor */}
					<div className="lg:col-span-2 space-y-6">
						{selectedPage ? (
							<>
								<div className="card">
									<div className="flex items-center justify-between mb-4">
										<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
											Edit: {state.selectedKey}
										</h2>
										<div className="flex items-center gap-2">
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													checked={selectedPage.enabled}
													onChange={(e) => updateSelectedPage({ enabled: e.target.checked })}
													className="sr-only peer"
												/>
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600"></div>
											</label>
											<button className="text-red-600 hover:text-red-700" onClick={deleteSelectedPage}>🗑️ Delete</button>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Title</label>
											<input
												type="text"
												value={selectedPage.title}
												onChange={(e) => updateSelectedPage({ title: e.target.value })}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
											/>
										</div>
										<div>
											<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Subtitle</label>
											<input
												type="text"
												value={selectedPage.subtitle}
												onChange={(e) => updateSelectedPage({ subtitle: e.target.value })}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
											/>
										</div>
										<div>
											<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">URL</label>
											<input
												type="text"
												value={selectedPage.url}
												disabled
												className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500"
											/>
										</div>
										<div>
											<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Theme</label>
											<select
												value={selectedPage.theme}
												onChange={(e) => updateSelectedPage({ theme: e.target.value })}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
											>
												<option value="default">Default</option>
												<option value="gallery">Gallery</option>
												<option value="video">Video</option>
												<option value="delivery">Delivery</option>
												<option value="embed">Embed</option>
												<option value="custom">Custom</option>
											</select>
										</div>
										<div className="md:col-span-2">
											<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Loading Text</label>
											<input
												type="text"
												value={selectedPage.loadingText}
												onChange={(e) => updateSelectedPage({ loadingText: e.target.value })}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
											/>
										</div>
									</div>
								</div>

								<div className="card">
									<div className="flex items-center justify-between mb-4">
										<h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Content</h3>
										<select
											value={selectedPage.content.type}
											onChange={(e) => updateSelectedContent({ type: e.target.value as PageContent['type'] })}
											className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
										>
											<option value="photos">Photos</option>
											<option value="embed">Embed</option>
											<option value="delivery">Delivery</option>
											<option value="custom">Custom</option>
										</select>
									</div>
									{renderContentEditor()}
								</div>

								<div className="card">
									<div className="flex items-center justify-between mb-3">
										<h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Preview</h3>
										<label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
											<input
												type="checkbox"
												checked={state.showPreviewUnlocked}
												onChange={(e) => setState((s) => ({ ...s, showPreviewUnlocked: e.target.checked }))}
											/>
											Show as unlocked
										</label>
									</div>
									<div className="space-y-4">
										<header className="text-center">
											<h4 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{selectedPage.title}</h4>
											<p className="text-gray-600 dark:text-gray-400">{selectedPage.subtitle}</p>
										</header>
										{selectedPage.content.type === 'photos' && selectedPage.content.items && (
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												{selectedPage.content.items.slice(0, 6).map((item, i) => (
													<div key={i} className="rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 aspect-video">
														{item.url ? (
															<img src={item.url} alt="" className="w-full h-full object-cover" />
														) : (
															<div className="h-full flex items-center justify-center text-gray-500 text-sm">Photo</div>
														)}
													</div>
												))}
											</div>
										)}
										{(selectedPage.content.type === 'embed' || selectedPage.content.type === 'custom') && (
											<EmbedContent embedUrl={selectedPage.content.embedUrl} title={selectedPage.title} />
										)}
										{selectedPage.content.type === 'delivery' && (
											<div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
												<div className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
													{selectedPage.content.status || 'Status'}
												</div>
												<div className="text-sm text-blue-800 dark:text-blue-300">
													{selectedPage.content.message || 'Your package details will appear here.'}
												</div>
											</div>
										)}
									</div>
								</div>
							</>
						) : (
							<div className="card">
								<p className="text-gray-600 dark:text-gray-400">Select a page to edit, or create a new one.</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
}


