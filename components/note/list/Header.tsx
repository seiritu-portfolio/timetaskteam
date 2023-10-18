import { useRef, useState } from 'react';
// * components
import MoreMenu from './MoreMenu';
import { IconWrapForCalendar } from '@component/general/wrap';
// * assets
import MagnifyGlassIcon from '@svg/magnifyingglass-big.svg';
import CloseIcon from '@svg/multiply.svg';

const ListHeader = ({
  title,
  noMenu,
  setSearch,
}: {
  title: string;
  noMenu?: boolean;
  setSearch: (newValue: string) => void;
}) => {
  const [isSearch, setIsSearch] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="py-16px pr-16px pl-24px border-b border-separator flex-row--between">
      {isSearch ? (
        <>
          <input
            ref={searchRef}
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearch(searchRef.current?.value ?? '');
              }
            }}
            className="flex-1 px-16px h-36px rounded-8px bg-backgroundPrimary text-fontPrimary focus:outline-none"
          />
          <IconWrapForCalendar
            onClick={() => {
              setIsSearch(false);
              setSearch('');
            }}
            additionalClass="ml-8px flex-none rounded-8px bg-backgroundPrimary text-fontPrimary cursor-pointer"
          >
            <CloseIcon width={20} height={20} />
          </IconWrapForCalendar>
        </>
      ) : (
        <>
          <span className="flex-1 med-title font-semibold">{title}</span>
          <MagnifyGlassIcon
            onClick={() => {
              setIsSearch(true);
            }}
            width={20}
            height={20}
            className="cursor-pointer hover:opacity-70"
          />
          {noMenu ? null : <MoreMenu />}
        </>
      )}
    </div>
  );
};

export default ListHeader;
