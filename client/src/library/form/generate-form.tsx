import React from 'react';
import { Form, type FormInstance } from 'antd';
import type { TFunction } from 'i18next';

import { EFormRuleType, EFormType } from '@/enums';
import { IForm } from '@/types';
import { generateInput } from './generate-input';

export const generateForm = ({
  item,
  index,
  showLabel = true,
  name,
  values,
  form,
  t,
  widthLabel,
  formatDate,
}: {
  item: IForm;
  index: number;
  showLabel?: boolean;
  name?: string;
  values: any;
  form: FormInstance;
  t: TFunction<'locale', 'library'>;
  widthLabel?: string;
  formatDate: string;
}): any => {
  if (!!item?.formItem?.condition && !item?.formItem?.condition({ value: values[item.name], form, index, values }))
    return;
  if (item?.formItem?.render) return item?.formItem?.render(form, values, generateForm, index);
  if (item.formItem) {
    const rules: any = [];
    if (!item.formItem.type) item.formItem.type = EFormType.text;

    if (item.formItem.rules) {
      item.formItem.rules
        .filter(item => !!item)
        .map(rule => {
          if (item.formItem) {
            switch (rule.type) {
              case EFormRuleType.required:
                if (
                  item.formItem.type &&
                  [
                    EFormType.text,
                    EFormType.name,
                    EFormType.number,
                    EFormType.hidden,
                    EFormType.password,
                    EFormType.textarea,
                  ].includes(item.formItem.type)
                ) {
                  rules.push({
                    required: true,
                    whitespace: true,
                    message: t(rule.message ?? 'Please enter', {
                      title: item.title.toLowerCase(),
                    }),
                  });
                } else {
                  rules.push({
                    required: true,
                    message: t(
                      rule.message ?? (item.formItem.type !== EFormType.otp ? 'Please choose' : 'Please enter'),
                      { title: item.title.toLowerCase() },
                    ),
                  });
                }
                break;
              case EFormRuleType.email:
                rules.push(() => ({
                  validator(_: any, value: any) {
                    const regexEmail =
                      /^(([^<>()[\]\\.,;:$%^&*\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!value || (typeof value === 'string' && regexEmail.test(value.trim())))
                      return Promise.resolve();
                    else if (
                      typeof value === 'object' &&
                      value.length > 0 &&
                      value.filter((item: any) => !regexEmail.test(item)).length === 0
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t(rule.message ?? 'Please enter a valid email address!')));
                  },
                }));
                break;
              case EFormRuleType.phone:
                rules.push(() => ({
                  validator(_: any, value: any) {
                    if (!value) return Promise.resolve();
                    else if (/^\d+$/.test(value)) {
                      if (value?.trim().length < 10)
                        return Promise.reject(new Error(t('Please enter at least characters!', { min: 10 })));
                      else if (value?.trim().length > 12)
                        return Promise.reject(new Error(t('Please enter maximum characters!', { max: 12 })));
                      else return Promise.resolve();
                    } else return Promise.reject(new Error(t('Please enter only number!')));
                  },
                }));
                break;
              case EFormRuleType.min:
                if (item.formItem.type === EFormType.number)
                  rules.push(() => ({
                    validator(_: any, value: any) {
                      if (!value || (/^0$|^-?[1-9]\d*(\.\d+)?$/.test(value) && parseFloat(value) < rule.value)) {
                        return Promise.reject(
                          new Error(t(rule.message ?? 'Please enter minimum number!', { min: rule.value })),
                        );
                      }
                      return Promise.resolve();
                    },
                  }));
                else {
                  if (!rule.message) {
                    if (item.formItem.type) {
                      rule.message = t('Please enter at least number characters!', { min: rule.value });
                    } else {
                      rule.message = t('Please enter minimum number!', { min: rule.value });
                    }
                  }
                  rules.push({
                    type: item.formItem.type,
                    min: rule.value,
                    message: rule.message,
                  });
                }
                break;
              case EFormRuleType.max:
                if (item.formItem.type === EFormType.number)
                  rules.push(() => ({
                    validator(_: any, value: any) {
                      if (!value || (/^0$|^-?[1-9]\d*(\.\d+)?$/.test(value) && parseFloat(value) > rule.value)) {
                        return Promise.reject(
                          new Error(t(rule.message ?? 'Please enter maximum number!', { max: rule.value })),
                        );
                      }
                      return Promise.resolve();
                    },
                  }));
                else {
                  if (!rule.message) {
                    if (item.formItem.type === EFormType.onlyNumber) {
                      rule.message = t('Please enter maximum number characters!', { max: rule.value });
                    } else {
                      rule.message = t('Please enter maximum number!', { max: rule.value });
                    }
                  }
                  rules.push({
                    type: item.formItem.type,
                    max: rule.value,
                    message: rule.message,
                  });
                }
                break;
              case EFormRuleType.url:
                rules.push({
                  type: 'url',
                  message: t(rule.message ?? 'Incorrect path format'),
                });
                break;
              case EFormRuleType.onlyText:
                rules.push(() => ({
                  validator(_: any, value: any) {
                    if (!value || /^[A-Za-z]+$/.test(value)) return Promise.resolve();
                    return Promise.reject(new Error(t(rule.message ?? 'Please enter only text!')));
                  },
                }));
                break;
              case EFormRuleType.onlyTextSpace:
                rules.push(() => ({
                  validator(_: any, value: any) {
                    if (!value || /^[a-zA-Z ]+$/.test(value)) return Promise.resolve();
                    return Promise.reject(new Error(t(rule.message ?? 'Please enter only text!')));
                  },
                }));
                break;
              case EFormRuleType.textarea:
                rules.push(() => ({
                  validator(_: any, value: any) {
                    if (value?.trim().length > 500) {
                      return Promise.reject(
                        new Error(t(rule.message ?? 'Please enter maximum characters!', { max: 500 })),
                      );
                    }
                    return Promise.resolve();
                  },
                }));
                break;
              case EFormRuleType.custom:
                rules.push(rule.validator);
                break;
              default:
            }
          }
          return rule;
        });
    }
    if (!item.formItem.notDefaultValid)
      switch (item.formItem.type) {
        case EFormType.number:
          rules.push(() => ({
            validator(_: any, value: any) {
              if (!value || (/^-?[1-9]*\d+(\.\d{1,2})?$/.test(value) && parseInt(value) < 1000000000))
                return Promise.resolve();
              return Promise.reject(new Error(t('Please enter only number!')));
            },
          }));
          break;
        case EFormType.name:
          rules.push(() => ({
            validator(_: any, value: any) {
              if (!value || /^[A-Za-zÀ-Ỹà-ỹ]+[A-Za-zÀ-Ỹà-ỹ\s-]*$/u.test(value)) return Promise.resolve();
              return Promise.reject(new Error(t('Please enter only text!')));
            },
          }));
          break;
        case EFormType.password:
          rules.push(() => ({
            validator: async (_: any, value: any) => {
              if (value) {
                let min = 8;
                rules.forEach((item: any) => item.min && (min = item.min));
                if (value.trim().length < min)
                  return Promise.reject(Error(t('Please enter at least characters!', { min })));
              } else return Promise.resolve();
            },
          }));
          break;
        case EFormType.onlyNumber:
          rules.push(() => ({
            validator(_: any, value: any) {
              if (!value || /^[0-9]+$/.test(value)) return Promise.resolve();
              return Promise.reject(new Error(t('Please enter only number!')));
            },
          }));
          break;
        case EFormType.otp:
          rules.push(() => ({
            validator(_: any, value: any) {
              if (value && value.length < (item.formItem?.maxLength || 5)) {
                return Promise.reject(
                  new Error(t('Please enter at least characters!', { min: item.formItem?.maxLength || 5 })),
                );
              }
              return Promise.resolve();
            },
          }));
          break;
        default:
      }

    const otherProps: any = {
      key: index,
      label: showLabel && item.title,
      name: name ?? item.name,
      labelAlign: 'left',
      validateTrigger: 'onBlur',
    };
    if (rules.length) otherProps.rules = rules;
    if (widthLabel) otherProps.labelCol = { flex: widthLabel };

    switch (item.formItem.type) {
      case EFormType.switch:
      case EFormType.checkbox:
        otherProps.valuePropName = 'checked';
        break;
      case EFormType.hidden:
        otherProps.hidden = true;
        break;
      case EFormType.select:
      case EFormType.upload:
      case EFormType.otp:
        otherProps.validateTrigger = 'onChange';
        break;
      default:
    }

    delete otherProps.key;
    return item.formItem.type !== EFormType.addable ? (
      <Form.Item {...otherProps}>
        {generateInput({
          item,
          values,
          name: otherProps.name,
          formatDate: formatDate,
          form,
          generateForm,
          t,
        })}
      </Form.Item>
    ) : (
      generateInput({ item, values, name: otherProps.name, formatDate: formatDate, form, generateForm, t })
    );
  }
  return null;
};
