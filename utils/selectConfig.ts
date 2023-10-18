import { StylesConfig } from 'react-select';

import {
  DefaultOptionType,
  GroupSelectProps,
  IconSelectProps,
} from '@model/input';

type IsMulti = boolean;

const defaultSettingObject = {
  control: (provided: any, state: any) => ({
    ...provided,
    paddingLeft: '16px',
    paddingRight: '16px',
    height: '44px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    border: 0,
    boxShadow: 'none',
  }),
  container: (provided: any, state: any) => ({
    ...provided,
    height: '44px',
  }),
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    padding: 0,
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    padding: 0,
    borderRadius: '6px',
    border: 'solid 0.5px #eaeaea',
    boxShadow: '0 0 12px 0 rgba(0, 0, 0, 0.12)',
  }),
  menuList: (provided: any, state: any) => ({
    ...provided,
    padding: 0,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    // marginRight: '12px',
    // marginLeft: '12px',
    width: 'auto',
    height: '44px',
    borderRadius: '6px',
    color: '#000000DF',
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: '#007aff14',
      color: '#007aff',
    },
  }),
};

const defaultSelectStyles: StylesConfig<DefaultOptionType, IsMulti> = {
  ...defaultSettingObject,
};

export const defaultSelectStyles02: StylesConfig<DefaultOptionType, IsMulti> = {
  ...defaultSelectStyles,
  menu: (provided: any, state: any) => ({
    ...provided,
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '6px',
    // border: 'solid 0.5px #eaeaea',
    boxShadow: '0 0 12px 0 rgba(0, 0, 0, 0.12)',
  }),
  menuList: (provided: any, state: any) => ({
    ...provided,
    padding: 0,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '6px',
    cursor: 'pointer',
  }),
};

export const listSelectStyles: StylesConfig<DefaultOptionType, IsMulti> = {
  ...defaultSelectStyles,
  menu: (provided, state) => ({
    ...provided,
    marginLeft: '0px',
    // paddingTop: '12px',
    // paddingBottom: '12px',
    width: '270px',
    height: '200px',
    borderRadius: '8px',
    border: 'solid 0.5px #eaeaea',
    boxShadow: '0 0 12px 0 rgba(0, 0, 0, 0.12)',
    overflow: 'auto',
  }),
  control: (provided, state) => ({
    ...provided,
    padding: 0,
    width: '280px',
    borderRadius: '8px',
    border: 0,
    backgroundColor: '#f1f1f1',
    boxShadow: 'none',
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    padding: 0,
    width: '280px',
    border: 1,
    borderColor: 'red',
  }),
  singleValue: (provided, state) => ({
    ...provided,
    width: '248px',
    border: 1,
    borderColor: 'red',
  }),
};

// for selects at task create/edit
export const importanceSelectStyles: StylesConfig<DefaultOptionType, IsMulti> =
  {
    ...defaultSelectStyles,
    control: (provided) => ({
      ...provided,
      width: '145px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#f9f9f9',
    }),
  };

// for groups multi select style
export const groupsSelectStyle: StylesConfig<GroupSelectProps, IsMulti> = {
  ...defaultSettingObject,
};

// for list public private select
export const listPublicSelectStyles: StylesConfig<IconSelectProps, false> = {
  ...defaultSettingObject,
};

// for icon select
export const iconSelectStyles: StylesConfig<IconSelectProps, false> = {
  ...defaultSettingObject,
  menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
};

export default defaultSelectStyles;
