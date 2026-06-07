-- Board dimensions: text -> numeric (decimal inches for length/width/thickness, litres for volume).
-- Converts existing text values: width/thickness/volume strip the unit; length parses feet'inches.
alter table boards
  alter column width type numeric using nullif(regexp_replace(width, '[^0-9.]', '', 'g'), '')::numeric,
  alter column thickness type numeric using nullif(regexp_replace(thickness, '[^0-9.]', '', 'g'), '')::numeric,
  alter column volume type numeric using nullif(regexp_replace(volume, '[^0-9.]', '', 'g'), '')::numeric,
  alter column length type numeric using (
    case
      when length is null then null
      else nullif(split_part(length, '''', 1), '')::numeric * 12
         + coalesce(nullif(regexp_replace(split_part(length, '''', 2), '[^0-9.]', '', 'g'), '')::numeric, 0)
    end
  );
