

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.7142b59e.js","_app/immutable/chunks/scheduler.8a724f99.js","_app/immutable/chunks/index.e0bf81a0.js"];
export const stylesheets = [];
export const fonts = [];
