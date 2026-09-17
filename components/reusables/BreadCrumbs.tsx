import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PropsDefinition {
  scss: { [key: string]: string };
}

const Breadcrumbs = ({ scss }: PropsDefinition) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();
  const fullQueryString = queryString ? `?${queryString}` : '';

  const pathSegments = pathname
    .split('/')
    .filter(segment => segment.length > 0);

  const formatBreadcrumbText = (segment: string) => {
    const decodedSegment = decodeURIComponent(segment);

    if (decodedSegment.startsWith('[') && decodedSegment.endsWith(']')) {
      return decodedSegment
        .slice(1, -1)
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    return decodedSegment
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const breadcrumbs = pathSegments.map((segment, i) => {
    let href = '/' + pathSegments.slice(0, i + 1).join('/');
    href += fullQueryString;

    const isActive =
      i === pathSegments.length - 1 ||
      ['bookkeeper', 'users', 'file_generator'].includes(segment);

    return {
      breadcrumb: formatBreadcrumbText(segment),
      href,
      isActive,
    };
  });

  return (
    <div className={scss.breadcrumbs}>
      <ol>
        {breadcrumbs.map((breadcrumb, i) => (
          <li
            key={i}
            className={breadcrumb.isActive ? scss.active : ''}
          >
            <Link href={breadcrumb.href}>
              {breadcrumb.breadcrumb}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Breadcrumbs;