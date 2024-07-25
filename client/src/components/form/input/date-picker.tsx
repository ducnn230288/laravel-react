import { DatePicker, type FormInstance } from 'antd';
import dayjs from 'dayjs';

import { SGlobal } from '@/services';
import { uuidv4 } from '@/utils';

const Component = ({
  form,
  name,
  id = 'date-picker-' + uuidv4(),
  onChange,
  format,
  disabledDate,
  showTime,
  picker,
  disabled,
  ...props
}: Type) => {
  const sGlobal = SGlobal();

  const handleOpenChange = e => {
    if (!e) {
      const { value }: any = document.getElementById(id);
      const selectDate = dayjs(value, format ?? 'DD/MM/YYYY');
      if (
        selectDate.isValid() &&
        onChange &&
        name &&
        (!form ||
          (form.getFieldValue(name) &&
            form.getFieldValue(name).format(format ?? 'DD/MM/YYYY') !== selectDate.format(format ?? 'DD/MM/YYYY')))
      ) {
        onChange(selectDate, value);
      }
    }
  };
  return (
    <DatePicker
      id={id}
      onChange={onChange}
      format={format}
      disabledDate={disabledDate}
      showTime={showTime}
      picker={picker}
      locale={sGlobal.localeDate}
      disabled={disabled}
      {...props}
      onOpenChange={handleOpenChange}
    />
  );
};
interface Type {
  form: FormInstance;
  name?: string;
  placeholder?: string;
  id?: string;
  onChange: (selectDate: any, value: any) => void;
  format?: string;
  disabledDate: (current: any) => boolean;
  showTime: boolean;
  picker: 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year' | undefined;
  disabled?: boolean;
}
export default Component;
