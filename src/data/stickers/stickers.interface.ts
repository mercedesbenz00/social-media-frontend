export interface IMedia {
  url: string;
  dims: [number, number];
  preview: string;
  size: number;
}

export interface ISticker {
  id: string;
  title: string;
  content_description: string;
  media: [
    {
      gif: IMedia;
      tinygif: IMedia;
    }
  ];
  itemurl: string;
  url: string;
}

export interface ISearchResults {
  results: ISticker[];
  next: string;
}
export interface ITag {
  searchterm: string;
  path: string;
  image: string;
  name: string;
}
export interface ICategories {
  locale: string;
  tags: ITag[];
}
export interface ITrending {
  locale: string;
  results: ISticker[];
  next: string;
}

export interface IAutocompleteResults {
  locale: "en";
  results: string[];
}
