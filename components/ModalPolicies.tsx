import { useState } from 'react';
import Modal from 'react-responsive-modal';

import ModalDefaultProps from '@model/modal';

const ModalPolicies = ({ isOpen, close }: ModalDefaultProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Modal
      open={isOpen}
      onClose={close}
      center
      showCloseIcon={false}
      classNames={{
        modal: 'modal-md-size',
      }}
    >
      <div className="p-36px w-full">
        <div className="big-title-light text-fontPrimary">
          利用規約・ポリシー
        </div>
        <div className="mt-36px w-full h-40px rounded-6px border-2 border-backgroundSecondary bg-backgroundPrimary body3 flex cursor-pointer">
          <span
            className={`flex-1 flex-xy-center ${
              activeTab === 1 && 'text-fontSecondary'
            }`}
            onClick={() => {
              setActiveTab(0);
            }}
          >
            利用規約
          </span>
          <span
            className={`flex-1 flex-xy-center ${
              activeTab === 0 && 'text-fontSecondary'
            }`}
            onClick={() => {
              setActiveTab(1);
            }}
          >
            プライバシーポリシー
          </span>
        </div>
        <div className="mt-24px body1">
          {activeTab === 0 ? (
            <>
              〇〇の利用規約（以下，「本規約」といいます。）は，＿＿＿＿＿（以下，「当社」といいます。）がこのウェブサイト上で提供するサービス（以下，「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。
              <br />
              <br />
              第1条（適用）
              <br />
              <br />
              本規約は，ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。
              当社は本サービスに関し，本規約のほか，ご利用にあたってのルール等，各種の定め（以下，「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず，本規約の一部を構成するものとします。
              本規約の規定が前条の個別規定の規定と矛盾する場合には，個別規定において特段の定めなき限り，個別規定の規定が優先されるものとします。
              第2条（利用登録）
              本サービスにおいては，登録希望者が本規約に同意の上，当社の定める方法によって利用登録を申請し，当社がこれを承認することによって，利用登録が完了するものとします。
              当社は，利用登録の申請者に以下の事由があると判断した場合，利用登録の申請を承認しないことがあり，その理由については一切の開示義務を負わないものとします。
              利用登録の申請に際して虚偽の事項を届け出た場合
              本規約に違反したことがある者からの申請である場合
              その他，当社が利用登録を相当でないと判断した場合
              第3条（ユーザーIDおよびパスワードの管理）
              第4条（利用料金および支払方法）
            </>
          ) : null}
        </div>
        <div className="mt-36px flex justify-end">
          <button
            className="ml-24px px-24px h-44px rounded-8px bg-primary button text-backgroundSecondary"
            onClick={close}
          >
            閉じる
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPolicies;
