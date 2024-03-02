import { useI18n } from 'vue-i18n'
import type { ValidationRuleWithoutParams, ValidationRuleWithParams, ValidationRule } from '@vuelidate/core'
import type { Ref } from 'vue-demi'
import {
  helpers,
  required as OrginalRequired,
  requiredIf as OrginalRequiredIf,
  requiredUnless as OrginalRequiredUnless,
  minLength as OrginalMinLength,
  maxLength as OrginalMaxLength,
  minValue as OrginalMinValue,
  maxValue as OrginalMaxValue,
  between as OrginalBetween,
  alpha as OrginalAlpha,
  alphaNum as OrginalAlphaNum,
  numeric as OrginalNumeric,
  integer as OrginalInteger,
  decimal as OrginalDecimal,
  email as OrginalEmail,
  ipAddress as OrginalIpAddress,
  macAddress as OrginalMacAddress,
  sameAs as OrginalSameAs,
  url as OrginalUrl,
  or as OrginalOr,
  and as OrginalAnd,
  not as OrginalNot,
} from '@vuelidate/validators'

// required
export const required: ValidationRuleWithoutParams = {
  $validator: OrginalRequired.$validator,
  $message: () => useI18n({ useScope: 'global' }).t('validation.required'),
}

// requiredIf
export function requiredIf(prop: boolean | string | (() => boolean | Promise<boolean>)): ValidationRuleWithParams {
  return helpers.withMessage(function () {
    return useI18n({ useScope: 'global' }).t('validation.required')
  }, OrginalRequiredIf(prop))
}

// requiredUnless
export function requiredUnless(prop: boolean | string | (() => boolean | Promise<boolean>)): ValidationRuleWithParams {
  return helpers.withMessage(function () {
    return useI18n({ useScope: 'global' }).t('validation.required')
  }, OrginalRequiredUnless(prop))
}

// minLength
export function minLength(length: number | Ref<number>): ValidationRuleWithParams {
  return helpers.withMessage(function () {
    return useI18n({ useScope: 'global' }).t('validation.min_length', { length })
  }, OrginalMinLength(length))
}

// maxLength
export function maxLength(length: number | Ref<number>): ValidationRuleWithParams {
  return helpers.withMessage(function () {
    return useI18n({ useScope: 'global' }).t('validation.max_length', { length })
  }, OrginalMaxLength(length))
}

// minValue
export function minValue(min: number | Ref<number> | string | Ref<string>): ValidationRuleWithParams {
  return helpers.withMessage(function () {
    return useI18n({ useScope: 'global' }).t('validation.min_value', { min })
  }, OrginalMinValue(min))
}

// maxValue
export function maxValue(max: number | Ref<number> | string | Ref<string>): ValidationRuleWithParams {
  return helpers.withMessage(function () {
    return useI18n({ useScope: 'global' }).t('validation.max_value', { max })
  }, OrginalMaxValue(max))
}

// between
export function between(min: number | Ref<number>, max: number | Ref<number>): ValidationRuleWithParams {
  return helpers.withMessage(function () {
    return useI18n({ useScope: 'global' }).t('validation.between', { min, max })
  }, OrginalBetween(min, max))
}

// alpha
export const alpha: ValidationRuleWithoutParams = {
  $validator: OrginalAlpha.$validator,
  $message: () => useI18n({ useScope: 'global' }).t('validation.alpha'),
}

