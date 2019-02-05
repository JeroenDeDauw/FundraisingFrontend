export interface FormValidity {
	dataEntered: boolean,
	isValid: boolean | null
}

export interface Form {
	[key: string]: FormValidity
}

export interface AddressState {
	isValidating: boolean
	form: Form,
}

export interface ValidationResult {
	status: string,
	messages: object
}

export interface Helper {
	inputIsValid(value: string, pattern: string): boolean
}

export interface InputField {
	name: string,
	value: string,
	pattern: string,
	optionalField: boolean
}

export interface FormData {
    [key: string]: InputField
}

export interface Payload {
    transport: JQueryTransport,
	validateAddressURL: String,
	formData: FormData
}

export interface PostData {
    [key: string]: string
}

export interface JQueryTransport {
    getData: Function
    postData: Function
}