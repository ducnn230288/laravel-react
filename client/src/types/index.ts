import type { EFormPickerDate, EFormRuleType, EFormType, ETableAlign, ETableFilterType } from '@/enums';
import type { API, routerLinks } from '@/utils';
import type { CheckboxOptionType, FormInstance } from 'antd';

export interface IResponses<T> {
  statusCode?: 200 | 201 | 500 | 404;
  message?: string;
  data?: T;
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ICommonEntity {
  id?: string;
  createdAt?: string;
  isDisable?: boolean;
}

export interface IPaginationQuery<T = object> {
  [selector: string]: any;
  perPage?: number;
  page?: number;
  like?: string | T;
  sort?: string | T;
  extend?: string | T;
  skip?: string | T;
  fullTextSearch?: string;
  include?: string;
}

export interface IDataTable {
  name?: string;
  title?: any;
  tableItem?: ITableItem;
}

export interface ITableItem {
  filter?: ITableItemFilter;
  width?: number;
  fixed?: string;
  sorter?: boolean;
  onCell?: (record: any) => { style?: any; onClick?: any; className?: string };
  align?: ETableAlign;
  onClick?: any;
  render?: (text: any, item: any) => JSX.Element | string;
  defaultSortOrder?: string;
  defaultFilteredValue?: string;
  isDateTime?: boolean;
}

export interface ITableItemFilter {
  type?: ETableFilterType;
  list?: ITableItemFilterList[];
  get?: ITableGet;
}

export interface ITableGet {
  keyApi?: string;
  method?: string;
  format?: (item: any) => CheckboxOptionType;
  params?: (props: { fullTextSearch: string; value?: any }) => any;
  data?: any;
  column?: IDataTable[];
  keepUnusedDataFor?: number;
}

export interface ITableItemFilterList {
  label?: string;
  value?: string | number;
}

export interface ITableRefObject {
  onChange: (request?: any) => void;
}

export interface IEditTable {
  fields?: {
    columns?: IColumnEditTable[];
    rows?: string[];
  };
  meta?: {
    field?: string;
    name?: string;
    fullName?: string;
    type?: string;
    formula?: string;
  }[];
  totals?: {
    row?: {
      subTotalsDimensions?: string[];
      reverseSubLayout?: boolean;
      subLabel?: string;
    };
  };
  data?: any[];
}

export interface IColumnEditTable {
  key?: string;
  children?: IColumnEditTable[];
}

export interface IForm {
  name: string;
  title: string;
  formItem?: IFormItem;
}

export interface IFormItem {
  type?: EFormType;
  col?: number;
  condition?: (props: { value: string; form: FormInstance; index: number; values: any }) => boolean;
  list?: any[];
  rules?: IFormItemRule[];
  isMultiple?: boolean;
  tab?: string;
  column?: IForm[];
  disabled?: (props: { value: any; form: FormInstance }) => boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  sliderMarks?: Record<number, string>;
  symbol?: string;
  initialValues?: { start: string; end: string };
  convert?: (data: any) => any;
  onChange?: (props: { value: any; form: FormInstance }) => void;
  onBlur?: (props: {
    value: string;
    form: FormInstance;
    name: string;
    api: typeof API;
    routerLinks: typeof routerLinks;
  }) => void;
  disabledDate?: (props: { current: any; form: FormInstance }) => boolean;
  showTime?: boolean;
  picker?: EFormPickerDate;
  onCalendarChange?: (props: { current: any; form: FormInstance }) => void;
  api?: IFormApi;
  get?: ITableGet;
  label?: string;
  maxTagCount?: number;
  tag?: {
    avatar: string;
    label: string;
    value: string;
    params: (props: { getFieldValue: any; fullTextSearch: string; value: any }) => any;
    api: string;
  };
  showSearch?: boolean;
  mask?: any;
  addonBefore?: (form?: FormInstance) => JSX.Element;
  addonAfter?: (form?: FormInstance) => JSX.Element;
  maxLength?: number;
  textAdd?: string;
  onAdd?: (props: { values: any; form: FormInstance }) => void;
  isTable?: boolean;
  showRemove?: any;
  idCheck?: any;
  notDefaultValid?: boolean;
  render?: (props: { form: FormInstance; values: any; generateForm: any; index: number }) => JSX.Element;
}

export interface IFormItemRule {
  type?: EFormRuleType;
  message?: string;
  value?: any;
  validator?: ({ getFieldValue }: any) => { validator(rule: any, value: string): Promise<void> };
  min?: number;
  max?: number;
  api?: {
    url: string;
    name: string;
    label: string;
    id?: string;
  };
}

export interface IFormApi {
  link?: () => string;
  format?: (item: any) => CheckboxOptionType;
  params?: (props: { form: FormInstance; fullTextSearch: string }) => any;
}

export interface IFormModalRefObject {
  handleEdit?: (item?: { id?: string }, isGet?: boolean) => Promise<void>;
  form?: FormInstance;
}