// username
const usernameValidatorFn = (): any => {
  const regex = /^[a-zA-Z0-9[\]`!@#$%^&*()={}:;<>+'-]*$/
  return (value: string) => regex.test(value)
}
export const username: ValidationRuleWithoutParams = {
  $validator: usernameValidatorFn(),
  $message: () => useI18n({ useScope: 'global' }).t('validation.username'),
}

const usernameUpdateValidatorFn = (): any => {
  const regex = /^[A-Za-z0-9\u0621-\u064A][A-Za-z0-9\u0621-\u064A-_.]+$/
  return (value: string) => regex.test(value)
}

export const updateUserNameValidation: ValidationRuleWithoutParams = {
  $validator: usernameUpdateValidatorFn(),
  $message: () => useI18n({ useScope: 'global' }).t('validation.username'),
}

// alphaNum
export const alphaNum: ValidationRuleWithoutParams = {
  $validator: OrginalAlphaNum.$validator,
  $message: () => useI18n({ useScope: 'global' }).t('validation.alpha_num'),
}

// numeric
export const numeric: ValidationRuleWithoutParams = {
  $validator: OrginalNumeric.$validator,
  $message: () => useI18n({ useScope: 'global' }).t('validation.numeric'),
}

// integer
export const integer: ValidationRuleWithoutParams = {
  $validator: OrginalInteger.$validator,
  $message: () => useI18n({ useScope: 'global' }).t('validation.integer'),
}

// decimal
export const decimal: ValidationRuleWithoutParams = {
  $validator: OrginalDecimal.$validator,
  $message: () => useI18n({ useScope: 'global' }).t('validation.decimal'),
}

// email
export const email: ValidationRuleWithoutParams = {
  $validator: OrginalEmail.$validator,
  $message: () => useI18n({ useScope: 'global' }).t('validation.email'),
}

// ipAddress
export const ipAddress: ValidationRuleWithoutParams = {
  $validator: OrginalIpAddress.$validator,
  $message: () => useI18n({ useScope: 'global' }).t('validation.ip_address'),
}

// macAddress
export function macAddress(separator: string | Ref<string>): ValidationRuleWithParams {
  return helpers.withMessage(function () {
    return useI18n({ useScope: 'global' }).t('validation.mac_address')
  }, OrginalMacAddress(separator))
}

// sameAs
export function sameAs<E = unknown>(equalTo: E, otherName?: string): ValidationRuleWithParams {
  const other = otherName !== undefined ? otherName : 'other'
  return helpers.withMessage(function () {
    return useI18n({ useScope: 'global' }).t('validation.same_as', { other })
  }, OrginalSameAs(equalTo, otherName))
}

// url
export const url: ValidationRuleWithoutParams = {
  $validator: OrginalUrl.$validator,
  $message: () => useI18n({ useScope: 'global' }).t('validation.url'),
}

// or
export function or(...validators: ValidationRule[]): ValidationRuleWithParams {
  return helpers.withMessage(function () {
    return useI18n({ useScope: 'global' }).t('validation.or')
  }, OrginalOr(...validators))
}

// and
export function and(...validators: ValidationRule[]): ValidationRuleWithParams {
  return helpers.withMessage(function () {
    return useI18n({ useScope: 'global' }).t('validation.and')
  }, OrginalAnd(...validators))
}

// not
export function not(validator: ValidationRule): ValidationRuleWithParams {
  return helpers.withMessage(function () {
    return useI18n({ useScope: 'global' }).t('validation.not')
  }, OrginalNot(validator))
}

// Phone
export const phone: ValidationRuleWithoutParams = {
  $validator: helpers.regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/),
  $message: () => useI18n({ useScope: 'global' }).t('validation.phone'),
}

// E.164 Phone
export const e164Phone: ValidationRuleWithoutParams = {
  $validator: helpers.regex(/^\+[1-9]\d{1,14}$/),
  $message: () => useI18n({ useScope: 'global' }).t('validation.e164_phone'),
}

// Domain
export const domain: ValidationRuleWithoutParams = {
  $validator: helpers.regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/),
  $message: () => useI18n({ useScope: 'global' }).t('validation.domain'),
}

// Match
export function match(pattern: number | Ref<number> | RegExp): ValidationRuleWithParams {
  return helpers.withMessage(function () {
    return useI18n({ useScope: 'global' }).t('validation.match')
  }, helpers.regex(pattern))
}
