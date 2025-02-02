import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import createAddress from '@/store/address';
import { NS_ADDRESS } from './namespaces';
import { REQUIRED_FIELDS_ADDRESS_UPDATE } from '@/store/address/constants';

Vue.use( Vuex );

export function createStore() {
	const storeBundle: StoreOptions<any> = {
		modules: {
			[ NS_ADDRESS ]: createAddress( REQUIRED_FIELDS_ADDRESS_UPDATE ),
		},
		strict: process.env.NODE_ENV !== 'production',
		getters: {
			isValidating: function ( state ): boolean {
				return state[ NS_ADDRESS ].isValidating;
			},
		},
	};

	return new Vuex.Store<any>( storeBundle );
}
