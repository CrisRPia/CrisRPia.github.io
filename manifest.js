export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.95a6981e.js","app":"_app/immutable/entry/app.e047a02b.js","imports":["_app/immutable/entry/start.95a6981e.js","_app/immutable/chunks/scheduler.8a724f99.js","_app/immutable/chunks/singletons.411d8fff.js","_app/immutable/chunks/index.b7823b24.js","_app/immutable/entry/app.e047a02b.js","_app/immutable/chunks/scheduler.8a724f99.js","_app/immutable/chunks/index.e0bf81a0.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
