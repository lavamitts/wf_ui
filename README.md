# The UI

## Examples

### 411410 - Chamois leather

Shows difference between UA and GB

Has:
- Sevastopol - prohibitions > 10
- CITES - restriction > 8
- Seal - resriction > 8

### 200710 - Homogenised preparations

Shows that there are a tonne of countries (like AZ and BO) where the import origin counts, as there is a CHED requiremnt

Has:
- nothing on GB trade, so just shows fine as  6 digit trade
- a CHED-D on a bunch of others like Bolivia, so asks

```
TO DO
- Complete the 8 digit and 10 digit flows
- Add in the 1011 countries
- Add in divergence at the end


```



```
select left(m.goods_nomenclature_item_id, 6) as subheading, m.measure_type_id, count(m.*)
from utils.materialized_measures_real_end_dates m,
utils.measure_types mt
where m.measure_type_id = mt.measure_type_id 
and (m.validity_end_date is null or m.validity_end_date::date >= current_date)
and m.validity_start_date::date <= current_date
and mt.trade_movement_code != '1'
and m.measure_type_id <= '999'
and mt.measure_type_series_id in ('A', 'B')
and m.goods_nomenclature_item_id is not null
group by left(m.goods_nomenclature_item_id, 6), m.measure_type_id 
order by 3 desc;

```