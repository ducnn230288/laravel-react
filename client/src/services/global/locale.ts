import type { PickerLocale } from 'antd/es/date-picker/generatePicker';

export const enLocale: PickerLocale = {
  lang: {
    locale: 'en_US',
    placeholder: 'Select date',
    rangePlaceholder: ['Start date', 'End date'],
    today: 'Today',
    now: 'Now',
    backToToday: 'Back to today',
    ok: 'OK',
    clear: 'Clear',
    month: 'Month',
    year: 'Year',
    timeSelect: 'Select time',
    dateSelect: 'Select date',
    weekSelect: 'Choose a week',
    monthSelect: 'Choose a month',
    yearSelect: 'Choose a year',
    decadeSelect: 'Choose a decade',
    yearFormat: 'YYYY',
    dateFormat: 'M/D/YYYY',
    dayFormat: 'D',
    dateTimeFormat: 'M/D/YYYY HH:mm:ss',
    monthBeforeYear: true,
    monthFormat: 'MMM',
    previousMonth: 'Previous month (PageUp)',
    nextMonth: 'Next month (PageDown)',
    previousYear: 'Last year (Control + left)',
    nextYear: 'Next year (Control + right)',
    previousDecade: 'Last decade',
    nextDecade: 'Next decade',
    previousCentury: 'Last century',
    nextCentury: 'Next century',
    shortWeekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  timePickerLocale: {
    placeholder: 'Select time',
    rangePlaceholder: ['Start time', 'End time'],
  },
  dateFormat: 'YYYY-MM-DD',
  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  weekFormat: 'YYYY-wo',
  monthFormat: 'YYYY-MM',
};
export const viLocale: PickerLocale = {
  lang: {
    locale: 'vi_VN',
    placeholder: 'Chọn ngày',
    rangePlaceholder: ['Ngày bắt đầu', 'Ngày kết thúc'],
    today: 'Hôm nay',
    now: 'Bây giờ',
    backToToday: 'Trở về hôm nay',
    ok: 'OK',
    clear: 'Xóa',
    month: 'Tháng',
    year: 'Năm',
    timeSelect: 'Chọn thời gian',
    dateSelect: 'Chọn ngày',
    weekSelect: 'Chọn tuần',
    monthSelect: 'Chọn tháng',
    yearSelect: 'Chọn năm',
    decadeSelect: 'Chọn thập kỷ',
    yearFormat: 'YYYY',
    dateFormat: 'D/M/YYYY',
    dayFormat: 'D',
    dateTimeFormat: 'D/M/YYYY HH:mm:ss',
    monthBeforeYear: false,
    monthFormat: 'MMM',
    previousMonth: 'Tháng trước (PageUp)',
    nextMonth: 'Tháng sau (PageDown)',
    previousYear: 'Năm trước (Control + left)',
    nextYear: 'Năm sau (Control + right)',
    previousDecade: 'Thập kỷ trước',
    nextDecade: 'Thập kỷ sau',
    previousCentury: 'Thế kỷ trước',
    nextCentury: 'Thế kỷ sau',
    shortWeekDays: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    shortMonths: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
  },
  timePickerLocale: {
    placeholder: 'Chọn thời gian',
    rangePlaceholder: ['Bắt đầu', 'Kết thúc'],
  },
  dateFormat: 'YYYY-MM-DD',
  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  weekFormat: 'YYYY-wo',
  monthFormat: 'YYYY-MM',
};