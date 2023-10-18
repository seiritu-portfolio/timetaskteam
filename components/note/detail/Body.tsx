import { useEffect, useRef, useState } from 'react';

const Body = ({
  id,
  isCreate,
  isEditable,
  title,
  note,
  onAddNote,
}: {
  id: number;
  isCreate: boolean;
  isEditable: boolean;
  title?: string;
  note?: string;
  onAddNote: (newTitle: string, newNote: string) => void;
}) => {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const noteRef = useRef<HTMLTextAreaElement | null>(null);
  const [isInit, setIsInit] = useState(false);
  useEffect(() => {
    setIsInit(true);
  }, [id, isCreate]);

  useEffect(() => {
    if (isCreate && isInit) {
      if (titleRef.current) {
        titleRef.current.value = '';
      }
      if (noteRef.current) {
        noteRef.current.value = '';
      }
      setIsInit(false);
    } else if (isInit) {
      if (titleRef.current) {
        titleRef.current.value = title ?? '';
      }
      if (noteRef.current) {
        noteRef.current.value = note ?? '';
      }
      setIsInit(false);
    }
  }, [isCreate, note, title, isInit]);

  return (
    <div className="flex-1 med-title text-fontPrimary flex flex-col justify-between">
      <div className="flex-1 py-24px px-24px max-w-620px med-title flex flex-col">
        <input
          ref={titleRef}
          onChange={(e) => {
            const newTitle = e.target.value;
            const newNote = noteRef.current?.value ?? '';
            onAddNote(newTitle, newNote);
          }}
          onKeyUp={(e) => {
            if ((e.key === 'Enter' || e.keyCode === 13) && noteRef.current) {
              noteRef.current.focus();
            }
          }}
          disabled={!isEditable}
          placeholder="新規ノート"
          className="focus:outline-none placeholder:text-fontSecondary disabled:bg-backgroundSecondary text-fontPrimary med-title font-semibold"
        />
        <div className="mt-1 border border-separator" />
        <textarea
          ref={noteRef}
          onChange={(e) => {
            const newNote = e.target.value;
            const newTitle = titleRef.current?.value ?? '';
            onAddNote(newTitle, newNote);
          }}
          disabled={!isEditable}
          className="mt-16px focus:outline-none disabled:bg-backgroundSecondary placeholder:text-fontSecondary text-fontPrimary flex-1 body1 "
        />
      </div>
      <div
        className={`flex-0 flex-none px-24px py-12px border-t border-separator flex flex-row items-center justify-end ${
          false ? '' : 'hidden'
        }`}
      >
        <span
          className={`p-12px body1 text-fontSecondary cursor-pointer`}
          onClick={() => {}}
        >
          キャンセル
        </span>
        <button
          className={`p-12px rounded-sm body1 text-primary cursor-pointer hover:bg-primarySelected`}
          onClick={() => onAddNote(title ?? '', note ?? '')}
          disabled={true}
        >
          保存
        </button>
      </div>
    </div>
  );
};

export default Body;
