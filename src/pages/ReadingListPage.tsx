import { AgentContext } from "@/components/agent-ui/AgentContext";
import { AgentButton, AgentInput } from "@/components/agent-ui";
import { useReadingListStore } from "@/stores/readingListStore";
import { ArticleCard } from "@/components/reading-list/ArticleCard";
import { Search } from "lucide-react";

export default function ReadingListPage() {
  const { getFilteredArticles, filters, updateFilters } = useReadingListStore();

  const articles = getFilteredArticles();

  return (
    <>
      <AgentContext
        controlId="reading-list-context"
        context="This is the reading list page where you can view and manage your saved articles. You can search articles and filter by status."
      />

      <div className="container mx-auto py-8 space-y-6">
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
          {/* Search */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <AgentInput
                controlId="search-input"
                placeholder="Search articles..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                onUniversalInput={(value) => updateFilters({ search: value })}
                context="Type here to search articles by title or description. You can clear the search by entering in a blank search."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <AgentButton
              controlId="filter-all"
              onUniversalClick={() => updateFilters({ status: "all" })}
              context="Show all articles regardless of status"
              className={`${
                filters.status === "all"
                  ? "bg-wii-blue text-white"
                  : "bg-wii-button-blue"
              }`}
            >
              All
            </AgentButton>
            <AgentButton
              controlId="filter-unread"
              onUniversalClick={() => updateFilters({ status: "unread" })}
              context="Show only unread articles"
              className={`${
                filters.status === "unread"
                  ? "bg-wii-blue text-white"
                  : "bg-wii-button-blue"
              }`}
            >
              Unread
            </AgentButton>
            <AgentButton
              controlId="filter-read"
              onUniversalClick={() => updateFilters({ status: "read" })}
              context="Show only read articles"
              className={`${
                filters.status === "read"
                  ? "bg-wii-blue text-white"
                  : "bg-wii-button-blue"
              }`}
            >
              Read
            </AgentButton>
            <AgentButton
              controlId="filter-archived"
              onUniversalClick={() => updateFilters({ status: "archived" })}
              context="Show only archived articles"
              className={`${
                filters.status === "archived"
                  ? "bg-wii-blue text-white"
                  : "bg-wii-button-blue"
              }`}
            >
              Archived
            </AgentButton>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No articles found. Try adjusting your filters.
          </div>
        )}
      </div>
    </>
  );
}
