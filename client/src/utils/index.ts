import { ETypeChart } from '@/enums';

import { KEY_TOKEN, LANGUAGE, LINK_API, LIST_LANGUAGE } from './variable';

export * from '../router-links';
export * from './api';
export * from './convertFormValue';
export * from './reportWebVitals';
export * from './variable';

export const cleanObjectKeyNull = (obj: { [selector: string]: any }) => {
  for (const propName in obj) {
    if (Object.hasOwn(obj, propName)) {
      if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === '' ||
        (typeof obj[propName] === 'object' && Object.keys(obj[propName]).length === 0)
      ) {
        delete obj[propName];
      } else if (typeof obj[propName] === 'object') {
        const keys = Object.keys(obj[propName]);
        let check = true;
        keys.forEach((key: string) => {
          if (check && obj[propName][key] !== undefined) {
            check = false;
          }
        });
        if (check) {
          delete obj[propName];
        }
      }
    }
  }
  return obj;
};

export const getSizePageByHeight = (height = 39, minusNumber = 3) =>
  Math.floor(
    (document.body.getBoundingClientRect().height -
      document.getElementsByTagName('tbody')[0].getBoundingClientRect().top) /
      height,
  ) - minusNumber;
export const getFilter = (queryParams = '{}', key = 'id') =>
  JSON.parse(JSON.parse(queryParams || '{}').filter || '{}')[key] || null;

export const lang = LIST_LANGUAGE.indexOf(location.hash.split('/')[1]) > -1 ? location.hash.split('/')[1] : LANGUAGE;

export const arrayUnique = (array: any, key?: string) => {
  const a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if ((key && a[i][key] === a[j][key]) || JSON.stringify(a[i]) === JSON.stringify(a[j])) {
        a.splice(j, 1);
      }
    }
  }
  return a;
};

export const handleDownloadCSV = async (url: string, name: string = 'file-csv') => {
  const res = await fetch(LINK_API + url, {
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      authorization: 'Bearer ' + (localStorage.getItem(KEY_TOKEN) ?? ''),
      'Accept-Language': localStorage.getItem('i18nextLng') ?? '',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  });
  if (res.status < 300) {
    const text = await res.text();
    const link = window.document.createElement('a');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(text));
    link.setAttribute('download', name + '.csv');
    link.click();
  }
};

export const handleGetBase64 = async (file: File) =>
  await new Promise(resolve => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });
export const arrayMove = (arr: any[], old_index: number, new_index: number) => {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr.filter(item => !!item);
};
export const uuidv4 = () => {
  let d = new Date().getTime(); //Timestamp
  let d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export const isNumeric = (str: string) => {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
};
export const searchTree = ({ array, value, key = '' }: { array: any; value?: string; key?: string }): any => {
  let result = null;
  if (array?.length)
    array.forEach(item => {
      if (!result) {
        if (item[key] == value) {
          result = item;
        } else if (item.children != null) {
          result = searchTree({ array: item.children, value, key });
        }
      }
    });
  return result;
};
export const mapTreeObject = (item: any): any => {
  return {
    ...item,
    title: item?.title ?? item?.name,
    key: item?.code ?? item?.id,
    value: item?.code ?? item?.id,
    isLeaf: !item?.children?.length,
    expanded: true,
    children: !item?.children ? null : item?.children?.map((i: any) => mapTreeObject(i)),
  };
};
export const textWidth = (text?: string, fontProp?: string) => {
  if (text) {
    const tag = document.createElement('div');
    tag.style.position = 'absolute';
    tag.style.left = '-999em';
    tag.style.whiteSpace = 'nowrap';
    if (fontProp) tag.style.font = fontProp;
    tag.innerHTML = text;
    document.body.appendChild(tag);
    const result = tag.clientWidth;
    document.body.removeChild(tag);
    return result;
  }
  return 0;
};
export const getLongTextInArray = (arr: string[]) => arr.reduce((a: string, b) => (a.length > b.length ? a : b), '');
export const reorderArray = (list: any[], startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
export const cssInObject = (styles: string) =>
  styles
    ? styles
        .trim()
        .split(';')
        .map(cur =>
          cur
            .trim()
            .split(':')
            .map(i => i.trim()),
        )
        .filter(i => i.length === 2)
        .reduce((acc: any, val) => {
          const [key, value] = val;
          const newKey = key.replace(/-./g, css => css.toUpperCase()[1]);
          acc[newKey] = value;
          return acc;
        }, {})
    : {};
export const formatDataChart = ({
  obj,
  title,
  level = 1,
  list,
  type = ETypeChart.pie,
}: {
  obj: any;
  title: string;
  level?: number;
  list?: string[];
  type: ETypeChart;
}) => {
  const listXy = [ETypeChart.scatter, ETypeChart.bubble];
  const listNumber = [ETypeChart.pie, ETypeChart.ring];
  let series: any[] = [];
  const category = obj.data
    .filter((i: any) => !level || (i.level === level && !i.isSummary))
    .map((i: any) => i.content);
  if (listXy.indexOf(type) > -1) {
    const listField: any[] = [];
    obj.meta
      .filter((i: any) => i.type === 'number' && (!list?.length || list.indexOf(i.field) > -1))
      .forEach((i: any, j: number, array: any[]) => {
        if (type === ETypeChart.bubble) {
          if (j % 3 === 2) {
            listField.push({
              name: array[j - 1].fullName + ' vs ' + array[j - 2].fullName + ' vs ' + i.fullName,
              field: array[j - 1].field + '|' + array[j - 2].field + '|' + i.field,
              value: [],
            });
          }
        } else if (j % 2 === 1) {
          listField.push({
            name: array[j - 1].fullName + ' vs ' + i.fullName,
            field: array[j - 1].field + '|' + i.field,
            value: [],
          });
        }
      });
    obj.data
      .filter((i: any) => !level || (i.level === level && !i.isSummary))
      .forEach((e: any) => {
        series.push({ name: e.content, value: [] });
        listField.forEach((_: any, index: number) => {
          const arrayField = listField[index].field.split('|');
          const value: number[] = [];
          arrayField.forEach((i: string) => {
            value.push(isNumeric(e[i]) ? parseFloat(e[i]) : 0);
          });
          series[series.length - 1].value.push([...value, ...listField[index].name.split(' vs ')]);
        });
      });
  } else {
    const listField = obj.meta
      .filter((i: any) => i.type === 'number' && (!list?.length || list.indexOf(i.field) > -1))
      .map((i: any) => ({ value: listNumber.indexOf(type) > -1 ? 0 : [], name: i.fullName, field: i.field }));
    obj.data
      .filter((i: any) => !level || (i.level === level && !i.isSummary))
      .forEach((e: any) => {
        listField.forEach((i: any, index: number) => {
          if (listNumber.indexOf(type) > -1 && isNumeric(e[i.field])) listField[index].value += parseFloat(e[i.field]);
          else listField[index].value.push(isNumeric(e[i.field]) ? parseFloat(e[i.field]) : 0);
        });
      });
    series = listNumber.indexOf(type) > -1 ? [{ data: listField }] : listField;
  }
  return { title, type, series, category };
};
