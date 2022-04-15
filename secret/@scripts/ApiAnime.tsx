import * as cheerio from 'cheerio';
import { newMangas, popular, resolveRecents, favorite, genderList } from '../@types/ApiManga';
import { gender, Info, chapterInfo } from '../@types/ViewInfo';
import { ViewsList } from './ViewsList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const viewsList = new ViewsList();

export class ApiManga {
    constructor() {}
    getRecents(): Promise<resolveRecents> {
        return new Promise((resolve, reject)=>{
            fetch('https://doujinhentai.net/').then((response)=>response.text()).then((html)=>{
                try {
                    const $ = cheerio.load(html);
                    var newMangas: newMangas[] = [];
                    var popular: popular[] = [];
                    $("#manga-popular-slider-5 div.slider__container").find('div.slider__item').each((_i: number, el)=>{
                        newMangas.push({
                            title: $(el).find('div.post-title.font-title h4').text().replace(/\n/gi, ''),
                            url: `https://doujinhentai.net/${String($(el).find('div.post-title.font-title h4 a').attr('href'))}`,
                            chapter: this.clearChapter($(el).find('div.chapter-item > span.chapter').text()).replace(/\n/gi, '').replace('capitulo', '').replace('-', '.'),
                            image: String($(el).find('div.slider__thumb_item.c-image-hover img').attr('data-src')).replace(/\n/gi, '')
                        });
                    });
                    $("#loop-content").each((_i, el0)=>{
                        $(el0).find('div.row div.col-xs-12.col-md-2').each((_i1, el1)=>{
                            popular.push({
                                title: $(el1).find('div.manga-name').text().replace(/\n/gi, ''),
                                image: String($(el1).find('a.thumbnail img').attr('src')),
                                url: String($(el1).find('a.thumbnail').attr('href')),
                                type: String($(el1).find('div.well p.fleer').text()).toLowerCase().replace('leer ', '').toUpperCase().replace(/\n/gi, '')
                            });
                        });
                    });
                    if (newMangas.length !== 0 && popular.length !== 0) resolve({ newMangas: newMangas, popular: popular }); else reject(false);
                } catch (error) {
                    reject(error);
                }
            }).catch((error)=>reject(error));
        });
    }

