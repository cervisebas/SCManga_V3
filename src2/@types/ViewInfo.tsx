import { ItemView } from './ViewsList';

type gender = {
    title: string,
    url: string
};
type chapter = {
    chapter: string,
    url: string
};
type chapterInfo = {
    chapter: string,
    url: string,
    view: boolean,
    viewInfo: ItemView
};
type optionChapter = {
    url: string,
    server: string
};
type Info = {
    title: string,
    date: string,
    type: string,
    synopsis: string,
    image: string,
    url: string,
    genders: gender[],
    chapters: chapterInfo[]
};

export type {
    Info,
    gender,
    chapter,
    chapterInfo,
    optionChapter
};