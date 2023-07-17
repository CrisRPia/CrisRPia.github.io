

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.4152922e.js","_app/immutable/chunks/scheduler.8a724f99.js","_app/immutable/chunks/index.e0bf81a0.js","_app/immutable/chunks/singletons.411d8fff.js","_app/immutable/chunks/index.b7823b24.js"];
export const stylesheets = [];
export const fonts = [];
