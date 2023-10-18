import dayjs from 'dayjs';

const NoteItem = (props: any) => {
  return (
    <div className="py-4px px-8px border-b border-separator">
      <div
        onClick={props.onClick}
        className={`px-16px py-8px rounded-8px text-fontPrimary flex flex-col ${
          props.isActive ? 'bg-primarySelected text-primary' : ''
        } hover:bg-primarySelected hover:text-primary`}
      >
        <span
          className={`med-title ${props.viewed ? 'font-normal' : 'font-bold'}`}
        >
          {props.title ? props.title : '新規ノート'}
        </span>
        <div className="mt-4px body2 flex items-center">
          <span className="body2-en text-fontPrimary">
            {dayjs(props.updated_at).format('YYYY/MM/DD')}
          </span>
          <span className="ml-12px body2 truncate">{props.memo}</span>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
