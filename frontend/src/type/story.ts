export interface IUser {
  _id: string;
  name: string;
  avatarUrl?: string;
}

interface ICategory {
    _id: string;
    name: string;
}
interface IOwner {
    _id: string;
    name: string;
    avatarUrl?: string;
}

export interface IStory {
    _id: string;
    title?: string;
    img?: string;
    article?: string;
    category?: ICategory;      // тепер об’єкт
    ownerId?: IOwner;          // об’єкт автора
    date?: string;
    favoriteCount?: number;
}

interface Props {
    story?: IStory; // optional
    isSaved?: boolean;
    onSaveToggle?: (id: string, add: boolean) => Promise<void>;
    isAuthenticated?: boolean;
}


// Тип для відповіді від бекенду з пагінацією
export interface IStoriesResponse {
  stories: IStory[];
  total: number;
  hasMore: boolean;
}