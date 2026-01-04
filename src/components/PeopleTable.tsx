import { useEffect, useState } from 'react';
import { PeopleItem } from './PeopleItem/PeopleItem';
import type { PeopleListType } from '../types/PeopleListType';
import { Person } from '../types';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';

/* eslint-disable jsx-a11y/control-has-associated-label */

interface PeopleTableProps extends PeopleListType {
  originalPeoplelist?: Person[];
}

export const PeopleTable = ({
  peoplelist,
  originalPeoplelist,
  loader,
  errortext,
  onPeople,
}: PeopleTableProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [warning, setWarning] = useState<string>('');

  const sortName = searchParams.get('sort');
  const sortOrder = searchParams.get('order');

  const originalList = originalPeoplelist || [];

  const handleSortField = (fieldName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentSort = params.get('sort');
    const currentOrder = params.get('order');

    if (currentSort !== fieldName) {
      params.set('sort', fieldName);
      params.delete('order');
    } else if (!currentOrder) {
      params.set('order', 'desc');
    } else {
      params.delete('sort');
      params.delete('order');
    }

    setSearchParams(params);
  };

  const sortBy = (nameField: string, order: 'asc' | 'desc' = 'asc') => {
    try {
      const sorted = [...originalList].sort((a, b) => {
        const valueA =
          (a[nameField as keyof Person] as Person)?.toString().toLowerCase() ||
          '';
        const valueB =
          (b[nameField as keyof Person] as Person)?.toString().toLowerCase() ||
          '';
        const compare = valueA.localeCompare(valueB);

        return order === 'asc' ? compare : -compare;
      });

      onPeople(sorted);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error sorting:', error);
      onPeople([...originalList]);
    }
  };

  useEffect(() => {
    if (originalList.length === 0) {
      return;
    }

    if (sortName) {
      const order = (sortOrder as 'asc' | 'desc') || 'asc';

      sortBy(sortName, order);
    } else {
      onPeople([...originalList]);
    }
  }, [sortName, sortOrder]);

  const getSortIcon = (fieldName: string) => {
    if (sortName !== fieldName) {
      return 'fa-sort';
    }

    return sortOrder === 'desc' ? 'fa-sort-down' : 'fa-sort-up';
  };

  return (
    <>
      {!loader &&
        (peoplelist.length > 0 ? (
          <table
            data-cy="peopleTable"
            className="table is-striped is-hoverable is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Name
                    <a
                      href="#/people"
                      onClick={e => {
                        e.preventDefault();
                        handleSortField('name');
                      }}
                    >
                      <span className="icon">
                        <i className={classNames('fas', getSortIcon('name'))} />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Sex
                    <a
                      href="#/people"
                      onClick={e => {
                        e.preventDefault();
                        handleSortField('sex');
                      }}
                    >
                      <span className="icon">
                        <i className={classNames('fas', getSortIcon('sex'))} />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Born
                    <a
                      href="#/people"
                      onClick={e => {
                        e.preventDefault();
                        handleSortField('born');
                      }}
                    >
                      <span className="icon">
                        <i className={classNames('fas', getSortIcon('born'))} />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Died
                    <a
                      href="#/people"
                      onClick={e => {
                        e.preventDefault();
                        handleSortField('died');
                      }}
                    >
                      <span className="icon">
                        <i className={classNames('fas', getSortIcon('died'))} />
                      </span>
                    </a>
                  </span>
                </th>

                <th>Mother</th>
                <th>Father</th>
              </tr>
            </thead>

            <tbody>
              {peoplelist?.map(persons => (
                <PeopleItem
                  key={persons.slug}
                  person={persons}
                  people={peoplelist}
                  warning={warning}
                  onWarning={setWarning}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <span data-cy="noPeopleMessage">{errortext}</span>
        ))}
    </>
  );
};
