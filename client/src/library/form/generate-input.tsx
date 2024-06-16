import React from 'react';
import {
  Checkbox,
  DatePicker as DateAntDesign,
  Radio,
  Slider,
  Switch,
  TimePicker,
  Input,
  type FormInstance,
} from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import type { TFunction } from 'i18next';

import { Check, Times } from '@/assets/svg';
import { EFormType } from '@/enums';
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
import type { IForm } from '@/interfaces';

export const generateInput = ({
  item,
  values,
  name,
  formatDate,
  generateForm,
  form,
  t,
}: {
  item: IForm;
  values: any;
  name: string;
  formatDate: string;
  generateForm: any;
  form: FormInstance;
  t: TFunction<'locale', 'library'>;
}) => {
  const { formItem } = item;
  if (formItem) {
    switch (formItem.type) {
      case EFormType.hidden:
        return <input type={'hidden'} name={item.name} tabIndex={-1} />;
      case EFormType.tab:
        return (
          <Tab name={item.name} generateForm={generateForm} form={form} column={formItem.column} list={formItem.list} />
        );
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
            onChange={e => formItem.onChange?.(e.target.value, form)}
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
              formatter: value =>
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
                ? formatDate + (formItem.showTime ? ' HH:mm' : '')
                : formatDate
            }
            onChange={(date: any) => formItem.onChange?.(date, form)}
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
            onCalendarChange={date => {
              form.setFieldValue(
                item.name,
                date?.filter(i => !!i),
              );
              formItem.onChange?.(
                date?.filter(i => !!i),
                form,
              );
            }}
            onOpenChange={open => {
              if (!open && form.getFieldValue(item.name)?.length < 2) form.resetFields([item.name]);
            }}
            format={formatDate + (formItem.showTime ? ' HH:mm' : '')}
            disabledDate={current => (formItem.disabledDate ? formItem.disabledDate(current, form) : false)}
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
            onChange={(date: any) => formItem.onChange?.(date, form)}
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
            onCalendarChange={date => {
              form.setFieldValue(
                item.name,
                date?.filter(i => !!i),
              );
              formItem.onChange?.(
                date?.filter(i => !!i),
                form,
              );
            }}
            onOpenChange={open => {
              if (!open && form.getFieldValue(item.name)?.length < 2) form.resetFields([item.name]);
            }}
            format={'HH:mm'}
            disabledDate={current => (formItem.disabledDate ? formItem.disabledDate(current, form) : false)}
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
            onChange={value => formItem.onChange?.(value, form)}
            disabled={formItem.disabled?.(values, form)}
          />
        ) : (
          <Checkbox
            onChange={value => formItem.onChange?.(value.target.checked, form)}
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
            onChange={({ target }) => formItem.onChange?.(target.value, form)}
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
            onChange={(value: any) => formItem.onChange?.(value, form)}
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
            onChange={(value: any) => formItem.onChange?.(value, form)}
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
            checkedChildren={<Check className='size-5 fill-white' />}
            unCheckedChildren={<Times className='size-5 fill-white' />}
            defaultChecked={!!values && values[item.name || ''] === 1}
            onChange={e => formItem.onChange?.(e, form)}
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
            onChange={(e: any) => formItem.onChange?.(e.target.value, form)}
            disabled={formItem.disabled?.(values, form)}
          />
        );
    }
  }
};
