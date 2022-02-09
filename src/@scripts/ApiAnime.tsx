import cheerio from 'cheerio';
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
            fetch('https://leermanga.net/').then((response)=>response.text()).then((html)=>{
                try {
                    const $ = cheerio.load(html);
                    var newMangas: newMangas[] = [];
                    var popular: popular[] = [];
                    $('body > div > div > div.site-content > div > div > div > div > div.main-col.col-lg-8.col-md-12.col-sm-12 > div:nth-child(1) > div.c-blog-listing.c-page__content.manga_content > div > div > div > div > div').find('div.col-xl-3.col-lg-3.col-md-3.col-4.manga_portada').each((i: number, el)=>{
                        newMangas.push({
                            title: $(el).find('span.manga-title-updated').text(),
                            url: String($(el).find('a').attr('href')),
                            chapter: this.clearChapter($(el).find('span.manga-episode-title').text()),
                            image: String($(el).find('img.img-responsive').attr('src'))
                        });
                    });
                    $('body > div > div > div.site-content > div > div > div > div > div.main-col.col-lg-8.col-md-12.col-sm-12 > div:nth-child(2) > div.c-blog-listing.c-page__content.manga_content > div > div > div > div > div').find('div.col-xl-4.col-lg-6.col-md-6.col-12.manga_portada').each((i: number, el)=>{
                        popular.push({
                            title: $(el).find('div.item-summary div.post-title.font-title h3 a').text(),
                            image: String($(el).find('div.item-thumb a img').attr('src')),
                            url: String($(el).find('div.item-thumb a').attr('href')),
                            type: $(el).find('div.item-thumb a span.manga-title-recommend').text()
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
                    var title: string = $('body > div > div > div > div > div.profile-manga > div > div > div > div.post-title').find('h1').text();
                    var date: string = $('body > div > div > div > div > div.profile-manga > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-content-data > div:nth-child(2)').find('div.summary-content').text().replace(/\ /gi, '').replace(/\n/gi, '');
                    var type: string = $('body > div > div > div > div > div.profile-manga > div > div > div > div.post-title').find('span.manga-title-info').text();
                    var synopsis: string = $('div.description-summary div.summary__content.show-more p').text();
                    var image: string = String($('body > div > div > div > div > div.profile-manga > div > div > div > div.tab-summary > div.summary_image > img').attr('src'));
                    var genders: gender[] = [];
                    var chapters: chapterInfo[] = [];
                    $('body > div > div > div > div > div.profile-manga > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-content-data > div:nth-child(3) > div.summary-content').find('a.btn.tags_manga').each((i: number, el)=>{
                        genders.push({
                            title: $(el).text().trimStart().trimEnd(),
                            url: String($(el).attr('href'))
                        });
                    });
                    $('body > div > div > div > div > div.c-page-content.style-1 > div > div > div.row > div.main-col.col-lg-8.col-md-12.col-sm-12 > div > div.c-page > div > div.page-content-listing.single-page.list-manga-check > div > ul > li > ul').find('li').each((i: number, el)=>{
                        viewsList.getItem(String($(el).find('a').attr('href'))).then((value)=>{
                            var temp1: string = `Capítulo ${String($(el).find('a').text()).replace(/\ /gi, '').replace(/\Capítulo/, '').replace(/\n/gi, '')}`;
                            var viewInfo: any = value;
                            chapters.push({
                                chapter: temp1.slice(0, temp1.indexOf(':')).replace('Capítulo ', ''),
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
                    $('div#images_chapter').find('img.img-fluid').each((i: number, el)=>{
                        images.push(String($(el).attr('data-src')));
                    });
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
            fetch(`https://leermanga.net/biblioteca?search=${this.replaceCharacter(search.toLowerCase().replace(/\ /gi, '+'))}`).then((resolve)=>resolve.text()).then(async(html)=>{
                try {
                    const $ = cheerio.load(html);
                    var list: popular[] = [];
                    $('body > div > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-lg-8.col-md-12.col-sm-12 > div > div > div > div.tab-content-wrap > div > div > div > div').find('div.col-xl-3.col-lg-3.col-md-3.col-6.manga_portada').each((i: number, el)=>{
                        var type: string = String($(el).find('a span.manga-title-recommend').text()).trimStart().trimEnd();
                        list.push({
                            title: $(el).find('h3.manga-title-updated a').text(),
                            image: String($(el).find('a img').attr('src')),
                            url: String($(el).find('h3.manga-title-updated a').attr('href')),
                            type: (type.charAt(0).toUpperCase() + type.slice(1))
                        });
                    });
                    if (list.length !== 0) {
                        var more = await this.getSearchMoreResults(search, '2');
                        var listExtend: popular[] = list.concat(more);
                        return resolve(listExtend);
                    } else {
                        return reject(false);
                    }
                } catch (error) {
                    return reject(error);
                }
            }).catch((error)=>reject(error));
        });
    }
    getSearchMoreResults(search: string, index: string): Promise<popular[]> {
        return new Promise((resolve, reject)=>{
            fetch(`https://leermanga.net/biblioteca?search=${this.replaceCharacter(search.toLowerCase().replace(/\ /gi, '+'))}&page=${index}`).then((resolve)=>resolve.text()).then(async(html)=>{
                try {
                    const $ = cheerio.load(html);
                    var list: popular[] = [];
                    $('body > div > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-lg-8.col-md-12.col-sm-12 > div > div > div > div.tab-content-wrap > div > div > div > div').find('div.col-xl-3.col-lg-3.col-md-3.col-6.manga_portada').each((i: number, el)=>{
                        var type: string = String($(el).find('a span.manga-title-recommend').text()).trimStart().trimEnd();
                        list.push({
                            title: $(el).find('h3.manga-title-updated a').text(),
                            image: String($(el).find('a img').attr('src')),
                            url: String($(el).find('h3.manga-title-updated a').attr('href')),
                            type: (type.charAt(0).toUpperCase() + type.slice(1))
                        });
                    });
                    return resolve(list);
                } catch (error) {
                    return reject(error);
                }
            }).catch((error)=>reject(error));
        });
    }
    getGender(gender: string): Promise<genderList> {
        return new Promise((resolve, reject)=>{
            fetch(`https://leermanga.net/genero/${gender}`).then((response)=>response.text()).then((html)=>{
                try {
                    const $ = cheerio.load(html);
                    var list: popular[] = [];
                    $('body > div.wrap > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-lg-8.col-md-12.col-sm-12 > div > div > div > div.tab-content-wrap > div > div > div > div > div').each((i: number, el)=>{
                        var type: string = $(el).find('a span').text().trimStart().trimEnd();
                        list.push({
                            image: String($(el).find('img.img-responsive').attr('src')),
                            title: $(el).find('h3').text().replace(/\n/gi, '').trimStart().trimEnd(),
                            url: String($(el).find('a').not('h3 a').attr('href')),
                            type: (type.charAt(0).toUpperCase()+type.slice(1))
                        });
                    });
                    var numbers: string[] = [];
                    $('body > div.wrap > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-lg-8.col-md-12.col-sm-12 > div > div > div > div.tab-content-wrap > div > nav > div > div > nav > ul').find('li').each((i: number, el)=>{
                        numbers.push($(el).text().trimStart().trimEnd().replace(/\n/gi, '').replace(/\ /gi, ''));
                    });
                    (list.length !== 0)? resolve({ list: list,pages: parseInt(numbers[numbers.length - 2]) }) : reject(false);
                } catch (error) {
                    reject(error);
                }
            }).catch((error)=>reject(error));
        });
    }
    getMoreGender(gender: string, page: string): Promise<popular[]> {
        return new Promise((resolve, reject)=>{
            fetch(`https://leermanga.net/genero/${gender}?page=${page}`).then((response)=>response.text()).then((html)=>{
                try {
                    const $ = cheerio.load(html);
                    var list: popular[] = [];
                    $('body > div.wrap > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-lg-8.col-md-12.col-sm-12 > div > div > div > div.tab-content-wrap > div > div > div > div > div').each((i: number, el)=>{
                        var type: string = $(el).find('a span').text().trimStart().trimEnd();
                        list.push({
                            image: String($(el).find('img.img-responsive').attr('src')),
                            title: $(el).find('h3').text().replace(/\n/gi, '').trimStart().trimEnd(),
                            url: String($(el).find('a').not('h3 a').attr('href')),
                            type: (type.charAt(0).toUpperCase()+type.slice(1))
                        });
                    });
                    resolve(list);
                } catch (error) {
                    reject(error);
                }
            }).catch((error)=>reject(error));
        });
    }
    getGender18(): Promise<genderList> {
        return new Promise((resolve, reject)=>{
            fetch(`https://leermanga.net/adulto`).then((response)=>response.text()).then((html)=>{
                try {
                    const $ = cheerio.load(html);
                    var list: popular[] = [];
                    $('body > div.wrap > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-lg-8.col-md-12.col-sm-12 > div > div > div > div.tab-content-wrap > div > div > div > div > div').each((i: number, el)=>{
                        var type: string = $(el).find('a span').text().trimStart().trimEnd();
                        list.push({
                            image: String($(el).find('img.img-responsive').attr('src')),
                            title: $(el).find('h3').text().replace(/\n/gi, '').trimStart().trimEnd(),
                            url: String($(el).find('a').not('h3 a').attr('href')),
                            type: (type.charAt(0).toUpperCase()+type.slice(1))
                        });
                    });
                    var numbers: string[] = [];
                    $('body > div.wrap > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-lg-8.col-md-12.col-sm-12 > div > div > div > div.tab-content-wrap > div > nav > div > div > nav > ul').find('li').each((i: number, el)=>{
                        numbers.push($(el).text().trimStart().trimEnd().replace(/\n/gi, '').replace(/\ /gi, ''));
                    });
                    (list.length !== 0)? resolve({ list: list,pages: parseInt(numbers[numbers.length - 2]) }) : reject(false);
                } catch (error) {
                    reject(error);
                }
            }).catch((error)=>reject(error));
        });
    }
    getMoreGender18(page: string): Promise<popular[]> {
        return new Promise((resolve, reject)=>{
            fetch(`https://leermanga.net/adulto?page=${page}`).then((response)=>response.text()).then((html)=>{
                try {
                    const $ = cheerio.load(html);
                    var list: popular[] = [];
                    $('body > div.wrap > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-lg-8.col-md-12.col-sm-12 > div > div > div > div.tab-content-wrap > div > div > div > div > div').each((i: number, el)=>{
                        var type: string = $(el).find('a span').text().trimStart().trimEnd();
                        list.push({
                            image: String($(el).find('img.img-responsive').attr('src')),
                            title: $(el).find('h3').text().replace(/\n/gi, '').trimStart().trimEnd(),
                            url: String($(el).find('a').not('h3 a').attr('href')),
                            type: (type.charAt(0).toUpperCase()+type.slice(1))
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
                    await AsyncStorage.setItem('favorites', JSON.stringify(result));
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
                var storage = await AsyncStorage.getItem('favorites');
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
                    await AsyncStorage.setItem('favorites', JSON.stringify(filter));
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