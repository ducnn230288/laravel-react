import React, { Fragment, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { notification } from '@/index';
import { Arrow, Paste, Times, UploadSVG } from '@/assets/svg';
import { API, keyToken, uuidv4 } from '@/utils';

import { Button } from '../button';
import { PopConfirm } from '../pop-confirm';

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
  const [listFiles, set_listFiles] = useState(
    multiple && value && typeof value === 'object'
      ? value.map((_item: any) => {
          if (_item.status) return _item;
          return {
            ..._item,
            status: 'done',
          };
        })
      : value
        ? [value]
        : [],
  );
  useEffect(() => {
    const tempData =
      !multiple && value && typeof value === 'object'
        ? value.map((_item: any) => {
            if (_item.status) return _item;
            return {
              ..._item,
              status: 'done',
            };
          })
        : value
          ? [value]
          : [];
    if (
      JSON.stringify(listFiles) !== JSON.stringify(tempData) &&
      listFiles.filter((item: any) => item.status === 'uploading').length === 0
    ) {
      set_listFiles(tempData);
      setTimeout(() => GLightbox({}));
    }
  }, [value, multiple]);

  useEffect(() => {
    setTimeout(() => GLightbox({}));
  }, []);

  const onUpload = async ({ target }: any) => {
    for (let i = 0; i < target.files.length; i++) {
      const file = target.files[i];
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        await notification.error({
          message: `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}mb): ${t('You can only upload up to mb!', {
            max: maxSize,
          })}`,
        });
        return set_listFiles(listFiles.filter((_item: any) => _item.id !== dataFile.id));
      }

      if (!(await validation(file, listFiles))) {
        return set_listFiles(listFiles.filter((_item: any) => _item.id !== dataFile.id));
      }
      const thumbUrl = await new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.readAsDataURL(file);
      });
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
      set_listFiles(listFiles);

      if (action) {
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
            set_listFiles(files);
            onChange && (await onChange(files));
          } else {
            isLoading.current = false;
            set_listFiles(listFiles.filter((_item: any) => _item.id !== dataFile.id));
          }
        } else {
          try {
            const data = await action(file, {
              onUploadProgress: (event: any) => {
                set_listFiles(
                  listFiles.map((item: any) => {
                    if (item.id === dataFile.id) {
                      item.percent = (event.loaded / event.total) * 100;
                      item.status = item.percent === 100 ? 'done' : 'uploading';
                    }
                    return item;
                  }),
                );
              },
            });
            const files = multiple
              ? listFiles.map((item: any) => {
                  if (item.id === dataFile.id) {
                    item = { ...item, ...data.data, status: 'done' };
                  }
                  return item;
                })
              : [{ ...data.data, status: 'done' }];
            isLoading.current = false;
            set_listFiles(files);
            onChange && (await onChange(files));
          } catch (e: any) {
            isLoading.current = false;
            set_listFiles(listFiles.filter((_item: any) => _item.id !== dataFile.id));
          }
        }
        setTimeout(() => GLightbox({}));
      }
    }
    ref.current.value = '';
  };
  const moverImage = async (index: number, new_index: number) => {
    if (multiple) {
      const files = array_move(listFiles, index, new_index);
      set_listFiles(files);
      onChange && (await onChange(files));
    }
  };

  const array_move = (arr: any[], old_index: number, new_index: number) => {
    if (new_index >= arr.length) {
      let k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr.filter((item) => !!item);
  };
  return (
    <Fragment>
      <div className={'mb-2 flex gap-2'}>
        <Button
          isLoading={isLoading.current}
          onClick={() => ref.current.click()}
          className={'!px-2 !py-0.5 !font-normal'}
          icon={<UploadSVG className={'size-4'} />}
          text={'Upload'}
        />
        <div
          onPaste={async (event) => {
            const items = event.clipboardData.items;
            for (const index in items) {
              const item = items[index];
              if (item.kind === 'file') {
                const blob = item.getAsFile();
                await onUpload({ target: { files: [blob] } });
              }
            }
          }}
          className={'cursor-pointer !px-2 !py-0.5 !font-normal'}
        >
          <Paste className={'size-4'} />
          Paste
        </div>
      </div>

      <input type="file" className={'hidden'} accept={accept} multiple={multiple} ref={ref} onChange={onUpload} />

      <div
        className={classNames({
          'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4': multiple,
          'w-24': !multiple,
        })}
      >
        {listFiles.map((file: any, index: number) => (
          <div
            key={index}
            className={classNames('relative', {
              'bg-yellow-100': file.status === 'error',
            })}
          >
            <a href={file[keyImage] ? file[keyImage] : file} className="glightbox">
              <img
                className={classNames('object-cover object-center h-24', {
                  'w-full': multiple,
                  'w-24': !multiple,
                })}
                src={file[keyImage] ? file[keyImage] : file}
                alt={file.name}
              />
            </a>
            {index > 0 && (
              <div
                onClick={() => moverImage(index, index - 1)}
                className={
                  'absolute right-1 top-1 flex size-6 cursor-pointer items-center justify-center rounded-full bg-gray-300 text-white transition-all duration-300 hover:bg-teal-900'
                }
              >
                <Arrow className={'size-3 rotate-180 fill-teal-700 hover:fill-white'} />
              </div>
            )}

            {index < listFiles.length - 1 && (
              <div
                onClick={() => moverImage(index, index + 1)}
                className={classNames(
                  'absolute right-1 bg-gray-300 hover:bg-teal-900 text-white rounded-full cursor-pointer w-6 h-6 transition-all duration-300 flex items-center justify-center',
                  {
                    'top-8': index > 0,
                    'top-1': index === 0,
                  },
                )}
              >
                <Arrow className={'size-3 fill-teal-700 hover:fill-white'} />
              </div>
            )}

            {showBtnDelete(file) && (
              <PopConfirm
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
                <Button
                  icon={<Times className={'size-3 fill-red-400 hover:fill-white'} />}
                  className={classNames(
                    '!bg-gray-300 !rounded-full absolute right-1 hover:!bg-red-500 text-white cursor-pointer w-6 h-6 transition-all duration-300 flex items-center justify-center',
                    {
                      'top-16 ': listFiles.length > 1 && index > 0 && index < listFiles.length - 1,
                      'top-8': listFiles.length > 1 && (index === 0 || index === listFiles.length - 1),
                      'top-1': listFiles.length === 1,
                    },
                  )}
                />
              </PopConfirm>
            )}
          </div>
        ))}
      </div>
    </Fragment>
  );
};