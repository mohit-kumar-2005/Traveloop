import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Input from '../common/Input.jsx';
import Loader from '../common/Loader.jsx';
import Card from '../common/Card.jsx';
import * as cityService from '../../services/cityService.js';
import { debounce } from '../../utils/helpers.js';
import { REGIONS } from '../../utils/constants.js';

export default function CitySearch({ onPickCity, mode = 'page' }) {
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('popularity');

  const debounced = useMemo(() => debounce((v) => setSearch(v), 300), []);

  useEffect(() => {
    debounced(q);
  }, [q, debounced]);

  const { data, isLoading } = useQuery({
    queryKey: ['cities', { search, region, page, sort }],
    queryFn: () =>
      cityService.fetchCities({
        search: search || undefined,
        region: region === 'All' ? undefined : region,
        page,
        limit: 12,
        sort: sort === 'popularity' ? undefined : sort,
      }),
  });

  return (
    <div className={mode === 'page' ? 'space-y-6' : 'space-y-4 max-h-[60vh] overflow-y-auto'}>
      {mode === 'page' && <h1 className="text-3xl font-bold">Explore cities</h1>}
      <Input
        autoFocus
        placeholder="Search cities or countries..."
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setPage(1);
        }}
        className="text-lg"
      />
      <div className="flex flex-wrap gap-2">
        {REGIONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => {
              setRegion(r);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
              region === r ? 'border-primary bg-teal-50 text-primary-dark' : 'border-slate-200 bg-white'
            }`}
          >
            {r}
          </button>
        ))}
      </div>
      <div className="flex gap-4 text-sm items-center">
        <span className="text-muted">Sort:</span>
        <button
          type="button"
          className={sort === 'popularity' ? 'font-semibold text-primary-dark' : ''}
          onClick={() => setSort('popularity')}
        >
          Popularity
        </button>
        <button
          type="button"
          className={sort === 'cost' ? 'font-semibold text-primary-dark' : ''}
          onClick={() => setSort('cost')}
        >
          Cost (low→high)
        </button>
        <button
          type="button"
          className={sort === 'name' ? 'font-semibold text-primary-dark' : ''}
          onClick={() => setSort('name')}
        >
          A–Z
        </button>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {(data?.cities || []).map((city) => (
            <Card key={city._id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img src={city.coverImage} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white space-y-1">
                  <p className="font-bold text-lg">{city.name}</p>
                  <p className="text-sm">{city.country}</p>
                  <p className="text-xs">{'$'.repeat(city.costIndex)} cost index</p>
                </div>
              </div>
              <div className="p-4 flex justify-between gap-2">
                {onPickCity ? (
                  <button
                    type="button"
                    className="text-sm font-semibold text-primary-dark min-h-[44px]"
                    onClick={() => onPickCity(city)}
                  >
                    Select city
                  </button>
                ) : (
                  <span className="text-sm text-muted">View details</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      {data?.pages > page && (
        <button
          type="button"
          className="w-full py-3 rounded-xl border border-slate-200 bg-white font-medium"
          onClick={() => setPage((p) => p + 1)}
        >
          Load more
        </button>
      )}
    </div>
  );
}