    getInformation(url: string): Promise<Info> {
        return new Promise((resolve, reject)=>{
            fetch(url).then((response)=>response.text()).then((html)=>{
                try {
                    const $ = cheerio.load(html);
                    var title: string = $('body > div > div > div.profile-manga > div > div > div > div.post-title').find('h3').text();
                    var date: string = $('div.post-status > div:nth-child(1)').find('div.summary-content').text().replace(/\ /gi, '').replace(/\n/gi, '');
                    var type: string = $('body > div > div > div.profile-manga > div > div > div > div.tab-summary > div.summary_content_wrap > div > div > div:nth-child(3)').find('div.summary-content').text().replace(/\n/gi, '');
                    var synopsis: string = $('body > div > div > i > i > div > div > div > div > div.main-col.col-md-8.col-sm-8 > div > div.c-page > div > div.description-summary.hide_show-more > div > p').text();
                    var image: string = String($('body > div > div > div.profile-manga > div > div > div > div.tab-summary > div.summary_image').find('img').attr('data-src'));
                    var genders: gender[] = [];
                    var chapters: chapterInfo[] = [];
                    $('div.genres-content').find('a').each((_i: number, el): any=>genders.push({ title: $(el).text().trimStart().trimEnd(), url: String($(el).attr('href')) }));
                    $("div.listing-chapters_wrap ul").find('li').each((_i: number, el)=>{
                        if ($(el).text().replace(/\n/gi, '').replace(/\ /gi, '').length == 0) return;
                        viewsList.getItem(String($(el).find('a').attr('href'))).then((value)=>{
                            var temp1: string = String($(el).find('a').not('span a').text()).replace(/\ /gi, '').replace(/\n/gi, '');
                            var viewInfo: any = value;
                            chapters.push({
                                chapter: temp1.slice(temp1.indexOf('Capitulo'), temp1.length).replace('Capitulo', ''),
                                url: String($(el).find('a').attr('href')),
                                view: (value)? true : false,
                                viewInfo: (value)? viewInfo : { url: '', date: '', views: 0 }
                            });
                        });
                    });
                    return resolve({
                        title: title,
                        date: date,
                        type: type,
                        synopsis: synopsis,
                        image: image,
                        url: url,
                        genders: genders,
                        chapters: chapters
                    });
                } catch (error) {
                    reject(error);
                }
            }).catch((error)=>reject(error));
        });
    }
    getImagesChapter(url: string): Promise<string[]> {
        return new Promise(async(resolve, reject)=>{
            fetch(url).then((response)=>response.text()).then((html)=>{
                try {
                    const $ = cheerio.load(html);
                    var images: string[] = [];
                    $('div#all').find('img.img-responsive').each((_i: number, el): any=>images.push(String($(el).attr('data-src')).trimStart().trimEnd().replace(/\ /gi, '%20').replace(/\n/gi, '').replace('http://', 'https://')));
                    if (images.length !== 0) { return resolve(images); } else { return reject(false); }
                } catch (error) {
                    return reject(error);
                }
            }).catch((error)=>reject(error));
        });
    }
    getSearchResults(search: string): Promise<popular[]> {
        return new Promise((resolve, reject)=>{
            if (search.length < 3) return reject(false);
            fetch(`https://doujinhentai.net/search?query=${this.replaceCharacter(search.toLowerCase().replace(/\ /gi, '+'))}`).then((resolve)=>resolve.text()).then(async(html)=>{
                try {
                    const $ = cheerio.load(html);
                    var list: popular[] = [];
                    $('div.row > div.c-tabs-item__content').find('div.c-tabs-item__content').each((_i, el)=>{
                        list.push({
                            title: $(el).find('div.post-title h4 a').text().replace(/\n/gi, ''),
                            image: String($(el).find('a img').attr('data-src')),
                            url: String($(el).find('div.post-title h4 a').attr('href')),
                            type: ($(el).find('div.post-content_item.mg_status div.summary-content span').text().replace(/\ /gi, '').replace(/\n/gi, '') == "Complete")? 'Finalizado': 'En Emision'
                        });
                    });
                    if (list.length !== 0) {
                        return resolve(list);
                    } else {
                        return reject(false);
                    }
                } catch (error) {
                    return reject(error);
                }
            }).catch((error)=>reject(error));
        });
    }
    getGender(gender: string): Promise<genderList> {
        return new Promise((resolve, reject)=>{
            fetch(`https://doujinhentai.net/lista-manga-hentai/category/${gender}`).then((response)=>response.text()).then((html)=>{
                try {
                    const $ = cheerio.load(html);
                    var list: popular[] = [];
                    $('div.page-content-listing').find('div.col-sm-6.col-md-3.col-xs-12').each((_i: number, el)=>{
                        list.push({
                            image: String($(el).find('img').attr('data-src')),
                            title: $(el).find('span.card-title').text().replace(/\n/gi, '').trimStart().trimEnd().replace('Leer ', ''),
                            url: String($(el).find('a').not('h3 a').attr('href')),
                            type: ''
                        });
                    });
                    var numbers: string[] = [];
                    $('ul.pagination').find('li').each((_i: number, el)=>{
                        if ($(el).find('a').attr('rel') == 'prev' || $(el).find('a').attr('rel') == 'next') return;
                        numbers.push($(el).text().trimStart().trimEnd().replace(/\n/gi, '').replace(/\ /gi, ''));
                    });
                    (list.length !== 0)? resolve({ list: list,pages: parseInt(numbers[numbers.length - 1]) }) : reject(false);
                } catch (error) {
                    reject(error);
                }
            }).catch((error)=>reject(error));
        });
    }
    getMoreGender(gender: string, page: string): Promise<popular[]> {
        return new Promise((resolve, reject)=>{
            fetch(`https://doujinhentai.net/lista-manga-hentai/category/${gender}?page=${page}`).then((response)=>response.text()).then((html)=>{
                try {
                    const $ = cheerio.load(html);
                    var list: popular[] = [];
                    $('div.page-content-listing').find('div.col-sm-6.col-md-3.col-xs-12').each((_i: number, el)=>{
                        list.push({
                            image: String($(el).find('img').attr('data-src')),
                            title: $(el).find('span.card-title').text().replace(/\n/gi, '').trimStart().trimEnd().replace('Leer ', ''),
                            url: String($(el).find('a').not('h3 a').attr('href')),
                            type: ''
                        });
                    });
                    resolve(list);
                } catch (error) {
                    reject(error);
                }
            }).catch((error)=>reject(error));
        });
    }


