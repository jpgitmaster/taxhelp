import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation'; // Import useSearchParams

interface PropsDefinition {
  scss: { [key: string]: string };
}

const Breadcrumbs = ({ scss }: PropsDefinition) => {
  const pathname = usePathname(); // Get the current URL pathname (e.g., /cms/roles/create_role)
  const searchParams = useSearchParams(); // Get the current URL search parameters (e.g., ?roleID=1&active_page=assigned_users)

  // Convert searchParams to a string if they exist
  const queryString = searchParams.toString();
  const fullQueryString = queryString ? `?${queryString}` : ''; // Prepend '?' if there are parameters

  // Split the path into segments, filtering out any empty strings (e.g., from leading/trailing slashes)
  const pathSegments = pathname.split('/').filter(segment => segment.length > 0);

  // Function to capitalize and replace underscores/hyphens for display
  const formatBreadcrumbText = (segment: string) => {
    // Decode %20 and other encoded characters
    const decodedSegment = decodeURIComponent(segment);

    if (decodedSegment.startsWith('[') && decodedSegment.endsWith(']')) {
      return decodedSegment.slice(1, -1) // Remove brackets
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
    // Construct the href for each breadcrumb
    // This correctly builds the path segment by segment
    let href = '/' + pathSegments.slice(0, i + 1).join('/');

    // Append the full query string to the href
    // The query parameters will be included in all breadcrumb links
    href += fullQueryString;

    // Format the segment for display
    const displaySegment = formatBreadcrumbText(segment);

    return {
      breadcrumb: displaySegment,
      href: href,
    };
  });

  return (
    <div className={scss.breadcrumbs}>
      <ol>
        {breadcrumbs.map((breadcrumb, i) => (
          <li key={i} className={i === (breadcrumbs.length - 1) ? scss.active : ''}>
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