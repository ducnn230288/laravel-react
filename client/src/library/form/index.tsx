import React, { useEffect, useRef } from 'react';
import {
  Checkbox,
  DatePicker as DateAntDesign,
  Form as AntForm,
  FormInstance,
  Radio,
  Slider,
  Switch,
  TimePicker,
  Spin,
  Input,
} from 'antd';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import dayjs from 'dayjs';

import { Check, Times } from '@/assets/svg';
import { EFormRuleType, EFormType } from '@/enums';
import { IFormItem, IForm } from '@/interfaces';
import { SGlobal } from '@/services';
import { convertFormValue } from '@/utils';

import {
  Addable,
  Cascader,
  Chips,
  Editor,
  DatePicker,
  Mask,
  Password,
  Select,
  SelectTable,
  SelectTag,
  Tab,
  TableTransfer,
  TreeSelect,
} from './input';
import { Upload } from '../upload';
import { Button } from '../button';

export const Form = ({
  className,
  columns,
  textSubmit,
  textCancel,
  handSubmit,
  handCancel,
  values = {},
  widthLabel,
  checkHidden = false,
  extendForm,
  extendButton,
  idSubmit = 'idSubmit',
  disableSubmit = false,
  spinning = false,
  formAnt,
}: Type) => {
  const refLoad = useRef(true);
  const reRender = () => {
    refLoad.current = false;
  };

  const [forms] = AntForm.useForm();
  const form = formAnt || forms;
  useEffect(() => {
    if (form && refLoad.current) {
      form.resetFields();
      form.setFieldsValue(convertFormValue(columns, values, false));
    }
    refLoad.current = true;
  }, [values]);

  const { t } = useTranslation('locale', { keyPrefix: 'library' });
  const sGlobal = SGlobal();
  const generateInput = (formItem: IFormItem, item: IForm, values: any, name: string) => {
    switch (formItem.type) {
      case EFormType.hidden:
        return <input type={'hidden'} name={item.name} tabIndex={-1} />;
      case EFormType.tab:
        return <Tab name={item.name} generateForm={generateForm} column={formItem.column} list={formItem.list} />;
      case EFormType.addable:
        return (
          <Addable
            name={item.name}
            column={formItem.column}
            textAdd={formItem.textAdd}
            onAdd={formItem.onAdd}
            isTable={formItem.isTable}
            showRemove={formItem.showRemove}
            idCheck={formItem.idCheck}
            generateForm={generateForm}
            form={form}
          />
        );
      case EFormType.editor:
        return <Editor placeholder={t(formItem.placeholder ?? 'Enter', { title: item.title.toLowerCase() })} />;
      case EFormType.upload:
        return <Upload multiple={!!formItem.mode} />;
      case EFormType.tableTransfer:
        return <TableTransfer formItem={formItem} form={form} />;
      case EFormType.password:
        return (
          <Password
            placeholder={t(formItem.placeholder ?? 'Enter', { title: item.title.toLowerCase() })}
            disabled={formItem.disabled?.(values, form)}
          />
        );
      case EFormType.textarea:
        return (
          <textarea
            disabled={formItem.disabled?.(values, form)}
            className={classNames('ant-input', {
              disabled: formItem.disabled?.(values, form),
            })}
            rows={4}
            maxLength={1000}
            placeholder={t(formItem.placeholder ?? 'Enter', { title: item.title.toLowerCase() })}
            onChange={(e) => formItem.onChange?.(e.target.value, form, reRender)}
          />
        );
      case EFormType.slider:
        return (
          <Slider
            tooltip={{ formatter: (value = 0) => formItem?.sliderMarks?.[value] }}
            max={formItem.max ? formItem.max : 100}
            min={formItem.min ? formItem.min : 0}
            marks={formItem.sliderMarks}
          />
        );
      case EFormType.sliderNumber:
        return (
          <Slider
            range
            tooltip={{
              formatter: (value) =>
                (value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0') +
                (formItem.symbol ? formItem.symbol : ''),
            }}
            max={formItem.max ? formItem.max : 9999999}
          />
        );
      case EFormType.date:
        return (
          <DatePicker
            format={
              !formItem.picker || formItem.picker === 'date'
                ? sGlobal.formatDate + (formItem.showTime ? ' HH:mm' : '')
                : sGlobal.formatDate
            }
            onChange={(date: any) => formItem.onChange?.(date, form, reRender)}
            disabledDate={(current: any) => (formItem.disabledDate ? formItem.disabledDate(current, form) : false)}
            showTime={!!formItem.showTime}
            picker={formItem.picker ?? 'date'}
            disabled={formItem.disabled?.(values, form)}
            form={form}
            name={item.name}
            placeholder={t(formItem.placeholder ?? 'Choose', { title: item.title.toLowerCase() })}
          />
        );
      case EFormType.dateRange:
        return (
          <DateAntDesign.RangePicker
            onCalendarChange={(date) => {
              form.setFieldValue(
                item.name,
                date?.filter((i) => !!i),
              );
              formItem.onChange?.(
                date?.filter((i) => !!i),
                form,
                reRender,
              );
            }}
            onOpenChange={(open) => {
              if (!open && form.getFieldValue(item.name)?.length < 2) form.resetFields([item.name]);
            }}
            format={sGlobal.formatDate + (formItem.showTime ? ' HH:mm' : '')}
            disabledDate={(current) => (formItem.disabledDate ? formItem.disabledDate(current, form) : false)}
            defaultValue={
              formItem.initialValues && [dayjs(formItem.initialValues.start), dayjs(formItem.initialValues.end)]
            }
            showTime={formItem.showTime}
            disabled={formItem.disabled?.(values, form)}
          />
        );
      case EFormType.time:
        return (
          <TimePicker
            minuteStep={10}
            format={'HH:mm'}
            onChange={(date: any) => formItem.onChange?.(date, form, reRender)}
            disabledDate={(current: any) => (formItem.disabledDate ? formItem.disabledDate(current, form) : false)}
            disabled={formItem.disabled?.(values, form)}
            name={item.name}
            placeholder={t(formItem.placeholder ?? 'Choose', { title: item.title.toLowerCase() })}
          />
        );
      case EFormType.timeRange:
        return (
          <TimePicker.RangePicker
            minuteStep={10}
            onCalendarChange={(date) => {
              form.setFieldValue(
                item.name,
                date?.filter((i) => !!i),
              );
              formItem.onChange?.(
                date?.filter((i) => !!i),
                form,
                reRender,
              );
            }}
            onOpenChange={(open) => {
              if (!open && form.getFieldValue(item.name)?.length < 2) form.resetFields([item.name]);
            }}
            format={'HH:mm'}
            disabledDate={(current) => (formItem.disabledDate ? formItem.disabledDate(current, form) : false)}
            defaultValue={
              formItem.initialValues && [dayjs(formItem.initialValues.start), dayjs(formItem.initialValues.end)]
            }
            disabled={formItem.disabled?.(values, form)}
          />
        );
      case EFormType.checkbox:
        return formItem.list ? (
          <Checkbox.Group
            options={formItem.list}
            onChange={(value) => formItem.onChange?.(value, form, reRender)}
            disabled={formItem.disabled?.(values, form)}
          />
        ) : (
          <Checkbox
            onChange={(value) => formItem.onChange?.(value.target.checked, form, reRender)}
            disabled={formItem.disabled?.(values, form)}
          >
            {formItem.label}
          </Checkbox>
        );
      case EFormType.radio:
        return (
          <Radio.Group
            options={formItem.list}
            optionType={'button'}
            disabled={formItem.disabled?.(values, form)}
            onChange={({ target }) => formItem.onChange?.(target.value, form, reRender)}
          />
        );
      case EFormType.tag:
        return (
          <SelectTag
            maxTagCount={formItem.maxTagCount ?? 'responsive'}
            placeholder={t(formItem.placeholder ?? 'Choose', { title: item.title.toLowerCase() })}
            tag={formItem.tag}
            form={form}
            disabled={formItem.disabled?.(values, form)}
          />
        );
      case EFormType.chips:
        return (
          <Chips
            placeholder={t(formItem.placeholder ?? 'Enter', { title: item.title.toLowerCase() })}
            disabled={formItem.disabled?.(values, form)}
            list={formItem.list}
          />
        );
      case EFormType.select:
        return (
          <Select
            showSearch={formItem.showSearch}
            maxTagCount={formItem.maxTagCount ?? 'responsive'}
            onChange={(value: any) => formItem.onChange?.(value, form, reRender)}
            placeholder={t(formItem.placeholder ?? 'Choose', { title: item.title.toLowerCase() })}
            form={form}
            disabled={formItem.disabled?.(values, form)}
            get={formItem.get}
            list={formItem.list}
            mode={formItem.mode}
          />
        );
      case EFormType.selectTable:
        return (
          <SelectTable
            onChange={(value: any) => formItem.onChange?.(value, form, reRender)}
            placeholder={t(formItem.placeholder ?? 'Choose', { title: item.title.toLowerCase() })}
            disabled={formItem.disabled?.(values, form)}
            mode={formItem.mode}
            get={formItem.get}
          />
        );
      case EFormType.treeSelect:
        return (
          <TreeSelect
            formItem={formItem}
            showSearch={formItem.showSearch}
            form={form}
            disabled={formItem.disabled?.(values, form)}
            placeholder={t(formItem.placeholder ?? 'Choose', { title: item.title.toLowerCase() })}
          />
        );
      case EFormType.cascader:
        return (
          <Cascader
            formItem={formItem}
            showSearch={formItem.showSearch}
            form={form}
            disabled={formItem.disabled?.(values, form)}
            placeholder={t(formItem.placeholder ?? 'Choose', { title: item.title.toLowerCase() })}
          />
        );
      case EFormType.switch:
        return (
          <Switch
            checkedChildren={<Check className="size-5 fill-white" />}
            unCheckedChildren={<Times className="size-5 fill-white" />}
            defaultChecked={!!values && values[item.name || ''] === 1}
            onChange={(e) => formItem.onChange?.(e, form, reRender)}
          />
        );
      case EFormType.otp:
        return <Input.OTP length={formItem.maxLength ?? 5} />;
      default:
        return (
          <Mask
            list={formItem.list}
            form={form}
            mask={formItem.mask}
            addonBefore={formItem.addonBefore}
            addonAfter={formItem.addonAfter}
            placeholder={t(formItem.placeholder ?? 'Enter', { title: item.title.toLowerCase() })}
            onBlur={(e: any) => formItem.onBlur?.(e.target.value, form, name)}
            onChange={(e: any) => formItem.onChange?.(e.target.value, form, reRender)}
            disabled={formItem.disabled?.(values, form)}
          />
        );
    }
  };
  const generateForm = (item: any, index: number, showLabel = true, name?: string) => {
    if (!!item?.formItem?.condition && !item?.formItem?.condition(values[item.name], form, index, values)) return;
    if (item?.formItem?.render) return item?.formItem?.render(form, values, generateForm, index, reRender);
    if (item.formItem) {
      const rules: any = [];
      if (!item.formItem.type) item.formItem.type = EFormType.text;

      if (item.formItem.rules) {
        item.formItem.rules
          .filter((item: any) => !!item)
          .map((rule: any) => {
            switch (rule.type) {
              case EFormRuleType.required:
                switch (item.formItem.type) {
                  case EFormType.text:
                  case EFormType.name:
                  case EFormType.number:
                  case EFormType.hidden:
                  case EFormType.password:
                  case EFormType.textarea:
                    rules.push({
                      required: true,
                      whitespace: true,
                      message: t(rule.message ?? 'Please enter', {
                        title: item.title.toLowerCase(),
                      }),
                    });
                    break;
                  default:
                    rules.push({
                      required: true,
                      message: t(
                        rule.message ?? (item.formItem.type !== EFormType.otp ? 'Please choose' : 'Please enter'),
                        { title: item.title.toLowerCase() },
                      ),
                    });
                    break;
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
                    )
                      return Promise.resolve();
                    return Promise.reject(new Error(t(rule.message || 'Please enter a valid email address!')));
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
                      if (!value || /^0$|^-?[1-9]\d*(\.\d+)?$/.test(value)) {
                        if (/^0$|^-?[1-9]\d*(\.\d+)?$/.test(value)) {
                          if (parseFloat(value) < rule.value) {
                            return Promise.reject(
                              new Error(t(rule.message || 'Please enter minimum number!', { min: rule.value })),
                            );
                          }
                        }
                      }
                      return Promise.resolve();
                    },
                  }));
                else {
                  if (!rule.message) {
                    switch (item.formItem.type) {
                      case EFormType.onlyNumber:
                        rule.message = t('Please enter at least number characters!', { min: rule.value });
                        break;
                      default:
                        rule.message = t('Please enter minimum number!', { min: rule.value });
                    }
                  }
                  rules.push({
                    type: item.formItem.type === EFormType.number ? 'number' : 'string',
                    min: rule.value,
                    message: rule.message,
                  });
                }
                break;
              case EFormRuleType.max:
                if (item.formItem.type === EFormType.number)
                  rules.push(() => ({
                    validator(_: any, value: any) {
                      if (!value || /^0$|^-?[1-9]\d*(\.\d+)?$/.test(value)) {
                        if (/^0$|^-?[1-9]\d*(\.\d+)?$/.test(value)) {
                          if (parseFloat(value) > rule.value) {
                            return Promise.reject(
                              new Error(t(rule.message || 'Please enter maximum number!', { max: rule.value })),
                            );
                          }
                        }
                      }
                      return Promise.resolve();
                    },
                  }));
                else {
                  if (!rule.message) {
                    switch (item.formItem.type) {
                      case EFormType.onlyNumber:
                        rule.message = t('Please enter maximum number characters!', { max: rule.value });
                        break;
                      default:
                        rule.message = t('Please enter maximum number!', { max: rule.value });
                    }
                  }
                  rules.push({
                    type: item.formItem.type === EFormType.number ? 'number' : 'string',
                    max: rule.value,
                    message: rule.message,
                  });
                }
                break;
              case EFormRuleType.url:
                rules.push({
                  type: 'url',
                  message: t(rule.message || 'Incorrect path format'),
                });
                break;
              case EFormRuleType.onlyText:
                rules.push(() => ({
                  validator(_: any, value: any) {
                    if (!value || /^[A-Za-z]+$/.test(value)) return Promise.resolve();
                    return Promise.reject(new Error(t(rule.message || 'Please enter only text!')));
                  },
                }));
                break;
              case EFormRuleType.onlyTextSpace:
                rules.push(() => ({
                  validator(_: any, value: any) {
                    if (!value || /^[a-zA-Z ]+$/.test(value)) return Promise.resolve();
                    return Promise.reject(new Error(t(rule.message || 'Please enter only text!')));
                  },
                }));
                break;
              case EFormRuleType.textarea:
                rules.push(() => ({
                  validator(_: any, value: any) {
                    if (value?.trim().length > 500) {
                      return Promise.reject(
                        new Error(t(rule.message || 'Please enter maximum characters!', { max: 500 })),
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
                  if (value.trim().length < min) return Promise.reject(t('Please enter at least characters!', { min }));
                  // if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(value))
                  //   return Promise.resolve();
                  // else return Promise.reject(t('Password needs to have at least 8 characters!'));
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
                if (value && value.length < (item.formItem.maxLength || 5)) {
                  return Promise.reject(
                    new Error(t('Please enter at least characters!', { min: item.formItem.maxLength || 5 })),
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
        <AntForm.Item {...otherProps}>{generateInput(item.formItem, item, values, otherProps.name)}</AntForm.Item>
      ) : (
        generateInput(item.formItem, item, values, otherProps.name)
      );
    }
    return null;
  };

  const handFinish = (values: any) => {
    values = convertFormValue(columns, values);
    handSubmit && handSubmit(values);
  };

  const timeout = useRef<any>();
  return (
    <Spin spinning={spinning}>
      <AntForm
        scrollToFirstError={true}
        requiredMark={true}
        className={classNames(className)}
        form={form}
        layout={!widthLabel ? 'vertical' : 'horizontal'}
        onFinishFailed={(failed) =>
          failed?.errorFields?.length && form?.scrollToField(failed?.errorFields[0].name, { behavior: 'smooth' })
        }
        onFinish={handFinish}
        onValuesChange={async (objValue) => {
          if (form && checkHidden) {
            clearTimeout(timeout.current);
            timeout.current = setTimeout(async () => {
              for (const key in objValue) {
                if (Object.hasOwn(objValue, key)) columns.filter((_item: any) => _item.name === key);
              }
              refLoad.current = false;
            }, 500);
          }
        }}
      >
        <div>
          <div className={'grid grid-cols-12 gap-x-5'}>
            {columns
              .filter((item: any) => !!item && !!item.formItem)
              .map(
                (column: any, index: number) =>
                  (!column?.formItem?.condition ||
                    !!column?.formItem?.condition(values[column.name], form, index, values)) && (
                    <div
                      className={classNames(
                        'col-span-12 type-' +
                          (column?.formItem?.type || EFormType.text) +
                          (' sm:col-span-' + (column?.formItem?.col ?? 12)) +
                          (' lg:col-span-' + (column?.formItem?.col ?? 12)),
                      )}
                      key={index + column.name}
                    >
                      {generateForm(column, index)}
                    </div>
                  ),
              )}
          </div>

          {extendForm?.(values)}
        </div>

        <div
          className={classNames('gap-7 flex sm:block mt-2', {
            'items-center sm:flex-row': handCancel && handSubmit,
            'md:inline-flex w-full justify-end': handSubmit,
            'sm:w-auto text-center items-center sm:flex-row flex-col': handSubmit && extendButton,
            '!w-full sm:inline-flex text-center justify-end items-center sm:flex-row':
              !handSubmit && (handCancel || extendButton),
          })}
        >
          {handCancel && (
            <Button
              text={textCancel ?? t('Cancel')}
              className={'w-full justify-center !border-black sm:w-auto sm:min-w-32'}
              onClick={handCancel}
            />
          )}
          {extendButton?.(form)}
          {handSubmit && (
            <Button
              text={textSubmit ?? t('Save')}
              id={idSubmit}
              onClick={() => form?.submit()}
              disabled={disableSubmit || spinning}
              className={'btn btn-primary btn-block text-base'}
            />
          )}
        </div>
      </AntForm>
    </Spin>
  );
};
interface Type {
  className?: string;
  columns: IForm[];
  textSubmit?: string;
  textCancel?: string;
  handSubmit?: (values: any) => void;
  handCancel?: () => void;
  values?: any;
  formAnt?: FormInstance;
  onFirstChange?: () => void;
  widthLabel?: string;
  checkHidden?: boolean;
  extendForm?: (values: any) => JSX.Element;
  extendButton?: (values: any) => JSX.Element;
  idSubmit?: string;
  disableSubmit?: boolean;
  spinning?: boolean;
}
