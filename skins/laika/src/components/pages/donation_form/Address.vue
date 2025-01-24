<template>
	<div class="address-section">
		<payment-bank-data v-if="isDirectDebit" :validateBankDataUrl="validateBankDataUrl" :validateLegacyBankDataUrl="validateLegacyBankDataUrl"></payment-bank-data>
		<feature-toggle>
			<two-step-address-type
					slot="campaigns.anon_form_display.two_steps"
					v-on:address-type="setAddressType( $event )"
					:disabledAddressTypes="disabledAddressTypes"
			></two-step-address-type>

			<two-step-fixed-disclaimer-address-type
					slot="campaigns.anon_form_display.two_steps_fixed_disclaimer"
					v-on:address-type="setAddressType( $event )"
					:disabledAddressTypes="disabledAddressTypes"
			></two-step-fixed-disclaimer-address-type>

			<address-type
					slot="campaigns.anon_form_display.address_type"
					v-on:address-type="setAddressType( $event )"
					:disabledAddressTypes="disabledAddressTypes"
			></address-type>
			<div
					slot="campaigns.anon_form_display.address_type"
					class="has-margin-top-18"
					v-show="!addressTypeIsNotAnon">{{ $t( 'donation_addresstype_option_anonymous_disclaimer' ) }}</div>
		</feature-toggle>
		<name v-if="addressTypeIsNotAnon" :show-error="fieldErrors" :form-data="formData" :address-type="addressType" v-on:field-changed="onFieldChange"></name>
		<postal v-if="addressTypeIsNotAnon" :show-error="fieldErrors" :form-data="formData" :countries="countries" v-on:field-changed="onFieldChange"></postal>
		<receipt-opt-out v-if="addressTypeIsNotAnon" v-on:opted-out="setReceiptOptedOut( $event )"/>
		<email v-if="addressTypeIsNotAnon" :show-error="fieldErrors.email" :form-data="formData" v-on:field-changed="onFieldChange"></email>
		<newsletter-opt-in v-if="addressTypeIsNotAnon"></newsletter-opt-in>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import AddressType from '@/components/pages/donation_form/AddressType.vue';
import Name from '@/components/shared/Name.vue';
import Postal from '@/components/shared/Postal.vue';
import ReceiptOptOut from '@/components/shared/ReceiptOptOut.vue';
import Email from '@/components/shared/Email.vue';
import NewsletterOptIn from '@/components/pages/donation_form/NewsletterOptIn.vue';
import { mapGetters } from 'vuex';
import { AddressValidity, AddressFormData, ValidationResult } from '@/view_models/Address';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { Validity } from '@/view_models/Validity';
import { NS_ADDRESS } from '@/store/namespaces';
import { setAddressField, validateAddress, validateEmail, setReceiptOptOut, setAddressType } from '@/store/address/actionTypes';
import { action } from '@/store/util';
import PaymentBankData from '@/components/shared/PaymentBankData.vue';
import TwoStepAddressType from '@/components/pages/donation_form/TwoStepAddressType.vue';
import TwoStepFixedDisclaimerAddressType from '@/components/pages/donation_form/TwoStepFixedDisclaimerAddressType.vue';
import { mergeValidationResults } from '@/merge_validation_results';

export default Vue.extend( {
	name: 'Address',
	components: {
		Name,
		Postal,
		AddressType,
		TwoStepAddressType,
		TwoStepFixedDisclaimerAddressType,
		ReceiptOptOut,
		Email,
		NewsletterOptIn,
		PaymentBankData,
	},
	data: function (): { formData: AddressFormData } {
		return {
			formData: {
				salutation: {
					name: 'salutation',
					value: '',
					pattern: '^(Herr|Frau)$',
					optionalField: false,
				},
				title: {
					name: 'title',
					value: '',
					pattern: '',
					optionalField: true,
				},
				companyName: {
					name: 'companyName',
					value: '',
					pattern: '^.+$',
					optionalField: false,
				},
				firstName: {
					name: 'firstName',
					value: '',
					pattern: '^.+$',
					optionalField: false,
				},
				lastName: {
					name: 'lastName',
					value: '',
					pattern: '^.+$',
					optionalField: false,
				},
				street: {
					name: 'street',
					value: '',
					pattern: '^.+$',
					optionalField: false,
				},
				city: {
					name: 'city',
					value: '',
					pattern: '^.+$',
					optionalField: false,
				},
				postcode: {
					name: 'postcode',
					value: '',
					pattern: '^[0-9]{4,5}$',
					optionalField: false,
				},
				country: {
					name: 'country',
					value: 'DE',
					pattern: '',
					optionalField: false,
				},
				email: {
					name: 'email',
					value: '',
					pattern: '^(.+)@(.+)\\.(.+)$',
					optionalField: false,
				},
			},
		};
	},
	props: {
		validateAddressUrl: String,
		validateEmailUrl: String,
		validateBankDataUrl: String,
		validateLegacyBankDataUrl: String,
		countries: Array as () => Array<String>,
	},
	computed: {
		fieldErrors: {
			get: function (): AddressValidity {
				return Object.keys( this.formData ).reduce( ( validity: AddressValidity, fieldName: string ) => {
					if ( !this.formData[ fieldName ].optionalField ) {
						validity[ fieldName ] = this.$store.state.address.validity[ fieldName ] === Validity.INVALID;
					}
					return validity;
				}, ( {} as AddressValidity ) );
			},
		},
		isDirectDebit: {
			get: function (): boolean {
				return this.$store.getters[ 'payment/isDirectDebitPayment' ];
			},
		},
		disabledAddressTypes: {
			get: function (): Array<AddressTypeModel> {
				return this.$store.getters[ 'payment/isDirectDebitPayment' ] ? [ AddressTypeModel.ANON ] : [];
			},
		},
		...mapGetters( NS_ADDRESS, [
			'addressType',
			'addressTypeIsNotAnon',
		] ),
	},
	methods: {
		validateForm(): Promise<ValidationResult> {
			return Promise.all( [
				this.$store.dispatch( action( NS_ADDRESS, validateAddress ), this.$props.validateAddressUrl ),
				this.$store.dispatch( action( NS_ADDRESS, validateEmail ), this.$props.validateEmailUrl ),
			] ).then( mergeValidationResults );
		},
		onFieldChange( fieldName: string ): void {
			this.$store.dispatch( action( NS_ADDRESS, setAddressField ), this.$data.formData[ fieldName ] );
		},
		setReceiptOptedOut( optedOut: boolean ): void {
			this.$store.dispatch( action( NS_ADDRESS, setReceiptOptOut ), optedOut );
		},
		setAddressType( addressType: AddressTypeModel ): void {
			this.$store.dispatch( action( NS_ADDRESS, setAddressType ), addressType );
		},
	},
} );
</script>
