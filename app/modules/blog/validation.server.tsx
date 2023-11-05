export type BlogArticleFrontmatter = {
  date: string;
  title: string;
  description: string;
  categories: string[];
  imageUrl?: string;
  imageAltText?: string;
};

export function validateFrontMatter(attributes: unknown): attributes is BlogArticleFrontmatter {
  return (
    !!attributes &&
    typeof attributes !== 'function' &&
    typeof attributes === 'object' &&
    typeof (attributes as any)['title'] === 'string' &&
    typeof (attributes as any)['description'] === 'string' &&
    Array.isArray((attributes as any)['categories']) &&
    typeof (attributes as any)['date'] === 'object'
  );
}