    async addFavorite(data: popular) {
        return new Promise((resolve, reject)=>{
            this.getFavorites().then(async(favorites)=>{
                try {
                    var add: favorite[] = [];
                    var date: string = moment().format("DD/MM/YYYY HH:mm");
                    add.push({
                        title: data.title,
                        image: data.image,
                        url: data.url,
                        type: data.type,
                        date: date
                    });
                    var result = favorites.concat(add);
                    await AsyncStorage.setItem('favorites-hentai', JSON.stringify(result));
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
    async getFavorites(): Promise<favorite[]> {
        return new Promise(async(resolve, reject)=>{
            try {
                var list: favorite[] = [];
                var storage = await AsyncStorage.getItem('favorites-hentai');
                resolve((storage !== null)? list.concat(JSON.parse(storage)) : list);   
            } catch (error) {
                reject(false);
            }
        });
    }
    async removeFavorite(url: string) {
        return new Promise((resolve, reject)=>{
            this.getFavorites().then(async(favorites)=>{
                try {
                    var filter = favorites.filter((value)=>value.url != url);
                    await AsyncStorage.setItem('favorites-hentai', JSON.stringify(filter));
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            }).catch((error)=>reject(error));
        });
    }
    isIntoFavorites(url: string): Promise<boolean> {
        return new Promise((resolve, reject)=>{
            this.getFavorites().then(async(favorites)=>{
                try {
                    var filter = favorites.find((value)=>value.url == url);
                    resolve((filter == undefined)? false: true);
                } catch (error) {
                    reject(error);
                }
            }).catch((error)=>reject(error));
        });
    }


    /* # # # # # Funciones # # # # # */
    replaceCharacter(str: string): string {
        return str.replace(/í/gi, 'i')
           .replace(/ì/gi, 'i')
           .replace(/ï/gi, 'i')
           .replace(/î/gi, 'i')
           .replace(/é/gi, 'e')
           .replace(/è/gi, 'e')
           .replace(/ë/gi, 'e')
           .replace(/ê/gi, 'e')
           .replace(/ó/gi, 'o')
           .replace(/ò/gi, 'o')
           .replace(/ö/gi, 'o')
           .replace(/ô/gi, 'o')
           .replace(/ú/gi, 'u')
           .replace(/ù/gi, 'u')
           .replace(/ü/gi, 'u')
           .replace(/û/gi, 'u')
           .replace(/á/gi, 'a')
           .replace(/à/gi, 'a')
           .replace(/ä/gi, 'a')
           .replace(/â/gi, 'a')
    }
    clearChapter(str: string) { return str.replace(/\ /gi, '').replace(/Capítulo/, ''); }
    calcTime(time: string) {
        var dateNow = new Date();
        if (time.indexOf('minuto') !== -1 || time.indexOf('minutos') !== -1) {
            var time1: number = parseInt(time.replace(/minutos/gi, '').replace(/minuto/gi, '').replace(/\ /gi, '').replace(/antes/gi, ''));
            dateNow.setMinutes(dateNow.getMinutes() - time1);
        }
        if (time.indexOf('hora') !== -1 || time.indexOf('horas') !== -1) {
            var time1: number = parseInt(time.replace(/horas/gi, '').replace(/hora/gi, '').replace(/\ /gi, '').replace(/antes/gi, ''));
            dateNow.setHours(dateNow.getHours() - time1);
        }
        var dateEdit: string = `${dateNow.getDate()}/${(dateNow.getMonth() + 1)}/${dateNow.getFullYear()}`;
        var hoursEdit: string = `${(String(dateNow.getHours()).length == 1)? `0${dateNow.getHours()}` : dateNow.getHours()}:${(String(dateNow.getMinutes()).length == 1)? `0${dateNow.getMinutes()}` : dateNow.getMinutes()}`;
        return `${dateEdit} ${hoursEdit}`;
    }
}