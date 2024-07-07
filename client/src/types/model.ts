import type { IUser } from '@/services';
interface ICommon {
  id?: string;
  createdAt?: string;
  isDisable?: boolean;
}
export interface IMCode extends ICommon {
  code?: string;
  type?: string;
  name?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  item?: IMCodeType;
  users?: IUser[];
}

export interface IMCodeType extends ICommon {
  name: string;
  code: string;
  isPrimary: boolean;
  createdAt?: string;
  updatedAt?: string;
  items?: IMCode[];
}
export interface IMContent extends ICommon {
  name?: string;
  type?: string;
  image?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  item?: IContentType;
  languages?: {
    id: string;
    language?: string;
    name: string;
    description?: string;
    position?: string;
    content?: string;
    dataId?: string;
    createdAt?: string;
    updatedAt?: string;
  }[];
}

export interface IContentType extends ICommon {
  name: string;
  code: string;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
  items?: IMContent[];
}

export interface IMParameter extends ICommon {
  name?: string;
  code?: string;
  vn?: string;
  en?: string;
  updatedAt?: string;
}

export interface IMPost extends ICommon {
  type?: string;
  thumbnailUrl?: string;
  item?: IMPostType;
  languages?: {
    language?: string;
    name: string;
    description?: string;
    slug: string;
    content?: string;
    postId?: string;
    post?: IMPost;
  }[];
}

export interface IMPostType extends ICommon {
  name: string;
  code: string;
  description: string;
  postTypeId: string;
  createdAt?: string;
  updatedAt?: string;
  items?: IMPost[];
  children?: IMPostType[];
}

export interface IMUser extends ICommon {
  name?: string;
  avatar?: string;
  password?: string;
  email?: string;
  phoneNumber?: string;
  dob?: string;
  description?: string;
  positionCode?: string;
  position?: IMCode;
  retypedPassword?: string;
  roleCode?: string;
  role?: IMUserRole;
  createdAt?: string;
  updatedAt?: string;
  isDisable?: boolean;
}

export interface IMUserRole extends ICommon {
  name?: string;
  code?: string;
  isSystemAdmin?: boolean;
  permissions?: string[];
  users?: IUser[];
  createdAt?: string;
  updatedAt?: string;
}
