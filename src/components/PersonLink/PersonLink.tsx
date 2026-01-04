import type { PersonLinkProps } from '../../types/PersonLinkProps';

export const PersonLink = ({ person, personName }: PersonLinkProps) => {
  if (person) {
    const isFemale = person.sex === 'f';

    return (
      <a
        href="#"
        className={isFemale ? 'has-text-danger' : 'has-text-info'}
        onClick={e => e.preventDefault()}
      >
        {person.name}
      </a>
    );
  }

  if (personName) {
    return <span>{personName}</span>;
  }

  return null;
};
