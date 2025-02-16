import { create } from "zustand";

export interface Article {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  addedAt: Date;
  readAt?: Date;
  isArchived: boolean;
}

interface ReadingListState {
  // Data
  articles: Article[];
  filters: {
    search: string;
    tags: string[];
    status: "all" | "unread" | "read" | "archived";
  };

  // View preferences
  viewMode: "grid" | "list";
  sortBy: "date" | "title" | "status";
  sortDirection: "asc" | "desc";

  // Actions
  addArticle: (article: Omit<Article, "id" | "addedAt">) => void;
  removeArticle: (id: string) => void;
  toggleRead: (id: string) => void;
  toggleArchived: (id: string) => void;
  updateFilters: (filters: Partial<ReadingListState["filters"]>) => void;
  addTag: (articleId: string, tag: string) => void;
  removeTag: (articleId: string, tag: string) => void;
  toggleViewMode: () => void;
  updateSort: (sort: {
    by: "date" | "title" | "status";
    direction: "asc" | "desc";
  }) => void;

  // Computed getters
  getFilteredArticles: () => Article[];
  getAllTags: () => string[];
}

const sampleArticles: Article[] = [
  {
    id: "1",
    title: "Pride and Prejudice",
    url: "https://www.gutenberg.org/files/1342/1342-h/1342-h.htm",
    description:
      "A classic novel of manners by Jane Austen. Elizabeth Bennet learns the error of making hasty judgments.",
    tags: ["classic", "romance", "literature"],
    addedAt: new Date("2024-01-15"),
    isArchived: false,
  },
  {
    id: "2",
    title: "The Great Gatsby",
    url: "https://www.gutenberg.org/files/64317/64317-h/64317-h.htm",
    description:
      "F. Scott Fitzgerald's masterpiece about the American Dream in the Jazz Age.",
    tags: ["american", "classic", "fiction"],
    addedAt: new Date("2024-02-01"),
    readAt: new Date("2024-02-10"),
    isArchived: false,
  },
  {
    id: "3",
    title: "Frankenstein",
    url: "https://www.gutenberg.org/files/84/84-h/84-h.htm",
    description:
      "Mary Shelley's gothic tale of a creature brought to life by science.",
    tags: ["gothic", "science-fiction", "horror"],
    addedAt: new Date("2024-01-20"),
    isArchived: false,
  },
  {
    id: "4",
    title: "The Art of War",
    url: "https://www.gutenberg.org/files/132/132-h/132-h.htm",
    description:
      "Sun Tzu's ancient Chinese text on military strategy and tactics.",
    tags: ["philosophy", "strategy", "non-fiction"],
    addedAt: new Date("2024-01-10"),
    readAt: new Date("2024-01-25"),
    isArchived: true,
  },
  {
    id: "5",
    title: "Dracula",
    url: "https://www.gutenberg.org/files/345/345-h/345-h.htm",
    description:
      "Bram Stoker's classic vampire tale told through letters and diary entries.",
    tags: ["gothic", "horror", "classic"],
    addedAt: new Date("2024-02-05"),
    isArchived: false,
  },
];

export const useReadingListStore = create<ReadingListState>((set, get) => ({
  articles: sampleArticles,
  filters: {
    search: "",
    tags: [],
    status: "all",
  },
  viewMode: "grid",
  sortBy: "date",
  sortDirection: "desc",

  // Actions
  addArticle: (articleData) =>
    set((state) => ({
      articles: [
        ...state.articles,
        {
          ...articleData,
          id: crypto.randomUUID(),
          addedAt: new Date(),
        },
      ],
    })),

  removeArticle: (id) =>
    set((state) => ({
      articles: state.articles.filter((article) => article.id !== id),
    })),

  toggleRead: (id) =>
    set((state) => ({
      articles: state.articles.map((article) =>
        article.id === id
          ? { ...article, readAt: article.readAt ? undefined : new Date() }
          : article
      ),
    })),

  toggleArchived: (id) =>
    set((state) => ({
      articles: state.articles.map((article) =>
        article.id === id
          ? { ...article, isArchived: !article.isArchived }
          : article
      ),
    })),

  updateFilters: (newFilters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    })),

  addTag: (articleId, tag) =>
    set((state) => ({
      articles: state.articles.map((article) =>
        article.id === articleId && !article.tags.includes(tag)
          ? { ...article, tags: [...article.tags, tag] }
          : article
      ),
    })),

  removeTag: (articleId, tag) =>
    set((state) => ({
      articles: state.articles.map((article) =>
        article.id === articleId
          ? { ...article, tags: article.tags.filter((t) => t !== tag) }
          : article
      ),
    })),

  toggleViewMode: () =>
    set((state) => ({
      viewMode: state.viewMode === "grid" ? "list" : "grid",
    })),

  updateSort: (sort) =>
    set(() => ({
      sortBy: sort.by,
      sortDirection: sort.direction,
    })),

  // Computed getters
  getFilteredArticles: () => {
    const state = get();
    let filtered = [...state.articles];

    // Apply search filter
    if (state.filters.search) {
      const searchLower = state.filters.search.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) ||
          article.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply tag filter
    if (state.filters.tags.length > 0) {
      filtered = filtered.filter((article) =>
        state.filters.tags.some((tag) => article.tags.includes(tag))
      );
    }

    // Apply status filter
    if (state.filters.status !== "all") {
      filtered = filtered.filter((article) => {
        switch (state.filters.status) {
          case "read":
            return !!article.readAt && !article.isArchived;
          case "unread":
            return !article.readAt && !article.isArchived;
          case "archived":
            return article.isArchived;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (state.sortBy) {
        case "date":
          comparison = a.addedAt.getTime() - b.addedAt.getTime();
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "status":
          comparison = (a.readAt ? 1 : 0) - (b.readAt ? 1 : 0);
          break;
      }
      return state.sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  },

  getAllTags: () => {
    const state = get();
    const tagSet = new Set<string>();
    state.articles.forEach((article) => {
      article.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  },
}));
