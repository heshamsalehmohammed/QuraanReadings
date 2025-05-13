class RouterSingleton {
	static router: any;

	static setRouter(value: any) {
		RouterSingleton.router = value;
	}
	static getRouter() {
		if (!RouterSingleton.router)
			return () => {
				console.error('router is Undefined');
			};

		return RouterSingleton.router;
	}
}
export default RouterSingleton;
