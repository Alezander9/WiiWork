import { AgentContext } from "@/components/agent-ui/AgentContext";
import {
  AgentButton,
  AgentInput,
  AgentSelect,
  AgentSelectTrigger,
  AgentSelectValue,
  AgentSelectContent,
  AgentSelectItem,
} from "@/components/agent-ui";
import { useReadingListStore } from "@/stores/readingListStore";
import { ArticleCard } from "@/components/reading-list/ArticleCard";
import { Grid, List, Plus, Search } from "lucide-react";

export default function ReadingListPage() {
  const {
    getFilteredArticles,
    filters,
    updateFilters,
    viewMode,
    toggleViewMode,
    updateSort,
    sortBy,
    sortDirection,
  } = useReadingListStore();

  const articles = getFilteredArticles();

  return (
    <>
      <AgentContext
        controlId="reading-list-context"
        context="This is the reading list page where you can view and manage your saved articles. You can search, filter by tags or status, and sort the articles. Each article can be marked as read, archived, or removed."
      />

      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-wii-blue">Reading List</h1>
          <AgentButton
            controlId="add-article-button"
            context="Click to add a new article to your reading list"
            className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Article
          </AgentButton>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
          {/* Search and View Toggle */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <AgentInput
                controlId="search-input"
                placeholder="Search articles..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                context="Type here to search articles by title or description"
                className="pl-10 w-full"
              />
            </div>
            <AgentButton
              controlId="view-mode-toggle"
              onUniversalClick={toggleViewMode}
              context={`Click to switch to ${
                viewMode === "grid" ? "list" : "grid"
              } view`}
              className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white"
            >
              {viewMode === "grid" ? (
                <List className="w-4 h-4" />
              ) : (
                <Grid className="w-4 h-4" />
              )}
            </AgentButton>
          </div>

          {/* Status, Tags, and Sort */}
          <div className="flex gap-4">
            <AgentSelect
              controlId="status-filter-select"
              value={filters.status}
              onValueChange={(value: typeof filters.status) =>
                updateFilters({ status: value })
              }
            >
              <AgentSelectTrigger
                controlId="status-filter-trigger"
                context="Select to filter articles by their read/archived status"
                className="bg-wii-button-blue"
              >
                <AgentSelectValue
                  controlId="status-filter-value"
                  placeholder="Status"
                />
              </AgentSelectTrigger>
              <AgentSelectContent controlId="status-filter-content">
                <AgentSelectItem
                  controlId="status-filter-all"
                  value="all"
                  context="Show all articles regardless of status"
                >
                  All
                </AgentSelectItem>
                <AgentSelectItem
                  controlId="status-filter-unread"
                  value="unread"
                  context="Show only unread articles"
                >
                  Unread
                </AgentSelectItem>
                <AgentSelectItem
                  controlId="status-filter-read"
                  value="read"
                  context="Show only read articles"
                >
                  Read
                </AgentSelectItem>
                <AgentSelectItem
                  controlId="status-filter-archived"
                  value="archived"
                  context="Show only archived articles"
                >
                  Archived
                </AgentSelectItem>
              </AgentSelectContent>
            </AgentSelect>

            <AgentSelect
              controlId="sort-select"
              value={sortBy}
              onValueChange={(value: typeof sortBy) =>
                updateSort({ by: value, direction: sortDirection })
              }
            >
              <AgentSelectTrigger
                controlId="sort-trigger"
                context="Select how to sort the articles"
                className="bg-wii-button-blue"
              >
                <AgentSelectValue
                  controlId="sort-value"
                  placeholder="Sort by"
                />
              </AgentSelectTrigger>
              <AgentSelectContent controlId="sort-content">
                <AgentSelectItem
                  controlId="sort-by-date"
                  value="date"
                  context="Sort articles by the date they were added"
                >
                  Date Added
                </AgentSelectItem>
                <AgentSelectItem
                  controlId="sort-by-title"
                  value="title"
                  context="Sort articles alphabetically by title"
                >
                  Title
                </AgentSelectItem>
                <AgentSelectItem
                  controlId="sort-by-status"
                  value="status"
                  context="Sort articles by their read status"
                >
                  Read Status
                </AgentSelectItem>
              </AgentSelectContent>
            </AgentSelect>

            <AgentButton
              controlId="sort-direction"
              onUniversalClick={() =>
                updateSort({
                  by: sortBy,
                  direction: sortDirection === "asc" ? "desc" : "asc",
                })
              }
              context={`Click to sort in ${
                sortDirection === "asc" ? "descending" : "ascending"
              } order`}
              className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white"
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </AgentButton>
          </div>
        </div>

        {/* Articles Grid/List */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No articles found. Try adjusting your filters or add a new article.
          </div>
        )}
      </div>
    </>
  );
}
