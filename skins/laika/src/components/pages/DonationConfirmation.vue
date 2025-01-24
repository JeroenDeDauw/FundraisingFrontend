<template>
	<div class="donation-confirmation">
		<div class="donation-summary-wrapper has-background-bright columns has-padding-18">
			<div class="column is-half">
				<donation-summary :address="address" :address-type="addressType"
								:payment="confirmationData.donation">
					<div class="title is-size-5">{{ $t( 'donation_confirmation_topbox_intro' ) }}</div>
				</donation-summary>
				<b-button v-if="showAddressChangeButton"
							id="address-change-button"
							class="address-change-button"
							@click="showAddressModal()"
							type="is-primary is-main">
					{{ $t('donation_confirmation_address_update_button') }}
				</b-button>
				<b-modal :active.sync="isAddressModalOpen" scroll="keep" class="address-modal" has-modal-card>
					<address-modal :countries="countries"
									:donation="confirmationData.donation"
									:updateDonorUrl="updateDonorUrl"
									:validate-address-url="validateAddressUrl"
									:validate-email-url="validateEmailUrl"
									:has-errored="addressChangeHasErrored"
									:has-succeeded="addressChangeHasSucceeded"
									v-on:address-update-failed="addressChangeHasErrored = true"
									v-on:address-updated="updateAddress( $event )">
					</address-modal>
				</b-modal>
				<payment-notice :payment="confirmationData.donation"></payment-notice>
				<div id="bank-data" v-if="showBankTransferCode">
					<bank-data :bank-transfer-code="confirmationData.donation.bankTransferCode"></bank-data>
					<div class="has-margin-top-18"
						v-html="$t( 'donation_confirmation_reminder_bank_transfer', { bankTransferCode: confirmationData.donation.bankTransferCode } )">
					</div>
				</div>
				<div id="newsletter-optin" class="has-margin-top-18" v-if="hasOptedIntoNewsletter">
					{{ $t( 'donation_confirmation_newsletter_confirmation' ) }}
				</div>
			</div>

			<div class="column is-half">
				<summary-links :confirmation-data="confirmationData"/>
			</div>
		</div>
		<membership-info :confirmation-data="confirmationData"></membership-info>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import BankData from '@/components/BankData.vue';
import DonationSummary from '@/components/DonationSummary.vue';
import MembershipInfo from '@/components/pages/donation_confirmation/MembershipInfo.vue';
import PaymentNotice from '@/components/pages/donation_confirmation/PaymentNotice.vue';
import SummaryLinks from '@/components/pages/donation_confirmation/SummaryLinks.vue';
import { AddressTypeModel, addressTypeName } from '@/view_models/AddressTypeModel';
import AddressModal, { SubmittedAddress } from '@/components/pages/donation_confirmation/AddressModal.vue';

export default Vue.extend( {
	name: 'DonationConfirmation',
	components: {
		BankData,
		DonationSummary,
		MembershipInfo,
		PaymentNotice,
		SummaryLinks,
		AddressModal,
	},
	data: function () {
		return {
			isAddressModalOpen: false,
			addressChangeHasErrored: false,
			addressChangeHasSucceeded: false,
			address: this.$props.confirmationData.address,
			addressType: this.$props.confirmationData.addressType,
		};
	},
	props: {
		confirmationData: Object,
		updateDonorUrl: String,
		validateAddressUrl: String,
		validateEmailUrl: String,
		countries: Array as () => Array<String>,
	},
	methods: {
		showAddressModal: function () {
			this.$data.isAddressModalOpen = true;
		},
		updateAddress: function ( submittedAddress: SubmittedAddress ) {
			this.$data.addressChangeHasSucceeded = true;
			this.$data.address = submittedAddress.addressData;
			this.$data.addressType = submittedAddress.addressType;
		},
	},
	computed: {
		showBankTransferCode: function () {
			return this.confirmationData.donation.paymentType === 'UEB';
		},
		hasOptedIntoNewsletter: function () {
			return this.confirmationData.donation.optsIntoNewsletter;
		},
		showAddressChangeButton: function () {
			return this.confirmationData.addressType === addressTypeName( AddressTypeModel.ANON ) &&
					!this.$data.addressChangeHasErrored && !this.$data.addressChangeHasSucceeded;
		},
	},
} );
</script>

<style lang="scss">
	@import "../../scss/custom";

	.donation {
		&-summary {
			&-wrapper {
				border: 1px solid $fun-color-gray-mid;
				border-radius: 2px;

				.address-change-button {
					width: 100%;
					white-space: normal;
				}
			}

			.bank-data-content {
				p {
					line-height: 2em;
				}
			}
		}
	}
</style>
