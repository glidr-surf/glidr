import { DimensionPicker } from './DimensionPicker';

export interface Dims {
  length: number | null;
  width: number | null;
  thickness: number | null;
  volume: number | null;
}

export const EMPTY_DIMS: Dims = { length: null, width: null, thickness: null, volume: null };

/** The shared board-dimension inputs (length/width/thickness/volume), reused by add-board and the rate flow. */
export function DimensionFields({ value, onChange }: { value: Dims; onChange: (dims: Dims) => void }) {
  return (
    <>
      <DimensionPicker kind="length" value={value.length} onChange={(v) => onChange({ ...value, length: v })} />
      <DimensionPicker kind="width" value={value.width} onChange={(v) => onChange({ ...value, width: v })} />
      <DimensionPicker kind="thickness" value={value.thickness} onChange={(v) => onChange({ ...value, thickness: v })} />
      <DimensionPicker kind="volume" value={value.volume} onChange={(v) => onChange({ ...value, volume: v })} />
    </>
  );
}
