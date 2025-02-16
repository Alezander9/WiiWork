import { Article } from "@/stores/readingListStore";
import {
  AgentCard,
  AgentCardHeader,
  AgentCardTitle,
  AgentCardDescription,
  AgentCardContent,
  AgentCardFooter,
  AgentBadge,
  AgentIconButton,
} from "@/components/agent-ui";
import {
  BookOpen,
  Archive,
  Trash2,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { useReadingListStore } from "@/stores/readingListStore";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { toggleRead, toggleArchived, removeArticle } = useReadingListStore();

  const isRead = !!article.readAt;

  return (
    <AgentCard
      controlId={`article-card-${article.id}`}
      context={`This is a card showing the article "${article.title}". You can mark it as read, archive it, or remove it.`}
      className="bg-white hover:shadow-lg transition-shadow"
    >
      <AgentCardHeader>
        <AgentCardTitle
          controlId={`article-title-${article.id}`}
          context="Click to the title or share icon to open the article in a new tab"
          className="flex items-center justify-between"
        >
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-wii-blue transition-colors"
          >
            {article.title}
            <ExternalLink className="inline-block ml-2 w-4 h-4" />
          </a>
        </AgentCardTitle>
        <AgentCardDescription
          controlId={`article-description-${article.id}`}
          className="text-sm text-gray-600 mt-2"
        >
          {article.description}
        </AgentCardDescription>
      </AgentCardHeader>

      <AgentCardContent>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <AgentBadge
              key={tag}
              controlId={`tag-${article.id}-${tag}`}
              context={`This article is tagged with "${tag}"`}
              className="bg-wii-button-blue text-black hover:bg-wii-blue hover:text-white cursor-pointer"
            >
              {tag}
            </AgentBadge>
          ))}
        </div>
      </AgentCardContent>

      <AgentCardFooter className="flex justify-between items-center">
        <div className="flex gap-2">
          <AgentIconButton
            controlId={`toggle-read-${article.id}`}
            onUniversalClick={() => toggleRead(article.id)}
            context={`Click to mark this article as ${isRead ? "unread" : "read"}`}
            className={`${
              isRead
                ? "bg-wii-blue text-white"
                : "bg-wii-button-blue text-black hover:bg-wii-blue hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
          </AgentIconButton>

          <AgentIconButton
            controlId={`archive-${article.id}`}
            onUniversalClick={() => toggleArchived(article.id)}
            context={`Click to ${
              article.isArchived ? "unarchive" : "archive"
            } this article`}
            className={`${
              article.isArchived
                ? "bg-wii-blue text-white"
                : "bg-wii-button-blue text-black hover:bg-wii-blue hover:text-white"
            }`}
          >
            <Archive className="w-4 h-4" />
          </AgentIconButton>

          <AgentIconButton
            controlId={`remove-${article.id}`}
            onUniversalClick={() => removeArticle(article.id)}
            context="Click to remove this article from your reading list"
            className="bg-red-100 text-red-600 hover:bg-red-200"
          >
            <Trash2 className="w-4 h-4" />
          </AgentIconButton>
        </div>

        {isRead && (
          <div className="flex items-center text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 mr-1" />
            Read on {article.readAt?.toLocaleDateString()}
          </div>
        )}
      </AgentCardFooter>
    </AgentCard>
  );
}
