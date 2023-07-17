

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.449cec79.js","_app/immutable/chunks/scheduler.8a724f99.js","_app/immutable/chunks/index.e0bf81a0.js","_app/immutable/chunks/index.b7823b24.js"];
export const stylesheets = ["_app/immutable/assets/2.af87a552.css"];
export const fonts = [];
