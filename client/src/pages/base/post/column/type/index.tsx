import slug from 'slug';

import { EFormRuleType, EFormType } from '@/enums';
import type { IForm } from '@/types';
import { loopMapSelect } from '@/utils';
import { useTranslation } from 'react-i18next';

export default {
  useForm: (id?: string, tree?: any[]): IForm[] => {
    const { t } = useTranslation('locale', { keyPrefix: 'pages.base.post' });

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
          type: id ? EFormType.hidden : EFormType.text,
        },
      },
      {
        title: t('Subtype'),
        name: 'post_type_id',
        formItem: {
          type: id ? EFormType.hidden : EFormType.treeSelect,
          list: loopMapSelect(tree),
        },
      },
    ];
  },
};
