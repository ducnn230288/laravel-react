import { Popconfirm, Spin } from 'antd';
import classNames from 'classnames';
import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import { message } from '@/index';
import { API, arrayMove, handleGetBase64, KEY_TOKEN, uuidv4 } from '@/utils';
import { CButton } from '../button';
import { CSvgIcon } from '../svg-icon';

export const CUpload = ({
  value = [],
  onChange,
  deleteFile,
  showBtnDelete = () => true,
  method = 'post',
  maxSize = 40,
  isMultiple = true,
  action = '/files',
  keyImage = 'path',
  accept = 'image/*',
  validation = async () => true,
}: PropsWithChildren<{
  value?: any[];
  onChange?: (values: any[]) => any;
  deleteFile?: any;
  showBtnDelete?: (file: any) => boolean;
  method?: string;
  maxSize?: number;
  isMultiple?: boolean;
  action?: string | ((file: any, config: any) => any);
  keyImage?: string;
  accept?: string;
  validation?: (file: any, listFiles: any) => Promise<boolean>;
}>) => {
  const { t } = useTranslation('locale', { keyPrefix: 'library' });
  const isLoading = useRef(false);
  const ref = useRef<any>();
  const [listFiles, setListFiles] = useState<any>([]);
  useEffect(() => {
    let tempData: any = typeof value === 'string' ? [value] : [];
    if (value && typeof value === 'object') {
      tempData = value.map((_item: any) => {
        if (_item.status) return _item;
        return {
          ..._item,
          status: 'done',
        };
      });
    }

    if (
      JSON.stringify(listFiles) !== JSON.stringify(tempData) &&
      listFiles.filter((item: any) => item.status === 'uploading').length === 0
    ) {
      setListFiles(tempData);
      setTimeout(() => GLightbox({}), 100);
    }
  }, [value, isMultiple]);

  useEffect(() => {
    setTimeout(() => GLightbox({}), 100);
  }, []);

  const onUpload = async ({ target }: any) => {
    for (const file of target.files) {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        message.error(
          `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}mb): ${t('You can only upload up to mb!', {
            max: maxSize,
          })}`,
        );
      }

      if ((maxSize && file.size > maxSize * 1024 * 1024) || !(await validation(file, listFiles))) {
        return setListFiles(listFiles.filter((_item: any) => _item.id !== dataFile.id));
      }
      const thumbUrl = handleGetBase64(file);
      const dataFile = {
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        size: file.size,
        type: file.type,
        originFileObj: file,
        thumbUrl,
        id: uuidv4(),
        percent: 0,
        status: 'uploading',
      };
      if (!isMultiple) {
        listFiles[0] = dataFile;
      } else {
        listFiles.push(dataFile);
      }
      isLoading.current = true;
      setListFiles([...listFiles]);

      if (typeof action === 'string') {
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        const { data } = await API.responsible<any>({
          url: action,
          config: {
            ...API.init(),
            method,
            body: bodyFormData,
            headers: {
              authorization: 'Bearer ' + (localStorage.getItem(KEY_TOKEN) ?? ''),
              'Accept-Language': localStorage.getItem('i18nextLng') ?? '',
            },
          },
        });

        formatData({ data, dataFile });
      }
      setTimeout(() => GLightbox({}), 100);
    }
    ref.current.value = '';
  };

  const formatData = async ({
    data,
    dataFile,
  }: {
    data: any;
    dataFile: {
      lastModified: any;
      lastModifiedDate: any;
      name: any;
      size: any;
      type: any;
      originFileObj: any;
      thumbUrl: unknown;
      id: string;
      percent: number;
      status: string;
    };
  }) => {
    if (data) {
      const files = isMultiple
        ? listFiles.map((item: any) => {
            if (item.id === dataFile.id) {
              item = { ...item, ...data, status: 'done' };
            }
            return item;
          })
        : [{ ...data, status: 'done' }];
      isLoading.current = false;
      setListFiles(files);
      onChange && (await onChange(files));
    } else {
      isLoading.current = false;
      setListFiles(listFiles.filter((_item: any) => _item.id !== dataFile.id));
    }
  };
  const moverImage = async (index: number, new_index: number) => {
    if (isMultiple) {
      const files = arrayMove(listFiles, index, new_index);
      setListFiles(files);
      onChange && (await onChange(files));
    }
  };

  const renderArrowUp = (index: number) =>
    index > 0 && (
      <button
        onClick={() => moverImage(index, index - 1)}
        className={
          'top-1 absolute right-1 bg-base-200 hover:bg-primary size-5 cursor-pointer rounded-full text-base-content transition-all duration-300'
        }
      >
        <CSvgIcon name='arrow' size={12} className={'m-1 rotate-180 fill-primary hover:fill-base-content'} />
      </button>
    );

  const renderArrowDown = (index: number) =>
    index < listFiles.length - 1 && (
      <button
        onClick={() => moverImage(index, index + 1)}
        className={classNames(
          'absolute right-1 bg-base-200 hover:bg-primary size-5 cursor-pointer rounded-full text-base-content transition-all duration-300',
          {
            'top-8': index > 0,
            'top-1': index === 0,
          },
        )}
      >
        <CSvgIcon name='arrow' size={12} className={'m-1 fill-primary hover:fill-base-content'} />
      </button>
    );

  const renderBtnDelete = (file, index) =>
    showBtnDelete(file) && (
      <Popconfirm
        destroyTooltipOnHide={true}
        title={t('Are you sure want delete?', { name: file.name, label: t('File').toLowerCase() })}
        onConfirm={async () => {
          if (deleteFile && file?.id) {
            const data = await deleteFile(file?.id);
            if (!data) {
              return false;
            }
          }
          onChange?.(listFiles.filter((_item: any) => _item.id !== file.id));
        }}
      >
        <button
          className={classNames('btn-delete', {
            'top-16 ': listFiles.length > 1 && index > 0 && index < listFiles.length - 1,
            'top-8': listFiles.length > 1 && (index === 0 || index === listFiles.length - 1),
            'top-1': listFiles.length === 1,
          })}
        >
          <CSvgIcon name='times' size={12} className={'m-1 fill-error hover:fill-base-content'} />
        </button>
      </Popconfirm>
    );
  const handlePaste = async event => {
    const items = event.clipboardData.items;
    for (const index in items) {
      const item = items[index];
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        await onUpload({ target: { files: [blob] } });
      }
    }
  };

  const renderListFiles = listFiles.map((file: any, index: number) => (
    <div key={'file-' + index} className={'relative'}>
      <a href={file[keyImage] ? file[keyImage] : file} className='glightbox'>
        <img src={file[keyImage] ? file[keyImage] : file} alt={file.name} />
      </a>
      {renderArrowUp(index)}
      {renderArrowDown(index)}
      {renderBtnDelete(file, index)}
    </div>
  ));

  return (
    <Spin spinning={isLoading.current}>
      <input type='file' className={'hidden'} accept={accept} multiple={isMultiple} ref={ref} onChange={onUpload} />
      <div className={classNames('upload', { 'upload-grid': isMultiple })}>{renderListFiles}</div>
      <div className={'mt-2 flex gap-2'}>
        <CButton
          isTiny={true}
          onClick={() => ref.current.click()}
          icon={<CSvgIcon name='upload' size={16} />}
          text={'Upload'}
        />
        <CButton
          isTiny={true}
          icon={<CSvgIcon name='paste' size={16} />}
          text={'Paste'}
          onPaste={handlePaste}
        ></CButton>
      </div>
    </Spin>
  );
};
