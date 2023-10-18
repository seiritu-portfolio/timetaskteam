import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-responsive-modal';

import CollaboListSelectRender from '@component/settings/CollaboListSelect';
import { guestsSelector, membersSelector } from '@store/selectors/collabos';
import { UserAllSelectable } from '@component/settings/userList/parts/UserRow';
import MagnifyGlassIcon from '@svg/magnifyingglass-big.svg';
import CloseIcon from '@svg/multiply.svg';
import CircledCloseIcon from '@svg/multiply-circle-fill-small.svg';
import ModalDefaultProps from '@model/modal';
import { IconWrap } from '@component/general/wrap';
import { DefaultInputWrap } from '@component/general/input';

interface ModalGroupMemberSelectProps extends ModalDefaultProps {
  selectedUsersIDs: number[];
  confirmBtnText?: string;
  onConfirm: (idsToAdd: number[]) => void;
}

const ModalGroupMemberSelect = ({
  isOpen,
  close,
  selectedUsersIDs,
  confirmBtnText,
  onConfirm,
}: ModalGroupMemberSelectProps) => {
  const [userIDList, setUserIDList] = useState<Array<number>>(selectedUsersIDs);
  const [collaboType, setCollaboType] = useState(0);
  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);

  const allSelected = React.useMemo(
    () =>
      (collaboType === 0 ? members : guests).filter(
        (_: any) => !userIDList.includes(_.id),
      ).length > 0
        ? false
        : true,
    [collaboType, userIDList, members, guests],
  );
  const membersIDList = React.useMemo(
    () => (members.length > 0 ? members.map((_: any) => _.id) : []),
    [members],
  );
  const guestsIDList = React.useMemo(
    () => (guests.length > 0 ? guests.map((_: any) => _.id) : []),
    [guests],
  );

  const [openSearch, setOpenSearch] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [inputReset, setInputReset] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setOpenSearch(false);
        close();
      }}
      center
      showCloseIcon={false}
      classNames={{
        overlay: 'modal-overlay',
        modal: 'modal-md-size',
        modalContainer: 'group-modal-select-member-container',
        root: 'group-modal-select-member-root',
      }}
      onOverlayClick={() => {
        setOpenSearch(false);
        close();
      }}
    >
      <div className="p-36px w-full h-full flex flex-col justify-between">
        <div className="h-48px flex-row--between">
          {openSearch ? (
            <>
              <IconWrap
                additionalClass="bg-backgroundPrimary text-fontPrimary hover:bg-primarySelected hover:text-primary cursor-pointer"
                onClick={() => {
                  setOpenSearch(false);
                  setSearch('');
                }}
              >
                <CloseIcon width={20} height={20} />
              </IconWrap>
              <DefaultInputWrap additionalPositionClass="flex-1 ml-24px">
                <input
                  ref={searchRef}
                  type="text"
                  onChange={(e) => {
                    if (e.target.value !== '') {
                      setInputReset(true);
                    } else {
                      setInputReset(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearch(searchRef.current?.value ?? '');
                    }
                  }}
                  className="flex-1 bg-backgroundPrimary focus:outline-none"
                />
                {inputReset ? (
                  <CircledCloseIcon
                    width="20"
                    height="20"
                    className="text-fontSecondary"
                    onClick={() => {
                      if (searchRef.current) {
                        searchRef.current.value = '';
                        setInputReset(false);
                      }
                    }}
                  />
                ) : null}
              </DefaultInputWrap>
            </>
          ) : (
            <>
              <h3 className="big-title text-fontPrimary">グループメンバー</h3>
              <div className="h-44px w-44px rounded-8px bg-backgroundTertiary text-fontPrimary flex-xy-center cursor-pointer">
                <MagnifyGlassIcon
                  className=""
                  width={24}
                  height={24}
                  onClick={() => {
                    setOpenSearch(true);
                  }}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col justify-start">
          <div className="mt-12px py-12px h-68px w-full rounded-6px flex flex-row items-center">
            <div
              className={`flex-1 h-44px rounded-l-6px bg-backgroundPrimary button text-${
                collaboType === 0 ? 'fontPrimary' : 'fontSecondary'
              } flex-xy-center cursor-pointer`}
              onClick={() => setCollaboType(0)}
            >
              <span>メンバー</span>
            </div>
            <div
              className={`flex-1 h-44px rounded-r-6px bg-backgroundPrimary button text-${
                collaboType === 1 ? 'fontPrimary' : 'fontSecondary'
              } flex-xy-center cursor-pointer`}
              onClick={() => setCollaboType(1)}
            >
              <span>ゲスト</span>
            </div>
          </div>
          <div className="mt-14px max-h-200px overflow-y-auto flex flex-row flex-wrap">
            <UserAllSelectable
              selected={allSelected}
              onSelect={() => {
                const currentTypeUserIDsList =
                  collaboType === 0 ? membersIDList : guestsIDList;
                const filteredOutArray = userIDList.filter(
                  (_: number) => !currentTypeUserIDsList.includes(_),
                );
                if (allSelected) {
                  setUserIDList([...filteredOutArray]);
                } else {
                  setUserIDList([
                    ...filteredOutArray,
                    ...currentTypeUserIDsList,
                  ]);
                }
              }}
              additionalPositionClass="mr-24px mb-12px"
            />
            <CollaboListSelectRender
              listIndex={collaboType}
              usersList={(() => {
                const renderList = collaboType === 0 ? members : guests;
                const filtered = renderList.filter((_) =>
                  _.name.includes(search),
                );
                return filtered;
              })()}
              onToggle={(id) => {
                userIDList.includes(id)
                  ? setUserIDList(userIDList.filter((_: number) => _ !== id))
                  : setUserIDList([...userIDList, id]);
              }}
              selectedIDsArray={userIDList}
            />
          </div>
        </div>
        <div className="mt-36px flex flex-row justify-end items-center">
          <span
            onClick={() => {
              setOpenSearch(false);
              close();
            }}
            className="button text-fontSecondary cursor-pointer"
          >
            キャンセル
          </span>
          <button
            className="ml-24px px-24px h-44px rounded-8px bg-primary button text-backgroundSecondary disabled:opacity-40"
            disabled={userIDList.length === 0}
            onClick={() => {
              onConfirm(userIDList);
            }}
          >
            {confirmBtnText ?? '次へ'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalGroupMemberSelect;
