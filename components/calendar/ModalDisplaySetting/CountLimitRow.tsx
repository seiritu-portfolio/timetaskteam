import { CountLimitSelect } from '@component/home/Selects';
import Switch from 'react-switch';

const CountLimitRow = ({
  desc,
  count,
  setCount,
}: {
  desc: string;
  count: number;
  setCount: (newValue: number) => void;
}) => {
  return (
    <div className={`p-12px rounded-6px flex-row--between`}>
      <div
        className="flex-1 mr-12px flex-row--between focus:outline-none"
        tabIndex={2}
      >
        <span className="body3 text-fontPrimary truncate">{desc}</span>
        <span className="body2-en">
          <CountLimitSelect
            value={count}
            onChange={(newValue: number) => {
              setCount(newValue);
            }}
            type="desc"
          />
          {/* {count} */}
        </span>
      </div>
      <Switch
        onChange={(e) => {
          setCount(e ? 1 : 0);
        }}
        checked={count !== 0}
        offColor="#888"
        onColor="#007aff"
        width={38}
        height={20}
        handleDiameter={18}
        uncheckedIcon={false}
        checkedIcon={false}
      />
    </div>
  );
};

export default CountLimitRow;
