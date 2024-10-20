export type BlogArticleFrontmatter = {
  date: Date;
  title: string;
  description: string;
  categories: string[];
  imageUrl?: string;
  imageAltText?: string;
};

export function validateFrontMatter(attributes: unknown): attributes is BlogArticleFrontmatter {
  return (
    !!attributes &&
    typeof attributes === 'object' &&
    'title' in attributes &&
    typeof attributes.title === 'string' &&
    'description' in attributes &&
    typeof attributes.description === 'string' &&
    'categories' in attributes &&
    Array.isArray(attributes.categories) &&
    'date' in attributes &&
    attributes.date instanceof Date
  );
}
