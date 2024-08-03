import {
  Checkbox,
  DatePicker as DateAntDesign,
  Input,
  Radio,
  Slider,
  Switch,
  TimePicker,
  type FormInstance,
} from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import type { TFunction } from 'i18next';

import { EFormType } from '@/enums';
import type { IForm } from '@/types';
import { API, FORMAT_DATE, routerLinks } from '@/utils';
import { CSvgIcon } from '../svg-icon';
import { CUpload } from '../upload';
import {
  CIAddable,
  CIChips,
  CIDatePicker,
  CIEditor,
  CIMask,
  CIPassword,
  CISelect,
  CISelectTable,
  CITab,
  CITreeSelect,
} from './input';

export const generateInput = ({
  item,
  values,
  name,
  generateForm,
  form,
  t,
}: {
  item: IForm;
  values: any;
  name: string;
  generateForm: any;
  form: FormInstance;
  t: TFunction<'locale', 'library'>;
}) => {
  const { formItem } = item;
  const onCalendarChange = date => {
    form.setFieldValue(
      item.name,
      date?.filter(i => !!i),
    );
    formItem?.onChange?.({ value: date?.filter(i => !!i), form });
  };
  if (formItem) {
    switch (formItem.type) {
      case EFormType.hidden:
        return <input type={'hidden'} name={item.name} tabIndex={-1} />;
      case EFormType.editor:
        return <CIEditor placeholder={t(formItem.placeholder ?? 'Enter', { title: item.title.toLowerCase() })} />;
      case EFormType.upload:
        return <CUpload isMultiple={formItem.isMultiple} />;
      case EFormType.otp:
        return <Input.OTP length={formItem.maxLength ?? 5} />;
      case EFormType.password:
        return (
          <CIPassword
            placeholder={t(formItem.placeholder ?? 'Enter', { title: item.title.toLowerCase() })}
            disabled={formItem.disabled?.({ value: values[item.name], form })}
          />
        );
      case EFormType.chips:
        return (
          <CIChips
            placeholder={t(formItem.placeholder ?? 'Enter', { title: item.title.toLowerCase() })}
            disabled={formItem.disabled?.({ value: values[item.name], form })}
            list={formItem.list}
          />
        );
      case EFormType.switch:
        return (
          <Switch
            checkedChildren={<CSvgIcon name='check' size={20} className='fill-white' />}
            unCheckedChildren={<CSvgIcon name='times' size={20} className='fill-white' />}
            defaultChecked={!!values && values[item.name || ''] === 1}
            onChange={value => formItem.onChange?.({ value, form })}
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
      case EFormType.radio:
        return (
          <Radio.Group
            options={formItem.list}
            optionType={'button'}
            disabled={formItem.disabled?.({ value: values[item.name], form })}
            onChange={({ target }) => formItem.onChange?.({ value: target.value, form })}
          />
        );

      case EFormType.tab:
        return (
          <CITab
            name={item.name}
            generateForm={generateForm}
            form={form}
            column={formItem.column}
            list={formItem.list}
          />
        );

      case EFormType.sliderNumber:
      case EFormType.textarea:
      case EFormType.addable:
      case EFormType.date:
      case EFormType.dateRange:
        return switchCaseMore1({ item, values, generateForm, form, t, onCalendarChange });

      case EFormType.treeSelect:
      case EFormType.selectTable:
      case EFormType.time:
      case EFormType.timeRange:
      case EFormType.checkbox:
      case EFormType.select:
        return switchCaseMore2({ item, values, form, t, onCalendarChange });

      default:
        return (
          <CIMask
            list={formItem.list}
            form={form}
            mask={formItem.mask}
            addonBefore={formItem.addonBefore}
            addonAfter={formItem.addonAfter}
            placeholder={t(formItem.placeholder ?? 'Enter', { title: item.title.toLowerCase() })}
            onBlur={e => formItem.onBlur?.({ value: e.target.value, form, name, api: API, routerLinks })}
            onChange={e => formItem.onChange?.({ value: e.target.value, form })}
            disabled={formItem.disabled?.({ value: values[item.name], form })}
          />
        );
    }
  }
};
const switchCaseMore1 = ({
  item,
  values,
  generateForm,
  form,
  t,
  onCalendarChange,
}: {
  item: IForm;
  values: any;
  generateForm: any;
  form: FormInstance;
  t: TFunction<'locale', 'library'>;
  onCalendarChange: any;
}) => {
  const { formItem } = item;
  if (formItem) {
    switch (formItem.type) {
      case EFormType.textarea:
        return (
          <textarea
            disabled={formItem.disabled?.({ value: values[item.name], form })}
            className={classNames('ant-input', {
              disabled: formItem.disabled?.({ value: values[item.name], form }),
            })}
            rows={4}
            maxLength={1000}
            placeholder={t(formItem.placeholder ?? 'Enter', { title: item.title.toLowerCase() })}
            onChange={e => formItem.onChange?.({ value: e.target.value, form })}
          />
        );
      case EFormType.addable:
        return (
          <CIAddable
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
      case EFormType.date:
        return (
          <CIDatePicker
            format={
              FORMAT_DATE + ((!formItem.picker || formItem.picker === 'date') && formItem.showTime ? ' HH:mm' : '')
            }
            onChange={value => formItem.onChange?.({ value, form })}
            disabledDate={current => (formItem.disabledDate ? formItem.disabledDate({ current, form }) : false)}
            showTime={!!formItem.showTime}
            picker={formItem.picker ?? 'date'}
            disabled={formItem.disabled?.({ value: values[item.name], form })}
            form={form}
            name={item.name}
            placeholder={t(formItem.placeholder ?? 'Choose', { title: item.title.toLowerCase() })}
          />
        );
      case EFormType.dateRange:
        return (
          <DateAntDesign.RangePicker
            onCalendarChange={onCalendarChange}
            onOpenChange={open => {
              if (!open && form.getFieldValue(item.name)?.length < 2) form.resetFields([item.name]);
            }}
            format={FORMAT_DATE + (formItem.showTime ? ' HH:mm' : '')}
            disabledDate={current => (formItem.disabledDate ? formItem.disabledDate({ current, form }) : false)}
            defaultValue={
              formItem.initialValues && [dayjs(formItem.initialValues.start), dayjs(formItem.initialValues.end)]
            }
            showTime={formItem.showTime}
            disabled={formItem.disabled?.({ value: values[item.name], form })}
          />
        );
    }
  }
};

const switchCaseMore2 = ({
  item,
  values,
  form,
  t,
  onCalendarChange,
}: {
  item: IForm;
  values: any;
  form: FormInstance;
  t: TFunction<'locale', 'library'>;
  onCalendarChange: any;
}) => {
  const { formItem } = item;
  if (formItem) {
    switch (formItem.type) {
      case EFormType.treeSelect:
        return (
          <CITreeSelect
            formItem={formItem}
            showSearch={formItem.showSearch}
            form={form}
            disabled={formItem.disabled?.({ value: values[item.name], form })}
            placeholder={t(formItem.placeholder ?? 'Choose', { title: item.title.toLowerCase() })}
          />
        );
      case EFormType.selectTable:
        return (
          <CISelectTable
            form={form}
            onChange={value => formItem.onChange?.({ value, form })}
            placeholder={t(formItem.placeholder ?? 'Choose', { title: item.title.toLowerCase() })}
            disabled={formItem.disabled?.({ value: values[item.name], form })}
            isMultiple={formItem.isMultiple}
            get={formItem.get}
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
      case EFormType.time:
        return (
          <TimePicker
            minuteStep={10}
            format={'HH:mm'}
            onChange={value => formItem.onChange?.({ value, form })}
            disabledDate={current => (formItem.disabledDate ? formItem.disabledDate({ current, form }) : false)}
            disabled={formItem.disabled?.({ value: values[item.name], form })}
            name={item.name}
            placeholder={t(formItem.placeholder ?? 'Choose', { title: item.title.toLowerCase() })}
          />
        );
      case EFormType.timeRange:
        return (
          <TimePicker.RangePicker
            minuteStep={10}
            onCalendarChange={onCalendarChange}
            onOpenChange={open => {
              if (!open && form.getFieldValue(item.name)?.length < 2) form.resetFields([item.name]);
            }}
            format={'HH:mm'}
            disabledDate={current => (formItem.disabledDate ? formItem.disabledDate({ current, form }) : false)}
            defaultValue={
              formItem.initialValues && [dayjs(formItem.initialValues.start), dayjs(formItem.initialValues.end)]
            }
            disabled={formItem.disabled?.({ value: values[item.name], form })}
          />
        );
      case EFormType.checkbox:
        return formItem.list ? (
          <Checkbox.Group
            options={formItem.list}
            onChange={value => formItem.onChange?.({ value, form })}
            disabled={formItem.disabled?.({ value: values[item.name], form })}
          />
        ) : (
          <Checkbox
            onChange={value => formItem.onChange?.({ value: value.target.checked, form })}
            disabled={formItem.disabled?.({ value: values[item.name], form })}
          >
            {formItem.label}
          </Checkbox>
        );
      case EFormType.select:
        return (
          <CISelect
            showSearch={formItem.showSearch}
            maxTagCount={formItem.maxTagCount ?? 'responsive'}
            onChange={value => formItem.onChange?.({ value, form })}
            placeholder={t(formItem.placeholder ?? 'Choose', { title: item.title.toLowerCase() })}
            form={form}
            disabled={formItem.disabled?.({ value: values[item.name], form })}
            get={formItem.get}
            list={formItem.list}
            isMultiple={formItem.isMultiple}
          />
        );
    }
  }
};
