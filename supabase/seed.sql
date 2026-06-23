-- Optional dev seed. Run after 0001_init.sql.
-- Categories mirror common TOTO bathroom product lines.

insert into public.categories (slug, name, description, sort_order) values
  ('new-arrivals', '新品上市', '最新引進的 TOTO 衛浴商品', 0),
  ('toilets',      '馬桶',     '單體式 / 分離式智慧馬桶與免治馬桶', 1),
  ('washlets',     '免治馬桶座', 'WASHLET 溫水洗淨便座', 2),
  ('faucets',      '面盆龍頭',  '臉盆與廚房龍頭', 3),
  ('basins',       '面盆',     '檯面盆與壁掛面盆', 4),
  ('showers',      '淋浴龍頭',  '淋浴柱與花灑系統', 5),
  ('bathtubs',     '浴缸',     '獨立式與嵌入式浴缸', 6)
on conflict (slug) do nothing;

-- Sample products (no images yet) so the grid renders during local dev.
insert into public.products (slug, name, description, category_id, model_number, price, is_published, is_new, sort_order)
select
  v.slug, v.name, v.description,
  c.id, v.model_number, v.price, true, true, v.sort_order
from (values
  ('neorest-nx2', 'NEOREST NX2 智慧型全自動馬桶', '頂級一體成型智慧馬桶，搭載 EWATER+ 除菌與自動掀蓋。', 'toilets', 'CS989VX', 268000, 0),
  ('washlet-sw', 'WASHLET SW 溫水洗淨便座', '溫水洗淨、暖座與除臭一體式便座。', 'washlets', 'TCF6631', 19800, 1),
  ('gc-faucet', 'GC 系列單孔面盆龍頭', '簡約方形設計單把手面盆龍頭。', 'faucets', 'TLG10301', 8900, 2),
  ('le-muse-basin', 'LE MUSE 檯面式面盆', '日本製陶瓷檯面盆，CEFIONTECT 奈米級釉面。', 'basins', 'LW1714B', 15600, 3)
) as v(slug, name, description, cat_slug, model_number, price, sort_order)
join public.categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;
