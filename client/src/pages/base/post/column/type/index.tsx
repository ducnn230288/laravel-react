import slug from 'slug';

import { EFormRuleType, EFormType } from '@/enums';
import { SCrud } from '@/services';
import type { IForm } from '@/types';
import type { IMPost, IMPostType } from '@/types/model';
import { loopMapSelect } from '@/utils';
import { useTranslation } from 'react-i18next';

export default {
  useForm: (): IForm[] => {
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });
    const sCrud = SCrud<IMPost, IMPostType>('Post', 'PostType');

    return [
      {
        title: t('Name type'),
        name: 'name',
        formItem: {
          rules: [{ type: EFormRuleType.required }],
          onBlur: (value, form) => {
            if (value && !form.getFieldValue('code')) form.setFieldValue('code', slug(value).toUpperCase());
          },
        },
      },
      {
        title: t('Code type'),
        name: 'code',
        formItem: {
          rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.max, value: 100 }],
          type: sCrud.dataType?.id ? EFormType.hidden : EFormType.text,
        },
      },
      {
        title: t('Subtype'),
        name: 'post_type_id',
        formItem: {
          type: sCrud.dataType?.id ? EFormType.hidden : EFormType.treeSelect,
          list: loopMapSelect(sCrud.resultType?.data),
        },
      },
    ];
  },
};
