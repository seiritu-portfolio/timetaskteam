import React from 'react';

interface FooterWrapType {
  children: React.ReactNode;
  styleClass?: string;
}

const FooterWrap = (props: FooterWrapType) => {
  return (
    <div
      className={`${props.styleClass ?? ''} absolute bottom-0 h-68px w-full`}
    >
      {props.children}
    </div>
  );
};

export { FooterWrap, FooterSaveCancel, BtnListSaveCancel };

const FooterSaveCancel = ({
  onSave,
  onCancel,
  disabled,
}: {
  onSave: any;
  onCancel: any;
  disabled?: boolean;
}) => {
  return (
    <FooterWrap styleClass="flex justify-end items-center">
      <BtnListSaveCancel
        onSave={onSave}
        onCancel={onCancel}
        disabled={disabled}
      />
    </FooterWrap>
  );
};

const BtnListSaveCancel = ({
  onSave,
  onCancel,
  disabled,
}: {
  onSave: any;
  onCancel: any;
  disabled?: boolean;
}) => {
  return (
    <div className="flex flex-row items-center">
      <div
        className="p-8px body1 text-fontSecondary cursor-pointer"
        onClick={onCancel}
      >
        キャンセル
      </div>
      <div
        className={`ml-8px mr-16px p-8px body1 text-primary cursor-pointer ${
          disabled ? 'opacity-40' : ''
        }`}
        onClick={() => {
          if (disabled) {
          } else {
            onSave();
          }
        }}
      >
        保存
      </div>
    </div>
  );
};
