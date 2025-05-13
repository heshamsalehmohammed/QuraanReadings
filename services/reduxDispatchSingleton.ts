class ReduxDispatchSingleton {
	static Dispatch: any;

	static setDispatch(value: any) {
		ReduxDispatchSingleton.Dispatch = value;
	}

	static getDispatch() {
		if (!ReduxDispatchSingleton.Dispatch)
			return () => {
				console.error('Dispatcher is Undefined');
			};
		return ReduxDispatchSingleton.Dispatch;
	}
}

export default ReduxDispatchSingleton;
