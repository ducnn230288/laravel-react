import React, { Fragment, type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Popconfirm } from 'antd';

import { message } from '@/index';
import { Arrow, Paste, Times, UploadSVG } from '@/assets/svg';
import { API, arrayMove, handleGetBase64, keyToken, uuidv4 } from '@/utils';
import { Button } from '../button';

export const Upload = ({
  value = [],
  onChange,
  deleteFile,
  showBtnDelete = () => true,
  method = 'post',
  maxSize = 40,
  multiple = true,
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
  multiple?: boolean;
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
    if (typeof value === 'object') {
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
  }, [value, multiple]);

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
      if (!multiple) {
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
              authorization: 'Bearer ' + (localStorage.getItem(keyToken) ?? ''),
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
      const files = multiple
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
    if (multiple) {
      const files = arrayMove(listFiles, index, new_index);
      setListFiles(files);
      onChange && (await onChange(files));
    }
  };

  return (
    <Fragment>
      <input type='file' className={'hidden'} accept={accept} multiple={multiple} ref={ref} onChange={onUpload} />
      <div
        className={classNames('upload', {
          'upload-grid': multiple,
          'w-24': !multiple,
        })}
      >
        {listFiles.map((file: any, index: number) => (
          <div key={'file-' + index} className={classNames('relative')}>
            <a href={file[keyImage] ? file[keyImage] : file} className='glightbox'>
              <img src={file[keyImage] ? file[keyImage] : file} alt={file.name} />
            </a>
            {index > 0 && (
              <button
                onClick={() => moverImage(index, index - 1)}
                className={
                  'top-1 absolute right-1 bg-gray-300 hover:bg-teal-900 size-5 cursor-pointer rounded-full text-white transition-all duration-300'
                }
              >
                <Arrow className={'size-3 m-1 rotate-180 fill-teal-700 hover:fill-white'} />
              </button>
            )}

            {index < listFiles.length - 1 && (
              <button
                onClick={() => moverImage(index, index + 1)}
                className={classNames(
                  'absolute right-1 bg-gray-300 hover:bg-teal-900 size-5 cursor-pointer rounded-full text-white transition-all duration-300',
                  {
                    'top-8': index > 0,
                    'top-1': index === 0,
                  },
                )}
              >
                <Arrow className={'size-3 m-1 fill-teal-700 hover:fill-white'} />
              </button>
            )}

            {showBtnDelete(file) && (
              <Popconfirm
                destroyTooltipOnHide={true}
                title={t('Are you sure want delete?')}
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
                <div
                  className={classNames(
                    'hover:!bg-red-500 absolute right-1 bg-gray-300 size-5 cursor-pointer rounded-full text-white transition-all duration-300',
                    {
                      'top-16 ': listFiles.length > 1 && index > 0 && index < listFiles.length - 1,
                      'top-8': listFiles.length > 1 && (index === 0 || index === listFiles.length - 1),
                      'top-1': listFiles.length === 1,
                    },
                  )}
                >
                  <Times className={'size-3 m-1 fill-red-400 hover:fill-white'} />
                </div>
              </Popconfirm>
            )}
          </div>
        ))}
      </div>
      <div className={'mt-2 flex gap-2'}>
        <Button
          isTiny={true}
          isLoading={isLoading.current}
          onClick={() => ref.current.click()}
          icon={<UploadSVG className={'size-4'} />}
          text={'Upload'}
        />
        <Button
          isTiny={true}
          icon={<Paste className={'size-4'} />}
          text={'Paste'}
          onPaste={async event => {
            const items = event.clipboardData.items;
            for (const index in items) {
              const item = items[index];
              if (item.kind === 'file') {
                const blob = item.getAsFile();
                await onUpload({ target: { files: [blob] } });
              }
            }
          }}
        ></Button>
      </div>
    </Fragment>
  );
};
